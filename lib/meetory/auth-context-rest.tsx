import React, { createContext, useState, useCallback, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { restClient } from "@/lib/api/rest-client";

export interface UserProfile {
  id: number;
  nickname: string;
  profile_img?: string;
  interests: string[];
  location: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isNewUser: boolean;
  onboardingStep: "login" | "terms" | "profile" | "interests" | "location" | "ready" | null;
  
  // 인증
  kakaoLogin: (accessToken: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  
  // 온보딩
  acceptTerms: () => void;
  saveProfile: (nickname: string, profileImage?: string) => Promise<void>;
  saveInterests: (interests: string[]) => Promise<void>;
  saveLocation: (location: string) => Promise<void>;
  completeOnboarding: () => void;
  
  // 프로필 수정
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<AuthContextType["onboardingStep"]>(null);

  // 세션 복구
  const restoreSession = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const userId = await SecureStore.getItemAsync("userId");
      
      if (accessToken && userId) {
        await restClient.setAccessToken(accessToken);
        const profile = await restClient.getUserProfile(parseInt(userId));
        setUser({
          ...profile,
          interests: profile.interests || [],
          location: profile.location || "",
        });
        setOnboardingStep("ready");
      } else {
        setOnboardingStep("login");
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      setOnboardingStep("login");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // 카카오 로그인
  const kakaoLogin = useCallback(async (accessToken: string) => {
    try {
      setIsLoading(true);
      const result = await restClient.kakaoLogin(accessToken);
      
      setIsNewUser(result.isNewUser);
      await SecureStore.setItemAsync("userId", result.userId.toString());
      
      if (result.isNewUser) {
        setOnboardingStep("profile");
      } else {
        const profile = await restClient.getUserProfile(result.userId);
        setUser({
          id: profile.id,
          nickname: profile.nickname,
          profile_img: profile.profile_img,
          interests: profile.interests || [],
          location: profile.location || "",
        });
        setOnboardingStep("ready");
      }
    } catch (error) {
      console.error("Kakao login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 구글 로그인
  const googleLogin = useCallback(async (idToken: string) => {
    try {
      setIsLoading(true);
      const result = await restClient.googleLogin(idToken);
      
      setIsNewUser(result.isNewUser);
      await SecureStore.setItemAsync("userId", result.userId.toString());
      
      if (result.isNewUser) {
        setOnboardingStep("profile");
      } else {
        const profile = await restClient.getUserProfile(result.userId);
        setUser({
          id: profile.id,
          nickname: profile.nickname,
          profile_img: profile.profile_img,
          interests: profile.interests || [],
          location: profile.location || "",
        });
        setOnboardingStep("ready");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await restClient.logout();
      await SecureStore.deleteItemAsync("userId");
      setUser(null);
      setOnboardingStep("login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  // 약관 동의
  const acceptTerms = useCallback(() => {
    setOnboardingStep("profile");
  }, []);

  // 프로필 저장
  const saveProfile = useCallback(async (nickname: string, profileImage?: string) => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) throw new Error("User ID not found");

      await restClient.updateUserProfile(parseInt(userId), {
        nickname,
        profile_img: profileImage,
      });

      setUser((prev) =>
        prev ? { ...prev, nickname, profile_img: profileImage } : null
      );
      setOnboardingStep("interests");
    } catch (error) {
      console.error("Failed to save profile:", error);
      throw error;
    }
  }, []);

  // 관심사 저장
  const saveInterests = useCallback(async (interests: string[]) => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) throw new Error("User ID not found");

      await restClient.addUserInterests(parseInt(userId), interests);
      setUser((prev) => (prev ? { ...prev, interests } : null));
      setOnboardingStep("location");
    } catch (error) {
      console.error("Failed to save interests:", error);
      throw error;
    }
  }, []);

  // 지역 저장
  const saveLocation = useCallback(async (location: string) => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) throw new Error("User ID not found");

      await restClient.setUserLocation(parseInt(userId), location);
      setUser((prev) => (prev ? { ...prev, location } : null));
      setOnboardingStep("ready");
    } catch (error) {
      console.error("Failed to save location:", error);
      throw error;
    }
  }, []);

  // 온보딩 완료
  const completeOnboarding = useCallback(() => {
    setOnboardingStep("ready");
  }, []);

  // 프로필 업데이트
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) throw new Error("User ID not found");

      await restClient.updateUserProfile(parseInt(userId), updates);
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isNewUser,
    onboardingStep,
    kakaoLogin,
    googleLogin,
    logout,
    restoreSession,
    acceptTerms,
    saveProfile,
    saveInterests,
    saveLocation,
    completeOnboarding,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

export const useAuth = useAuthContext;
