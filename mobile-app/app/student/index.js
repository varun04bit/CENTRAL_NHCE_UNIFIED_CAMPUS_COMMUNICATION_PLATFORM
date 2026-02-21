import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnnouncementCard from "../../components/ui/AnnouncementCard";

export default function StudentDashboard() {
  const router = useRouter();

  const announcements = [
    {
      id: "1",
      title: "Mid-Semester Exam Schedule Released",
      description: "Check your exam schedule for November 2024.",
      priority: "High",
      category: "Academic",
      date: "Nov 15, 2024",
      timeAgo: "2 hours ago",
      image: "https://picsum.photos/400/200",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: "2",
      title: "Guest Lecture on AI & ML",
      description: "Join us Friday 3PM in Auditorium.",
      priority: "Medium",
      category: "Event",
      date: "Nov 18, 2024",
      timeAgo: "5 hours ago",
      image: "https://picsum.photos/400/201",
    },
  ];

  /* ✅ LOGOUT FUNCTION */
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

        {/* RIGHT ICONS */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons name="notifications-outline" size={26} color="#FFD700" />

          <Pressable onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={26} color="#FF6B6B" />
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

      {/* LIST */}
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <AnnouncementCard
            item={item}
            onPress={() =>
              router.push({
                pathname: "/student/announcement-details",
                params: { data: JSON.stringify(item) },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",   // ✅ pure black
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    color: "#FFFFFF",
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
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  badge: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});