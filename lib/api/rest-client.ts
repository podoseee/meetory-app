import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * REST API 클라이언트
 * 팀원 백엔드 (Express.js + MySQL) 연동
 * 기본 URL: http://localhost:3000/api
 * 
 * 백엔드 구조:
 * - POST /auth/kakao, /auth/google, /auth/refresh
 * - GET/PUT /users/:id
 * - POST /users/:id/interests, /users/:id/location
 * - POST/GET /groups, /groups/:id/join, /groups/:id/leave
 * - GET /groups/:id/messages, POST /groups/:id/messages
 * - POST /footprints, GET /users/:id/footprints
 * - POST /reports, POST /users/:id/blocks
 */

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  userId: number;
}

export interface User {
  id: number;
  kakao_id?: string;
  google_id?: string;
  nickname: string;
  profile_img?: string;
  bio?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Interest {
  id: number;
  name: string;
  category: string;
}

export interface UserLocation {
  user_id: number;
  latitude: number;
  longitude: number;
  updated_at: string;
}

export interface Group {
  id: number;
  name: string;
  status: 'active' | 'expired' | 'met';
  max_members: number;
  expires_at: string;
  created_at: string;
}

export interface GroupMember {
  group_id: number;
  user_id: number;
  joined_at: string;
}

export interface Message {
  id: number;
  group_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

export interface Footprint {
  id: number;
  user_id: number;
  group_id: number;
  latitude: number;
  longitude: number;
  met_at: string;
}

export interface Report {
  id: number;
  reporter_id: number;
  target_id: number;
  reason: string;
  created_at: string;
}

class RestClient {
  private client: AxiosInstance;
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });

    // 요청 인터셉터: Authorization 헤더 자동 추가
    this.client.interceptors.request.use(
      async (config) => {
        const token = this.accessToken || (await SecureStore.getItemAsync('accessToken'));
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터: 401 에러 시 토큰 갱신
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            if (!refreshToken) {
              throw new Error('Refresh token not found');
            }

            const response = await axios.post(`${this.baseURL}/auth/refresh`, {
              refresh_token: refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            this.accessToken = accessToken;
            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            await this.logout();
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // ===== 인증 (Auth) =====

  async kakaoLogin(accessToken: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/kakao', {
      access_token: accessToken,
    });
    const { accessToken: token, refreshToken } = response.data;
    this.accessToken = token;
    await SecureStore.setItemAsync('accessToken', token);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    return response.data;
  }

  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/google', {
      id_token: idToken,
    });
    const { accessToken: token, refreshToken } = response.data;
    this.accessToken = token;
    await SecureStore.setItemAsync('accessToken', token);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    const { accessToken: token } = response.data;
    this.accessToken = token;
    await SecureStore.setItemAsync('accessToken', token);
    return response.data;
  }

  async logout(): Promise<void> {
    this.accessToken = null;
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }

  async setAccessToken(token: string): Promise<void> {
    this.accessToken = token;
  }

  // ===== 사용자 (Users) =====

  async getUserProfile(userId: number): Promise<User> {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  async updateUserProfile(userId: number, data: Partial<User>): Promise<User> {
    const response = await this.client.put(`/users/${userId}`, data);
    return response.data;
  }

  async addUserInterests(userId: number, interestIds: number[]): Promise<void> {
    await this.client.post(`/users/${userId}/interests`, {
      interest_ids: interestIds,
    });
  }

  async setUserLocation(userId: number, latitude: number, longitude: number): Promise<UserLocation> {
    const response = await this.client.post(`/users/${userId}/location`, {
      latitude,
      longitude,
    });
    return response.data;
  }

  async getInterests(): Promise<Interest[]> {
    const response = await this.client.get('/interests');
    return response.data;
  }

  // ===== 그룹/채팅 (Groups) =====

  async createGroup(name: string, maxMembers: number = 5): Promise<Group> {
    const response = await this.client.post('/groups', {
      name,
      max_members: maxMembers,
    });
    return response.data;
  }

  async getGroup(groupId: number): Promise<Group> {
    const response = await this.client.get(`/groups/${groupId}`);
    return response.data;
  }

  async listUserGroups(userId: number): Promise<Group[]> {
    const response = await this.client.get(`/users/${userId}/groups`);
    return response.data;
  }

  async joinGroup(groupId: number, userId: number): Promise<GroupMember> {
    const response = await this.client.post(`/groups/${groupId}/join`, {
      user_id: userId,
    });
    return response.data;
  }

  async leaveGroup(groupId: number, userId: number): Promise<void> {
    await this.client.post(`/groups/${groupId}/leave`, {
      user_id: userId,
    });
  }

  async findMatchingGroups(userId: number, interests?: number[]): Promise<Group[]> {
    const response = await this.client.get('/groups/matching', {
      params: {
        user_id: userId,
        interests: interests?.join(','),
      },
    });
    return response.data;
  }

  async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    const response = await this.client.get(`/groups/${groupId}/members`);
    return response.data;
  }

  // ===== 메시지 (Messages) =====

  async getGroupMessages(groupId: number, limit: number = 50): Promise<Message[]> {
    const response = await this.client.get(`/groups/${groupId}/messages`, {
      params: { limit },
    });
    return response.data;
  }

  async sendMessage(groupId: number, senderId: number, content: string): Promise<Message> {
    const response = await this.client.post(`/groups/${groupId}/messages`, {
      sender_id: senderId,
      content,
    });
    return response.data;
  }

  // ===== 발자취 (Footprints) =====

  async createFootprint(userId: number, groupId: number, latitude: number, longitude: number): Promise<Footprint> {
    const response = await this.client.post('/footprints', {
      user_id: userId,
      group_id: groupId,
      latitude,
      longitude,
    });
    return response.data;
  }

  async getUserFootprints(userId: number): Promise<Footprint[]> {
    const response = await this.client.get(`/users/${userId}/footprints`);
    return response.data;
  }

  // ===== 신고/차단 (Reports/Blocks) =====

  async reportUser(reporterId: number, targetId: number, reason: string): Promise<Report> {
    const response = await this.client.post('/reports', {
      reporter_id: reporterId,
      target_id: targetId,
      reason,
    });
    return response.data;
  }

  async blockUser(userId: number, blockedUserId: number): Promise<void> {
    await this.client.post(`/users/${userId}/blocks`, {
      blocked_user_id: blockedUserId,
    });
  }

  async getBlockedUsers(userId: number): Promise<User[]> {
    const response = await this.client.get(`/users/${userId}/blocks`);
    return response.data;
  }
}

export const restClient = new RestClient(
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'
);
