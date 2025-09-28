import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function PromotionTitle({
  name,
  subtitle = "Up to 50% OFF",
}: {
  name?: string;
  subtitle?: string;
}) {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        paddingVertical: 6,
        paddingHorizontal: 2,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#222" }}>{name}</Text>

      <Text style={{ fontSize: 24, fontWeight: "700", color: "#EC7208" }}>{subtitle}</Text>

      <TouchableOpacity
        onPress={() => router.push("/products" as any)}
        style={{
          borderWidth: 1,
          borderColor: "#000",
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 4,
        }}
      >
        <Text style={{ fontSize: 14 }}>View All</Text>
      </TouchableOpacity>
    </View>
  );
}
