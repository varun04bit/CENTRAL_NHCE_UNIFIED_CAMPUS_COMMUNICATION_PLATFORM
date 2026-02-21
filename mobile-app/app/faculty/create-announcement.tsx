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
import { createAnnouncement } from "../../services/announcement.service";

export default function CreateAnnouncement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("INFO");
  const [semester, setSemester] = useState("");
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
    if (!title || !description || !priority) {
      Alert.alert("Error", "Title, description, and priority are required");
      return;
    }

    try {
      setLoading(true);

      let fileIds: string[] = [];

      if (files.length > 0) {
        const uploaded = await uploadFiles(files);
        fileIds = uploaded.map((f: any) => f.id);
      }

      await createAnnouncement({
        title,
        description,
        priority,
        semester: semester ? parseInt(semester) : null,
        fileIds,
      });

      Alert.alert("Success", "Announcement created successfully");

      setTitle("");
      setDescription("");
      setSemester("");
      setFiles([]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Announcement</Text>

      <TextInput
        placeholder="Title"
        placeholderTextColor="#888"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description"
        placeholderTextColor="#888"
        style={[styles.input, { height: 100 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

     
      <Text style={styles.label}>Priority</Text>

{["PINNED", "HIGH", "INFO"].map((p) => {
  const isSelected = priority === p;

  const getColor = () => {
    if (p === "PINNED") return "#facc15";
    if (p === "HIGH") return "#ef4444";
    return "#3b82f6";
  };

  return (
    <Pressable
      key={p}
      onPress={() => setPriority(p)}
      style={[
        styles.priorityButton,
        isSelected && {
          borderColor: getColor(),
          borderWidth: 2,
        },
      ]}
    >
      <Text
        style={[
          styles.priorityText,
          isSelected && { color: getColor(), fontWeight: "700" },
        ]}
      >
        {p}
      </Text>
    </Pressable>
  );
})}

      <TextInput
        placeholder="Semester (optional)"
        placeholderTextColor="#888"
        style={styles.input}
        keyboardType="numeric"
        value={semester}
        onChangeText={setSemester}
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
  label: {
    color: "#aaa",
    marginBottom: 6,
  },
  // priorityButton: {
  //   padding: 12,
  //   borderRadius: 10,
  //   marginBottom: 10,
  //   backgroundColor: "rgba(255,255,255,0.06)",
  // },
  priorityButton: {
  padding: 12,
  borderRadius: 10,
  marginBottom: 10,
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.1)",
},
  // prioritySelected: {
  //   backgroundColor: "#fff",
  // },
  priorityText: {
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