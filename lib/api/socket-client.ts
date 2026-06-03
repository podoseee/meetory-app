import { io, Socket } from 'socket.io-client';
import { EventEmitter } from 'events';

/**
 * Socket.io 클라이언트
 * 팀원 백엔드 (Express.js + Socket.io) 실시간 채팅 연동
 * 
 * 이벤트:
 * - connected: 연결 성공
 * - disconnected: 연결 해제
 * - error: 에러 발생
 * - message: 메시지 수신
 * - user_joined: 사용자 입장
 * - user_left: 사용자 퇴장
 * - typing: 타이핑 상태
 */

export interface SocketMessage {
  id: number;
  group_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

export interface SocketUser {
  id: number;
  nickname: string;
  profile_img?: string;
}

class SocketClient extends EventEmitter {
  private socket: Socket | null = null;
  private url: string;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor(url: string = 'http://localhost:3000') {
    super();
    this.url = url;
  }

  /**
   * Socket.io 연결
   */
  connect(accessToken: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(this.url, {
      auth: {
        token: accessToken,
      },
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      transports: ['websocket', 'polling'],
    });

    // 연결 성공
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected', {});
    });

    // 연결 해제
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
      this.emit('disconnected', {});
    });

    // 에러
    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
      this.emit('error', { error });
    });

    // 메시지 수신
    this.socket.on('message', (message: SocketMessage) => {
      this.emit('message', message);
    });

    // 사용자 입장
    this.socket.on('user_joined', (user: SocketUser) => {
      this.emit('user_joined', user);
    });

    // 사용자 퇴장
    this.socket.on('user_left', (user: SocketUser) => {
      this.emit('user_left', user);
    });

    // 타이핑 상태
    this.socket.on('typing', (data: { user_id: number; is_typing: boolean }) => {
      this.emit('typing', data);
    });

    // 재연결 시도
    this.socket.on('reconnect_attempt', () => {
      this.reconnectAttempts++;
      console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    });

    // 재연결 실패
    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      this.emit('error', { error: 'Reconnection failed' });
    });
  }

  /**
   * 그룹 입장
   */
  joinGroup(groupId: number, userId: number): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('join_group', {
      group_id: groupId,
      user_id: userId,
    });
  }

  /**
   * 그룹 퇴장
   */
  leaveGroup(groupId: number, userId: number): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('leave_group', {
      group_id: groupId,
      user_id: userId,
    });
  }

  /**
   * 메시지 전송
   */
  sendMessage(groupId: number, senderId: number, content: string): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('send_message', {
      group_id: groupId,
      sender_id: senderId,
      content,
    });
  }

  /**
   * 타이핑 상태 전송
   */
  setTyping(groupId: number, userId: number, isTyping: boolean): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('typing', {
      group_id: groupId,
      user_id: userId,
      is_typing: isTyping,
    });
  }

  /**
   * 연결 해제
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * 연결 상태 확인
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Socket ID 반환
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const socketClient = new SocketClient(
  process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000'
);
