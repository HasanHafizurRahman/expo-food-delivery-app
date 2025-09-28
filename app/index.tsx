import FeaturedCategories from "@/components/FeaturedCategories";
import HeroCarousel from "@/components/HeroCarousel";
import LightningDeals from "@/components/LightningDeals";
import PromotionMobile from "@/components/promotion/PromotionMobile";
import SearchInput from "@/components/SearchInput";
import { getPromotionsRN } from "@/utils/getPromotionsRN";
import { fetchSlidersRN } from "@/utils/getSlider";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import "./global.css";

export default function Index() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // fetch sliders and promotions in parallel
        const [sliderItems, promoItems] = await Promise.allSettled([
          fetchSlidersRN(),
          getPromotionsRN(),
        ]);

        if (!mounted) return;

        if (sliderItems.status === "fulfilled") {
          setSliders(sliderItems.value ?? []);
        } else {
          console.warn("Failed to load sliders", sliderItems.reason);
          setSliders([]);
        }

        if (promoItems.status === "fulfilled") {
          setPromotions(promoItems.value ?? []);
        } else {
          console.warn("Failed to load promotions", promoItems.reason);
          setPromotions([]);
        }
      } catch (err) {
        console.warn("Failed to load sliders/promotions", err);
        if (mounted) {
          setSliders([]);
          setPromotions([]);
        }
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

        {/* Search input */}
        <View className="px-4 mt-3">
          <SearchInput initialQuery="" initialSuggestions={[]} />
        </View>

        <FeaturedCategories />
        <LightningDeals />

        {/* Promotion mobile (uses promotions state) */}
        <PromotionMobile promotions={promotions} />
      </View>
    </ScrollView>
  );
}
