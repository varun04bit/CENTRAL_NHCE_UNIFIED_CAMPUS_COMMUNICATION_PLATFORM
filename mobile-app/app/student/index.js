import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import AnnouncementCard from "../../components/ui/AnnouncementCard";
import ProfileAvatar from "../../components/ui/ProfileAvatar";
import ProfileSheet from "../../components/ui/ProfileSheet";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function StudentDashboard() {
  const router = useRouter();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [email, setEmail] = useState("");

  // ✅ FETCH STUDENT EMAIL
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        setEmail(json.email);
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };

    fetchProfile();
  }, []);

  // ✅ FETCH ANNOUNCEMENTS
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ✅ BLOCK ANDROID BACK BUTTON (EXIT APP)
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to exit?", [
        { text: "Cancel", style: "cancel" },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch announcements");

      const json = await res.json();
      setAnnouncements(json.announcements || []);
    } catch (error) {
      Alert.alert("Error", "Unable to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setProfileOpen(false);
    router.replace("/login");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg-pattern.jpeg")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Campus Connect</Text>
            <Text style={styles.subtitle}>
              Stay updated with campus happenings
            </Text>
          </View>

          <Pressable onPress={() => setProfileOpen(true)}>
            <ProfileAvatar size={38} />
          </Pressable>
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
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => {
              const imageFile = item.files?.find((f) =>
                f.mimeType?.startsWith("image/")
              );
              const docFile = item.files?.find(
                (f) => !f.mimeType?.startsWith("image/")
              );
              const resolveUrl = (u) =>
                u ? (u.startsWith("http") ? u : `${API_BASE_URL}/${u}`) : null;

              return (
                <AnnouncementCard
                  item={{
                    ...item,
                    image: resolveUrl(item.image || imageFile?.url),
                    fileUrl: resolveUrl(item.fileUrl || docFile?.url),
                    date: item.priority || "INFO",
                    timeAgo: new Date(item.createdAt).toLocaleDateString(),
                  }}
                />
              );
            }}
          />
        )}

        {/* PROFILE SHEET */}
        <ProfileSheet
          visible={profileOpen}
          onClose={() => setProfileOpen(false)}
          email={email || "Loading..."}
          onLogout={handleLogout}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: { color: "#333" },

  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },

  sectionTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },

  badge: {
    backgroundColor: "#006aff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  empty: {
    color: "#000",
    textAlign: "center",
    marginTop: 60,
  },
});