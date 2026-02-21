import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL; // your IP

export const uploadFiles = async (files: any[]) => {
  const token = await AsyncStorage.getItem("token");

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/octet-stream",
    } as any);
  });

  const response = await fetch(`${BASE_URL}/api/uploads`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

  // const data = await response.json();
  const text = await response.text();
console.log("UPLOAD RESPONSE:", text);

let data;
try {
  data = JSON.parse(text);
} catch (e) {
  throw new Error("Backend did not return JSON. Check backend terminal.");
}

  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data.files;
};