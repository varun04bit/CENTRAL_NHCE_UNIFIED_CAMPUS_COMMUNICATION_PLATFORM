import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Pressable,
  Image,
  Linking,
  ImageBackground,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
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
          <Text style={[styles.title, { color: theme.text }]}>Newsletters</Text>
        </View>

        {/* CONTENT */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.tint}
            style={{ marginTop: 40 }}
          />
        ) : newsletters.length === 0 ? (
          <Text style={[styles.empty, { color: theme.icon }]}>
            No newsletters available
          </Text>
        ) : (
          <FlatList
            data={newsletters}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.meta}>
                  {item.month}/{item.year}
                </Text>

                {/* FILE PREVIEW */}
                {item.files?.length > 0 && (
                  <View style={styles.files}>
                    {item.files.map((file) => {
                      const url = file.url.startsWith("http")
                        ? file.url
                        : `${API_BASE_URL}/${file.url}`;

                      // 🖼 IMAGE PREVIEW
                      if (file.mimeType?.startsWith("image/")) {
                        return (
                          <Pressable
                            key={file.id}
                            onPress={() => Linking.openURL(url)}
                          >
                            <Image source={{ uri: url }} style={styles.image} />
                          </Pressable>
                        );
                      }

                      // 📄 PDF / DOC DOWNLOAD
                      return (
                        <Pressable
                          key={file.id}
                          style={styles.fileRow}
                          onPress={() => Linking.openURL(url)}
                        >
                          <Ionicons
                            name="document-outline"
                            size={18}
                            color={theme.tint}
                          />
                          <Text
                            style={[styles.fileText, { color: theme.text }]}
                          >
                            Open attachment
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
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

  card: {
    backgroundColor: "#ffffffdd",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },

  meta: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
  },

  files: {
    marginTop: 8,
    gap: 10,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },

  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },

  fileText: {
    fontSize: 13,
  },
});
