import { useState } from "react";
import { Text, View, TextInput, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { ScreenFooter } from "@/components/meetory/screen-footer";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/meetory/auth-context-rest";
import { useColors } from "@/hooks/use-colors";

/**
 * 위치 설정 화면
 * 팀원 백엔드 REST API 기반
 * 좌표 기반 위치 저장 (latitude, longitude)
 */

export default function LocationSetupScreen() {
  const router = useRouter();
  const colors = useColors();
  const { saveLocation, isLoading } = useAuth();
  const [latitude, setLatitude] = useState("37.7749"); // 기본값: 샌프란시스코
  const [longitude, setLongitude] = useState("-122.4194");
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    try {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lon)) {
        Alert.alert("오류", "유효한 좌표를 입력해주세요.");
        return;
      }

      if (lat < -90 || lat > 90) {
        Alert.alert("오류", "위도는 -90 ~ 90 사이의 값이어야 합니다.");
        return;
      }

      if (lon < -180 || lon > 180) {
        Alert.alert("오류", "경도는 -180 ~ 180 사이의 값이어야 합니다.");
        return;
      }

      setIsSaving(true);
      await saveLocation(lat, lon);
      router.push("/(tabs)/footprint");
    } catch (error) {
      console.error("Location save error:", error);
      Alert.alert("오류", "위치 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer className="px-6" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 pt-8 gap-6">
        <View>
          <Text className="text-2xl font-bold text-foreground">위치를 설정해주세요</Text>
          <Text className="text-sm text-muted mt-2">
            좌표를 입력하여 주변 사용자와 매칭됩니다.
          </Text>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-sm text-muted">위도 (Latitude)</Text>
            <TextInput
              value={latitude}
              onChangeText={setLatitude}
              placeholder="예) 37.7749"
              placeholderTextColor={colors.muted}
              className="bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border"
              keyboardType="decimal-pad"
              editable={!isLoading && !isSaving}
            />
            <Text className="text-xs text-muted">범위: -90 ~ 90</Text>
          </View>

          <View className="gap-2">
            <Text className="text-sm text-muted">경도 (Longitude)</Text>
            <TextInput
              value={longitude}
              onChangeText={setLongitude}
              placeholder="예) -122.4194"
              placeholderTextColor={colors.muted}
              className="bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border"
              keyboardType="decimal-pad"
              editable={!isLoading && !isSaving}
            />
            <Text className="text-xs text-muted">범위: -180 ~ 180</Text>
          </View>

          <View className="bg-surface rounded-lg p-4 mt-2">
            <Text className="text-xs text-muted mb-2">
              💡 팁: 현재 위치를 가져오려면 GPS 권한이 필요합니다.
            </Text>
            <Text className="text-xs text-muted">
              테스트용 기본값: 샌프란시스코 (37.7749, -122.4194)
            </Text>
          </View>
        </View>
      </View>

      <ScreenFooter
        label={isSaving ? "저장 중..." : "완료"}
        onPress={handleNext}
        disabled={isLoading || isSaving}
      />
    </ScreenContainer>
  );
}
