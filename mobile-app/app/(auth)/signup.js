import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import GlassInput from "@/components/GlassInput";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";

/* =========================
   BACKEND-CONNECTED DATA
========================= */

// 🔴 USE REAL IDs FROM YOUR DB
const PROGRAMS = [
  {
    id: "c1f35fc3-0623-4378-8722-7a204723e87a",
    name: "BE",
  },
];

const DEPARTMENTS_BY_PROGRAM = {
  BE: [
    { id: "95aedf79-bbfb-44e1-b400-3a98bda48d4f", name: "MECH" },
    { id: "b7b5cd1f-e2bd-40fc-8261-669facdb942c", name: "EEE" },
    { id: "25f86767-daab-45af-bc7c-56c9c5a8d85c", name: "ECE" },
    { id: "2b15d2ff-92bb-4a9d-ab13-28167d86dcb6", name: "CSE" },
    { id: "9cfaac68-7533-40cd-9084-74034b44576f", name: "AIML" },
    { id: "e6146188-5ca5-4568-8281-ab20d5690392", name: "DS" },
    { id: "252c1811-023a-403b-8322-760a82eada32", name: "ISE" },
  ],
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/* =========================
        SIGNUP SCREEN
========================= */

export default function Signup() {
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [semester, setSemester] = useState("");

  const [program, setProgram] = useState(null);
  const [department, setDepartment] = useState(null);

  const [programModal, setProgramModal] = useState(false);
  const [deptModal, setDeptModal] = useState(false);

  const departments =
    program ? DEPARTMENTS_BY_PROGRAM[program.name] : [];

  /* =========================
         SIGNUP HANDLER
  ========================= */

  const handleSignup = async () => {


    if (
      !email ||
      !password ||
      !program ||
      !department ||
      semester === ""
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const sem = Number(semester);

    if (isNaN(sem) || sem < 1 || sem > 8) {
      Alert.alert("Error", "Semester must be between 1 and 8");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/student/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            programId: program.id,
            departmentId: department.id,
            semester: sem,
          }),
        }
      );

      // const data = await res.json();

      const text = await res.text();
console.log("RAW RESPONSE:", text);

if (!res.ok) {
  Alert.alert("Signup Failed", text);
  return;
}

Alert.alert("Success", "Account created successfully");
router.replace("/login");


      if (!res.ok) {
        Alert.alert("Signup Failed", data.message);
        return;
      }

      Alert.alert("Success", "Account created successfully");
      router.replace("/login");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        Create an account to continue
      </Text>

      <Text style={styles.label}>EMAIL</Text>
      <GlassInput
        value={email}
        onChangeText={setEmail}
        placeholder="name@campus.ac.in"
      />

      <Text style={styles.label}>PASSWORD</Text>
      <GlassInput
  placeholder="Create password"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
/>

      <Text style={styles.label}>PROGRAM</Text>
      <Dropdown
        value={program?.name}
        placeholder="Select program"
        onPress={() => setProgramModal(true)}
      />

      <Text style={styles.label}>DEPARTMENT</Text>
      <Dropdown
        value={department?.name}
        placeholder="Select department"
        onPress={() => setDeptModal(true)}
        disabled={!program}
      />

      <Text style={styles.label}>SEMESTER</Text>
      <GlassInput
        keyboardType="numeric"
        value={semester}
        onChangeText={setSemester}
        placeholder="1 - 8"
      />

      {/* ✅ REPLACED SLIDE BUTTON */}
      <Pressable style={styles.signupBtn} onPress={handleSignup}>
        <Text style={styles.signupText}>SIGN UP</Text>
      </Pressable>

      {/* PROGRAM MODAL */}
      <GlassModal
        visible={programModal}
        data={PROGRAMS}
        onClose={() => setProgramModal(false)}
        onSelect={(item) => {
          setProgram(item);
          setDepartment(null);
          setProgramModal(false);
        }}
      />

      {/* DEPARTMENT MODAL */}
      <GlassModal
        visible={deptModal}
        data={departments}
        onClose={() => setDeptModal(false)}
        onSelect={(item) => {
          setDepartment(item);
          setDeptModal(false);
        }}
      />
    </View>
  );
}

/* =========================
        REUSABLE UI
========================= */

function Dropdown({ value, placeholder, onPress, disabled }) {
  return (
    <Pressable
      style={[
        styles.glassRow,
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <BlurView
        intensity={25}
        tint="light"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Text style={styles.valueText}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={18} color="#ddd" />
    </Pressable>
  );
}

function GlassModal({ visible, data, onClose, onSelect }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <BlurView
        intensity={100}
        tint="dark"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.option}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.optionText}>
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* =========================
            STYLES
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f14",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 24,
  },
  label: {
    color: "#888",
    fontSize: 12,
    marginTop: 16,
    marginBottom: 6,
  },
  glassRow: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(160,200,255,0.28)",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  valueText: {
    color: "#fff",
    fontSize: 15,
  },
  signupBtn: {
    marginTop: 32,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
  },
  signupText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: "#413e3e",
    borderRadius: 18,
    maxHeight: "65%",
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  optionText: {
    color: "#fff",
  },
});
