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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

import { uploadFiles } from "../../services/upload.service";
import { createAnnouncement } from "../../services/announcement.service";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function CreateAnnouncement() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("INFO");
  const [semester, setSemester] = useState("");
  const [deadline, setDeadline] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedFileIds, setUploadedFileIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const pickFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (!result.canceled) {
      setFiles(result.assets);
      setUploadedFileIds([]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, j) => j !== index));
    setUploadedFileIds([]);
  };

  const handleAIGenerate = async () => {
    if (files.length === 0) {
      Alert.alert("No files selected", "Please select an image or PDF first.");
      return;
    }

    try {
      setAiLoading(true);

      let fileIds = uploadedFileIds;
      if (fileIds.length === 0) {
        const uploaded = await uploadFiles(files);
        fileIds = uploaded.map((f) => f.id);
        setUploadedFileIds(fileIds);
      }

      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/announcements/ai-draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileIds }),
      });

      const responseText = await res.text();
      let draft;
      try {
        draft = JSON.parse(responseText);
      } catch {
        throw new Error("Unexpected server response");
      }

      if (!res.ok) {
        throw new Error(draft.message || "AI generation failed");
      }

      if (draft.title) setTitle(draft.title);
      if (draft.description) setDescription(draft.description);
      if (draft.priority) setPriority(draft.priority);
      if (draft.semester) setSemester(String(draft.semester));
      if (draft.deadline) setDeadline(draft.deadline);

      Alert.alert(
        "✨ AI Draft Ready!",
        "Fields have been filled. Please review and edit before submitting."
      );
    } catch (err) {
      Alert.alert(
        "AI Error",
        err.message || "Could not generate draft. You can still fill manually."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Title & description required");
      return;
    }

    try {
      setLoading(true);

      let fileIds = uploadedFileIds;
      if (files.length > 0 && fileIds.length === 0) {
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
      setDeadline("");
      setFiles([]);
      setUploadedFileIds([]);
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
          {/* BACK BUTTON */}
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <Text style={styles.heading}>Create Announcement</Text>
          <Text style={styles.subheading}>
            Post updates for students quickly & easily
          </Text>

          {/* FILE PICKER */}
          <Pressable style={styles.fileButton} onPress={pickFiles}>
            <Ionicons name="attach-outline" size={18} color="#000" />
            <Text style={styles.fileButtonText}>Select Files</Text>
          </Pressable>

          {files.map((file, i) => (
            <Pressable
              key={i}
              onPress={() => removeFile(i)}
              style={styles.fileItem}
            >
              <Text>📎 {file.name}</Text>
              <Text style={{ color: "#ef4444" }}>Remove</Text>
            </Pressable>
          ))}

          {/* AI GENERATE BUTTON */}
          <Pressable
            style={[styles.aiButton, aiLoading && { opacity: 0.7 }]}
            onPress={handleAIGenerate}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <ActivityIndicator color="#FFD700" size="small" />
            ) : (
              <>
                <Text style={styles.aiButtonIcon}>✨</Text>
                <Text style={styles.aiButtonText}>Generate with AI</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.aiHint}>
            Upload a brochure, notice, PDF or poster and let Gemini AI fill the form
          </Text>

          <View style={styles.divider} />

          {/* TITLE */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#888"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          {/* DESCRIPTION */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Description"
            placeholderTextColor="#888"
            style={[styles.input, { height: 120 }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* DEADLINE */}
          {deadline ? (
            <View style={styles.deadlineBadge}>
              <Ionicons name="time-outline" size={16} color="#1a1a1a" />
              <Text style={styles.deadlineText}>Deadline: {deadline}</Text>
              <Pressable onPress={() => setDeadline("")}>
                <Ionicons name="close-circle" size={16} color="#666" />
              </Pressable>
            </View>
          ) : null}

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
          <Text style={styles.label}>Semester (optional)</Text>
          <TextInput
            placeholder="e.g. 4"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="numeric"
            value={semester}
            onChangeText={setSemester}
          />

          {/* SUBMIT */}
          <Pressable
            style={[styles.submit, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.submitText}>Submit Announcement</Text>
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

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
    fontSize: 15,
    marginBottom: 24,
  },

  label: {
    color: "#444",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#ffffffcc",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    fontSize: 15,
  },

  fileButton: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  fileButtonText: {
    fontWeight: "700",
    fontSize: 15,
  },

  fileItem: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffffcc",
    padding: 12,
    borderRadius: 10,
  },

  aiButton: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 14,
    marginBottom: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#FFD700",
  },

  aiButtonIcon: { fontSize: 16 },

  aiButtonText: {
    color: "#FFD700",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  aiHint: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginBottom: 20,
  },

  deadlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,215,0,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.4)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },

  deadlineText: {
    flex: 1,
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: 14,
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

  submit: {
    backgroundColor: "#FFD700",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 40,
  },

  submitText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
