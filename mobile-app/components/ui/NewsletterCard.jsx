import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function NewsletterCard({ item }) {

  const openNewsletter = () => {
    if (item.fileUrl) {
      Linking.openURL(item.fileUrl);
    }
  };

  return (
    <Pressable style={styles.card} onPress={openNewsletter}>

      {/* TITLE */}
      <Text style={styles.title}>{item.title}</Text>

      {/* DESCRIPTION */}
      <Text style={styles.desc}>{item.description}</Text>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.date}>📅 {item.date}</Text>

        <Ionicons
          name="download-outline"
          size={22}
          color="#64748B"
        />
      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  desc: {
    color: "#475569",
    marginBottom: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  date: {
    color: "#64748B",
  },
});