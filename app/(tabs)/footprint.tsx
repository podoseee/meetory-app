import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Ionicons as IonType } from "@expo/vector-icons";

import { AppHeader } from "@/components/meetory/app-header";
import { ScreenContainer } from "@/components/screen-container";
import { FOOTPRINT_PLACES } from "@/lib/meetory/mock-data";
import { useColors } from "@/hooks/use-colors";

const MAP_PINS = [
  { top: "18%", left: "22%", label: "카페", color: "#8B5CF6" },
  { top: "35%", left: "55%", label: "맛집", color: "#EC4899" },
  { top: "52%", left: "30%", label: "공원", color: "#10B981" },
  { top: "68%", left: "62%", label: "콘서트홀", color: "#F59E0B" },
];

export default function FootprintScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="px-4" edges={["top", "left", "right"]}>
      <AppHeader title="발자취" showSearch />

      {/* 지도 섹션 */}
      <View className="rounded-2xl overflow-hidden border border-border mt-4 mb-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-[300px] shadow-sm">
        {/* 배경 그리드 */}
        <View className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <View
              key={`h-${i}`}
              className="absolute bg-gray-300"
              style={{
                top: `${20 * (i + 1)}%`,
                left: 0,
                right: 0,
                height: 1,
              }}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <View
              key={`v-${i}`}
              className="absolute bg-gray-300"
              style={{
                top: 0,
                bottom: 0,
                left: `${20 * (i + 1)}%`,
                width: 1,
              }}
            />
          ))}
        </View>

        {/* 핀 마커 */}
        {MAP_PINS.map((pin) => (
          <View
            key={pin.label}
            className="absolute items-center"
            style={{ top: pin.top as `${number}%`, left: pin.left as `${number}%` }}
          >
            {/* 핀 배경 */}
            <View
              className="w-10 h-10 rounded-full items-center justify-center shadow-lg"
              style={{ backgroundColor: pin.color }}
            >
              <Ionicons name="location" size={18} color="#fff" />
            </View>
            {/* 핀 라벨 */}
            <View className="bg-white rounded-lg px-2 py-1 mt-2 shadow-md border border-gray-200">
              <Text className="text-xs font-semibold text-foreground whitespace-nowrap">
                {pin.label}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 최근 방문한 장소 섹션 */}
      <View className="mb-4">
        <Text className="text-lg font-bold text-foreground mb-4">최근 방문한 장소</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mb-4">
        {FOOTPRINT_PLACES.map((place, index) => (
          <View
            key={place.id}
            className="flex-row items-center gap-3 py-4 px-3 rounded-xl mb-2"
            style={{ backgroundColor: colors.surface }}
          >
            {/* 아이콘 */}
            <View
              className="w-12 h-12 rounded-lg items-center justify-center"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <Ionicons
                name={
                  (
                    place.category === "카페"
                      ? "cafe"
                      : place.category === "맛집"
                        ? "restaurant"
                        : place.category === "운동"
                          ? "fitness"
                          : place.category === "문화"
                            ? "image"
                            : place.category === "쇼핑"
                              ? "bag"
                              : "location"
                  ) as any
                }
                size={24}
                color={colors.primary}
              />
            </View>

            {/* 정보 */}
            <View className="flex-1">
              <Text className="font-semibold text-foreground text-base">{place.name}</Text>
              <Text className="text-xs text-muted mt-1">
                {place.category} · {place.visitedAt}
              </Text>
            </View>

            {/* 화살표 */}
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
