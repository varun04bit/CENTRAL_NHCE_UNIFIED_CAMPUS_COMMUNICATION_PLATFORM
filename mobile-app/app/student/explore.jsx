import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NewsletterCard from "../../components/ui/NewsletterCard";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/newsletters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch newsletters");
      }

      const json = await res.json();
      setNewsletters(json || []);
    } catch (error) {
      console.error("Fetch newsletters error:", error);
      Alert.alert("Error", "Unable to load newsletters");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.title}>Newsletters</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FFD700"
          style={{ marginTop: 40 }}
        />
      ) : newsletters.length === 0 ? (
        <Text style={styles.empty}>No newsletters available</Text>
      ) : (
        <FlatList
          data={newsletters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NewsletterCard
              item={{
                ...item,
                date: `${item.month}/${item.year}`,
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 80,
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 16,
  },

  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  empty: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 60,
  },
});
