import useDebounce from "@/hook/useDebounce";
import { fetcherRN } from "@/utils/fetcherRN";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Keyboard,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

type ProductItem = any;

export default function SearchInput({
  initialQuery = "",
  initialSuggestions = [],
}: {
  initialQuery?: string;
  initialSuggestions?: ProductItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const debounced = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<ProductItem[]>(initialSuggestions || []);
  const [open, setOpen] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!debounced || debounced.trim().length === 0) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        // adjust endpoint if your API expects different path
        const json: any = await fetcherRN(`/products?search=${encodeURIComponent(debounced)}`);
        const items = json?.data?.items ?? json?.items ?? json ?? [];
        if (!cancelled && mountedRef.current) {
          setSuggestions(Array.isArray(items) ? items.slice(0, 10) : []);
          if ((items?.length ?? 0) > 0) setOpen(true);
        }
      } catch (e) {
        if (!cancelled && mountedRef.current) {
          setSuggestions([]);
          setOpen(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const onSubmit = () => {
    const q = query?.trim();
    if (q) {
      Keyboard.dismiss();
      setOpen(false);
      router.push(`/products?search=${encodeURIComponent(q)}` as any);
    }
  };

  const onSelect = (item: ProductItem) => {
    if (!item) return;
    Keyboard.dismiss();
    setOpen(false);

    const slug = item.slug || item?.stock?.id || item?.id;
    if (!slug) {
      router.push(`/products?search=${encodeURIComponent(item.title || query)}` as any);
    } else {
      router.push(`/product-details/${encodeURIComponent(slug)}` as any);
    }
  };

  const onShowAll = () => {
    Keyboard.dismiss();
    setOpen(false);
    const q = query?.trim();
    const url = q ? `/products?search=${encodeURIComponent(q)}` : "/products";
    router.push(url as any);
  };

  // overlay tap closes suggestions
  const renderOverlay = () =>
    open ? (
      <TouchableWithoutFeedback
        onPress={() => {
          setOpen(false);
          Keyboard.dismiss();
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 8,
          }}
        />
      </TouchableWithoutFeedback>
    ) : null;

  return (
    <View className="w-full relative">
      {/* Overlay to detect outside taps */}
      {renderOverlay()}

      <View className="px-4">
        <View className="flex-row items-center rounded-full border border-gray-300 overflow-hidden bg-white">
          <TextInput
            value={query}
            onChangeText={(t) => setQuery(t)}
            onFocus={() => debounced && setOpen(true)}
            placeholder="Search for anything"
            returnKeyType="search"
            onSubmitEditing={onSubmit}
            className="flex-1 px-4 py-3 text-sm"
            style={{
              // ensure Android text vertical padding looks OK
              paddingVertical: Platform.OS === "android" ? 8 : undefined,
            }}
          />
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onSubmit}
            className="px-4 py-3 bg-primary-0"
          >
            <Text className="text-white font-medium">Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <View
          className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg"
          style={{ zIndex: 10, maxHeight: 300 }}
        >
          <FlatList
            data={suggestions}
            keyExtractor={(item, idx) =>
              (item?.slug || item?.id || item?.title || idx).toString()
            }
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                className="flex-row items-center px-4 py-3"
              >
                <View className="w-10 h-10 mr-3 bg-gray-100 rounded overflow-hidden items-center justify-center">
                  {item?.promotional_image ? (
                    <Image
                      source={
                        typeof item.promotional_image === "string"
                          ? { uri: item.promotional_image }
                          : item.promotional_image
                      }
                      style={{ width: 40, height: 40 }}
                      contentFit="cover"
                    />
                  ) : (
                    <Text className="text-gray-400">🔎</Text>
                  )}
                </View>

                <View className="flex-1">
                  <Text numberOfLines={1}>{item?.title ?? item?.name ?? "Unnamed"}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={() => (
              <TouchableOpacity
                onPress={onShowAll}
                className="py-3 items-center border-t border-gray-100"
              >
                <Text className="text-sm font-medium text-primary-0">
                  {query?.trim()
                    ? `Show all results for "${query.trim()}"`
                    : "Show all products"}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
