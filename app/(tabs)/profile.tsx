import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const colors = useColors();
  const [userProfile, setUserProfile] = useState({
    nickname: "러닝러버",
    interests: ["러닝", "카페"],
    location: "강남",
    checkInCount: 12,
    lastActive: "오늘",
  });

  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);

  const handleLogout = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Logout logic
  };

  const handleEditProfile = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to edit profile
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">프로필</Text>
          </View>

          {/* Profile Card */}
          <View className="bg-surface rounded-2xl p-6 gap-4">
            <View className="flex-row items-center gap-4">
              <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
                <Text className="text-3xl">👤</Text>
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-foreground">{userProfile.nickname}</Text>
                <Text className="text-sm text-muted mt-1">마지막 활동: {userProfile.lastActive}</Text>
              </View>
            </View>

            {/* Profile Info */}
            <View className="gap-3 border-t border-border pt-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">관심사</Text>
                <View className="flex-row gap-2">
                  {userProfile.interests.map((interest, idx) => (
                    <View key={idx} className="bg-primary/10 rounded-full px-3 py-1">
                      <Text className="text-xs font-semibold text-primary">{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">지역</Text>
                <Text className="font-semibold text-foreground">{userProfile.location}</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">체크인</Text>
                <Text className="font-semibold text-foreground">{userProfile.checkInCount}곳</Text>
              </View>
            </View>

            {/* Edit Button */}
            <TouchableOpacity
              onPress={handleEditProfile}
              className="bg-primary rounded-lg py-3 items-center justify-center mt-2"
            >
              <Text className="font-semibold text-white">프로필 수정</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">설정</Text>

            {/* Blocked Users */}
            <View className="bg-surface rounded-xl p-4 gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-foreground">차단된 사용자</Text>
                <Text className="text-sm text-muted">{blockedUsers.length}명</Text>
              </View>

              {blockedUsers.length === 0 ? (
                <Text className="text-sm text-muted">차단된 사용자가 없습니다.</Text>
              ) : (
                <View className="gap-2">
                  {blockedUsers.map((user, idx) => (
                    <View key={idx} className="flex-row items-center justify-between">
                      <Text className="text-sm text-foreground">{user.nickname}</Text>
                      <TouchableOpacity className="px-3 py-1 bg-error/10 rounded">
                        <Text className="text-xs font-semibold text-error">차단 해제</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* App Info */}
            <View className="bg-surface rounded-xl p-4 gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">앱 버전</Text>
                <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">개인정보 보호정책</Text>
                <Text className="text-lg">→</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">이용약관</Text>
                <Text className="text-lg">→</Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-error/10 rounded-lg py-3 items-center justify-center"
          >
            <Text className="font-semibold text-error">로그아웃</Text>
          </TouchableOpacity>

          {/* Spacer */}
          <View className="h-4" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
