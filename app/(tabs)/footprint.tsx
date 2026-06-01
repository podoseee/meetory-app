import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function FootprintScreen() {
  const colors = useColors();

  const [selectedInterest, setSelectedInterest] = useState("러닝");
  const [userInterests] = useState(["러닝", "카페", "영화", "게임"]);

  const [popularPlaces] = useState({
    러닝: [
      { place: "한강", count: 45 },
      { place: "올림픽공원", count: 32 },
      { place: "강남역", count: 28 },
    ],
    카페: [
      { place: "성수", count: 52 },
      { place: "연남", count: 38 },
      { place: "강남", count: 35 },
    ],
    영화: [
      { place: "강남 CGV", count: 42 },
      { place: "코엑스", count: 38 },
      { place: "홍대 메가박스", count: 25 },
    ],
    게임: [
      { place: "강남 PC방", count: 30 },
      { place: "홍대 게임센터", count: 22 },
      { place: "건대 PC방", count: 18 },
    ],
  });

  const [myCheckIns] = useState([
    { id: 1, place: "한강", interest: "러닝", date: "오늘" },
    { id: 2, place: "성수 카페", interest: "카페", date: "어제" },
    { id: 3, place: "강남 CGV", interest: "영화", date: "2일 전" },
  ]);

  const handleCheckIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to check-in screen
  };

  const handleInterestSelect = async (interest: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedInterest(interest);
  };

  const currentPlaces = popularPlaces[selectedInterest as keyof typeof popularPlaces] || [];

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">발자취</Text>
            <Text className="text-sm text-muted mt-1">관심사별 인기 장소와 내 기록</Text>
          </View>

          {/* Check-in Button */}
          <TouchableOpacity
            onPress={handleCheckIn}
            className="bg-primary rounded-xl p-4 flex-row items-center justify-between"
          >
            <View>
              <Text className="font-semibold text-white">오늘 어디 갔어?</Text>
              <Text className="text-xs text-white/80 mt-1">장소를 체크인해보세요</Text>
            </View>
            <Text className="text-2xl">📍</Text>
          </TouchableOpacity>

          {/* Popular Places Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">인기 장소</Text>

            {/* Interest Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {userInterests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  onPress={() => handleInterestSelect(interest)}
                  className={`px-4 py-2 rounded-full ${
                    selectedInterest === interest
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selectedInterest === interest ? "text-white" : "text-foreground"
                    }`}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Places List */}
            <View className="gap-2">
              {currentPlaces.map((place, idx) => (
                <View key={idx} className="bg-surface rounded-xl p-4 flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-lg font-bold text-primary">#{idx + 1}</Text>
                      <Text className="font-semibold text-foreground">{place.place}</Text>
                    </View>
                    <Text className="text-xs text-muted mt-1">{place.count}명이 방문함</Text>
                  </View>
                  <TouchableOpacity className="bg-primary/10 rounded-lg px-3 py-2">
                    <Text className="text-xs font-semibold text-primary">체크인</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* My Check-ins Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">내 기록</Text>

            {myCheckIns.length === 0 ? (
              <View className="bg-surface rounded-xl p-6 items-center justify-center min-h-[120px]">
                <Text className="text-muted text-center">체크인 기록이 없습니다.</Text>
              </View>
            ) : (
              <View className="gap-2">
                {myCheckIns.map((checkIn) => (
                  <View key={checkIn.id} className="bg-surface rounded-xl p-4 flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
                      <Text className="text-lg">📍</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{checkIn.place}</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <View className="bg-primary/10 rounded px-2 py-1">
                          <Text className="text-xs font-semibold text-primary">{checkIn.interest}</Text>
                        </View>
                        <Text className="text-xs text-muted">{checkIn.date}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Spacer */}
          <View className="h-4" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
