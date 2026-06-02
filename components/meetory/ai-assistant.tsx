import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

interface AIAssistantProps {
  message: string;
  onClose: () => void;
  visible: boolean;
}

export function AIAssistant({ message, onClose, visible }: AIAssistantProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
      className="absolute bottom-20 right-4 z-50"
    >
      <View className="bg-white rounded-3xl p-4 shadow-lg border border-purple-200 max-w-xs">
        {/* 캐릭터 아바타 */}
        <View className="flex-row items-start gap-3 mb-3">
          <View className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 items-center justify-center">
            <Text className="text-lg">✨</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-purple-600 text-sm">Meetory 어시스턴트</Text>
          </View>
        </View>

        {/* 메시지 */}
        <View className="bg-purple-50 rounded-2xl p-3 mb-3">
          <Text className="text-sm text-foreground leading-5">{message}</Text>
        </View>

        {/* 닫기 버튼 */}
        <TouchableOpacity
          onPress={onClose}
          className="self-end bg-purple-100 rounded-full p-2"
        >
          <Ionicons name="close" size={16} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {/* 말풍선 꼬리 */}
      <View
        className="absolute bottom-0 right-4 w-0 h-0"
        style={{
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderTopWidth: 8,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: "#F3E8FF",
          marginTop: -1,
        }}
      />
    </Animated.View>
  );
}
