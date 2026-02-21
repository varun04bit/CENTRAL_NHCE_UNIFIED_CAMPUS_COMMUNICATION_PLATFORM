import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NewsletterCard from "../../components/ui/NewsletterCard";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  const newsletters = [
    {
      id: "1",
      title: "Campus Monthly Newsletter",
      description: "All events, placements & news for October.",
      date: "Nov 1, 2024",
      image: "https://picsum.photos/400/300",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: "2",
      title: "Tech Club Special Edition",
      description: "Highlights of Hackathon + AI Workshop.",
      date: "Nov 5, 2024",
      image: "https://picsum.photos/400/301",
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: insets.top + 10 }   // ✅ FIX
      ]}
    >
      <Text style={styles.title}>Newsletters</Text>

      <FlatList
        data={newsletters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewsletterCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,  // for tab bar
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 16,
  },

  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
});