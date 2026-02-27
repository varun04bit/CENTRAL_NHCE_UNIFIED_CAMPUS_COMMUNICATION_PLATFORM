import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  Alert,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [semester, setSemester] = useState("");

  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [program, setProgram] = useState(null);
  const [department, setDepartment] = useState(null);

  const [programModal, setProgramModal] = useState(false);
  const [deptModal, setDeptModal] = useState(false);

  /* ---------- FETCH PROGRAMS ---------- */
  useEffect(() => {
    fetch(`${API_BASE_URL}/meta/programs`)
      .then(res => res.json())
      .then(setPrograms)
      .catch(() => Alert.alert("Error", "Failed to load programs"));
  }, []);

  /* ---------- FETCH DEPARTMENTS ---------- */
  useEffect(() => {
    if (!program) return;

    fetch(`${API_BASE_URL}/meta/departments/${program.id}`)
      .then(res => res.json())
      .then(setDepartments)
      .catch(() => Alert.alert("Error", "Failed to load departments"));
  }, [program]);

  /* ---------- SIGNUP ---------- */
  const handleSignup = async () => {
    if (!email || !password || !program || !department || !semester) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/student/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          programId: program.id,
          departmentId: department.id,
          semester: Number(semester),
        }),
      });

      if (!res.ok) {
        Alert.alert("Signup Failed");
        return;
      }

      Alert.alert("Success", "Account created!");
      router.replace("/login");
    } catch {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg-pattern.jpeg")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Create Account ✨</Text>
            <Text style={styles.subtitle}>
              Join Campus Connect today
            </Text>

            {/* EMAIL */}
            <Input icon="mail-outline" value={email} onChange={setEmail} placeholder="Email" />

            {/* PASSWORD */}
            <Input icon="lock-closed-outline" value={password} onChange={setPassword} placeholder="Password" secure />

            {/* PROGRAM */}
            <Dropdown
              value={program?.name}
              placeholder="Select Program"
              onPress={() => setProgramModal(true)}
            />

            {/* DEPARTMENT */}
            <Dropdown
              value={department?.name}
              placeholder="Select Department"
              onPress={() => setDeptModal(true)}
              disabled={!program}
            />

            {/* SEMESTER */}
            <Input icon="school-outline" value={semester} onChange={setSemester} placeholder="Semester 1-8" />

            {/* BUTTON */}
            <Pressable style={styles.signupBtn} onPress={handleSignup}>
              <Text style={styles.signupText}>SIGN UP</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* PROGRAM MODAL */}
      <SelectModal
        visible={programModal}
        data={programs}
        onClose={() => setProgramModal(false)}
        onSelect={(item) => {
          setProgram(item);
          setDepartment(null);
          setProgramModal(false);
        }}
      />

      {/* DEPT MODAL */}
      <SelectModal
        visible={deptModal}
        data={departments}
        onClose={() => setDeptModal(false)}
        onSelect={(item) => {
          setDepartment(item);
          setDeptModal(false);
        }}
      />
    </ImageBackground>
  );
}

/* ---------- INPUT ---------- */
function Input({ icon, value, onChange, placeholder, secure }) {
  return (
    <View style={styles.inputBox}>
      <Ionicons name={icon} size={20} color="#666" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={secure}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

/* ---------- DROPDOWN ---------- */
function Dropdown({ value, placeholder, onPress, disabled }) {
  return (
    <Pressable
      style={[styles.inputBox, disabled && { opacity: 0.4 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={{ flex: 1, color: value ? "#000" : "#888" }}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={20} color="#666" />
    </Pressable>
  );
}

/* ---------- MODAL ---------- */
function SelectModal({ visible, data, onClose, onSelect }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modal}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={styles.option}
                onPress={() => onSelect(item)}
              >
                <Text style={{ color: "#000" }}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1 },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#000",
  },

  subtitle: {
    color: "#333",
    marginBottom: 25,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffcc",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 14,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: "#000",
  },

  signupBtn: {
    marginTop: 20,
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  signupText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 24,
  },

  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    maxHeight: "65%",
  },

  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});