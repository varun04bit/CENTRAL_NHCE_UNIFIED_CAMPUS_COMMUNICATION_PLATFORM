import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [unread, setUnread] = useState(0);

  // 🔹 OPTIONAL: Fetch unread announcements count
  useEffect(() => {
    // Later connect to backend
    // setUnread(3);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#111",

          // ✅ Fix icons getting hidden
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },

        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#888",
      }}
    >
      {/* ================= ANNOUNCEMENTS ================= */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Announcements",

          // 🔹 Badge when unread
          tabBarBadge: unread > 0 ? unread : null,

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="megaphone-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ================= NEWSLETTERS ================= */}
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