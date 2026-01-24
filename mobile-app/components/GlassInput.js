import { View, TextInput, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export default function GlassInput({
  placeholder,
  secureTextEntry = false,
  rightIcon = null,
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* BLUR LAYER */}
        <BlurView intensity={25} tint="light" style={StyleSheet.absoluteFill} />

        {/* TOP GLASS HIGHLIGHT */}
        <View style={styles.glassHighlight} />

        {/* CONTENT */}
        <View style={styles.content}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.55)"
            secureTextEntry={secureTextEntry}
            style={styles.input}
          />
          {rightIcon}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
  },

  /* OUTER GLASS */
  container: {
    height: 54,
    borderRadius: 18,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "rgba(160,200,255,0.28)",
  },

  /* TOP LIGHT REFLECTION */
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
    justifyContent: "space-between",

    backgroundColor: "rgba(255,255,255,0.15)",
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
