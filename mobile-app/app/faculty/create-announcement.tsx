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
import { uploadFiles } from "../../services/upload.service";
import { createAnnouncement } from "../../services/announcement.service";

export default function CreateAnnouncement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("INFO");
  const [semester, setSemester] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (!result.canceled) setFiles(result.assets);
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Title & description required");
      return;
    }

    try {
      setLoading(true);

      let fileIds = [];
      if (files.length > 0) {
        const uploaded = await uploadFiles(files);
        fileIds = uploaded.map((f) => f.id);
      }

      await createAnnouncement({
        title,
        description,
        priority,
        semester: semester ? parseInt(semester) : null,
        fileIds,
      });

      Alert.alert("Success", "Announcement created!");
      setTitle("");
      setDescription("");
      setSemester("");
      setFiles([]);
    } catch (err) {
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
          
          <Text style={styles.heading}>Create Announcement</Text>
          <Text style={styles.subheading}>
            Post updates for students quickly & easily
          </Text>

          {/* TITLE */}
          <TextInput
            placeholder="Title"
            placeholderTextColor="#888"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          {/* DESCRIPTION */}
          <TextInput
            placeholder="Description"
            placeholderTextColor="#888"
            style={[styles.input, { height: 120 }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* PRIORITY */}
          <Text style={styles.label}>Priority</Text>

          {["PINNED", "HIGH", "INFO"].map((p) => (
            <Pressable
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityButton,
                priority === p && styles.prioritySelected,
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === p && { color: "#FFD700" },
                ]}
              >
                {p}
              </Text>
            </Pressable>
          ))}

          {/* SEMESTER */}
          <TextInput
            placeholder="Semester (optional)"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="numeric"
            value={semester}
            onChangeText={setSemester}
          />

          {/* FILES */}
          <Pressable style={styles.fileButton} onPress={pickFiles}>
            <Text style={{ fontWeight: "600" }}>Select Files</Text>
          </Pressable>

          {files.length > 0 &&
            files.map((file, i) => (
              <Pressable
                key={i}
                onPress={() => setFiles(files.filter((_, j) => j !== i))}
                style={styles.fileItem}
              >
                <Text>📎 {file.name}</Text>
                <Text style={{ color: "#ef4444" }}>Remove</Text>
              </Pressable>
            ))}

          {/* SUBMIT */}
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
  container: { flex: 1, padding: 20 },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#000",
    marginBottom: 6,
  },

  subheading: {
    color: "#444",
    fontSize: 15,
    marginBottom: 24,
  },

  input: {
    backgroundColor: "#ffffffcc",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    fontSize: 15,
  },

  label: {
    color: "#444",
    marginBottom: 8,
    fontSize: 13,
  },

  priorityButton: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#ffffffcc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  prioritySelected: {
    borderColor: "#FFD700",
    borderWidth: 2,
  },

  priorityText: {
    fontSize: 15,
    color: "#000",
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