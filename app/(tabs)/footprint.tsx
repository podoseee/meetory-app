import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface CheckIn {
  id: string;
  name: string;
  category: string;
  date: string;
  visits: number;
  emoji: string;
}

const POPULAR_PLACES: CheckIn[] = [
  { id: "1", name: "한강공원", category: "러닝", date: "2024년 1월", visits: 87, emoji: "🏃" },
  { id: "2", name: "올림픽공원", category: "러닝", date: "2024년 1월", visits: 76, emoji: "🏃" },
  { id: "3", name: "성수 카페거리", category: "카페", date: "2024년 1월", visits: 92, emoji: "☕" },
  { id: "4", name: "연남동 책방", category: "책", date: "2024년 1월", visits: 65, emoji: "📚" },
  { id: "5", name: "강남역 맛집", category: "음식", date: "2024년 1월", visits: 78, emoji: "🍜" },
  { id: "6", name: "홍대 미술관", category: "미술", date: "2024년 1월", visits: 54, emoji: "🎨" },
  { id: "7", name: "건대 영화관", category: "영화", date: "2024년 1월", visits: 81, emoji: "🎬" },
  { id: "8", name: "여의도 공원", category: "산책", date: "2024년 1월", visits: 69, emoji: "🚶" },
];

const RECENT_VISITS: CheckIn[] = [
  { id: "r1", name: "성수 카페거리", category: "카페", date: "오늘 14:30", visits: 1, emoji: "☕" },
  { id: "r2", name: "한강공원", category: "러닝", date: "어제 06:00", visits: 1, emoji: "🏃" },
  { id: "r3", name: "강남역 맛집", category: "음식", date: "3일 전", visits: 1, emoji: "🍜" },
];

export default function FootprintScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"popular" | "recent">("popular");

  const renderPlaceCard = ({ item }: { item: CheckIn }) => (
    <TouchableOpacity
      className="bg-surface rounded-2xl p-4 mb-3 border border-border"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-2xl">{item.emoji}</Text>
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground">{item.name}</Text>
              <Text className="text-xs text-muted">{item.category}</Text>
            </View>
          </View>
          <Text className="text-xs text-muted">{item.date}</Text>
        </View>
        <View className="items-center gap-1">
          <View className="bg-primary/10 rounded-full px-2 py-1">
            <Text className="text-sm font-semibold text-primary">{item.visits}</Text>
          </View>
          <Text className="text-[10px] text-muted">방문</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer edges={["top", "left", "right"]} className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* 히어로 섹션 */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent rounded-3xl p-6 mb-6 mt-4">
          <View className="items-center gap-3">
            <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center">
              <MaterialCommunityIcons name="map-marker-path" size={32} color={colors.primary} />
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-foreground">당신의 발자취</Text>
              <Text className="text-sm text-muted mt-1">관심사별 인기 장소를 발견하세요</Text>
            </View>
          </View>
        </View>

        {/* 탭 */}
        <View className="flex-row gap-3 mb-6 px-4">
          <TouchableOpacity
            onPress={() => setActiveTab("popular")}
            className={`flex-1 py-3 rounded-lg border ${
              activeTab === "popular"
                ? "bg-primary border-primary"
                : "bg-surface border-border"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "popular" ? "text-white" : "text-foreground"
              }`}
            >
              인기 장소
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("recent")}
            className={`flex-1 py-3 rounded-lg border ${
              activeTab === "recent"
                ? "bg-primary border-primary"
                : "bg-surface border-border"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "recent" ? "text-white" : "text-foreground"
              }`}
            >
              최근 방문
            </Text>
          </TouchableOpacity>
        </View>

        {/* 콘텐츠 */}
        <View className="px-4 pb-8">
          {activeTab === "popular" ? (
            <>
              <Text className="text-lg font-bold text-foreground mb-4">
                관심사별 인기 장소 TOP 8
              </Text>
              <FlatList
                data={POPULAR_PLACES}
                renderItem={renderPlaceCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          ) : (
            <>
              <Text className="text-lg font-bold text-foreground mb-4">
                최근 방문 장소
              </Text>
              <FlatList
                data={RECENT_VISITS}
                renderItem={renderPlaceCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          )}
        </View>

        {/* 팁 섹션 */}
        <View className="mx-4 mb-8 bg-primary/5 rounded-2xl p-4 border border-primary/20">
          <View className="flex-row gap-3">
            <MaterialCommunityIcons name="lightbulb" size={24} color={colors.primary} />
            <View className="flex-1">
              <Text className="font-semibold text-foreground mb-1">팁</Text>
              <Text className="text-xs text-muted">
                장소를 체크인하면 당신의 발자취가 기록되고, 같은 관심사를 가진 사람들과 만날 수 있어요!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
