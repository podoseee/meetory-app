import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppHeader } from "@/components/meetory/app-header";
import { PrimaryButton } from "@/components/meetory/primary-button";
import { ScreenContainer } from "@/components/screen-container";
import { MATCH_PROFILES } from "@/lib/meetory/mock-data";
import { useAuth } from "@/lib/meetory/auth-context";

export default function MatchingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuth();
  const match = MATCH_PROFILES.find((p) => p.id === id);

  if (!match) return null;

  const common = match.interests.filter((i) => profile?.interests.includes(i));

  return (
    <ScreenContainer className="px-4" edges={["top", "left", "right", "bottom"]}>
      <AppHeader title="매칭 상세" onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-full bg-primary/15 items-center justify-center mb-4">
            <Text className="text-5xl">{match.avatarEmoji}</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground">{match.nickname}</Text>
          <View className="bg-primary rounded-full px-4 py-1.5 mt-3">
            <Text className="text-white font-bold">{match.matchPercent}% 매칭</Text>
          </View>
        </View>

        <Text className="text-sm text-muted mb-2">공통 관심사</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {(common.length ? common : match.interests).map((tag) => (
            <View key={tag} className="bg-primary/10 rounded-full px-3 py-1.5">
              <Text className="text-primary font-medium">{tag}</Text>
            </View>
          ))}
        </View>

        <Text className="text-foreground leading-6">{match.status}</Text>
      </ScrollView>

      <View className="py-4">
        <PrimaryButton
          label="채팅 요청하기"
          onPress={() => {
            // 채팅방 생성 후 채팅 화면으로 이동
            router.push("/chat/1");
          }}
        />
      </View>
    </ScreenContainer>
  );
}
