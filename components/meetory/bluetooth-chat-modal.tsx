import { View, Text, TouchableOpacity, Modal, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";

interface BluetoothChatModalProps {
  visible: boolean;
  locationName: string;
  onAccept: () => void;
  onReject: () => void;
}

export function BluetoothChatModal({
  visible,
  locationName,
  onAccept,
  onReject,
}: BluetoothChatModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, scaleAnim]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
          className="bg-white rounded-3xl p-6 mx-6 max-w-sm shadow-2xl"
        >
          {/* 아이콘 */}
          <View className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 items-center justify-center self-center mb-4">
            <Ionicons name="bluetooth" size={32} color="#fff" />
          </View>

          {/* 제목 */}
          <Text className="text-xl font-bold text-foreground text-center mb-2">
            새로운 채팅방 발견!
          </Text>

          {/* 위치 정보 */}
          <View className="bg-blue-50 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="location" size={18} color="#3B82F6" />
              <Text className="text-sm font-semibold text-blue-600">주변 위치</Text>
            </View>
            <Text className="text-base font-bold text-foreground">{locationName}</Text>
            <Text className="text-xs text-muted mt-2">
              같은 관심사를 가진 사람들이 모이고 있어요!
            </Text>
          </View>

          {/* 설명 */}
          <Text className="text-sm text-muted text-center mb-6 leading-5">
            이 위치에서 관심사가 맞는 사람들과 채팅방을 시작해보세요.
          </Text>

          {/* 버튼 */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={onAccept}
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full py-3 items-center"
            >
              <Text className="font-bold text-white text-base">입장하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onReject}
              className="bg-gray-100 rounded-full py-3 items-center"
            >
              <Text className="font-semibold text-foreground text-base">나중에</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
