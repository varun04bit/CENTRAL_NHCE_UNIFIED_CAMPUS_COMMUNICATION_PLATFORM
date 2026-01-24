import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import GlassInput from "@/components/GlassInput";
import SlideButton from "@/components/SlideButton";


export default function Login() {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* CONTENT WRAPPER (CENTERED) */}
          <View style={styles.content}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>Hey User! 👋</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {/* FORM */}
            <View style={styles.form}>
              <Text style={styles.label}>EMAIL</Text>
              <GlassInput
                placeholder="name@campus.ac.in"
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
                rightIcon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="rgba(255,255,255,0.55)"
                  />
                }
              />

              <Text style={styles.forgot}>Forgot password?</Text>

              {/* LOGIN BUTTON */}
              <SlideButton onComplete={() => console.log("Login triggered")} />

              {/* FOOTER */}
              <Link href="/signup">
                <Text style={styles.footer}>
                  New here? <Text style={styles.link}>Sign up!</Text>
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


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
    justifyContent: "center", // ✅ vertical centering
    paddingHorizontal: 24,
  },

  header: {
    marginBottom: 34,
  },

  title: {
    fontFamily: "Inter-SemiBoldItalic",
    fontSize: 55,
    fontWeight: "800", // bold like image
    color: "#fff",
    letterSpacing: 0.2,
  },

  subtitle: {
    fontFamily: "Inter-Regular",
    color:"rgba(255,255,255,0.65)",
    fontSize:18,
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

  button: {
    backgroundColor: "#fff",
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },

  buttonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 15,
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
