import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "./primary-button";

interface ScreenFooterProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ScreenFooter({ label, onPress, disabled, loading }: ScreenFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="pt-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      <PrimaryButton label={label} onPress={onPress} disabled={disabled} loading={loading} />
    </View>
  );
}
