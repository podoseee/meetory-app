import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppHeader } from "@/components/meetory/app-header";
import { ScreenContainer } from "@/components/screen-container";
import { FOOTPRINT_PLACES } from "@/lib/meetory/mock-data";

const MAP_PINS = [
  { top: "18%", left: "22%", label: "카페" },
  { top: "35%", left: "55%", label: "맛집" },
  { top: "52%", left: "30%", label: "공원" },
  { top: "68%", left: "62%", label: "콘서트홀" },
];

export default function FootprintScreen() {
  return (
    <ScreenContainer className="px-4" edges={["top", "left", "right"]}>
      <AppHeader title="발자취" showSearch />

      <View className="flex-1 rounded-2xl overflow-hidden border border-border mt-2 mb-4 bg-[#E8F4EA] min-h-[280px]">
        <View className="absolute inset-0 opacity-30">
          {[...Array(6)].map((_, i) => (
            <View
              key={i}
              className="absolute bg-white/60"
              style={{
                top: `${15 + i * 14}%`,
                left: 0,
                right: 0,
                height: 2,
                transform: [{ rotate: `${i % 2 === 0 ? 8 : -5}deg` }],
              }}
            />
          ))}
        </View>
        {MAP_PINS.map((pin) => (
          <View
            key={pin.label}
            className="absolute items-center"
            style={{ top: pin.top as `${number}%`, left: pin.left as `${number}%` }}
          >
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center shadow-sm">
              <Ionicons name="location" size={16} color="#fff" />
            </View>
            <Text className="text-[10px] font-medium text-foreground mt-0.5 bg-white/90 px-1 rounded">
              {pin.label}
            </Text>
          </View>
        ))}
      </View>

      <Text className="text-lg font-bold text-foreground mb-3">최근 방문한 장소</Text>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {FOOTPRINT_PLACES.map((place) => (
          <View
            key={place.id}
            className="flex-row items-center gap-3 py-3 border-b border-border"
          >
            <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
              <Ionicons name="storefront-outline" size={20} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">{place.name}</Text>
              <Text className="text-xs text-muted mt-0.5">
                {place.category} · {place.visitedAt}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
