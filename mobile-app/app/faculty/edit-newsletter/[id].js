import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function EditNewsletter() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNewsletter();
  }, []);

  const loadNewsletter = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/newsletters/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const newsletter = data.find((n) => n.id === id);

      if (!newsletter) {
        Alert.alert("Error", "Newsletter not found");
        router.back();
        return;
      }

      setTitle(newsletter.title);
      setDescription(newsletter.description || "");
      setMonth(String(newsletter.month));
      setYear(String(newsletter.year));
    } catch (error) {
      console.error("Load newsletter error:", error);
      Alert.alert("Error", "Failed to load newsletter");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !month || !year) {
      Alert.alert("Validation Error", "Title, month, and year are required");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          month: Number(month),
          year: Number(year),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      Alert.alert("Success", "Newsletter updated successfully");
      router.back();
    } catch (error) {
      console.error("Update newsletter error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
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
      <View style={styles.container}>
        <Text style={styles.title}>Edit Newsletter</Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#777"
        />

        <TextInput
          style={[styles.input, styles.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description (optional)"
          placeholderTextColor="#777"
          multiline
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.smallInput]}
            value={month}
            onChangeText={setMonth}
            placeholder="MM"
            placeholderTextColor="#777"
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, styles.smallInput]}
            value={year}
            onChangeText={setYear}
            placeholder="YYYY"
            placeholderTextColor="#777"
            keyboardType="numeric"
          />
        </View>

        <Pressable
          style={[styles.btn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.btnText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  loader: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 24,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
    color: "#fff",
    marginBottom: 14,
  },
  textarea: {
    height: 110,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  smallInput: {
    flex: 1,
  },
  btn: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginTop: 22,
  },
  btnText: {
    color: "#000",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },
});
