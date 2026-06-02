import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ScreenFooter } from "@/components/meetory/screen-footer";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/meetory/auth-context";

export default function WelcomeScreen() {
  const router = useRouter();
  const { completeWelcome } = useAuth();

  const handleStart = async () => {
    await completeWelcome();
    router.push("/(auth)/chatrooms-ready");
  };

  return (
    <ScreenContainer className="px-6 justify-center items-center" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 justify-center items-center gap-6">
        <View className="w-24 h-24 rounded-full bg-primary/15 items-center justify-center">
          <Ionicons name="checkmark-circle" size={64} color="#7C3AED" />
        </View>
        <Text className="text-2xl font-bold text-foreground text-center">
          Meetory에 오신 것을{"\n"}환영해요!
        </Text>
        <Text className="text-muted text-center text-sm leading-6">
          관심사 기반으로 채팅방이 자동 생성됩니다.{"\n"}곧 새로운 친구들을 만나보세요.
        </Text>
      </View>

      <ScreenFooter label="시작하기" onPress={handleStart} />
    </ScreenContainer>
  );
}
