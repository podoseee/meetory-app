import { useState, useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { ScreenFooter } from "@/components/meetory/screen-footer";
import { TagChip } from "@/components/meetory/tag-chip";
import { ScreenContainer } from "@/components/screen-container";
import { MAX_INTERESTS } from "@/lib/meetory/constants";
import { useAuth } from "@/lib/meetory/auth-context-rest";
import { restClient, Interest } from "@/lib/api/rest-client";

/**
 * 관심사 선택 화면
 * 팀원 백엔드 REST API 기반
 * 관심사 ID 배열로 저장
 */

export default function InterestsScreen() {
  const router = useRouter();
  const { saveInterests, isLoading } = useAuth();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);

  // 관심사 목록 조회
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const data = await restClient.getInterests();
        setInterests(data);
      } catch (error) {
        console.error("Failed to fetch interests:", error);
      } finally {
        setIsLoadingInterests(false);
      }
    };
    fetchInterests();
  }, []);

  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((s) => s !== id));
    } else if (selectedIds.length < MAX_INTERESTS) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      await saveInterests(selectedIds);
      router.push("/(auth)/location-setup");
    } catch (error) {
      console.error("Failed to save interests:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingInterests) {
    return (
      <ScreenContainer className="px-6 items-center justify-center">
        <ActivityIndicator size="large" color="#7C3AED" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-6" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 pt-8 gap-4">
        <Text className="text-2xl font-bold text-foreground">
          관심사를 선택해주세요{"\n"}
          <Text className="text-base font-normal text-muted">(최대 {MAX_INTERESTS}개)</Text>
        </Text>

        <View className="flex-row flex-wrap gap-2 mt-2">
          {interests.map((interest) => (
            <TagChip
              key={interest.id}
              label={interest.name}
              selected={selectedIds.includes(interest.id)}
              onPress={() => toggle(interest.id)}
              disabled={!selectedIds.includes(interest.id) && selectedIds.length >= MAX_INTERESTS}
            />
          ))}
        </View>

        <Text className="text-sm text-muted mt-2">선택됨: {selectedIds.length}/{MAX_INTERESTS}</Text>
      </View>

      <ScreenFooter
        label={loading ? "저장 중..." : "다음"}
        onPress={handleNext}
        disabled={selectedIds.length === 0 || isLoading || loading}
        loading={loading}
      />
    </ScreenContainer>
  );
}
