import { View, Text, StyleSheet, PanResponder, Animated } from "react-native";
import { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SlideButton({ onComplete }) {
  const translateX = useRef(new Animated.Value(0)).current;

  const TRACK_WIDTH = 320;
  const KNOB_SIZE = 48;
  const MAX_TRANSLATE = TRACK_WIDTH - KNOB_SIZE - 8;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        if (gesture.dx >= 0 && gesture.dx <= MAX_TRANSLATE) {
          translateX.setValue(gesture.dx);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > MAX_TRANSLATE * 0.9) {
          Animated.timing(translateX, {
            toValue: MAX_TRANSLATE,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            onComplete && onComplete();
          });
        } else {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.wrapper}>
      <View style={styles.track}>
        {/* Glass highlight */}
        <View style={styles.highlight} />

        <Text style={styles.text}>Slide to Login</Text>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.knob,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <Ionicons name="arrow-forward" size={22} color="#000" />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 36,
  },

  /* GLASS TRACK */
  track: {
    width: 320,
    height: 56,
    borderRadius: 28,

    backgroundColor: "rgba(255,255,255,0.22)", // ~60% frosted
    borderWidth: 1,
    borderColor: "rgba(160,200,255,0.28)",

    justifyContent: "center",
    overflow: "hidden",
  },

  /* TOP LIGHT REFLECTION */
  highlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  text: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 0.4,
  },

  /* SLIDER KNOB */
  knob: {
    position: "absolute",
    left: 4,
    width: 48,
    height: 48,
    borderRadius: 24,

    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#9fc9ff",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});
