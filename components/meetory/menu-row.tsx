import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface MenuRowProps {
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}

export function MenuRow({ label, onPress, destructive }: MenuRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-border"
      activeOpacity={0.7}
    >
      <Text className={`text-base ${destructive ? "text-error" : "text-foreground"}`}>{label}</Text>
      {!destructive ? <Ionicons name="chevron-forward" size={18} color="#9CA3AF" /> : <View />}
    </TouchableOpacity>
  );
}
