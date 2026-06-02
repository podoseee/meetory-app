import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "kakao" | "outline" | "google";
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
}: PrimaryButtonProps) {
  const base = "rounded-xl py-4 items-center justify-center min-h-[52px]";
  const styles = {
    primary: "bg-primary",
    kakao: "bg-[#FEE500]",
    google: "bg-white border border-border",
    outline: "bg-surface border border-border",
  };
  const textStyles = {
    primary: "text-white",
    kakao: "text-[#3C1E1E]",
    google: "text-foreground",
    outline: "text-foreground",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${styles[variant]} ${disabled ? "opacity-50" : ""}`}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#7C3AED"} />
      ) : (
        <Text className={`font-semibold text-base ${textStyles[variant]}`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
