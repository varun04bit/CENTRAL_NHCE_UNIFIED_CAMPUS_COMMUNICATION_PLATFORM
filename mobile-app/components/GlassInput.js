import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function GlassInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  rightIcon = null,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* BLUR */}
        <BlurView
          intensity={25}
          tint="light"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* GLASS HIGHLIGHT */}
        <View style={styles.glassHighlight} />

        {/* CONTENT */}
        <View style={styles.content}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.55)"
            secureTextEntry={isPassword && !showPassword}
            keyboardType={keyboardType}
            style={styles.input}
          />

          {/* PASSWORD TOGGLE */}
          {isPassword && (
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={10}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="rgba(255,255,255,0.7)"
              />
            </Pressable>
          )}

          {/* OPTIONAL RIGHT ICON (email etc.) */}
          {!isPassword && rightIcon}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
  },

  container: {
    height: 54,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(160,200,255,0.28)",
  },

  glassHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    zIndex: 2,
  },

  content: {
    flex: 1,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    letterSpacing: 0.3,
    marginRight: 10,
  },
});
