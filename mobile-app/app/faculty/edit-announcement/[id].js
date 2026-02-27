import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ImageBackground,
  ActivityIndicator,
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/announcements/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const item = data.find((a) => a.id.toString() === id);

      if (item) {
        setTitle(item.title);
        setDescription(item.description);
      }
    } catch {
      Alert.alert("Error", "Failed to load announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

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
    } catch {
      Alert.alert("Error", "Failed to update");
    } finally {
      setSaving(false);
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
      source={require("../../../assets/images/bg-pattern.jpeg")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Edit Announcement</Text>
          <Text style={styles.subtitle}>
            Update your announcement details
          </Text>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#888"
          />

          <TextInput
            style={[styles.input, { height: 120 }]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Description"
            placeholderTextColor="#888"
          />

          <Pressable style={styles.btn} onPress={handleSave}>
            {saving ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000",
    marginBottom: 6,
  },

  subtitle: {
    color: "#555",
    marginBottom: 26,
  },

  input: {
    backgroundColor: "#ffffffcc",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    fontSize: 15,
  },

  btn: {
    backgroundColor: "#FFD700",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
});