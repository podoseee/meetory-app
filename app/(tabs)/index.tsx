import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
// import { useRouter } from "expo-router";

export default function HomeScreen() {
  const colors = useColors();
  const [isMatching, setIsMatching] = useState(false);
  const [activeChatRooms, setActiveChatRooms] = useState<any[]>([]);

  useEffect(() => {
    // Load active chat rooms on mount
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    // TODO: Fetch from API
    setActiveChatRooms([]);
  };

  const handleStartMatching = async () => {
    setIsMatching(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // TODO: Call matching API
      // const result = await trpc.matching.start.mutate();
      // Navigate to chat room
      // router.push(`/chat/${result.roomId}`);
    } catch (error) {
      console.error("Matching failed:", error);
    } finally {
      setIsMatching(false);
    }
  };

  const handleChatRoomPress = (roomId: number) => {
    // TODO: Navigate to chat room
  };

  const handleProfilePress = () => {
    // TODO: Navigate to profile
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-foreground">Meetory</Text>
              <Text className="text-sm text-muted mt-1">관심사로 만나는 사람들</Text>
            </View>
            <TouchableOpacity
              onPress={handleProfilePress}
              className="w-12 h-12 rounded-full bg-primary items-center justify-center"
            >
              <Text className="text-lg text-white">👤</Text>
            </TouchableOpacity>
          </View>

          {/* Matching Section */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleStartMatching}
              disabled={isMatching}
              className="bg-primary rounded-2xl p-8 items-center justify-center min-h-[180px]"
              style={{ opacity: isMatching ? 0.7 : 1 }}
            >
              {isMatching ? (
                <View className="gap-3 items-center">
                  <ActivityIndicator size="large" color="white" />
                  <Text className="text-white font-semibold">매칭 중...</Text>
                </View>
              ) : (
                <View className="gap-3 items-center">
                  <Text className="text-5xl">✨</Text>
                  <Text className="text-xl font-bold text-white text-center">매칭 시작</Text>
                  <Text className="text-sm text-white/80 text-center">
                    같은 관심사를 가진 사람들과 만나보세요
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Active Chat Rooms Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">활성 채팅방</Text>

            {activeChatRooms.length === 0 ? (
              <View className="bg-surface rounded-xl p-6 items-center justify-center min-h-[120px]">
                <Text className="text-muted text-center">
                  매칭을 시작하여 새로운 사람들과 만나보세요!
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {activeChatRooms.map((room) => (
                  <TouchableOpacity
                    key={room.id}
                    onPress={() => handleChatRoomPress(room.id)}
                    className="bg-surface rounded-xl p-4 flex-row items-center justify-between active:opacity-70"
                  >
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{room.name}</Text>
                      <Text className="text-sm text-muted mt-1">{room.memberCount}명 참여 중</Text>
                    </View>
                    <Text className="text-lg">→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Quick Tips */}
          <View className="bg-primary/10 rounded-xl p-4 gap-2">
            <Text className="font-semibold text-foreground">💡 팁</Text>
            <Text className="text-sm text-foreground leading-relaxed">
              AI 조언 기능을 사용하여 대화를 시작해보세요. 같은 관심사를 가진 사람들과 자연스러운 대화를 나눌 수 있습니다.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
