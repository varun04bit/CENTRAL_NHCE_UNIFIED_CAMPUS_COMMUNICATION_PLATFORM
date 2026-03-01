import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";

import { uploadFiles } from "../../services/upload.service";
import { createNewsletter } from "../../services/newsletter.service";

export default function CreateNewsletter() {
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (!result.canceled) setFiles(result.assets);
  };

  const handleSubmit = async () => {
    if (!title || !month || !year) {
      Alert.alert("Error", "Title, month and year are required");
      return;
    }

    if (parseInt(month) < 1 || parseInt(month) > 12) {
      Alert.alert("Error", "Month must be between 1 and 12");
      return;
    }

    try {
      setLoading(true);

      let fileIds = [];
      if (files.length > 0) {
        const uploaded = await uploadFiles(files);
        fileIds = uploaded.map((f) => f.id);
      }

      await createNewsletter({
        title,
        description,
        month: parseInt(month),
        year: parseInt(year),
        fileIds,
      });

      Alert.alert("Success", "Newsletter created!");
      setTitle("");
      setDescription("");
      setMonth("");
      setYear("");
      setFiles([]);
    } catch {
      Alert.alert("Error", "Something went wrong");
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
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* BACK BUTTON */}
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <Text style={styles.heading}>Create Newsletter</Text>
          <Text style={styles.subheading}>
            Share monthly updates with students
          </Text>

          <TextInput
            placeholder="Title"
            placeholderTextColor="#888"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Description (optional)"
            placeholderTextColor="#888"
            style={[styles.input, { height: 110 }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            placeholder="Month (1-12)"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="numeric"
            value={month}
            onChangeText={setMonth}
          />

          <TextInput
            placeholder="Year (e.g. 2025)"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="numeric"
            value={year}
            onChangeText={setYear}
          />

          <Pressable style={styles.fileButton} onPress={pickFiles}>
            <Text style={{ fontWeight: "600" }}>Select Files</Text>
          </Pressable>

          {files.map((file, i) => (
            <Pressable
              key={i}
              onPress={() => setFiles(files.filter((_, j) => j !== i))}
              style={styles.fileItem}
            >
              <Text>📎 {file.name}</Text>
              <Text style={{ color: "#ef4444" }}>Remove</Text>
            </Pressable>
          ))}

          <Pressable style={styles.submit} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={{ fontWeight: "700" }}>Submit</Text>
            )}
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  backButton: {
    marginBottom: 12,
    alignSelf: "flex-start",
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#000",
    marginBottom: 6,
  },

  subheading: {
    color: "#444",
    marginBottom: 24,
  },

  input: {
    backgroundColor: "#ffffffcc",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  fileButton: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: "center",
  },

  fileItem: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  submit: {
    backgroundColor: "#FFD700",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 40,
  },
});