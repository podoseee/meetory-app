import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { useAuth } from "@/lib/meetory/auth-context-rest";

/**
 * 루트 라우터
 * 팀원 백엔드 REST API 기반 인증 상태에 따라 라우팅
 * 
 * 온보딩 플로우:
 * 1. login: 로그인 화면
 * 2. terms: 약관 동의
 * 3. profile: 프로필 설정 (닉네임, 프로필 이미지)
 * 4. interests: 관심사 선택
 * 5. location: 위치 설정 (좌표)
 * 6. ready: 온보딩 완료 → 메인 화면
 */

export default function Index() {
  const { user, isLoading, onboardingStep } = useAuth();

  // 로딩 중
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  // 로그인 필요
  if (!user || onboardingStep === "login" || onboardingStep === null) {
    return <Redirect href="/(auth)/login" />;
  }

  // 온보딩 단계별 라우팅
  if (onboardingStep !== "ready") {
    const routes: Record<string, string> = {
      terms: "/(auth)/terms",
      profile: "/(auth)/profile-setup",
      interests: "/(auth)/interests",
      location: "/(auth)/location-setup",
      ready: "/(tabs)/footprint",
    };
    const route = routes[onboardingStep];
    if (route) {
      return <Redirect href={route as never} />;
    }
  }

  // 온보딩 완료 → 메인 화면
  return <Redirect href="/(tabs)/footprint" />;
}
