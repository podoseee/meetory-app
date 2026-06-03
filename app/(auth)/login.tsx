import { Text, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { MeetoryLogo } from "@/components/meetory/meetory-logo";
import { PrimaryButton } from "@/components/meetory/primary-button";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/meetory/auth-context-rest";

/**
 * 로그인 화면
 * 팀원 백엔드 OAuth (Kakao, Google) 연동
 */

export default function LoginScreen() {
  const router = useRouter();
  const { kakaoLogin, googleLogin, isLoading } = useAuth();
  const [isKakaoLoading, setIsKakaoLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  /**
   * 카카오 로그인
   * 실제 구현: Kakao SDK를 사용하여 accessToken 획득
   * 현재: 테스트용 토큰 사용 (나중에 실제 SDK로 교체)
   */
  const handleKakaoLogin = async () => {
    try {
      setIsKakaoLoading(true);
      // TODO: 실제 Kakao SDK를 사용하여 accessToken 획득
      // const { accessToken } = await KakaoLogin.login();
      // await kakaoLogin(accessToken);
      
      // 임시: 테스트용 토큰 (실제 환경에서는 Kakao SDK 사용)
      console.log("Kakao login initiated - requires Kakao SDK integration");
      Alert.alert("알림", "카카오 로그인은 Kakao SDK 통합이 필요합니다.");
    } catch (error) {
      console.error("Kakao login error:", error);
      Alert.alert("오류", "카카오 로그인에 실패했습니다.");
    } finally {
      setIsKakaoLoading(false);
    }
  };

  /**
   * 구글 로그인
   * 실제 구현: Google Sign-In SDK를 사용하여 idToken 획득
   * 현재: 테스트용 토큰 사용 (나중에 실제 SDK로 교체)
   */
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      // TODO: 실제 Google Sign-In SDK를 사용하여 idToken 획득
      // const { idToken } = await GoogleSignin.signIn();
      // await googleLogin(idToken);
      
      // 임시: 테스트용 토큰 (실제 환경에서는 Google Sign-In SDK 사용)
      console.log("Google login initiated - requires Google Sign-In SDK integration");
      Alert.alert("알림", "구글 로그인은 Google Sign-In SDK 통합이 필요합니다.");
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert("오류", "구글 로그인에 실패했습니다.");
    } finally {
      setIsGoogleLoading(false);
    }
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
        <PrimaryButton
          label="카카오로 시작하기"
          variant="kakao"
          onPress={handleKakaoLogin}
          disabled={isLoading || isKakaoLoading}
        />
        <PrimaryButton
          label="Google로 시작하기"
          variant="google"
          onPress={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
        />
        <PrimaryButton
          label="Apple로 시작하기"
          variant="outline"
          onPress={() => Alert.alert("알림", "Apple 로그인은 아직 지원하지 않습니다.")}
          disabled={isLoading}
        />
        <Text className="text-xs text-muted text-center mt-4 leading-5">
          가입 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </Text>
      </View>
    </ScreenContainer>
  );
}
