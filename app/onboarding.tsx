import { ScrollView, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

type OnboardingStep = "nickname" | "interests" | "location" | "complete";

const INTERESTS = ["러닝", "카페", "영화", "게임", "독서", "요리", "여행", "음악", "스포츠", "기술"];
const LOCATIONS = ["강남", "홍대", "건대", "명동", "성수", "연남", "강북", "강동", "강서", "서초"];

export default function OnboardingScreen() {
  const colors = useColors();
  const [step, setStep] = useState<OnboardingStep>("nickname");
  const [nickname, setNickname] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step === "nickname" && nickname.trim()) {
      setStep("interests");
    } else if (step === "interests" && selectedInterests.length > 0) {
      setStep("location");
    } else if (step === "location" && selectedLocation) {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // TODO: Call profile creation API
      // await trpc.profile.create.mutate({
      //   nickname,
      //   interests: selectedInterests,
      //   location: selectedLocation,
      // });

      // Navigate to home
      setStep("complete");
    } catch (error) {
      console.error("Profile creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step === "interests") {
      setStep("nickname");
    } else if (step === "location") {
      setStep("interests");
    }
  };

  const isNextDisabled =
    (step === "nickname" && !nickname.trim()) ||
    (step === "interests" && selectedInterests.length === 0) ||
    (step === "location" && !selectedLocation);

  return (
    <ScreenContainer className="p-4 justify-between">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Meetory</Text>
            <Text className="text-sm text-muted mt-2">관심사로 만나는 사람들</Text>
          </View>

          {/* Progress Indicator */}
          <View className="flex-row gap-2">
            {["nickname", "interests", "location"].map((s) => (
              <View
                key={s}
                className={`flex-1 h-1 rounded-full ${
                  ["nickname", "interests", "location"].indexOf(s) <= ["nickname", "interests", "location"].indexOf(step)
                    ? "bg-primary"
                    : "bg-surface"
                }`}
              />
            ))}
          </View>

          {/* Step 1: Nickname */}
          {step === "nickname" && (
            <View className="gap-4">
              <View>
                <Text className="text-2xl font-bold text-foreground mb-2">익명 닉네임</Text>
                <Text className="text-sm text-muted">
                  2~20자의 닉네임을 입력하세요. 다른 사용자들에게 이 이름으로 보여집니다.
                </Text>
              </View>

              <TextInput
                value={nickname}
                onChangeText={setNickname}
                placeholder="닉네임 입력 (예: 러닝러버)"
                placeholderTextColor={colors.muted}
                className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                maxLength={20}
              />

              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted">{nickname.length}/20</Text>
                {nickname.length >= 2 && (
                  <Text className="text-xs text-success">✓ 사용 가능</Text>
                )}
              </View>
            </View>
          )}

          {/* Step 2: Interests */}
          {step === "interests" && (
            <View className="gap-4">
              <View>
                <Text className="text-2xl font-bold text-foreground mb-2">관심사 선택</Text>
                <Text className="text-sm text-muted">
                  최소 1개, 최대 5개의 관심사를 선택하세요.
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedInterests.includes(interest)
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        selectedInterests.includes(interest)
                          ? "text-white"
                          : "text-foreground"
                      }`}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted">선택됨: {selectedInterests.length}/5</Text>
                {selectedInterests.length > 0 && (
                  <Text className="text-xs text-success">✓ 선택 완료</Text>
                )}
              </View>
            </View>
          )}

          {/* Step 3: Location */}
          {step === "location" && (
            <View className="gap-4">
              <View>
                <Text className="text-2xl font-bold text-foreground mb-2">지역 선택</Text>
                <Text className="text-sm text-muted">
                  주로 활동하는 지역을 선택하세요.
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {LOCATIONS.map((location) => (
                  <TouchableOpacity
                    key={location}
                    onPress={() => handleLocationSelect(location)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedLocation === location
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
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

              {selectedLocation && (
                <Text className="text-xs text-success">✓ {selectedLocation} 선택됨</Text>
              )}
            </View>
          )}

          {/* Step 4: Complete */}
          {step === "complete" && (
            <View className="gap-4 items-center justify-center py-8">
              <Text className="text-5xl">🎉</Text>
              <Text className="text-2xl font-bold text-foreground text-center">프로필 설정 완료!</Text>
              <Text className="text-sm text-muted text-center">
                이제 같은 관심사를 가진 사람들과 만날 준비가 되었어요.
              </Text>
              <View className="gap-2 mt-4">
                <Text className="text-sm text-foreground font-semibold">닉네임: {nickname}</Text>
                <Text className="text-sm text-foreground font-semibold">관심사: {selectedInterests.join(", ")}</Text>
                <Text className="text-sm text-foreground font-semibold">지역: {selectedLocation}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      {step !== "complete" && (
        <View className="gap-3 mt-6">
          <TouchableOpacity
            onPress={handleNext}
            disabled={isNextDisabled || isLoading}
            className="bg-primary rounded-lg py-3 items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-white">
                {step === "location" ? "완료" : "다음"}
              </Text>
            )}
          </TouchableOpacity>

          {step !== "nickname" && (
            <TouchableOpacity
              onPress={handleBack}
              className="bg-surface rounded-lg py-3 items-center justify-center"
            >
              <Text className="font-semibold text-foreground">이전</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {step === "complete" && (
        <TouchableOpacity className="bg-primary rounded-lg py-3 items-center justify-center">
          <Text className="font-semibold text-white">시작하기</Text>
        </TouchableOpacity>
      )}
    </ScreenContainer>
  );
}
