import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";

import { ScreenFooter } from "@/components/meetory/screen-footer";
import { ScreenContainer } from "@/components/screen-container";
import { AVATAR_EMOJIS } from "@/lib/meetory/constants";
import { useAuth } from "@/lib/meetory/auth-context";
import { useColors } from "@/hooks/use-colors";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const colors = useColors();
  const { saveProfile } = useAuth();
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<string>(AVATAR_EMOJIS[0]);

  const handleNext = () => {
    const trimmedNickname = nickname.trim();
    if (trimmedNickname.length < 2) {
      Alert.alert(
        "닉네임 입력 오류",
        "닉네임은 최소 2자 이상이어야 합니다.",
        [{ text: "확인", onPress: () => {} }]
      );
      return;
    }
    saveProfile(trimmedNickname, avatar);
    router.push("/(auth)/interests");
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
          />
        </View>

        <View className="gap-3">
          <Text className="text-sm text-muted">기본 프로필 사진 선택</Text>
          <View className="flex-row flex-wrap gap-4">
            {AVATAR_EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => setAvatar(emoji)}
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

      <ScreenFooter label="다음" onPress={handleNext} disabled={nickname.trim().length < 2} />
    </ScreenContainer>
  );
}
