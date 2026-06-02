export const INTEREST_OPTIONS = [
  "여행",
  "영화",
  "음악",
  "운동",
  "독서",
  "맛집",
  "카페",
  "게임",
  "콘서트",
  "요리",
  "사진",
  "반려동물",
] as const;

export const AVATAR_EMOJIS = ["🦊", "🐻", "🐼", "🐨", "🦁", "🐸"] as const;

export const MAX_INTERESTS = 5;

export const STORAGE_KEYS = {
  profile: "@meetory/profile",
  onboardingStep: "@meetory/onboarding-step",
  chatRooms: "@meetory/chat-rooms",
  bluetoothEnabled: "@meetory/bluetooth-on",
} as const;
