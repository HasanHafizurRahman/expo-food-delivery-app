import React, { useMemo } from "react";
import { Image as RNImage, Text, View } from "react-native";

type MiniProduct = {
  id?: string;
  image?: string | null;
  price?: number | string;
  oldPrice?: number | null;
  description?: string;
};

const DEFAULT_API_BASE = "https://ecom-api.virleaf.com";

export default function ProductCardMiniMobile({ product }: { product: MiniProduct }) {
  // compute full URI if product.image is relative; if already absolute, use as-is
  const uri = useMemo(() => {
    const img = product?.image;
    if (!img) return null;
    if (/^https?:\/\//i.test(img)) return img;
    const base = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;
    return `${base.replace(/\/$/, "")}/${img.replace(/^\//, "")}`;
  }, [product?.image]);

  return (
    <View style={{ width: "100%", paddingHorizontal: 8, paddingVertical: 8 }}>
      {/* square image (aspectRatio: 1 mimics next/image fill inside a square) */}
      <View
        style={{
          width: "100%",
          aspectRatio: 1,
          marginBottom: 8,
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: "#f3f3f3",
        }}
      >
        {uri ? (
          <RNImage
            source={{ uri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#999" }}>No Image</Text>
          </View>
        )}
      </View>

      {/* Price Row */}
      <View>
        <Text style={{ fontSize: 14, fontWeight: "700" }}>Tk. {product?.price}</Text>
        {product?.oldPrice != null && (
          <Text style={{ marginLeft: 6, fontSize: 12, color: "#888", textDecorationLine: "line-through" }}>
            Tk. {product?.oldPrice}
          </Text>
        )}
      </View>
    </View>
  );
}
