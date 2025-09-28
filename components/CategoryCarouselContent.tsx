import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Category = {
  slug: string;
  icon?: string;
  title?: string;
  from_price?: number | string;
};

export default function CategoryCarouselContent({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const listRef = useRef<FlatList<Category> | null>(null);
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [listWidth, setListWidth] = useState(0);

  // Mobile-only design: items occupy ~22.2222% of viewport width
  const mobileItemWidth = Math.round(width * 0.222222);
  const itemWidth = mobileItemWidth;

  // content width and max offset
  const contentWidth = (categories?.length || 0) * itemWidth;
  const maxOffset = Math.max(0, contentWidth - (listWidth || width));

  useEffect(() => {
    const handler = ({ window }: { window: { width: number } }) => {
      setWidth(window.width);
    };
    const sub = Dimensions.addEventListener?.("change", handler);
    return () => sub?.remove?.();
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setScrollOffset(x);
  };

  // getItemLayout for reliable scrollToOffset
  const getItemLayout = (_: any, index: number) => ({
    length: itemWidth,
    offset: itemWidth * index,
    index,
  });

  if (!categories || categories.length === 0) return null;

  return (
    <View style={{ paddingVertical: 12, paddingHorizontal: 8 }}>
      <View
        onLayout={(e) => {
          setListWidth(e.nativeEvent.layout.width);
        }}
      >
        <FlatList
          ref={listRef}
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.slug}
          renderItem={({ item }) => {
            const circleSize = 61;
            const border = 2;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push(`/products?category=${encodeURIComponent(item.slug)}` as any)}
                style={{
                  width: itemWidth,
                  paddingHorizontal: 6,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: circleSize,
                    height: circleSize,
                    borderRadius: circleSize / 2,
                    overflow: "hidden",
                    borderWidth: border,
                    borderColor: "#FB7A0A",
                    backgroundColor: "#e6e6e6",
                    marginBottom: 6,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.icon ? (
                    <Image
                      source={{ uri: item.icon }}
                      contentFit="cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : null}
                </View>

                <View
                  style={{
                    backgroundColor: "#FFF7ED",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 999,
                    marginBottom: 6,
                    alignSelf: "center",
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "700", color: "#FB7A0A" }}>
                    From {item?.from_price ?? "0"} ৳
                  </Text>
                </View>

                <Text
                  numberOfLines={2}
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    maxWidth: itemWidth - 12,
                    color: "#333",
                  }}
                >
                  {item?.title}
                </Text>
              </TouchableOpacity>
            );
          }}
          getItemLayout={getItemLayout}
          onScroll={onScroll}
          scrollEventThrottle={16}
          // Snap so each item aligns like snap-x snap-mandatory
          snapToInterval={itemWidth}
          snapToAlignment="start"
          decelerationRate={Platform.OS === "ios" ? "fast" : 0.95}
        />
      </View>
    </View>
  );
}
