import React from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ProfileAvatar({ size = 38 }) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Ionicons name="person" size={size * 0.6} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#3b82f6", // blue circle
    justifyContent: "center",
    alignItems: "center",
  },
});
