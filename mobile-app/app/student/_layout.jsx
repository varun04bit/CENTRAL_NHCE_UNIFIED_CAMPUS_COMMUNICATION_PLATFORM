import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import useAppTheme from "../../hooks/useAppTheme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [unread, setUnread] = useState(0);
  const { theme } = useAppTheme();

  useEffect(() => {
    // later connect backend
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // ❗ remove extra top bar

        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.icon,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },

        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#888",
      }}
    >
      {/* ANNOUNCEMENTS */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Announcements",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="megaphone-outline" size={size} color={color} />
          ),
        }}
      />

      {/* NEWSLETTERS */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Newsletters",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}