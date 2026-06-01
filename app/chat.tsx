import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from "react-native";
import { useState, useEffect, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface Message {
  id: number;
  userId: number;
  nickname: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Member {
  id: number;
  nickname: string;
  interests: string[];
}

export default function ChatRoomScreen() {
  const colors = useColors();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      userId: 1,
      nickname: "러닝러버",
      content: "안녕하세요! 요즘 한강에서 뛰시는 분들 많으신가요?",
      timestamp: "10:30",
      isOwn: true,
    },
    {
      id: 2,
      userId: 2,
      nickname: "마라톤선수",
      content: "네, 요즘 날씨가 좋아서 한강에 사람이 많아요!",
      timestamp: "10:32",
      isOwn: false,
    },
    {
      id: 3,
      userId: 3,
      nickname: "조깅초보",
      content: "저도 한강에서 자주 뛰어요. 같이 뛸래요?",
      timestamp: "10:33",
      isOwn: false,
    },
  ]);

  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState("오늘 한강에서 뵌 분들 중에 정기적으로 뛰시는 분 있으세요?");
  const [members] = useState<Member[]>([
    { id: 1, nickname: "러닝러버", interests: ["러닝"] },
    { id: 2, nickname: "마라톤선수", interests: ["러닝", "피트니스"] },
    { id: 3, nickname: "조깅초보", interests: ["러닝"] },
  ]);

  const [showMembers, setShowMembers] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: Message = {
      id: messages.length + 1,
      userId: 1,
      nickname: "러닝러버",
      content: messageInput,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // TODO: Send message via API
  };

  const handleGetAISuggestion = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAISuggestion(true);

    // TODO: Fetch AI suggestion from API
  };

  const handleCopyAISuggestion = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Copy to clipboard
  };

  const handleUseSuggestion = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessageInput(aiSuggestion);
    setShowAISuggestion(false);
  };

  const handleLeaveRoom = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Leave chat room and navigate back
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`flex-row gap-2 mb-3 ${item.isOwn ? "justify-end" : "justify-start"}`}>
      {!item.isOwn && (
        <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center">
          <Text className="text-xs font-bold text-primary">{item.nickname[0]}</Text>
        </View>
      )}
      <View className={`max-w-xs gap-1 ${item.isOwn ? "items-end" : "items-start"}`}>
        {!item.isOwn && (
          <Text className="text-xs text-muted px-2">{item.nickname}</Text>
        )}
        <View
          className={`rounded-2xl px-4 py-2 ${
            item.isOwn ? "bg-primary" : "bg-surface"
          }`}
        >
          <Text className={`${item.isOwn ? "text-white" : "text-foreground"}`}>
            {item.content}
          </Text>
        </View>
        <Text className="text-xs text-muted px-2">{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-4 justify-between">
      {/* Header */}
      <View className="gap-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-foreground">러닝 모임 - 강남</Text>
            <Text className="text-sm text-muted mt-1">3명 참여 중</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowMembers(!showMembers)}
            className="w-10 h-10 rounded-full bg-surface items-center justify-center"
          >
            <Text className="text-lg">👥</Text>
          </TouchableOpacity>
        </View>

        {/* Members Modal */}
        {showMembers && (
          <View className="bg-surface rounded-xl p-4 gap-3">
            <Text className="font-semibold text-foreground">참여자</Text>
            {members.map((member) => (
              <View key={member.id} className="flex-row items-center justify-between pb-3 border-b border-border last:border-b-0">
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">{member.nickname}</Text>
                  <View className="flex-row gap-1 mt-1">
                    {member.interests.map((interest, idx) => (
                      <View key={idx} className="bg-primary/10 rounded px-2 py-1">
                        <Text className="text-xs font-semibold text-primary">{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <TouchableOpacity className="px-3 py-1 bg-error/10 rounded">
                  <Text className="text-xs font-semibold text-error">신고</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Messages */}
      <View className="flex-1 mb-4">
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      </View>

      {/* AI Suggestion */}
      {showAISuggestion && (
        <View className="bg-primary/10 rounded-xl p-4 mb-4 gap-3">
          <View className="flex-row items-start gap-2">
            <Text className="text-lg">💡</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground mb-2">AI 조언</Text>
              <Text className="text-sm text-foreground leading-relaxed">{aiSuggestion}</Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleCopyAISuggestion}
              className="flex-1 bg-primary/20 rounded-lg py-2 items-center"
            >
              <Text className="text-sm font-semibold text-primary">복사</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUseSuggestion}
              className="flex-1 bg-primary rounded-lg py-2 items-center"
            >
              <Text className="text-sm font-semibold text-white">사용</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Input Area */}
      <View className="gap-3">
        <View className="flex-row items-center gap-2">
          <TextInput
            value={messageInput}
            onChangeText={setMessageInput}
            placeholder="메시지를 입력하세요..."
            placeholderTextColor={colors.muted}
            className="flex-1 bg-surface rounded-full px-4 py-3 text-foreground"
            maxLength={1000}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!messageInput.trim()}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center disabled:opacity-50"
          >
            <Text className="text-lg">→</Text>
          </TouchableOpacity>
        </View>

        {/* AI Suggestion Button */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handleGetAISuggestion}
            className="flex-1 bg-primary/10 rounded-lg py-2 flex-row items-center justify-center gap-2"
          >
            <Text className="text-lg">💡</Text>
            <Text className="text-sm font-semibold text-primary">AI 조언</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLeaveRoom}
            className="flex-1 bg-error/10 rounded-lg py-2 flex-row items-center justify-center gap-2"
          >
            <Text className="text-lg">🚪</Text>
            <Text className="text-sm font-semibold text-error">나가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
