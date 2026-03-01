import { Image } from "react-native";

export default function AppLogo({ size = 120 }) {
  return (
    <Image
      source={require("../../assets/images/logo.png")}
      style={{
        width: size,
        height: size,
        resizeMode: "contain",
      }}
    />
  );
}