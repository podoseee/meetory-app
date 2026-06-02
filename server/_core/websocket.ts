import { WebSocketServer } from "ws";
import { Server } from "http";
import { getDb as dbConnection } from "../db";
import { messages } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

interface WebSocketMessage {
  type: "join" | "message" | "leave" | "typing";
  chatRoomId: number;
  userId?: number;
  content?: string;
  nickname?: string;
  timestamp?: number;
}

interface ChatRoomClient {
  ws: any;
  userId: number;
  nickname: string;
  chatRoomId: number;
}

// 채팅방별 클라이언트 관리
const chatRoomClients = new Map<number, ChatRoomClient[]>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: any) => {
    console.log("[WebSocket] New connection");

    let currentClient: ChatRoomClient | null = null;

    ws.on("message", async (data: string) => {
      try {
        const message: WebSocketMessage = JSON.parse(data);

        switch (message.type) {
          case "join": {
            // 채팅방 입장
            if (!message.chatRoomId || !message.userId || !message.nickname) {
              ws.send(JSON.stringify({ type: "error", message: "Invalid join message" }));
              return;
            }

            currentClient = {
              ws,
              userId: message.userId,
              nickname: message.nickname,
              chatRoomId: message.chatRoomId,
            };

            // 채팅방 클라이언트 목록에 추가
            if (!chatRoomClients.has(message.chatRoomId)) {
              chatRoomClients.set(message.chatRoomId, []);
            }
            chatRoomClients.get(message.chatRoomId)!.push(currentClient);

            // 입장 알림 브로드캐스트
            broadcastToRoom(message.chatRoomId, {
              type: "user-joined",
              nickname: message.nickname,
              timestamp: Date.now(),
            });

            console.log(
              `[WebSocket] User ${message.userId} joined room ${message.chatRoomId}`
            );
            break;
          }

          case "message": {
            // 메시지 전송
            if (!currentClient || !message.content) {
              ws.send(JSON.stringify({ type: "error", message: "Invalid message" }));
              return;
            }

            const db = await dbConnection();
            if (!db) {
              ws.send(JSON.stringify({ type: "error", message: "Database connection failed" }));
              return;
            }

            // 데이터베이스에 메시지 저장
            try {
              await db.insert(messages).values({
                chatRoomId: currentClient.chatRoomId,
                userId: currentClient.userId,
                content: message.content,
                createdAt: new Date(),
              });
            } catch (err: any) {
              console.error("[WebSocket] Failed to save message:", err);
            }

            // 모든 클라이언트에게 메시지 브로드캐스트
            broadcastToRoom(currentClient.chatRoomId, {
              type: "message",
              userId: currentClient.userId,
              nickname: currentClient.nickname,
              content: message.content,
              timestamp: Date.now(),
            });

            console.log(
              `[WebSocket] Message from ${currentClient.nickname} in room ${currentClient.chatRoomId}`
            );
            break;
          }

          case "typing": {
            // 타이핑 상태 표시
            if (!currentClient) return;

            broadcastToRoom(currentClient.chatRoomId, {
              type: "user-typing",
              nickname: currentClient.nickname,
              timestamp: Date.now(),
            });
            break;
          }

          case "leave": {
            // 채팅방 퇴장
            if (!currentClient) return;

            removeClientFromRoom(currentClient.chatRoomId, currentClient);
            broadcastToRoom(currentClient.chatRoomId, {
              type: "user-left",
              nickname: currentClient.nickname,
              timestamp: Date.now(),
            });

            currentClient = null;
            break;
          }
        }
      } catch (err) {
        console.error("[WebSocket] Message parsing error:", err);
        ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
      }
    });

    ws.on("close", () => {
      if (currentClient) {
        removeClientFromRoom(currentClient.chatRoomId, currentClient);
        broadcastToRoom(currentClient.chatRoomId, {
          type: "user-left",
          nickname: currentClient.nickname,
          timestamp: Date.now(),
        });
      }
      console.log("[WebSocket] Connection closed");
    });

    ws.on("error", (err: any) => {
      console.error("[WebSocket] Error:", err);
    });
  });

  console.log("[WebSocket] Server initialized");
}

function broadcastToRoom(chatRoomId: number, message: any) {
  const clients = chatRoomClients.get(chatRoomId);
  if (!clients) return;

  const data = JSON.stringify(message);
  clients.forEach((client) => {
    // WebSocket.OPEN = 1
    if (client.ws.readyState === 1) {
      client.ws.send(data);
    }
  });
}

function removeClientFromRoom(chatRoomId: number, client: ChatRoomClient) {
  const clients = chatRoomClients.get(chatRoomId);
  if (!clients) return;

  const index = clients.indexOf(client);
  if (index > -1) {
    clients.splice(index, 1);
  }

  if (clients.length === 0) {
    chatRoomClients.delete(chatRoomId);
  }
}
