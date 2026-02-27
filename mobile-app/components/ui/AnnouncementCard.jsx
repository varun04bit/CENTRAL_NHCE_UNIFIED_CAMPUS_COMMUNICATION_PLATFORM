import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Linking,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AnnouncementCard({ item }) {

  const openAttachment = () => {
    if (item.fileUrl || item.image) {
      Linking.openURL(item.fileUrl || item.image);
    }
  };

  return (
    <Pressable style={styles.card} onPress={openAttachment}>

      <View style={styles.badgeRow}>
        <Text style={styles.title}>{item.title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" style={{ marginLeft: "auto" }} />
      </View>

      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
          onError={() => console.log("Image failed:", item.image)}
        />
      )}

      <Text style={styles.desc}>{item.description}</Text>

      <View style={styles.footer}>
        <Text style={styles.date}>📅 {item.date}</Text>
        <Text style={styles.time}>{item.timeAgo}</Text>
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

  image: {
    width: "100%",
    height: 170,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#ddd",
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
  },

  desc: {
    color: "#475569",
    marginBottom: 10,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  date: { color: "#64748B" },
  time: { color: "#64748B" },
});