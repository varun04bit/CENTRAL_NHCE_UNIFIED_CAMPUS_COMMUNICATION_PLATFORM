import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  BackHandler,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AnnouncementCard from "../../components/ui/AnnouncementCard";

const dummyAnnouncements = [
  {
    id: 1,
    title: "Campus Placement Drive 🚀",
    description:
      "Infosys and TCS visiting campus next week. Register before Friday.",
    image: null,
    fileUrl: null,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Alumni Meet 2026 🎉",
    description:
      "Join us for annual alumni meetup on March 15th at Main Auditorium.",
    image: null,
    fileUrl: null,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Hackathon Alert 💻",
    description:
      "48-hour AI Hackathon hosted by Coding Club. Prize pool ₹50,000.",
    image: null,
    fileUrl: null,
    createdAt: new Date(),
  },
];

export default function AlumniDashboard() {
  const router = useRouter();

  // ✅ BACK BUTTON → GO TO LOGIN PAGE
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Go back", "Do you want to go back to Login?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "YES",
          onPress: () => router.replace("/login"),
        },
      ]);
      return true; // prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/bg-pattern.jpeg")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Alumni Dashboard</Text>
        <Text style={styles.subtitle}>
          Stay connected with campus updates
        </Text>

        <FlatList
          data={dummyAnnouncements}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <AnnouncementCard
              item={{
                ...item,
                timeAgo: new Date(item.createdAt).toLocaleDateString(),
              }}
            />
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000",
    marginBottom: 6,
  },

  subtitle: {
    color: "#555",
    marginBottom: 20,
  },
});