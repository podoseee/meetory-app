import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { DEFAULT_CHAT_ROOMS } from "./mock-data";
import { STORAGE_KEYS } from "./constants";
import type { ChatRoom, OnboardingStep, UserProfile } from "./types";

interface AuthContextValue {
  isReady: boolean;
  isLoggedIn: boolean;
  onboardingStep: OnboardingStep | "done";
  profile: UserProfile | null;
  chatRooms: ChatRoom[];
  bluetoothEnabled: boolean;
  signIn: () => Promise<void>;
  acceptTerms: (marketing: boolean) => void;
  saveProfile: (nickname: string, avatarEmoji: string) => void;
  saveInterests: (interests: string[]) => Promise<void>;
  completeWelcome: () => Promise<void>;
  completeChatroomsIntro: () => Promise<void>;
  setBluetoothEnabled: (enabled: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

// 기본 프로필 제거 - 사용자가 로그인부터 시작하도록
const defaultProfile: UserProfile | null = null;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | "done">("login");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [bluetoothEnabled, setBluetoothEnabledState] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [stepRaw, profileRaw, roomsRaw, btRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.onboardingStep),
          AsyncStorage.getItem(STORAGE_KEYS.profile),
          AsyncStorage.getItem(STORAGE_KEYS.chatRooms),
          AsyncStorage.getItem(STORAGE_KEYS.bluetoothEnabled),
        ]);

        if (stepRaw === "done") {
          setIsLoggedIn(true);
          setOnboardingStep("done");
          if (profileRaw) setProfile(JSON.parse(profileRaw) as UserProfile);
          setChatRooms(roomsRaw ? (JSON.parse(roomsRaw) as ChatRoom[]) : DEFAULT_CHAT_ROOMS);
        } else if (stepRaw) {
          setIsLoggedIn(true);
          setOnboardingStep(stepRaw as OnboardingStep);
        } else {
          // 저장된 상태가 없으면 로그인 화면부터 시작
          setOnboardingStep("login");
        }

        if (btRaw !== null) setBluetoothEnabledState(btRaw === "true");
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const persistStep = useCallback(async (step: OnboardingStep | "done") => {
    await AsyncStorage.setItem(STORAGE_KEYS.onboardingStep, step);
    setOnboardingStep(step);
  }, []);

  const signIn = useCallback(async () => {
    setIsLoggedIn(true);
    await persistStep("terms");
  }, [persistStep]);

  const acceptTerms = useCallback(
    (marketing: boolean) => {
      setProfile((p) => ({
        nickname: p?.nickname ?? "",
        avatarEmoji: p?.avatarEmoji ?? "😊",
        interests: p?.interests ?? [],
        marketingAgreed: marketing,
      }));
      void persistStep("profile");
    },
    [persistStep],
  );

  const saveProfile = useCallback((nickname: string, avatarEmoji: string) => {
    setProfile({
      nickname,
      avatarEmoji,
      interests: [],
      marketingAgreed: false,
    });
    void persistStep("interests");
  }, [persistStep]);

  const saveInterests = useCallback(
    async (interests: string[]) => {
      if (!profile) return;
      const next: UserProfile = {
        ...profile,
        interests,
      };
      setProfile(next);
      await AsyncStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(next));
      await persistStep("welcome");
    },
    [profile, persistStep],
  );

  const completeWelcome = useCallback(async () => {
    await persistStep("chatrooms");
  }, [persistStep]);

  const completeChatroomsIntro = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.chatRooms, JSON.stringify(DEFAULT_CHAT_ROOMS));
    setChatRooms(DEFAULT_CHAT_ROOMS);
    await persistStep("done");
  }, [persistStep]);

  const setBluetoothEnabled = useCallback(async (enabled: boolean) => {
    setBluetoothEnabledState(enabled);
    await AsyncStorage.setItem(STORAGE_KEYS.bluetoothEnabled, String(enabled));
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.onboardingStep,
      STORAGE_KEYS.profile,
      STORAGE_KEYS.chatRooms,
    ]);
    setIsLoggedIn(false);
    setOnboardingStep("login");
    setProfile(null);
    setChatRooms([]);
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      isLoggedIn,
      onboardingStep,
      profile,
      chatRooms,
      bluetoothEnabled,
      signIn,
      acceptTerms,
      saveProfile,
      saveInterests,
      completeWelcome,
      completeChatroomsIntro,
      setBluetoothEnabled,
      logout,
    }),
    [
      isReady,
      isLoggedIn,
      onboardingStep,
      profile,
      chatRooms,
      bluetoothEnabled,
      signIn,
      acceptTerms,
      saveProfile,
      saveInterests,
      completeWelcome,
      completeChatroomsIntro,
      setBluetoothEnabled,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
