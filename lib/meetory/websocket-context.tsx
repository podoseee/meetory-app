import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import Constants from "expo-constants";

export interface ChatMessage {
  type: "message" | "user-joined" | "user-left" | "user-typing" | "error";
  userId?: number;
  nickname?: string;
  content?: string;
  timestamp?: number;
  message?: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  joinRoom: (chatRoomId: number, userId: number, nickname: string) => void;
  leaveRoom: () => void;
  setTyping: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

function getWebSocketUrl(): string {
  try {
    // 프로덕션 환경
    if (!__DEV__) {
      return "wss://meetory-api.example.com/ws";
    }

    // Expo Go 환경에서 실제 IP 주소 감지
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.debuggerHost;
    if (debuggerHost) {
      const host = debuggerHost.split(":")[0];
      return `ws://${host}:3000/ws`;
    }

    // 에뮬레이터 환경 (Android)
    if (Platform.OS === "android") {
      return "ws://10.0.2.2:3000/ws";
    }

    // 기본값 (로컬 개발)
    return "ws://localhost:3000/ws";
  } catch (error) {
    console.warn("[WebSocket] URL 감지 실패, 기본값 사용:", error);
    return "ws://localhost:3000/ws";
  }
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<{
    chatRoomId: number;
    userId: number;
    nickname: string;
  } | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // WebSocket 연결
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsUrl = getWebSocketUrl();
        console.log("[WebSocket] 연결 시도:", wsUrl);

        const webSocket = new WebSocket(wsUrl);

        webSocket.onopen = () => {
          console.log("[WebSocket] 연결됨");
          setIsConnected(true);
          setReconnectAttempts(0);
          
          // Haptics 안전하게 호출
          if (Platform.OS !== "web") {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (e) {
              console.warn("[WebSocket] Haptics 호출 실패:", e);
            }
          }
        };

        webSocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as ChatMessage;
            console.log("[WebSocket] 메시지 수신:", message);
            setMessages((prev) => [...prev, message]);
          } catch (e) {
            console.error("[WebSocket] 메시지 파싱 실패:", e);
          }
        };

        webSocket.onerror = (error) => {
          console.error("[WebSocket] 오류:", error);
          setIsConnected(false);
          
          if (Platform.OS !== "web") {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } catch (e) {
              console.warn("[WebSocket] Haptics 호출 실패:", e);
            }
          }
        };

        webSocket.onclose = () => {
          console.log("[WebSocket] 연결 종료");
          setIsConnected(false);
          
          // 자동 재연결 (최대 5회)
          if (reconnectAttempts < 5) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            console.log(`[WebSocket] ${delay}ms 후 재연결 시도 (${reconnectAttempts + 1}/5)`);
            setTimeout(() => {
              setReconnectAttempts((prev) => prev + 1);
              connectWebSocket();
            }, delay);
          }
        };

        setWs(webSocket);
      } catch (error) {
        console.error("[WebSocket] 연결 초기화 실패:", error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [reconnectAttempts]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!ws || !currentRoom) {
        console.warn("[WebSocket] 연결 또는 채팅방 정보 없음");
        return;
      }

      try {
        const message = {
          type: "message",
          chatRoomId: currentRoom.chatRoomId,
          userId: currentRoom.userId,
          nickname: currentRoom.nickname,
          content,
          timestamp: Date.now(),
        };
        ws.send(JSON.stringify(message));
        console.log("[WebSocket] 메시지 전송:", message);
      } catch (error) {
        console.error("[WebSocket] 메시지 전송 실패:", error);
      }
    },
    [ws, currentRoom]
  );

  const joinRoom = useCallback(
    (chatRoomId: number, userId: number, nickname: string) => {
      if (!ws) {
        console.warn("[WebSocket] 연결 없음");
        return;
      }

      try {
        const message = {
          type: "join",
          chatRoomId,
          userId,
          nickname,
          timestamp: Date.now(),
        };
        ws.send(JSON.stringify(message));
        setCurrentRoom({ chatRoomId, userId, nickname });
        console.log("[WebSocket] 채팅방 입장:", message);
      } catch (error) {
        console.error("[WebSocket] 입장 실패:", error);
      }
    },
    [ws]
  );

  const leaveRoom = useCallback(() => {
    if (!ws || !currentRoom) return;

    try {
      const message = {
        type: "leave",
        chatRoomId: currentRoom.chatRoomId,
        userId: currentRoom.userId,
        timestamp: Date.now(),
      };
      ws.send(JSON.stringify(message));
      setCurrentRoom(null);
      setMessages([]);
      console.log("[WebSocket] 채팅방 퇴장:", message);
    } catch (error) {
      console.error("[WebSocket] 퇴장 실패:", error);
    }
  }, [ws, currentRoom]);

  const setTyping = useCallback(() => {
    if (!ws || !currentRoom) return;

    try {
      const message = {
        type: "typing",
        chatRoomId: currentRoom.chatRoomId,
        userId: currentRoom.userId,
        nickname: currentRoom.nickname,
        timestamp: Date.now(),
      };
      ws.send(JSON.stringify(message));
    } catch (error) {
      console.error("[WebSocket] 타이핑 상태 전송 실패:", error);
    }
  }, [ws, currentRoom]);

  const value: WebSocketContextType = {
    isConnected,
    messages,
    sendMessage,
    joinRoom,
    leaveRoom,
    setTyping,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
}
