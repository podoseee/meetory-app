import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { AppHeader } from "@/components/meetory/app-header";
import { ScreenContainer } from "@/components/screen-container";
import { MATCH_PROFILES } from "@/lib/meetory/mock-data";

export default function MatchingScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="px-4" edges={["top", "left", "right"]}>
      <AppHeader title="오늘의 성향 매칭" showSearch />

      <ScrollView showsVerticalScrollIndicator={false} className="mt-2">
        {MATCH_PROFILES.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            className="bg-surface rounded-2xl p-4 mb-3 flex-row gap-4"
            activeOpacity={0.85}
            onPress={() => router.push(`/matching/${profile.id}` as never)}
          >
            <View className="w-16 h-16 rounded-full bg-primary/15 items-center justify-center">
              <Text className="text-3xl">{profile.avatarEmoji}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-foreground text-lg">{profile.nickname}</Text>
                <View className="bg-primary rounded-full px-2.5 py-1">
                  <Text className="text-white text-xs font-bold">{profile.matchPercent}%</Text>
                </View>
              </View>
              <Text className="text-sm text-muted mt-1 leading-5" numberOfLines={2}>
                {profile.status}
              </Text>
              <View className="flex-row flex-wrap gap-1.5 mt-2">
                {profile.interests.map((tag) => (
                  <View key={tag} className="bg-white rounded-full px-2 py-0.5 border border-border">
                    <Text className="text-xs text-primary font-medium">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
