import BottomNav from "@/components/BottomNav";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  // you can control auth state and cartCount here and pass as props
  const isAuth = false; // replace with real auth state
  const cartCount = 0;

  return (
    <>
      <Stack />
      <BottomNav isAuth={isAuth} cartCount={cartCount} />
    </>
  );
}
