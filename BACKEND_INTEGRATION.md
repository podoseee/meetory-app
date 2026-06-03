# Meetory 앱 - 팀원 백엔드 연동 가이드

## 개요

Meetory 앱이 팀원의 Express.js + MySQL + Socket.io 백엔드와 통신하도록 완전히 재구성되었습니다.

## 기술 스택 변경

### 이전
- tRPC (타입 안전 RPC)
- 로컬 상태 관리
- WebSocket

### 현재
- **REST API** (axios 기반)
- **Socket.io** (실시간 채팅)
- **OAuth 2.0** (Kakao, Google)
- **좌표 기반 위치** (latitude, longitude)

## 환경변수 설정

### 필수 설정

```bash
# 팀원 백엔드 API 서버
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Socket.io 서버
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 선택 설정

```bash
# Kakao OAuth
EXPO_PUBLIC_KAKAO_APP_ID=YOUR_KAKAO_APP_ID

# Google OAuth
EXPO_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

## API 클라이언트

### REST API 클라이언트
위치: `lib/api/rest-client.ts`

**주요 기능:**
- Kakao/Google OAuth 로그인
- 사용자 프로필 관리
- 관심사 관리
- 위치 정보 저장 (좌표)
- 그룹/채팅방 관리
- 메시지 전송/수신
- 발자취 기록
- 사용자 신고/차단

**사용 예시:**
```typescript
import { restClient } from '@/lib/api/rest-client';

// 카카오 로그인
const result = await restClient.kakaoLogin(accessToken);

// 사용자 프로필 조회
const user = await restClient.getUserProfile(userId);

// 관심사 저장 (ID 배열)
await restClient.addUserInterests(userId, [1, 2, 3]);

// 위치 저장 (좌표)
await restClient.setUserLocation(userId, 37.7749, -122.4194);
```

### Socket.io 클라이언트
위치: `lib/api/socket-client.ts`

**주요 기능:**
- 실시간 메시지 수신
- 사용자 입장/퇴장 알림
- 타이핑 상태 전송
- 그룹 입장/퇴장

**사용 예시:**
```typescript
import { socketClient } from '@/lib/api/socket-client';

// 연결
socketClient.connect(accessToken);

// 그룹 입장
socketClient.joinGroup(groupId, userId);

// 메시지 전송
socketClient.sendMessage(groupId, userId, 'Hello!');

// 이벤트 리스닝
socketClient.on('message', (message) => {
  console.log('New message:', message);
});
```

## 인증 플로우

### AuthContext (REST API 기반)
위치: `lib/meetory/auth-context-rest.tsx`

**온보딩 단계:**
1. **login** - OAuth 로그인 (Kakao/Google)
2. **terms** - 약관 동의
3. **profile** - 프로필 설정 (닉네임, 프로필 이미지)
4. **interests** - 관심사 선택 (관심사 ID 배열)
5. **location** - 위치 설정 (좌표: latitude, longitude)
6. **ready** - 온보딩 완료

**사용 예시:**
```typescript
import { useAuth } from '@/lib/meetory/auth-context-rest';

export function MyComponent() {
  const { user, kakaoLogin, saveProfile, saveInterests, saveLocation } = useAuth();

  // 카카오 로그인
  await kakaoLogin(accessToken);

  // 프로필 저장
  await saveProfile('닉네임', 'profile_image_url');

  // 관심사 저장
  await saveInterests([1, 2, 3]);

  // 위치 저장
  await saveLocation(37.7749, -122.4194);
}
```

## 데이터 모델

### User
```typescript
{
  id: number;
  nickname: string;
  profile_img?: string;
  bio?: string;
  kakao_id?: string;
  google_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### Interest
```typescript
{
  id: number;
  name: string;
  category: string;
}
```

### Group
```typescript
{
  id: number;
  name: string;
  status: 'active' | 'expired' | 'met';
  max_members: number;
  expires_at: string;
  created_at: string;
}
```

### Message
```typescript
{
  id: number;
  group_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}
```

### Footprint
```typescript
{
  id: number;
  user_id: number;
  group_id: number;
  latitude: number;
  longitude: number;
  met_at: string;
}
```

## 토큰 관리

### 자동 토큰 갱신
REST API 클라이언트는 자동으로 토큰을 갱신합니다:

1. 요청 시 `Authorization: Bearer {accessToken}` 헤더 추가
2. 401 응답 시 자동으로 `refreshToken` 사용
3. 새 토큰 획득 후 원래 요청 재시도
4. 갱신 실패 시 로그아웃 처리

### 토큰 저장
- `accessToken`: Expo Secure Store에 저장
- `refreshToken`: Expo Secure Store에 저장

## 테스트

### 환경변수 검증
```bash
pnpm test tests/env-config.test.ts
```

## 배포 준비

### 1. 환경변수 설정
프로덕션 환경에 다음 환경변수 설정:
- `EXPO_PUBLIC_API_URL`: 실제 백엔드 URL
- `EXPO_PUBLIC_SOCKET_URL`: 실제 Socket.io URL
- `EXPO_PUBLIC_KAKAO_APP_ID`: Kakao OAuth 앱 ID
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth 클라이언트 ID

### 2. 빌드
```bash
pnpm build
```

### 3. 배포
```bash
pnpm start
```

## 주의사항

### OAuth 통합
현재 로그인 화면에서 OAuth 버튼은 실제 SDK 통합이 필요합니다:

- **Kakao**: `react-native-kakao-sdk` 또는 `@react-native-seoul/kakao-login` 필요
- **Google**: `@react-native-google-signin/google-signin` 필요

### 위치 권한
GPS 기반 위치 설정을 위해 다음 권한 필요:
- iOS: `NSLocationWhenInUseUsageDescription`
- Android: `android.permission.ACCESS_FINE_LOCATION`

### Socket.io 연결
Socket.io는 앱이 로그인 후 자동으로 연결됩니다.
필요시 수동으로 연결:

```typescript
import { socketClient } from '@/lib/api/socket-client';

socketClient.connect(accessToken);
```

## 문제 해결

### API 연결 실패
1. 백엔드 서버 실행 확인
2. `EXPO_PUBLIC_API_URL` 확인
3. 네트워크 연결 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### Socket.io 연결 실패
1. `EXPO_PUBLIC_SOCKET_URL` 확인
2. 백엔드 Socket.io 서버 실행 확인
3. 방화벽 설정 확인

### 토큰 갱신 실패
1. `refreshToken` 유효성 확인
2. 백엔드 `/auth/refresh` 엔드포인트 확인
3. 로그아웃 후 재로그인

## 참고 자료

- [팀원 백엔드 저장소](https://github.com/cienjw/TT-app-backend)
- [Expo 문서](https://docs.expo.dev/)
- [Socket.io 클라이언트 문서](https://socket.io/docs/v4/client-api/)
