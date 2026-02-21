import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { uploadFiles } from "../../services/upload.service";
import { createNewsletter } from "../../services/newsletter.service";

export default function CreateNewsletter() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const pickFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
    });

    if (!result.canceled) {
      setFiles(result.assets);
    }
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

    let fileIds: string[] = [];

    if (files.length > 0) {
      const uploaded = await uploadFiles(files);
      fileIds = uploaded.map((f: any) => f.id);
    }

    await createNewsletter({
      title,
      description,
      month: parseInt(month),
      year: parseInt(year),
      fileIds,
    });

    Alert.alert("Success", "Newsletter created successfully");

    setTitle("");
    setDescription("");
    setMonth("");
    setYear("");
    setFiles([]);
  } catch (err: any) {
    Alert.alert("Error", err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Newsletter</Text>

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
        style={[styles.input, { height: 100 }]}
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
        <Text style={{ color: "#fff" }}>Select Files</Text>
      </Pressable>
        {files.length > 0 && (
  <View style={{ marginBottom: 16 }}>
    {files.map((file, index) => (
      <Pressable
        key={index}
        onPress={() =>
          setFiles(files.filter((_, i) => i !== index))
        }
        style={{
          marginBottom: 6,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "#aaa", fontSize: 12 }}>
          📎 {file.name}
        </Text>

        <Text style={{ color: "#ef4444", fontSize: 12 }}>
          Remove
        </Text>
      </Pressable>
    ))}
  </View>
)}
      <Pressable style={styles.submit} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={{ fontWeight: "700" }}>Submit</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  heading: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    color: "#fff",
  },
  fileButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  submit: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
});