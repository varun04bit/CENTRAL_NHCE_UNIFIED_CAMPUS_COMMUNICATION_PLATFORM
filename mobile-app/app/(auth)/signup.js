import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import SlideToSignupButton from "../../components/SlideToSignupButton";
import GlassInput from "@/components/GlassInput";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const COURSES = ["B.E"];

const DEPARTMENTS = [
  "DEPARTMENT OF APPLIED SCIENCES",
  "COMPUTER SCIENCE & ENGINEERING",
  "COMPUTER SCIENCE & ENGINEERING (DATA SCIENCE)",
  "INFORMATION SCIENCE & ENGINEERING",
  "CIVIL ENGINEERING",
  "MECHANICAL ENGINEERING",
  "ELECTRICAL & ELECTRONICS ENGINEERING",
  "ELECTRONICS & COMMUNICATION ENGINEERING",
  "ARTIFICIAL INTELLIGENCE & MACHINE LEARNING",
];

export default function Signup() {
  const router = useRouter();

  const [course, setCourse] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");

  const [courseModal, setCourseModal] = useState(false);
  const [deptModal, setDeptModal] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!!!!</Text>
      <Text style={styles.subtitle}>Create an account to be a part of the fam..</Text>

      <Text style={styles.label}>FULL NAME</Text>
      <GlassInput placeholder="Enter your full name" />

      <Text style={styles.label}>EMAIL</Text>
      <GlassInput placeholder="Enter your email" />

      <Text style={styles.label}>PASSWORD</Text>
      <GlassInput placeholder="Create a password" secureTextEntry />

      {/* COURSE */}
      <Text style={styles.label}>COURSE</Text>
      <Pressable style={styles.glassRow} onPress={() => setCourseModal(true)}>
        <BlurView intensity={25} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.glassHighlight} />
        <Text style={[styles.valueText, !course && styles.placeholder]}>
          {course || "Select course"}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#ddd" />
      </Pressable>

      {/* DEPARTMENT */}
      <Text style={styles.label}>DEPARTMENT</Text>
      <Pressable style={styles.glassRow} onPress={() => setDeptModal(true)}>
        <BlurView intensity={25} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.glassHighlight} />
        <Text style={[styles.valueText, !department && styles.placeholder]}>
          {department || "Select department"}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#ddd" />
      </Pressable>

      {/* SEMESTER */}
      <Text style={styles.label}>SEMESTER</Text>
      <GlassInput placeholder="Enter semester" />

      <SlideToSignupButton onComplete={() => console.log("Signup triggered")} />

      <Text style={styles.footer}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => router.push("/login")}>
          Login
        </Text>
      </Text>

      {/* COURSE MODAL */}
      <GlassModal
        visible={courseModal}
        data={COURSES}
        onClose={() => setCourseModal(false)}
        onSelect={(item) => {
          setCourse(item);
          setCourseModal(false);
        }}
      />

      {/* DEPARTMENT MODAL */}
      <GlassModal
        visible={deptModal}
        data={DEPARTMENTS}
        onClose={() => setDeptModal(false)}
        onSelect={(item) => {
          setDepartment(item);
          setDeptModal(false);
        }}
      />
    </View>
  );
}

/* GLASS MODAL COMPONENT */
function GlassModal({ visible, data, onClose, onSelect }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* FULL SCREEN BLUR */}
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />

      {/* DARK OVERLAY + CENTERED DROPDOWN */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={() => {}}>
          {/* DROPDOWN CONTENT (NO BLUR HERE) */}
          <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.option}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f14",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontFamily:"Inter-SemiBoldItalic",
    fontSize: 50,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    color: "#aaa",
    marginBottom: 30,
  },
  label: {
    color: "#888",
    fontSize: 12,
    marginTop: 16,
    marginBottom: 6,
  },

  /* GLASS DROPDOWN ROW */
  glassRow: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(160,200,255,0.28)",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  glassHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  valueText: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
  },

  placeholder: {
    color: "rgba(255,255,255,0.55)",
  },

  footer: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 28,
  },

  link: {
    color: "#fff",
    fontWeight: "600",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    padding: 24,
  },

  modal: {
    backgroundColor: "#413e3e", // SOLID background → stays sharp
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(160,200,255,0.28)",
    maxHeight: "65%",
  },

  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },

  optionText: {
    color: "#fff",
    fontSize: 14,
  },
});
