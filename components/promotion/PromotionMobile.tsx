import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import ProductCardMiniMobile from "../card/ProductCardMiniMobile";
import PromotionTitle from "./PromotionTitle";

export default function PromotionMobile({ promotions = [] }: { promotions?: any[] }) {
    console.log("promotions", promotions);
    const router = useRouter();
    const promo = promotions?.[0];
    const stocks = promo?.stocks?.slice(0, 6) || [];

    if (!promo) return null;

    const width = Dimensions.get("window").width;
    // each item ~43% width like your Next design
    const itemWidth = Math.round(width * 0.43);

    const renderItem = ({ item }: { item: any }) => {
        // `item` is the wrapper object that contains:
        //  - promotional_image (item.promotional_image)
        //  - slug, title (item.title)
        //  - stock (item.stock) which has price/discount fields
        const wrapper = item ?? {};
        const s = wrapper.stock ?? {};

        // image and title come from wrapper
        const image = wrapper.promotional_image ?? null;
        const title = wrapper.title ?? wrapper.name ?? "";

        // price logic uses the inner stock object (s)
        const effectivePrice =
            s?.discounted_price != null && s?.discounted_price !== ""
                ? Number(s.discounted_price)
                : Number(s.price ?? 0);

        const oldPriceRaw = s?.price ?? null;
        const hasDiscount =
            oldPriceRaw != null &&
            !Number.isNaN(Number(oldPriceRaw)) &&
            Number(oldPriceRaw) > Number(effectivePrice);

        const product = {
            id: wrapper?.slug ?? s?.id,
            description: title,
            image: image,
            price: effectivePrice,
            oldPrice: hasDiscount ? Number(oldPriceRaw) : null,
        };

        // debug logging to verify image is present
        if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log("product ", product);
        }

        return (
            <TouchableOpacity
                onPress={() => router.push(`/product-details/${wrapper?.slug ?? s?.id}` as any)}
                style={{ width: itemWidth }}
            >
                <ProductCardMiniMobile product={product} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 12 }}>
            <PromotionTitle name={promo.name} />

            <FlatList
                data={stocks}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(s) => s?.slug ?? s?.stock?.id ?? Math.random().toString()}
                renderItem={renderItem}
                snapToInterval={itemWidth}
                decelerationRate="fast"
                contentContainerStyle={{ paddingVertical: 8 }}
            />
        </View>
    );
}
