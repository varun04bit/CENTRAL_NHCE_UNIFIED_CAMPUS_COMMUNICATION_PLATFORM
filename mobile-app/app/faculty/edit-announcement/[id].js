import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function EditAnnouncement() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/announcements/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const item = data.find((a) => a.id === id);
    setTitle(item.title);
    setDescription(item.description);
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("token");
    await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });
    Alert.alert("Updated", "Announcement updated successfully");
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Announcement</Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#777"
        />

        <TextInput
          style={[styles.input, { height: 120 }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Description"
          placeholderTextColor="#777"
        />

        <Pressable style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>Save Changes</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  container: { padding: 24 },
  title: { color: "#fff", fontSize: 26, fontWeight: "700", marginBottom: 20 },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    marginBottom: 14,
  },
  btn: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  btnText: {
    color: "#000",
    fontWeight: "700",
    textAlign: "center",
  },
});
