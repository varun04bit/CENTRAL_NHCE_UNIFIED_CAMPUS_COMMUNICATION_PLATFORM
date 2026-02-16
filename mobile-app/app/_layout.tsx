import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-BoldItalic": require("../assets/fonts/Inter-BoldItalic.ttf"),
    "Inter-SemiBoldItalic": require("../assets/fonts/Inter-SemiBoldItalic.ttf"),
  });

  // Prevent splash / white screen while fonts load
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth screens */}
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />

      {/* Main app (tabs) */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

