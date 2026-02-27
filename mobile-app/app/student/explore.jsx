import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NewsletterCard from "../../components/ui/NewsletterCard";
import useAppTheme from "../../hooks/useAppTheme";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/newsletters`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch newsletters");

      const json = await res.json();
      setNewsletters(json || []);
    } catch (error) {
      Alert.alert("Error", "Unable to load newsletters");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg-pattern.jpeg")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Newsletters
          </Text>
        </View>

        {/* CONTENT */}
        {loading ? (
          <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 40 }} />
        ) : newsletters.length === 0 ? (
          <Text style={[styles.empty, { color: theme.icon }]}>
            No newsletters available
          </Text>
        ) : (
          <FlatList
            data={newsletters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <NewsletterCard
                item={{
                  ...item,
                  date: `${item.month}/${item.year}`,
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          />
        )}
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
    marginTop: 4,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 60,
  },
});