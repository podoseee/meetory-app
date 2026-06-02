import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { MeetoryLogo } from "@/components/meetory/meetory-logo";
import { PrimaryButton } from "@/components/meetory/primary-button";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/meetory/auth-context";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSocialLogin = async (provider: string) => {
    await signIn();
    router.replace("/(auth)/terms");
  };

  return (
    <ScreenContainer className="px-6 justify-between pb-8" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 justify-center items-center gap-2">
        <MeetoryLogo />
        <Text className="text-muted text-center mt-4 text-sm">
          관심사로 만나는 소규모 채팅, Meetory
        </Text>
      </View>

      <View className="gap-3">
        <PrimaryButton label="카카오로 시작하기" variant="kakao" onPress={() => handleSocialLogin("kakao")} />
        <PrimaryButton label="Google로 시작하기" variant="google" onPress={() => handleSocialLogin("google")} />
        <PrimaryButton label="Apple로 시작하기" variant="outline" onPress={() => handleSocialLogin("apple")} />
        <Text className="text-xs text-muted text-center mt-4 leading-5">
          가입 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </Text>
      </View>
    </ScreenContainer>
  );
}
