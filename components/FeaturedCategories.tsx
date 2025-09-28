import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { getFeaturedCategoriesRN } from "../utils/getFeaturedCategoriesRN";
import CategoryCarouselContent from "./CategoryCarouselContent";
import CategorySkeleton from "./loader/CategorySkeleton";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await getFeaturedCategoriesRN();
        if (mounted) setCategories(cats);
      } catch (err) {
        console.error("Failed to load featured categories", err);
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <CategorySkeleton />;
  if (!categories || categories.length === 0) return null;

  return (
    <View>
      <CategoryCarouselContent categories={categories} />
    </View>
  );
}
