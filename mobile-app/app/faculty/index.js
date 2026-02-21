import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FacultyHome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Faculty Panel</Text>
          <Text style={styles.subtitle}>
            Create and manage your announcements & newsletters
          </Text>
        </View>

        {/* CREATE SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create</Text>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/faculty/create-announcement")}
          >
            <Ionicons name="megaphone-outline" size={22} color="#fff" />
            <Text style={styles.cardText}>Create Announcement</Text>
          </Pressable>
          <Pressable
            style={styles.card}
            onPress={() => router.push("/faculty/announcements")}
          >
            <Ionicons name="newspaper-outline" size={22} color="#fff" />
            <Text style={styles.cardText}>Create Newsletter</Text>
          </Pressable>
        </View>

        {/* MANAGE SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage</Text>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/faculty/announcements")}
          >
            <Ionicons name="list-outline" size={22} color="#fff" />
            <Text style={styles.cardText}>My Announcements</Text>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/faculty/newsletters")}
          >
            <Ionicons name="albums-outline" size={22} color="#fff" />
            <Text style={styles.cardText}>My Newsletters</Text>
          </Pressable>
        </View>

        {/* PROFILE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/faculty/profile")}
          >
            <Ionicons name="person-outline" size={22} color="#fff" />
            <Text style={styles.cardText}>My Profile</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 28,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: "rgba(255,255,255,0.65)",
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
