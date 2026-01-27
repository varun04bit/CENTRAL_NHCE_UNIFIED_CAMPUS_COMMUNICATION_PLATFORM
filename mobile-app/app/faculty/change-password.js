

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import GlassInput from "@/components/GlassInput";

/* =========================
      CONFIG
========================= */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/* =========================
    CHANGE PASSWORD SCREEN
========================= */

export default function ChangePassword() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
      AUTH GUARD (FACULTY ONLY)
  ========================= */

  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem("role");

      if (role !== "FACULTY") {
        Alert.alert("Access Denied", "Unauthorized access");
        router.replace("/login");
      }
    };

    checkRole();
  }, []);

  /* =========================
      UPDATE PASSWORD HANDLER
  ========================= */

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert(
        "Error",
        "Password must be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Session expired", "Please login again");
        router.replace("/login");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/auth/faculty/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert(
          "Error",
          data.message || "Password update failed"
        );
        return;
      }

      // 🔐 IMPORTANT SECURITY STEP
      // Clear old token & role and force fresh login
      await AsyncStorage.multiRemove(["token", "role"]);

      Alert.alert(
        "Success",
        "Password updated successfully. Please login again.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      console.error("Password update error:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>
          Please update your password to continue
        </Text>

        <Text style={styles.label}>NEW PASSWORD</Text>
        <GlassInput
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Pressable
          style={[
            styles.btn,
            loading && { opacity: 0.6 },
          ]}
          onPress={handleUpdatePassword}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "UPDATING..." : "UPDATE PASSWORD"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* =========================
            STYLES
========================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },

  subtitle: {
    color: "#aaa",
    marginTop: 8,
    marginBottom: 30,
  },

  label: {
    color: "#888",
    fontSize: 12,
    marginBottom: 6,
    marginTop: 18,
  },

  btn: {
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
  },

  btnText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "700",
  },
});
