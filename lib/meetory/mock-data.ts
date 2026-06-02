import type { ChatMessage, ChatRoom, FootprintPlace, MatchProfile } from "./types";

export const DEFAULT_CHAT_ROOMS: ChatRoom[] = [
  {
    id: "1",
    name: "여행 좋아하는 사람들",
    lastMessage: "다음 주 제주도 가실 분?",
    time: "오후 2:30",
    memberCount: 4,
  },
  {
    id: "2",
    name: "맛집 탐방 모임",
    lastMessage: "성수 카페 추천해요!",
    time: "오전 11:20",
    memberCount: 3,
  },
  {
    id: "3",
    name: "콘서트 동행",
    lastMessage: "이번 주말 공연 티켓 구했어요",
    time: "어제",
    memberCount: 5,
  },
];

export const MATCH_PROFILES: MatchProfile[] = [
  {
    id: "m1",
    nickname: "여행러버",
    avatarEmoji: "🦊",
    matchPercent: 87,
    status: "주말에 가까운 곳으로 당일치기 여행 가고 싶어요",
    interests: ["여행", "맛집", "카페"],
  },
  {
    id: "m2",
    nickname: "카페지기",
    avatarEmoji: "🐻",
    matchPercent: 80,
    status: "성수·연남 카페 투어 좋아해요",
    interests: ["카페", "사진", "맛집"],
  },
  {
    id: "m3",
    nickname: "콘서트매니아",
    avatarEmoji: "🐼",
    matchPercent: 75,
    status: "이번 달 인디 공연 같이 가실 분?",
    interests: ["콘서트", "음악"],
  },
];

export const FOOTPRINT_PLACES: FootprintPlace[] = [
  { id: "p1", name: "성수 카페거리", category: "카페", visitedAt: "오늘" },
  { id: "p2", name: "한강공원", category: "운동", visitedAt: "어제" },
  { id: "p3", name: "강남 맛집골목", category: "맛집", visitedAt: "3일 전" },
  { id: "p4", name: "홍대 문화거리", category: "문화", visitedAt: "4일 전" },
  { id: "p5", name: "명동 쇼핑거리", category: "쇼핑", visitedAt: "5일 전" },
  { id: "p6", name: "강남역 카페", category: "카페", visitedAt: "1주일 전" },
  { id: "p7", name: "서촌 갤러리", category: "문화", visitedAt: "1주일 전" },
  { id: "p8", name: "이태원 국제음식", category: "맛집", visitedAt: "2주일 전" },
];

export function getChatMessages(roomId: string): ChatMessage[] {
  return [
    {
      id: "1",
      nickname: "여행러버",
      content: "안녕하세요! 반가워요 😊",
      time: "10:30",
      isOwn: false,
    },
    {
      id: "2",
      nickname: "나",
      content: "안녕하세요! 같은 관심사라서 들어왔어요.",
      time: "10:32",
      isOwn: true,
    },
    {
      id: "3",
      nickname: "맛집탐험가",
      content: "이번 주말에 모임 한번 해볼까요?",
      time: "10:35",
      isOwn: false,
    },
  ];
}

export const AI_SUGGESTIONS = [
  "최근에 다녀온 여행지 이야기를 나눠보세요.",
  "주말 계획을 물어보면 대화가 자연스럽게 이어져요.",
  "좋아하는 맛집을 추천해 달라고 해보세요.",
];

export function getRoomName(roomId: string): string {
  return DEFAULT_CHAT_ROOMS.find((r) => r.id === roomId)?.name ?? `채팅방 ${roomId}`;
}

export const INTERESTS = [
  "여행",
  "맛집",
  "카페",
  "콘서트",
  "영화",
  "독서",
  "운동",
  "음악",
  "사진",
  "요리",
];

export const LOCATIONS = [
  "강남",
  "홍대",
  "건대",
  "명동",
  "강북",
  "성수",
  "연남",
  "이태원",
];
