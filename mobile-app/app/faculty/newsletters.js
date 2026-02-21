import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  Linking,
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
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.title}>My Newsletters</Text>
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

            <Pressable
              onPress={() =>
                router.push(`/faculty/edit-newsletter/${item.id}`)
              }
            >
              <Ionicons name="pencil-outline" size={18} color="#fff" />
            </Pressable>

            {/* FILE PREVIEW */}
            {item.files?.length > 0 && (
              <View style={styles.files}>
                {item.files.map((file) => {
                  if (file.mimeType.startsWith("image/")) {
                    return (
                      <Pressable
                        key={file.id}
                        onPress={() => Linking.openURL(file.url)}
                      >
                        <Image
                          source={{ uri: file.url }}
                          style={styles.image}
                        />
                      </Pressable>
                    );
                  }

                  return (
                    <Pressable
                      key={file.id}
                      style={styles.fileRow}
                      onPress={() => Linking.openURL(file.url)}
                    >
                      <Ionicons
                        name="document-outline"
                        size={18}
                        color="#fff"
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
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  loader: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  list: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  meta: { color: "#aaa", fontSize: 12, marginTop: 4 },

  files: {
    marginTop: 12,
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
    color: "#fff",
    fontSize: 13,
  },
});
