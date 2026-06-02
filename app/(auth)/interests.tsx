import { useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenFooter } from "@/components/meetory/screen-footer";
import { TagChip } from "@/components/meetory/tag-chip";
import { ScreenContainer } from "@/components/screen-container";
import { INTEREST_OPTIONS, MAX_INTERESTS } from "@/lib/meetory/constants";
import { useAuth } from "@/lib/meetory/auth-context";

export default function InterestsScreen() {
  const router = useRouter();
  const { saveInterests } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((s) => s !== item));
    } else if (selected.length < MAX_INTERESTS) {
      setSelected([...selected, item]);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    await saveInterests(selected);
    setLoading(false);
    router.push("/(auth)/welcome");
  };

  return (
    <ScreenContainer className="px-6" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 pt-8 gap-4">
        <Text className="text-2xl font-bold text-foreground">
          관심사를 선택해주세요{"\n"}
          <Text className="text-base font-normal text-muted">(최대 {MAX_INTERESTS}개)</Text>
        </Text>

        <View className="flex-row flex-wrap gap-2 mt-2">
          {INTEREST_OPTIONS.map((item) => (
            <TagChip
              key={item}
              label={item}
              selected={selected.includes(item)}
              onPress={() => toggle(item)}
              disabled={!selected.includes(item) && selected.length >= MAX_INTERESTS}
            />
          ))}
        </View>

        <Text className="text-sm text-muted mt-2">선택됨: {selected.length}/{MAX_INTERESTS}</Text>
      </View>

      <ScreenFooter
        label="다음"
        onPress={handleNext}
        disabled={selected.length === 0}
        loading={loading}
      />
    </ScreenContainer>
  );
}
