import { Text, TouchableOpacity } from "react-native";

interface TagChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export function TagChip({ label, selected, onPress, disabled }: TagChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      className={`px-4 py-2.5 rounded-full border ${
        selected ? "bg-white border-primary" : "bg-primary border-primary"
      } ${disabled && !selected ? "opacity-40" : ""}`}
      activeOpacity={0.8}
    >
      <Text className={`font-medium ${selected ? "text-primary" : "text-white"}`}>{label}</Text>
    </TouchableOpacity>
  );
}
