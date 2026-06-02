import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { AppHeader } from "@/components/meetory/app-header";
import { PrimaryButton } from "@/components/meetory/primary-button";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/meetory/auth-context";

export default function ChatListScreen() {
  const router = useRouter();
  const { chatRooms, bluetoothEnabled, setBluetoothEnabled } = useAuth();

  const handleMatch = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <ScreenContainer className="px-4" edges={["top", "left", "right"]}>
      <AppHeader title="채팅방" showSearch />

      <View className="bg-surface rounded-xl p-4 flex-row items-center justify-between mt-2 mb-4">
        <View className="flex-1 pr-3">
          <Text className="font-semibold text-foreground">블루투스 연결상태</Text>
          <Text className="text-xs text-muted mt-1 leading-4">
            주변에 관심사가 맞는 사람이 있으면 알림이 울려요!
          </Text>
        </View>
        <Switch
          value={bluetoothEnabled}
          onValueChange={setBluetoothEnabled}
          trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
          thumbColor={bluetoothEnabled ? "#7C3AED" : "#f4f3f4"}
        />
      </View>

      <View className="bg-surface rounded-2xl p-5 mb-5 items-center gap-3">
        <Text className="text-lg font-bold text-foreground">채팅방 매칭</Text>
        <Text className="text-sm text-muted text-center">
          마음에 드는 친구들을 매칭해보세요!
        </Text>
        <View className="w-full mt-1">
          <PrimaryButton label="매칭하기" onPress={handleMatch} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {chatRooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            onPress={() => router.push(`/chat/${room.id}`)}
            className="flex-row items-center gap-3 py-4 border-b border-border"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full bg-primary/15 items-center justify-center">
              <Text className="text-xl">💬</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">{room.name}</Text>
              <Text className="text-sm text-muted mt-0.5" numberOfLines={1}>
                {room.lastMessage}
              </Text>
            </View>
            <Text className="text-xs text-muted">{room.time}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity className="mt-4 py-3 items-center">
          <Text className="text-primary font-semibold">+ 새 채팅방 만들기</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
