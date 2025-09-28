import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Slide = {
  image: string;
  title?: string;
  url?: string;
};

export default function HeroCarousel({
  sliders = [],
  autoplayDelay = 5000,
}: {
  sliders?: Slide[];
  autoplayDelay?: number; // ms
}) {
  const router = useRouter();
  const listRef = useRef<FlatList<Slide> | null>(null);
  const [index, setIndex] = useState(0);

  const width = Dimensions.get("window").width;
  const height = Math.round(width / 2.5);

  // update width on dimension change (optional but useful for rotation)
  useEffect(() => {
    const sub = Dimensions.addEventListener?.("change", () => {
      // force re-render so width/height are recalculated (setIndex no-op)
      setIndex((i) => i);
    });
    return () => sub?.remove?.();
  }, []);

  // autoplay: use scrollToOffset (more reliable cross-platform)
  useEffect(() => {
    if (!sliders || sliders.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % sliders.length;
        // scroll by offset
        listRef.current?.scrollToOffset({ offset: next * width, animated: true });
        return next;
      });
    }, autoplayDelay);

    return () => clearInterval(id);
  }, [sliders, autoplayDelay, width]);

  // compute index when user finishes a scroll gesture
  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / width);
    if (newIndex !== index) setIndex(newIndex);
  };

  // getItemLayout helps scrollToIndex/scrollToOffset work reliably (and improves perf)
  const getItemLayout = (_: ArrayLike<Slide> | null | undefined, i: number) => ({
    length: width,
    offset: width * i,
    index: i,
  });

  if (!sliders || sliders.length === 0) return null;

  return (
    <View className="w-full" style={{ paddingHorizontal: 0 }}>
      <FlatList
        ref={listRef}
        data={sliders}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, idx) => `${item.image}-${idx}`}
        renderItem={({ item }) => (
          <View style={{ width, height }} className="relative rounded-lg overflow-hidden">
            {/* Use { uri } for remote images */}
            <Image
              source={typeof item.image === "string" ? { uri: item.image } : item.image}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
            <View className="absolute bottom-4 left-4">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  if (item.url) router.push(item.url as any);
                }}
                className="rounded-full bg-white px-4 py-2"
                style={{ elevation: 2 }}
              >
                <Text className="text-sm font-medium text-[#252525]">Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        // make scrolling control reliable
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={onMomentumScrollEnd}
        // optional: ensure one-page snapping on web
        decelerationRate="fast"
      />

      {/* Dots indicator */}
      <View className="flex-row items-center justify-center mt-3">
        {sliders.map((_, i) => (
          <View
            key={i}
            className="mx-1"
            style={{
              width: i === index ? 18 : 8,
              height: 8,
              borderRadius: 8,
              backgroundColor: i === index ? "#FB7A0A" : "rgba(0,0,0,0.15)",
            }}
          />
        ))}
      </View>
    </View>
  );
}
