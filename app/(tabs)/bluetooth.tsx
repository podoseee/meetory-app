import { useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { AppHeader } from "@/components/meetory/app-header";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/meetory/auth-context";

export default function BluetoothScreen() {
  const { bluetoothEnabled, setBluetoothEnabled } = useAuth();
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (bluetoothEnabled) {
      pulse.value = withRepeat(withTiming(1.4, { duration: 1500 }), -1, true);
      const t = setTimeout(() => setShowMatchPopup(true), 4000);
      return () => clearTimeout(t);
    }
    setShowMatchPopup(false);
    pulse.value = 1;
  }, [bluetoothEnabled, pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value,
  }));

  return (
    <ScreenContainer className="px-4" edges={["top", "left", "right"]}>
      <AppHeader title="블루투스" />

      <View className="bg-surface rounded-xl p-4 flex-row items-center justify-between mt-4">
        <Text className="font-semibold text-foreground text-lg">블루투스 연결상태</Text>
        <Switch
          value={bluetoothEnabled}
          onValueChange={setBluetoothEnabled}
          trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
          thumbColor={bluetoothEnabled ? "#7C3AED" : "#f4f3f4"}
        />
      </View>

      {bluetoothEnabled ? (
        <View className="flex-1 items-center justify-center">
          <View className="w-56 h-56 items-center justify-center">
            <Animated.View
              style={ringStyle}
              className="absolute w-56 h-56 rounded-full border-2 border-primary/30"
            />
            <Animated.View
              style={ringStyle}
              className="absolute w-40 h-40 rounded-full border-2 border-primary/40"
            />
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
              <Text className="text-3xl">📍</Text>
            </View>
          </View>
          <Text className="text-muted mt-8 text-center">주변 사람을 찾는 중...</Text>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-muted text-center leading-6">
            블루투스를 켜면 주변의 성향이 맞는 사람을 찾아드려요.
          </Text>
        </View>
      )}

      {showMatchPopup && bluetoothEnabled ? (
        <View className="absolute bottom-8 left-4 right-4 bg-white rounded-2xl p-5 shadow-lg border border-border">
          <Text className="text-primary font-bold text-center mb-2">Zing~ 🔔</Text>
          <Text className="text-foreground text-center font-semibold mb-3">
            주변에 성향이 맞는 사람이 있어요!
          </Text>
          <View className="flex-row justify-center gap-3">
            {["🦊", "🐻"].map((e) => (
              <View key={e} className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
                <Text className="text-2xl">{e}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScreenContainer>
  );
}
