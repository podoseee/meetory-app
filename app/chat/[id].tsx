import { useRef, useState, useEffect } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { AIAssistant } from "@/components/meetory/ai-assistant";
import { AI_SUGGESTIONS, getChatMessages, getRoomName } from "@/lib/meetory/mock-data";
import type { ChatMessage } from "@/lib/meetory/types";
import { useColors } from "@/hooks/use-colors";
import { useWebSocket } from "@/lib/meetory/websocket-context";
import { useAuthContext } from "@/lib/meetory/auth-context";

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { profile } = useAuthContext();
  const { messages: wsMessages, sendMessage: wsSendMessage, joinRoom, leaveRoom, isConnected } = useWebSocket();
  const roomId = id ?? "1";
  const [messages, setMessages] = useState<ChatMessage[]>(() => getChatMessages(roomId));
  const [input, setInput] = useState("");
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const listRef = useRef<FlatList>(null);

  // WebSocket 입장
  useEffect(() => {
    if (profile) {
      joinRoom(parseInt(roomId), profile.id || Math.floor(Math.random() * 1000), profile.nickname || "익명");
    }
    return () => {
      leaveRoom();
    };
  }, [roomId, profile, joinRoom, leaveRoom]);

  const send = async () => {
    if (!input.trim()) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // WebSocket으로 메시지 전송
    wsSendMessage(input.trim());
    
    // 로컬 UI 업데이트
    const msg: ChatMessage = {
      id: String(Date.now()),
      nickname: "나",
      content: input.trim(),
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const showAiAdvice = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const tip = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];
    setAiTip(tip);
    setShowAI(true);
  };

  // WebSocket 메시지 추가
  useEffect(() => {
    wsMessages.forEach((wsMsg) => {
      if (wsMsg.type === "message") {
        const msg: ChatMessage = {
          id: String(Date.now()),
          nickname: wsMsg.nickname || "익명",
          content: wsMsg.content || "",
          time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
          isOwn: false,
        };
        setMessages((prev) => [...prev, msg]);
      }
    });
  }, [wsMessages]);

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <View className={`flex-row mb-3 gap-2 ${item.isOwn ? "justify-end" : "justify-start"}`}>
      {!item.isOwn ? (
        <View className="w-8 h-8 rounded-full bg-surface items-center justify-center">
          <Text className="text-xs font-bold text-primary">{item.nickname[0]}</Text>
        </View>
      ) : null}
      <View className={`max-w-[75%] ${item.isOwn ? "items-end" : "items-start"}`}>
        {!item.isOwn ? (
          <Text className="text-xs text-muted mb-1 ml-1">{item.nickname}</Text>
        ) : null}
        <View className={`rounded-2xl px-4 py-2.5 ${item.isOwn ? "bg-primary" : "bg-surface"}`}>
          <Text className={item.isOwn ? "text-white" : "text-foreground"}>{item.content}</Text>
        </View>
        <Text className="text-[10px] text-muted mt-1 px-1">{item.time}</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer edges={["top", "left", "right"]} className="flex-1">
      <AIAssistant
        message={aiTip || ""}
        visible={showAI && !!aiTip}
        onClose={() => setShowAI(false)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 px-4"
        keyboardVerticalOffset={8}
      >
        <View className="flex-row items-center py-3 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
            <Ionicons name="chevron-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-foreground flex-1">
            {getRoomName(roomId)} (4명)
          </Text>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          className="flex-1 py-3"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />



        <View className="flex-row items-center gap-2 pb-4 pt-2 border-t border-border">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={isConnected ? "메세지 입력하기..." : "연결 중..."}
            placeholderTextColor={colors.muted}
            className="flex-1 bg-surface rounded-full px-4 py-3 text-foreground"
            onSubmitEditing={send}
            editable={isConnected}
          />
          <TouchableOpacity onPress={showAiAdvice} className="w-10 h-10 items-center justify-center">
            <Ionicons name="flash" size={22} color="#7C3AED" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={send}
            disabled={!input.trim() || !isConnected}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center opacity-100 disabled:opacity-40"
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
