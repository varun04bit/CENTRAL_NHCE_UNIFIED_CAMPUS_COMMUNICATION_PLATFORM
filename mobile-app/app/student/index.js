import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import AnnouncementCard from "../../components/ui/AnnouncementCard";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function StudentDashboard() {
  const router = useRouter();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/announcements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch announcements");
      }

      const json = await res.json();

      // ✅ API returns { announcements: [...] }
      setAnnouncements(json.announcements || []);
    } catch (error) {
      console.error("Student announcements error:", error);
      Alert.alert("Error", "Unable to load announcements");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ LOGOUT */
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Campus Connect</Text>
          <Text style={styles.subtitle}>
            Stay updated with campus happenings
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons
            name="notifications-outline"
            size={26}
            color="#FFD700"
          />

          <Pressable onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={26}
              color="#FF6B6B"
            />
          </Pressable>
        </View>
      </View>

      {/* SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Announcements</Text>

        <View style={styles.badge}>
          <Text style={{ color: "white" }}>
            {announcements.length} active
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FFD700"
          style={{ marginTop: 40 }}
        />
      ) : announcements.length === 0 ? (
        <Text style={styles.empty}>No announcements available</Text>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <AnnouncementCard
              item={{
                ...item,
                timeAgo: new Date(item.createdAt).toLocaleDateString(),
              }}
              onPress={() =>
                router.push({
                  pathname: "/student/announcement-details",
                  params: { data: JSON.stringify(item) },
                })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#A1A1AA",
  },

  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  badge: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 60,
  },
});