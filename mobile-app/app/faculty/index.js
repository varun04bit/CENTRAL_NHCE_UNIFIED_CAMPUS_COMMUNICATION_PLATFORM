import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ImageBackground,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

import ProfileAvatar from "../../components/ui/ProfileAvatar";
import ProfileSheet from "../../components/ui/ProfileSheet";

export default function FacultyHome() {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ BLOCK BACK BUTTON
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
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Faculty Panel</Text>
              <Text style={styles.subtitle}>
                Create and manage announcements & newsletters
              </Text>
            </View>

            <Pressable onPress={() => setProfileOpen(true)}>
              <ProfileAvatar size={40} />
            </Pressable>
          </View>

          {/* CREATE */}
          <Section title="Create">
            <Card
              icon="megaphone-outline"
              text="Create Announcement"
              onPress={() => router.push("/faculty/create-announcement")}
            />
            <Card
              icon="newspaper-outline"
              text="Create Newsletter"
              onPress={() => router.push("/faculty/create-newsletter")}
            />
          </Section>

          {/* MANAGE */}
          <Section title="Manage">
            <Card
              icon="list-outline"
              text="My Announcements"
              onPress={() => router.push("/faculty/announcements")}
            />
            <Card
              icon="albums-outline"
              text="My Newsletters"
              onPress={() => router.push("/faculty/newsletters")}
            />
          </Section>

        </View>

        <ProfileSheet
          visible={profileOpen}
          onClose={() => setProfileOpen(false)}
          email={"faculty@email.com"}
          onLogout={handleLogout}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

/* ---------- REUSABLE ---------- */

function Section({ title, children }) {
  return (
    <View style={{ marginBottom: 26 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Card({ icon, text, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#FFD700" />
      <Text style={styles.cardText}>{text}</Text>
    </Pressable>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1 },

  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  header: {
    marginTop: 20,
    marginBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: "#444",
    maxWidth: 260,
  },

  sectionTitle: {
    color: "#555",
    fontSize: 13,
    marginBottom: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  card: {
    backgroundColor: "#ffffffcc",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});