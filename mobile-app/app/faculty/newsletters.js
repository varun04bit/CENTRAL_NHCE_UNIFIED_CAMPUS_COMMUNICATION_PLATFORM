import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  Linking,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function MyNewsletters() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/newsletters/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Fetch newsletters error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/bg-pattern.jpeg")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* BACK BUTTON */}
              <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>← Back</Text>
              </Pressable>

              <Text style={styles.title}>My Newsletters</Text>
            </>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No newsletters created yet</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.meta}>
                  {item.month}/{item.year}
                </Text>
              </View>

              {/* EDIT */}
              <Pressable
                onPress={() =>
                  router.push(`/faculty/edit-newsletter/${item.id}`)
                }
              >
                <Ionicons name="pencil-outline" size={20} color="#FFD700" />
              </Pressable>

              {/* FILE PREVIEW */}
              {item.files?.length > 0 && (
                <View style={styles.files}>
                  {item.files.map((file) => {
                    const url = file.url.startsWith("http")
                      ? file.url
                      : `${API_BASE_URL}/${file.url}`;

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

                    return (
                      <Pressable
                        key={file.id}
                        style={styles.fileRow}
                        onPress={() => Linking.openURL(url)}
                      >
                        <Ionicons
                          name="document-outline"
                          size={18}
                          color="#FFD700"
                        />
                        <Text style={styles.fileText}>Open attachment</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  list: { padding: 20 },

  backButton: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#000",
    marginBottom: 20,
  },

  empty: {
    color: "#666",
    textAlign: "center",
    marginTop: 40,
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
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  meta: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },

  files: { marginTop: 12, gap: 10 },

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
    color: "#000",
    fontSize: 13,
  },
});