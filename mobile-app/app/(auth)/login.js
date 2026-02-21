

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import GlassInput from "@/components/GlassInput";

/* =========================
      CONFIG
========================= */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/* =========================
        LOGIN SCREEN
========================= */

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
        LOGIN HANDLER
  ========================= */

  const handleLogin = async () => {
      console.log("📱 LOGIN ATTEMPT");
  console.log("📱 EMAIL:", email);
  console.log("📱 PASSWORD:", password);
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("📱 LOGIN RESPONSE STATUS:", res.status);
console.log("📱 LOGIN RESPONSE DATA:", data);

      // ❌ Handle error first
      if (!res.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return;
      }

      // ✅ Store token & role exactly from backend
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("role", data.role);

      console.log("📱 STORED ROLE:", data.role);
console.log(
  "📱 REQUIRES PASSWORD CHANGE:",
  data.requiresPasswordChange
);

      // 🔐 Faculty first login → force password change
      if (data.role === "FACULTY" && data.requiresPasswordChange) {
        router.replace("/faculty/change-password");
        return;
      }

      // ✅ Normal login (student or faculty)
      router.replace("/");

    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>Hey User! 👋</Text>
              <Text style={styles.subtitle}>
                Sign in to continue
              </Text>
            </View>

            {/* FORM */}
            <View style={styles.form}>
              <Text style={styles.label}>EMAIL</Text>
              <GlassInput
                placeholder="name@campus.ac.in"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                rightIcon={
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color="rgba(255,255,255,0.55)"
                  />
                }
              />

              <Text style={styles.label}>PASSWORD</Text>
              <GlassInput
  placeholder="Enter your password"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
/>


              <Text style={styles.forgot}>
                Forgot password?
              </Text>

              {/* LOGIN BUTTON */}
              <Pressable
                style={[
                  styles.loginBtn,
                  loading && { opacity: 0.6 },
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginText}>
                  {loading ? "LOGGING IN..." : "LOGIN"}
                </Text>
              </Pressable>

              {/* FOOTER */}
              <Link href="/signup">
                <Text style={styles.footer}>
                  New here?{" "}
                  <Text style={styles.link}>Sign up!</Text>
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: "#000",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  header: {
    marginBottom: 34,
  },

  title: {
    fontFamily: "Inter-SemiBoldItalic",
    fontSize: 55,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.65)",
    fontSize: 18,
    marginTop: 6,
  },

  form: {
    marginTop: 8,
  },

  label: {
    color: "#888",
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 18,
  },

  forgot: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "right",
    marginTop: 10,
  },

  loginBtn: {
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
  },

  loginText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
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
});
