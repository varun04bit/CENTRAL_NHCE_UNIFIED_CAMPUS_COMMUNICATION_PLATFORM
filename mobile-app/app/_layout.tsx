import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { useEffect, useState } from "react";
import AnimatedSplash from "./splash";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-BoldItalic": require("../assets/fonts/Inter-BoldItalic.ttf"),
    "Inter-SemiBoldItalic": require("../assets/fonts/Inter-SemiBoldItalic.ttf"),
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#ffffff" }} />;
  }

  if (showSplash) {
    return <AnimatedSplash />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}