import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { ScreenFooter } from "@/components/meetory/screen-footer";
import { ScreenContainer } from "@/components/screen-container";
import { AVATAR_EMOJIS } from "@/lib/meetory/constants";
import { useAuth } from "@/lib/meetory/auth-context-rest";
import { useColors } from "@/hooks/use-colors";

/**
 * 프로필 설정 화면
 * 팀원 백엔드 REST API 기반
 * 닉네임과 프로필 이미지 설정
 */

export default function ProfileSetupScreen() {
  const router = useRouter();
  const colors = useColors();
  const { saveProfile, isLoading } = useAuth();
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<string>(AVATAR_EMOJIS[0]);
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    const trimmedNickname = nickname.trim();
    if (trimmedNickname.length < 2) {
      Alert.alert(
        "닉네임 입력 오류",
        "닉네임은 최소 2자 이상이어야 합니다.",
        [{ text: "확인", onPress: () => {} }]
      );
      return;
    }

    try {
      setIsSaving(true);
      // 프로필 저장 (닉네임, 프로필 이미지 URL)
      // 현재: 이모지를 프로필 이미지로 사용
      // 나중: 실제 이미지 URL로 교체
      await saveProfile(trimmedNickname, avatar);
      router.push("/(auth)/interests");
    } catch (error) {
      console.error("Profile save error:", error);
      Alert.alert("오류", "프로필 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer className="px-6" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 pt-8 gap-6">
        <Text className="text-2xl font-bold text-foreground">닉네임 & 기본 사진</Text>

        <View className="gap-2">
          <Text className="text-sm text-muted">닉네임</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="예) pododang_dodang"
            placeholderTextColor={colors.muted}
            className="bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border"
            maxLength={20}
            editable={!isLoading && !isSaving}
          />
        </View>

        <View className="gap-3">
          <Text className="text-sm text-muted">기본 프로필 사진 선택</Text>
          <View className="flex-row flex-wrap gap-4">
            {AVATAR_EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => setAvatar(emoji)}
                disabled={isLoading || isSaving}
                className={`w-16 h-16 rounded-full items-center justify-center border-2 ${
                  avatar === emoji ? "border-primary bg-primary/10" : "border-border bg-surface"
                }`}
              >
                <Text className="text-3xl">{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScreenFooter
        label={isSaving ? "저장 중..." : "다음"}
        onPress={handleNext}
        disabled={nickname.trim().length < 2 || isLoading || isSaving}
      />
    </ScreenContainer>
  );
}
