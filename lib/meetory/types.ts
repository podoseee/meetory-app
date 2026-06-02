export type OnboardingStep =
  | "login"
  | "terms"
  | "profile"
  | "interests"
  | "welcome"
  | "chatrooms";

export interface UserProfile {
  id?: number;
  nickname: string;
  avatarEmoji: string;
  interests: string[];
  location?: string;
  marketingAgreed: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  memberCount: number;
}

export interface ChatMessage {
  id: string;
  nickname: string;
  content: string;
  time: string;
  isOwn: boolean;
}

export interface MatchProfile {
  id: string;
  nickname: string;
  avatarEmoji: string;
  matchPercent: number;
  status: string;
  interests: string[];
}

export interface FootprintPlace {
  id: string;
  name: string;
  category: string;
  visitedAt: string;
}
