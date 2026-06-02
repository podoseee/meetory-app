import { useEffect, useState } from "react";
import { Switch, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { AppHeader } from "@/components/meetory/app-header";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/meetory/auth-context";
import { useBluetoothContext, PREDEFINED_LOCATIONS } from "@/lib/meetory/bluetooth-context";
import { useColors } from "@/hooks/use-colors";

export default function BluetoothScreen() {
  const { bluetoothEnabled, setBluetoothEnabled } = useAuth();
  const colors = useColors();
  const { simulateLocationDetection } = useBluetoothContext();
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const pulse = useSharedValue(1);

  const handleSimulateLocation = (index: number) => {
    simulateLocationDetection(PREDEFINED_LOCATIONS[index]);
  };

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
        <>
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

          {/* 테스트용 위치 감지 버튼 */}
          <View className="mb-4">
            <Text className="text-xs font-semibold text-muted mb-2">테스트: 위치 감지</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {PREDEFINED_LOCATIONS.map((location, index) => (
                <TouchableOpacity
                  key={location.id}
                  onPress={() => handleSimulateLocation(index)}
                  className="bg-surface rounded-lg p-3 min-w-[100px] items-center gap-1"
                >
                  <Ionicons
                    name={
                      location.category === "콘서트"
                        ? "musical-notes"
                        : location.category === "서점"
                          ? "book"
                          : location.category === "도서관"
                            ? "library"
                            : location.category === "카페"
                              ? "cafe"
                              : "location"
                    }
                    size={18}
                    color={colors.primary}
                  />
                  <Text className="text-[10px] text-foreground text-center">{location.category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
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
