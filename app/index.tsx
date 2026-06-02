import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { useAuth } from "@/lib/meetory/auth-context";

export default function Index() {
  const { isReady, isLoggedIn, onboardingStep } = useAuth();

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!isLoggedIn || onboardingStep === "login") {
    return <Redirect href="/(auth)/login" />;
  }

  if (onboardingStep !== "done") {
    const routes: Record<string, string> = {
      terms: "/(auth)/terms",
      profile: "/(auth)/profile-setup",
      interests: "/(auth)/interests",
      welcome: "/(auth)/welcome",
      chatrooms: "/(auth)/chatrooms-ready",
    };
    return <Redirect href={(routes[onboardingStep] ?? "/(auth)/terms") as never} />;
  }

  return <Redirect href="/(tabs)/footprint" />;
}
