import { Alert, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { AppHeader } from "@/components/meetory/app-header";
import { MenuRow } from "@/components/meetory/menu-row";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/meetory/auth-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (!profile) return null;

  return (
    <ScreenContainer className="px-4" edges={["top", "left", "right"]}>
      <AppHeader title="프로필" />

      <View className="flex-row items-center gap-4 py-6 border-b border-border">
        <View className="w-20 h-20 rounded-full bg-primary/15 items-center justify-center">
          <Text className="text-4xl">{profile.avatarEmoji}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-foreground">{profile.nickname}</Text>
          <Text className="text-sm text-muted mt-2">{profile.interests.join(", ")}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="mt-2">
        <MenuRow label="내 정보 수정" />
        <MenuRow label="알림 설정" />
        <MenuRow label="차단한 사용자" />
        <MenuRow label="이용 가이드" />
        <MenuRow label="로그 아웃" onPress={handleLogout} destructive />
      </ScrollView>
    </ScreenContainer>
  );
}
