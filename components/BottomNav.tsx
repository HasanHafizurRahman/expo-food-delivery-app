"use client";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    AccountIcon,
    ActiveAccountIcon,
    ActiveCartIcon,
    ActiveCategoryIcon,
    ActiveHomeIcon,
    CartIcon,
    CategoryIcon,
    HomeIcon,
} from "./NavIcons";

type NavItem = {
    href: `/${string}`;
    label: string;
    icon: React.FC<any>;
    activeIcon?: React.FC<any>;
    badge?: number;
    requiresAuth?: boolean;
};

export default function BottomNav({
    cartCount = 0,
    isAuth = false,
}: {
    cartCount?: number;
    isAuth?: boolean;
}) {
    const router = useRouter();

    const navItems: NavItem[] = [
        { href: "/", label: "Home", icon: HomeIcon, activeIcon: ActiveHomeIcon, badge: undefined },
        { href: "/category", label: "Category", icon: CategoryIcon, activeIcon: ActiveCategoryIcon, badge: undefined },
        {
            href: "/cart",
            label: "Cart",
            icon: CartIcon,
            activeIcon: ActiveCartIcon,
            badge: cartCount ?? 0,
            requiresAuth: true,
        },
        {
            href: "/customer_dashboard/profile",
            label: "Account",
            icon: AccountIcon,
            activeIcon: ActiveAccountIcon,
            badge: undefined,
            requiresAuth: true,
        },
    ];

    type Hrefs = (typeof navItems)[number]["href"];

    // derive pathname (works on web; on native you may need to pass route manually)
    const pathname =
        typeof (global as any).location !== "undefined" ? (global as any).location.pathname : "/";

    // Handler accepts the literal union type (Hrefs)
    const handleItemClick = (href: Hrefs, requiresAuth?: boolean) => {
        if (requiresAuth && !isAuth) {
            router.replace("/login" as any);
            return;
        }

        // Cart special handling — keep existing behavior
        if (href === "/cart") {
            router.push((isAuth ? "/cart" : "/login") as any);
            return;
        }
        router.push(href as any);
    };

    const isActiveFor = (href: Hrefs) => {
        if (!pathname) return false;
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <SafeAreaView edges={["bottom"]} className="absolute left-0 right-0 bottom-0 z-50">
            <View className="h-16 flex-row bg-main-primary-0">
                {navItems?.map((item) => {
                    const Icon = item.icon;
                    const ActiveIcon = item.activeIcon;
                    const badge = Number(item.badge ?? 0);
                    // item.href is a readonly literal compatible with Hrefs
                    const isActive = isActiveFor(item.href);

                    return (
                        <TouchableOpacity
                            key={item.label}
                            onPress={() => handleItemClick(item.href, item.requiresAuth)}
                            activeOpacity={0.8}
                            className="flex-1 items-center justify-center px-1 pt-1"
                            accessibilityLabel={item.label}
                        >
                            <View className="relative items-center">
                                {isActive ? (
                                    ActiveIcon ? <ActiveIcon width={20} height={20} /> : <Icon width={20} height={20} />
                                ) : (
                                    <Icon width={20} height={20} />
                                )}

                                {badge > 0 && (
                                    <View className="absolute -right-2 -top-2 h-5 w-5 rounded-full items-center justify-center bg-[#FF9433]">
                                        <Text className="text-xs font-bold text-white">{badge > 9 ? "9+" : badge}</Text>
                                    </View>
                                )}
                            </View>

                            <Text
                                className={`text-xs ${isActive ? "font-semibold text-white" : "text-white font-normal"
                                    }`}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}
