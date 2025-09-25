import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import HeroCarousel from "../components/HeroCarousel";
import { fetchSlidersRN } from "../utils/fetcherRN";
import "./global.css";

export default function Index() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await fetchSlidersRN();
        if (mounted) setSliders(items);
      } catch (err) {
        console.warn("Failed to load sliders", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
      <View>
        {/* Hero / Banner */}
        {!loading && sliders.length > 0 ? (
          <HeroCarousel sliders={sliders} autoplayDelay={5000} />
        ) : (
          <View className="h-40 items-center justify-center">
            <Text className="text-sm text-gray-500">Loading banners...</Text>
          </View>
        )}

        {/* rest of your homepage */}
        <View className="mt-6">
          <Text className="text-lg font-bold">Home content</Text>
        </View>
      </View>
    </ScrollView>
  );
}
