import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenFooter } from "@/components/meetory/screen-footer";
import { ScreenContainer } from "@/components/screen-container";
import { DEFAULT_CHAT_ROOMS } from "@/lib/meetory/mock-data";
import { useAuth } from "@/lib/meetory/auth-context";

export default function ChatroomsReadyScreen() {
  const router = useRouter();
  const { completeChatroomsIntro } = useAuth();

  const handleGoMain = async () => {
    await completeChatroomsIntro();
    router.replace("/(tabs)/footprint");
  };

  return (
    <ScreenContainer className="px-6" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 pt-12 gap-6">
        <Text className="text-2xl font-bold text-foreground leading-8">
          관심사에 맞는{"\n"}채팅방 3개가 생성되었어요!
        </Text>

        <View className="gap-3 mt-4">
          {DEFAULT_CHAT_ROOMS.map((room) => (
            <View key={room.id} className="bg-surface rounded-xl p-4 flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-primary/15 items-center justify-center">
                <Text className="text-xl">💬</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">{room.name}</Text>
                <Text className="text-xs text-muted mt-1">{room.memberCount}명 참여 중</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <ScreenFooter label="메인으로 가기" onPress={handleGoMain} />
    </ScreenContainer>
  );
}
