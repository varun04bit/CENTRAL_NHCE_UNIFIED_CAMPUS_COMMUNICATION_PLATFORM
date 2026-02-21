import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function MyAnnouncements() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/announcements/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Fetch announcements error:", error);
      Alert.alert("Error", "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Delete Announcement", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("token");

          await fetch(`${API_BASE_URL}/announcements/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          fetchData();
        },
      },
    ]);
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
          <Text style={styles.title}>My Announcements</Text>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No announcements yet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>

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

            <View style={styles.row}>
              <Text style={styles.meta}>Priority: {item.priority}</Text>

              <View style={styles.actions}>
                <Pressable
                  onPress={() =>
                    router.push(`/faculty/edit-announcement/${item.id}`)
                  }
                >
                  <Ionicons name="pencil-outline" size={18} color="#fff" />
                </Pressable>

                <Pressable onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#ff5c5c" />
                </Pressable>
              </View>
            </View>
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
  desc: { color: "rgba(255,255,255,0.65)", marginTop: 6 },

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

  row: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: { color: "#aaa", fontSize: 12 },
  actions: { flexDirection: "row", gap: 16 },
});
