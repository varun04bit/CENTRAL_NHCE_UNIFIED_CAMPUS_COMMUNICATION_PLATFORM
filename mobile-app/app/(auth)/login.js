import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
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

      if (!res.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("role", data.role);

      if (data.role === "FACULTY" && data.requiresPasswordChange) {
        router.replace("/faculty/change-password");
        return;
      }

      if (data.role === "FACULTY") router.replace("/faculty");
      else router.replace("/student");

    } catch {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg-pattern.jpeg")}
      resizeMode="cover"   // use "repeat" if pattern tile
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>
              Sign in to your Campus Connect account
            </Text>

            {/* EMAIL */}
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#555" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#666"
                style={styles.input}
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#555" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#666"
                style={styles.input}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPass(!showPass)}>
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#555"
                />
              </Pressable>
            </View>

            {/* LOGIN BUTTON */}
            <Pressable
              style={[styles.loginBtn, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.loginText}>LOGIN</Text>
              )}
            </Pressable>

            <Link href="/signup">
              <Text style={styles.footer}>
                New here? <Text style={styles.link}>Sign up</Text>
              </Text>
            </Link>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#000",
    marginBottom: 6,
  },

  subtitle: {
    color: "#333",
    marginBottom: 30,
    fontSize: 15,
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
    fontSize: 15,
  },

  loginBtn: {
    marginTop: 20,
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  loginText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    marginTop: 22,
    textAlign: "center",
    color: "#000",
  },

  link: {
    color: "#006aff",
    fontWeight: "600",
  },
});