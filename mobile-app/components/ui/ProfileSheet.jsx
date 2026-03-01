import React from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import ProfileAvatar from "./ProfileAvatar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileSheet({ visible, onClose, email, onLogout }) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      {/* DARK BACKGROUND */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* SHEET */}
      <View style={styles.sheet}>
        <ProfileAvatar size={85} />

        <Text style={styles.email}>{email}</Text>

        {/* ⭐ GRADIENT LOGOUT BUTTON */}
        <Pressable onPress={onLogout} style={{ width: "80%" }}>
          <LinearGradient
            colors={["#ff4d4d", "#ef4444", "#b91c1c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logout}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Secure Logout</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  sheet: {
    backgroundColor: "#000",
    height: "60%", // ⭐ REDUCED HEIGHT
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 30,
    alignItems: "center",
  },

  email: {
    color: "#aaa",
    marginTop: 16,
    marginBottom: 40,
    fontSize: 16,
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
});
