import { useRef, useState } from "react";
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
import { AI_SUGGESTIONS, getChatMessages, getRoomName } from "@/lib/meetory/mock-data";
import type { ChatMessage } from "@/lib/meetory/types";
import { useColors } from "@/hooks/use-colors";

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const roomId = id ?? "1";
  const [messages, setMessages] = useState<ChatMessage[]>(() => getChatMessages(roomId));
  const [input, setInput] = useState("");
  const [aiTip, setAiTip] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  const send = async () => {
    if (!input.trim()) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
  };

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

        {aiTip ? (
          <View className="bg-primary/10 rounded-xl p-3 mb-2">
            <Text className="text-xs font-semibold text-primary mb-1">AI 조력자 조언</Text>
            <Text className="text-sm text-foreground">{aiTip}</Text>
            <TouchableOpacity onPress={() => setInput(aiTip)} className="mt-2">
              <Text className="text-xs text-primary font-semibold">입력창에 넣기</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View className="flex-row items-center gap-2 pb-4 pt-2 border-t border-border">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="메세지 입력하기..."
            placeholderTextColor={colors.muted}
            className="flex-1 bg-surface rounded-full px-4 py-3 text-foreground"
            onSubmitEditing={send}
          />
          <TouchableOpacity onPress={showAiAdvice} className="w-10 h-10 items-center justify-center">
            <Ionicons name="flash" size={22} color="#7C3AED" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={send}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center opacity-100 disabled:opacity-40"
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
