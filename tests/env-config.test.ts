import { describe, it, expect } from 'vitest';

/**
 * 환경변수 설정 검증 테스트
 * 팀원 백엔드 REST API 연동을 위한 필수 환경변수 확인
 */

describe('Environment Configuration', () => {
  it('should have EXPO_PUBLIC_API_URL configured', () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    expect(apiUrl).toBeDefined();
    expect(apiUrl).toMatch(/^https?:\/\/.+/);
  });

  it('should have EXPO_PUBLIC_SOCKET_URL configured', () => {
    const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL;
    expect(socketUrl).toBeDefined();
    expect(socketUrl).toMatch(/^https?:\/\/.+/);
  });

  it('API_URL should be valid URL format', () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    try {
      new URL(apiUrl || '');
      expect(true).toBe(true);
    } catch {
      expect.fail('Invalid API URL format');
    }
  });

  it('SOCKET_URL should be valid URL format', () => {
    const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL;
    try {
      new URL(socketUrl || '');
      expect(true).toBe(true);
    } catch {
      expect.fail('Invalid Socket URL format');
    }
  });

  it('should have optional OAuth configurations', () => {
    const kakaoAppId = process.env.EXPO_PUBLIC_KAKAO_APP_ID;
    const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
    
    // OAuth 설정은 선택사항이므로 정의되지 않을 수 있음
    if (kakaoAppId) {
      expect(typeof kakaoAppId).toBe('string');
      expect(kakaoAppId.length).toBeGreaterThan(0);
    }
    
    if (googleClientId) {
      expect(typeof googleClientId).toBe('string');
      expect(googleClientId.length).toBeGreaterThan(0);
    }
  });
});
