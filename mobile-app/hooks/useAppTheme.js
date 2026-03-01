import { Colors } from "../constants/theme";

export default function useAppTheme() {
  // ⭐ Force light theme everywhere
  const theme = Colors.light;

  return { theme, scheme: "light" };
}