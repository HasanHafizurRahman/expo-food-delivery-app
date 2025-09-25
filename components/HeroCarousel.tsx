import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";

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
  // desired aspect ratio close to original 2.5/1 -> aspectRatio = width/height -> height = width / 2.5
  const height = Math.round(width / 2.5);

  // autoplay
  useEffect(() => {
    if (!sliders || sliders.length <= 1) return;

    const id = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % sliders.length;
        // scroll FlatList
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, autoplayDelay);

    return () => clearInterval(id);
  }, [sliders, autoplayDelay]);

  // on manual scroll update index
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  if (!sliders || sliders.length === 0) return null;

  return (
    <View className="w-full" style={{ paddingHorizontal: 0 }}>
      <FlatList
        ref={listRef}
        data={sliders}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, idx) => item.image + idx}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={{ width, height }} className="relative rounded-lg overflow-hidden">
            <Image
              source={item.image}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
              // placeholder={require("../assets/placeholder.png")}
            />
            <View className="absolute bottom-4 left-4">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  // navigate to slide url if present
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
              transitionDuration: "200ms",
            }}
          />
        ))}
      </View>
    </View>
  );
}
