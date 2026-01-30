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
// const PROGRAMS = [
//   {
//     id: "c1f35fc3-0623-4378-8722-7a204723e87a",
//     name: "BE",
//   },
// ];

export const PROGRAMS = [
  { id: "c1f35fc3-0623-4378-8722-7a204723e87a", name: "BE" },
  { id: "17389129-b533-4609-8cbf-28310fc95c11", name: "BBA" },
  { id: "5f24adb9-321e-411c-b100-611189d1183a", name: "BCOM" },
  { id: "270f39cb-e957-423d-9a35-4e0c5007b970", name: "MTECH" },
  { id: "ff12f7cc-5bc5-40e0-af9c-685f8c38207c", name: "MBA" },
  { id: "21d5a144-ff13-4cfb-98dc-348c98b39193", name: "MCOM" },
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
  BBA: [
    { id: "eea64e5b-7a25-4361-8820-090d7f1ed727", name: "General Management" },
    { id: "d726baa6-e45a-4219-a5e4-2fe2cc2ef14b", name: "Finance" },
    { id: "63c8ec13-9543-4334-8327-4e000fe93a7f", name: "Marketing" },
    { id: "d9b629d4-1404-4ea3-8902-552eda95fa2e", name: "HR" },
  ],
  BCOM: [
    { id: "5ad7736c-5401-4e1e-a249-ee63be2f5e55", name: "General" },
    { id: "a342b778-9668-4cff-b3ca-16a74ded8631", name: "Accounting" },
    { id: "e6dca7ab-ca53-42c9-9927-72e2fc837a13", name: "Finance" },
  ],
  MTECH: [
    { id: "ddb295ed-d2ba-4fa4-bd51-8eb6b5086dbb", name: "Computer Science" },
    { id: "17f696f2-fde2-49b8-87ec-f70ae924ecf6", name: "VLSI Design" },
    { id: "a6e55e0a-a7bd-4f63-87af-58dd98d947f8", name: "Power Systems" },
    { id: "9bea1a2a-b3d2-48ae-9321-45a752e5c465", name: "Structural Engineering" },
  ],
  MBA: [
    { id: "00d8e297-8132-4755-a40e-2d7e0ccea0fc", name: "Finance" },
    { id: "191f4443-a341-4133-a096-e252920042ae", name: "HR" },
    { id: "3c1c1535-2363-43c1-966d-ac5db2b0bc00", name: "Marketing" },
    { id: "b6674668-1a8f-4017-8730-2f1528b5685f", name: "Operations" },
  ],
  MCOM: [
    { id: "22a8eec4-199f-472b-8693-f6340b814368", name: "General" },
    { id: "84fa3f65-5a72-4eec-ad07-9a380ba70607", name: "Finance" },
    { id: "5bde68c9-054a-4ee1-8c4f-e0b8da1dd39c", name: "Accounting" },
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
