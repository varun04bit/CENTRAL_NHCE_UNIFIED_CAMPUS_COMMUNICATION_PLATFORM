import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.29.10:5000";

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