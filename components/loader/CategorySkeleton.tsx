import React from "react";
import { View } from "react-native";

export default function CategorySkeleton() {
  return (
    <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
      <View style={{ height: 120, backgroundColor: "#f3f3f3", borderRadius: 8 }} />
      <View style={{ height: 10, width: 120, backgroundColor: "#f3f3f3", marginTop: 10, borderRadius: 6 }} />
    </View>
  );
}
