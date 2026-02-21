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

      {/* BADGES */}
      <View style={styles.badgeRow}>
        <View style={[styles.priority, getPriority(item.priority)]}>
          <Text style={styles.badgeText}>{item.priority}</Text>
        </View>

        <View style={styles.category}>
          <Text style={styles.badgeText}>{item.category}</Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#94A3B8"
          style={{ marginLeft: "auto" }}
        />
      </View>

      {/* IMAGE PREVIEW */}
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
        <Text style={styles.time}>{item.timeAgo}</Text>
      </View>

    </Pressable>
  );
}

/* ---------- PRIORITY COLORS ---------- */
function getPriority(p) {
  if (p === "High") return { backgroundColor: "#5A1B1B" };
  if (p === "Medium") return { backgroundColor: "#5A4A1B" };
  return { backgroundColor: "#1E293B" };
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0B1120",
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

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  priority: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  category: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: { color: "#E2E8F0", fontSize: 12 },

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
  time: { color: "#64748B" },
});