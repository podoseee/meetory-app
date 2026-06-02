import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useAuthContext } from "@/lib/meetory/auth-context";
import { useColors } from "@/hooks/use-colors";
import { TagChip } from "@/components/meetory/tag-chip";
import { INTERESTS, LOCATIONS } from "@/lib/meetory/mock-data";

export default function ProfileEditScreen() {
  const router = useRouter();
  const colors = useColors();
  const { profile, saveProfile, saveInterests } = useAuthContext();

  const [nickname, setNickname] = useState(profile?.nickname || "");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile?.interests || []
  );
  const [selectedLocation, setSelectedLocation] = useState(profile?.location || "");

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert("오류", "닉네임을 입력해주세요.");
      return;
    }

    if (selectedInterests.length === 0) {
      Alert.alert("오류", "최소 1개의 관심사를 선택해주세요.");
      return;
    }

    if (!selectedLocation) {
      Alert.alert("오류", "지역을 선택해주세요.");
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 프로필 업데이트
    saveProfile(nickname.trim(), "😊");
    await saveInterests(selectedInterests);

    Alert.alert("성공", "프로필이 업데이트되었습니다.");
    router.back();
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest].slice(0, 5)
    );
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* 헤더 */}
        <View className="flex-row items-center py-3 border-b border-border px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center -ml-2"
          >
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-foreground flex-1">프로필 수정</Text>
        </View>

        {/* 닉네임 */}
        <View className="px-4 py-4 gap-2">
          <Text className="text-sm font-semibold text-foreground">닉네임</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력하세요"
            placeholderTextColor={colors.muted}
            className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
            maxLength={20}
          />
          <Text className="text-xs text-muted">{nickname.length}/20</Text>
        </View>

        {/* 관심사 */}
        <View className="px-4 py-4 gap-3">
          <Text className="text-sm font-semibold text-foreground">관심사 (최대 5개)</Text>
          <View className="flex-row flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <TagChip
                key={interest}
                label={interest}
                selected={selectedInterests.includes(interest)}
                onPress={() => toggleInterest(interest)}
              />
            ))}
          </View>
        </View>

        {/* 지역 */}
        <View className="px-4 py-4 gap-3">
          <Text className="text-sm font-semibold text-foreground">지역</Text>
          <View className="flex-row flex-wrap gap-2">
            {LOCATIONS.map((location: string) => (
              <TouchableOpacity
                key={location}
                onPress={() => setSelectedLocation(location)}
                className={`px-4 py-2 rounded-full border ${
                  selectedLocation === location
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedLocation === location
                      ? "text-white"
                      : "text-foreground"
                  }`}
                >
                  {location}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 저장 버튼 */}
        <View className="px-4 py-4 gap-2">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-primary rounded-lg px-4 py-3 items-center"
          >
            <Text className="text-white font-semibold">저장</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-surface rounded-lg px-4 py-3 items-center border border-border"
          >
            <Text className="text-foreground font-semibold">취소</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
