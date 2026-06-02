# 🌟 Meetory

> **관심사로 만나는 사람들** — 익명 기반의 소규모 자동 매칭 채팅 앱

---

## 📱 앱 개요

**Meetory**는 같은 관심사를 가진 3~5명의 사람들을 자동으로 매칭하여 익명으로 채팅할 수 있는 모바일 앱입니다. AI 대화 조언 기능으로 자연스러운 대화를 시작하고, 발자취 기능으로 관심사별 인기 장소를 발견해보세요.

### 🎯 핵심 기능

| 기능 | 설명 |
|------|------|
| **자동 매칭** | 관심사 + 지역 기반 3~5명 그룹 자동 생성 |
| **익명 채팅** | 랜덤 닉네임으로 프라이버시 보호 |
| **AI 조언** | 대화 시작 주제 제안 (LLM 기반) |
| **발자취** | 관심사별 인기 장소 추천 및 체크인 기록 |
| **안전성** | 사용자 신고 및 차단 기능 |

---

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+
- pnpm 9.12.0+
- Expo Go (모바일 테스트용)

### 설치 및 실행

```bash
# 1. 프로젝트 설치
cd meetory-app
pnpm install

# 2. 개발 서버 시작
pnpm dev

# 3. 모바일 앱 미리보기
# 터미널에 표시된 QR 코드를 Expo Go로 스캔하거나
# 브라우저에서 http://localhost:8081 접속
```

---

## 📁 프로젝트 구조

```
meetory-app/
├── app/                          # 앱 화면 (Expo Router)
│   ├── (tabs)/
│   │   ├── index.tsx            # Home - 매칭 & 채팅
│   │   ├── footprint.tsx        # Footprint - 발자취
│   │   ├── profile.tsx          # Profile - 프로필
│   │   └── _layout.tsx          # 탭 네비게이션
│   ├── chat.tsx                 # 채팅방 화면
│   ├── onboarding.tsx           # 온보딩 (닉네임, 관심사, 지역)
│   └── _layout.tsx              # 루트 레이아웃
│
├── server/                       # 백엔드 (Node.js + Express)
│   ├── _core/
│   │   ├── index.ts             # 서버 진입점
│   │   ├── trpc.ts              # tRPC 설정
│   │   ├── llm.ts               # AI 조언 (LLM)
│   │   └── ...
│   ├── routers.ts               # tRPC 라우터
│   ├── db.ts                    # 데이터베이스 쿼리
│   └── README.md                # 백엔드 상세 문서
│
├── drizzle/                      # 데이터베이스 스키마
│   ├── schema.ts                # 테이블 정의
│   ├── migrations/              # 마이그레이션 파일
│   └── relations.ts             # 테이블 관계
│
├── components/                   # React 컴포넌트
│   ├── screen-container.tsx     # SafeArea 래퍼
│   └── ui/
│       └── icon-symbol.tsx      # 탭 아이콘 매핑
│
├── lib/                          # 유틸리티
│   ├── trpc.ts                  # tRPC 클라이언트
│   ├── theme-provider.tsx       # 테마 프로바이더
│   └── utils.ts                 # 헬퍼 함수
│
├── design.md                     # UI/UX 설계 문서
├── todo.md                       # 개발 체크리스트
└── app.config.ts                # Expo 설정
```

---

## 🎨 기술 스택

### 프론트엔드
- **React Native 0.81** — 크로스 플랫폼 모바일 개발
- **Expo SDK 54** — 네이티브 기능 쉽게 사용
- **Expo Router 6** — 파일 기반 라우팅
- **NativeWind 4** — React Native에서 Tailwind CSS 사용
- **TypeScript 5.9** — 타입 안전성

### 백엔드
- **Node.js + Express** — 서버 프레임워크
- **tRPC 11** — 타입 안전 API
- **Drizzle ORM** — 데이터베이스 쿼리
- **MySQL** — 데이터 저장소

### AI & 외부 서비스
- **Manus LLM API** — 대화 주제 제안 (내장)
- **OAuth** — 사용자 인증 (내장)

---

## 🎯 주요 화면

### 1️⃣ 온보딩 (Onboarding)
- 닉네임 설정 (2~20자)
- 관심사 선택 (1~5개)
- 지역 선택 (강남, 홍대, 건대 등)

### 2️⃣ Home - 매칭 & 채팅
- **매칭 시작** 버튼으로 관심사 + 지역 기반 그룹 생성
- 활성 채팅방 목록 표시
- 각 채팅방 진입 가능

### 3️⃣ Chat Room - 실시간 채팅
- 메시지 송수신
- 참여자 프로필 확인
- **💡 AI 조언** 버튼으로 대화 주제 제안
- 채팅방 나가기 / 재매칭

### 4️⃣ Footprint - 발자취
- 관심사별 **인기 장소 TOP 3** 표시
- **체크인** 기능으로 방문 기록
- 내 체크인 히스토리 조회

