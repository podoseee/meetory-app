import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  userId: number;
  isNewUser: boolean;
}

interface UserProfile {
  id: number;
  nickname: string;
  profile_img?: string;
  kakao_id?: string;
  google_id?: string;
  interests?: string[];
  location?: string;
}

interface Group {
  id: number;
  name: string;
  interests: string[];
  location: string;
  member_count: number;
  created_at: string;
}

interface Message {
  id: number;
  group_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

class RestClient {
  private api: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // 요청 인터셉터: 토큰 추가
    this.api.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터: 401 시 토큰 갱신
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            if (refreshToken) {
              const { data } = await this.api.post('/auth/refresh', { refresh_token: refreshToken });
              this.accessToken = data.accessToken;
              await SecureStore.setItemAsync('accessToken', data.accessToken);
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
              return this.api(originalRequest);
            }
          } catch (err) {
            // 토큰 갱신 실패 - 로그아웃 처리
            await this.logout();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // ===== 인증 =====
  async kakaoLogin(accessToken: string): Promise<AuthTokens> {
    const { data } = await this.api.post('/auth/kakao', { access_token: accessToken });
    this.accessToken = data.accessToken;
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    return data;
  }

  async googleLogin(idToken: string): Promise<AuthTokens> {
    const { data } = await this.api.post('/auth/google', { id_token: idToken });
    this.accessToken = data.accessToken;
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    return data;
  }

  async logout(): Promise<void> {
    this.accessToken = null;
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }

  async setAccessToken(token: string): Promise<void> {
    this.accessToken = token;
  }

  // ===== 사용자 =====
  async getUserProfile(userId: number): Promise<UserProfile> {
    const { data } = await this.api.get(`/users/${userId}`);
    return data;
  }

  async updateUserProfile(userId: number, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data } = await this.api.put(`/users/${userId}`, updates);
    return data;
  }

  async addUserInterests(userId: number, interests: string[]): Promise<void> {
    await this.api.post(`/users/${userId}/interests`, { interests });
  }

  async setUserLocation(userId: number, location: string): Promise<void> {
    await this.api.post(`/users/${userId}/location`, { location });
  }

  // ===== 그룹 (채팅방) =====
  async createGroup(data: {
    name: string;
    interests: string[];
    location: string;
  }): Promise<Group> {
    const { data: group } = await this.api.post('/groups', data);
    return group;
  }

  async getGroup(groupId: number): Promise<Group> {
    const { data } = await this.api.get(`/groups/${groupId}`);
    return data;
  }

  async listUserGroups(userId: number): Promise<Group[]> {
    const { data } = await this.api.get(`/users/${userId}/groups`);
    return data;
  }

  async joinGroup(groupId: number): Promise<void> {
    await this.api.post(`/groups/${groupId}/join`);
  }

  async leaveGroup(groupId: number): Promise<void> {
    await this.api.post(`/groups/${groupId}/leave`);
  }

  async findMatchingGroups(interests: string[], location: string): Promise<Group[]> {
    const { data } = await this.api.get('/groups/matching', {
      params: { interests: interests.join(','), location },
    });
    return data;
  }

  // ===== 메시지 =====
  async getGroupMessages(groupId: number, limit: number = 50): Promise<Message[]> {
    const { data } = await this.api.get(`/groups/${groupId}/messages`, {
      params: { limit },
    });
    return data;
  }

  async sendMessage(groupId: number, content: string): Promise<Message> {
    const { data } = await this.api.post(`/groups/${groupId}/messages`, { content });
    return data;
  }

  // ===== 발자취 =====
  async createFootprint(data: {
    user_id: number;
    location: string;
    category: string;
  }): Promise<void> {
    await this.api.post('/footprints', data);
  }

  async getUserFootprints(userId: number): Promise<any[]> {
    const { data } = await this.api.get(`/users/${userId}/footprints`);
    return data;
  }

  async getPopularPlaces(interests: string[], location: string): Promise<any[]> {
    const { data } = await this.api.get('/footprints/popular', {
      params: { interests: interests.join(','), location },
    });
    return data;
  }

  // ===== 안전성 =====
  async blockUser(userId: number, blockedUserId: number): Promise<void> {
    await this.api.post(`/users/${userId}/block/${blockedUserId}`);
  }

  async unblockUser(userId: number, blockedUserId: number): Promise<void> {
    await this.api.delete(`/users/${userId}/block/${blockedUserId}`);
  }

  async reportUser(data: {
    reporter_id: number;
    reported_id: number;
    reason: string;
  }): Promise<void> {
    await this.api.post('/reports', data);
  }
}

export const restClient = new RestClient();
