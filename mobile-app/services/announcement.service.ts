import AsyncStorage from "@react-native-async-storage/async-storage";
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL



export const createAnnouncement = async (payload: any) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/announcements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Creation failed");
  }

  return data;
};