import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3000";

export interface SocketMessage {
  id?: number;
  group_id: number;
  user_id: number;
  nickname: string;
  content: string;
  created_at?: string;
}

export interface SocketUser {
  id: number;
  nickname: string;
  profile_img?: string;
}

type SocketEventHandler = (data: any) => void;

class SocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<SocketEventHandler>> = new Map();
  private messageQueue: SocketMessage[] = [];
  private isConnected = false;

  async connect(accessToken: string, userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          auth: { token: accessToken, userId },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ["websocket", "polling"],
        });

        this.socket.on("connect", () => {
          console.log("Socket connected:", this.socket?.id);
          this.isConnected = true;
          this.emit("connected", {});
          resolve();
        });

        this.socket.on("disconnect", () => {
          console.log("Socket disconnected");
          this.isConnected = false;
          this.emit("disconnected", {});
        });

        this.socket.on("error", (error) => {
          console.error("Socket error:", error);
          this.emit("error", { error });
        });

        // 메시지 수신
        this.socket.on("message", (message: SocketMessage) => {
          this.emit("message", message);
        });

        // 사용자 입장
        this.socket.on("user_joined", (user: SocketUser) => {
          this.emit("user_joined", user);
        });

        // 사용자 퇴장
        this.socket.on("user_left", (user: SocketUser) => {
          this.emit("user_left", user);
        });

        // 타이핑 표시
        this.socket.on("user_typing", (data: { userId: number; nickname: string }) => {
          this.emit("user_typing", data);
        });

        // 타이핑 중지
        this.socket.on("user_stop_typing", (data: { userId: number }) => {
          this.emit("user_stop_typing", data);
        });

        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error("Socket connection timeout"));
          }
        }, 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // 그룹 입장
  joinGroup(groupId: number): void {
    if (this.socket?.connected) {
      this.socket.emit("join_group", { group_id: groupId });
    }
  }

  // 그룹 퇴장
  leaveGroup(groupId: number): void {
    if (this.socket?.connected) {
      this.socket.emit("leave_group", { group_id: groupId });
    }
  }

  // 메시지 전송
  sendMessage(groupId: number, content: string): void {
    if (this.socket?.connected) {
      this.socket.emit("send_message", {
        group_id: groupId,
        content,
      });
    } else {
      // 연결이 끊어진 경우 큐에 저장
      this.messageQueue.push({
        group_id: groupId,
        user_id: 0,
        nickname: "",
        content,
      });
    }
  }

  // 타이핑 표시
  startTyping(groupId: number): void {
    if (this.socket?.connected) {
      this.socket.emit("start_typing", { group_id: groupId });
    }
  }

  // 타이핑 중지
  stopTyping(groupId: number): void {
    if (this.socket?.connected) {
      this.socket.emit("stop_typing", { group_id: groupId });
    }
  }

  // 이벤트 리스너 등록
  on(event: string, handler: SocketEventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  // 이벤트 리스너 제거
  off(event: string, handler: SocketEventHandler): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  // 이벤트 발생
  private emit(event: string, data: any): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  // 연결 상태 확인
  isConnectedSocket(): boolean {
    return this.isConnected;
  }

  // 대기 중인 메시지 전송
  async flushMessageQueue(): Promise<void> {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message.group_id, message.content);
      }
    }
  }
}

export const socketClient = new SocketClient();
