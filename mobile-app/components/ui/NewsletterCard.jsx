import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Linking,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function NewsletterCard({ item }) {

  const openFile = () => {
    if (item.fileUrl || item.image) {
      Linking.openURL(item.fileUrl || item.image);
    }
  };

  return (
    <Pressable style={styles.card} onPress={openFile}>

      {/* IMAGE */}
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}

      {/* TITLE */}
      <Text style={styles.title}>{item.title}</Text>

      {/* DESCRIPTION */}
      <Text style={styles.desc}>{item.description}</Text>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.date}>📅 {item.date}</Text>

        <Ionicons
          name="download-outline"
          size={20}
          color="#94A3B8"
        />
      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 170,
    borderRadius: 14,
    marginBottom: 10,
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },

  desc: {
    color: "#94A3B8",
    marginBottom: 10,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  date: { color: "#64748B" },
});