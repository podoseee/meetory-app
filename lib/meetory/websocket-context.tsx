import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as Haptics from "expo-haptics";

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

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<{
    chatRoomId: number;
    userId: number;
    nickname: string;
  } | null>(null);

  // WebSocket 연결
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // 개발 환경에서는 localhost:3000을 사용
        // 프로덕션에서는 실제 서버 URL을 사용
        const wsUrl = __DEV__
          ? "ws://localhost:3000/ws"
          : "wss://your-production-domain.com/ws";

        const webSocket = new WebSocket(wsUrl);

        webSocket.onopen = () => {
          console.log("[WebSocket] Connected");
          setIsConnected(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        };

        webSocket.onmessage = (event) => {
          try {
            const message: ChatMessage = JSON.parse(event.data);
            setMessages((prev) => [...prev, message]);
            console.log("[WebSocket] Message received:", message);
          } catch (err) {
            console.error("[WebSocket] Failed to parse message:", err);
          }
        };

        webSocket.onerror = (error) => {
          console.error("[WebSocket] Error:", error);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        };

        webSocket.onclose = () => {
          console.log("[WebSocket] Disconnected");
          setIsConnected(false);
          // 5초 후 재연결 시도
          setTimeout(connectWebSocket, 5000);
        };

        setWs(webSocket);
      } catch (err) {
        console.error("[WebSocket] Connection failed:", err);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const joinRoom = useCallback(
    (chatRoomId: number, userId: number, nickname: string) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.error("[WebSocket] WebSocket not connected");
        return;
      }

      setCurrentRoom({ chatRoomId, userId, nickname });
      setMessages([]);

      ws.send(
        JSON.stringify({
          type: "join",
          chatRoomId,
          userId,
          nickname,
        })
      );

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [ws]
  );

  const leaveRoom = useCallback(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !currentRoom) {
      return;
    }

    ws.send(
      JSON.stringify({
        type: "leave",
        chatRoomId: currentRoom.chatRoomId,
      })
    );

    setCurrentRoom(null);
    setMessages([]);
  }, [ws, currentRoom]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!ws || ws.readyState !== WebSocket.OPEN || !currentRoom) {
        console.error("[WebSocket] Cannot send message: not connected or not in room");
        return;
      }

      ws.send(
        JSON.stringify({
          type: "message",
          chatRoomId: currentRoom.chatRoomId,
          content,
        })
      );

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [ws, currentRoom]
  );

  const setTyping = useCallback(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !currentRoom) {
      return;
    }

    ws.send(
      JSON.stringify({
        type: "typing",
        chatRoomId: currentRoom.chatRoomId,
      })
    );
  }, [ws, currentRoom]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        messages,
        sendMessage,
        joinRoom,
        leaveRoom,
        setTyping,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
}