### 5️⃣ Profile - 프로필 & 설정
- 닉네임, 관심사, 지역 정보
- 체크인 통계
- 차단 사용자 관리
- 로그아웃

---

## 🎨 색상 팔레트

| 색상 | HEX | 용도 |
|------|-----|------|
| Primary Purple | `#7C3AED` | 주요 버튼, 강조 |
| Light Purple | `#EDE9FE` | 배경, 하이라이트 |
| Dark Gray | `#1F2937` | 텍스트 |
| Light Gray | `#F3F4F6` | 배경, 구분선 |
| Success Green | `#10B981` | 성공 상태 |
| Error Red | `#EF4444` | 에러 상태 |

---

## 📊 데이터베이스 스키마

### 주요 테이블

| 테이블 | 설명 |
|--------|------|
| `users` | 사용자 계정 |
| `userProfiles` | 닉네임, 관심사, 지역 |
| `chatRooms` | 매칭된 그룹 채팅방 |
| `chatRoomMembers` | 채팅방 참여자 |
| `messages` | 채팅 메시지 |
| `checkIns` | 장소 체크인 기록 |
| `blockedUsers` | 차단 관계 |
| `reports` | 신고 기록 |
| `aiSuggestions` | AI 대화 조언 |

자세한 스키마는 `drizzle/schema.ts` 참고.

---

## 🔌 API 엔드포인트

### 프로필 관리
- `profile.create` — 프로필 생성
- `profile.get` — 프로필 조회
- `profile.update` — 프로필 수정

### 매칭 & 채팅
- `matching.start` — 매칭 시작
- `chatRoom.list` — 채팅방 목록
- `message.send` — 메시지 전송
- `message.list` — 메시지 조회

### AI & 안전성
- `ai.getSuggestion` — AI 대화 조언
- `safety.block` — 사용자 차단
- `safety.report` — 사용자 신고

### 발자취
- `checkIn.create` — 체크인 생성
- `checkIn.list` — 체크인 목록
- `place.getPopular` — 인기 장소 조회

자세한 API 문서는 `server/README.md` 참고.

---

## 🧪 개발 가이드

### 새 화면 추가

```tsx
// app/my-screen.tsx
import { ScreenContainer } from "@/components/screen-container";
import { Text, View } from "react-native";

export default function MyScreen() {
  return (
    <ScreenContainer className="p-4">
      <View className="gap-4">
        <Text className="text-2xl font-bold text-foreground">
          My Screen
        </Text>
      </View>
    </ScreenContainer>
  );
}
```

### API 호출

```tsx
import { trpc } from "@/lib/trpc";

export default function MyComponent() {
  const { data, isLoading } = trpc.profile.get.useQuery();
  
  return (
    <Text>
      {isLoading ? "로딩 중..." : `안녕하세요, ${data?.nickname}님`}
    </Text>
  );
}
```

### 스타일링 (NativeWind)

```tsx
<View className="flex-1 items-center justify-center p-4 bg-primary rounded-lg">
  <Text className="text-white font-bold text-lg">
    Styled with Tailwind
  </Text>
</View>
```

---

## 📋 개발 체크리스트

### P0 (필수)
- [x] 데이터베이스 스키마 설계
- [x] 백엔드 API 구현
- [x] 프론트엔드 UI 화면
- [ ] 실시간 메시지 기능
- [ ] 프로필 생성 API 연동

### P1 (중요)
- [ ] 매칭 알고리즘 테스트
- [ ] 채팅 메시지 실시간 동기화
- [ ] AI 조언 기능 테스트

### P2 (선택)
- [ ] 발자취 기능 고도화
- [ ] 푸시 알림
- [ ] 사용자 통계

자세한 내용은 `todo.md` 참고.

---

## 🚀 배포

### APK 빌드 (Android)

```bash
# Expo 클라우드 빌드
eas build --platform android

# 또는 로컬 빌드
pnpm run build
```

### iOS 배포

```bash
eas build --platform ios
```

> **주의**: 배포 전 `webdev_save_checkpoint`로 체크포인트를 생성한 후, 관리 UI의 **Publish** 버튼을 클릭하세요.

---

## 📚 참고 자료

- [Expo 공식 문서](https://docs.expo.dev/)
- [React Native 가이드](https://reactnative.dev/)
- [NativeWind 문서](https://www.nativewind.dev/)
- [tRPC 튜토리얼](https://trpc.io/docs)
- [Drizzle ORM](https://orm.drizzle.team/)

---

## 🤝 기여

버그 리포트, 기능 제안, PR은 언제든 환영합니다!

---

## 📄 라이선스

MIT License — 자유롭게 사용하세요.

---

## 💬 문의

질문이나 피드백이 있으신가요? 프로젝트 이슈를 등록해주세요.

**Happy Coding! 🎉**
