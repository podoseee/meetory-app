import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ScreenFooter } from "@/components/meetory/screen-footer";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/meetory/auth-context-rest";

/**
 * 약관 동의 화면
 * 팀원 백엔드 REST API 기반
 */

function CheckRow({
  label,
  checked,
  onToggle,
  required,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  required?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onToggle} className="flex-row items-center gap-3 py-3">
      <View
        className={`w-6 h-6 rounded-md border items-center justify-center ${
          checked ? "bg-primary border-primary" : "border-border bg-white"
        }`}
      >
        {checked ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
      </View>
      <Text className="flex-1 text-foreground">
        {required ? "(필수) " : "(선택) "}
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function TermsScreen() {
  const router = useRouter();
  const { acceptTerms } = useAuth();
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const allChecked = terms && privacy;
  const agreeAll = terms && privacy && marketing;

  const toggleAll = () => {
    const next = !agreeAll;
    setTerms(next);
    setPrivacy(next);
    setMarketing(next);
  };

  const handleNext = () => {
    // 약관 동의 처리
    acceptTerms();
    router.push("/(auth)/profile-setup");
  };

  return (
    <ScreenContainer className="px-6" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 pt-8">
        <Text className="text-2xl font-bold text-foreground mb-8">약관에 동의해주세요</Text>

        <CheckRow label="전체 동의" checked={agreeAll} onToggle={toggleAll} />
        <View className="h-px bg-border my-2" />
        <CheckRow label="이용약관" checked={terms} onToggle={() => setTerms(!terms)} required />
        <CheckRow label="개인정보 처리방침" checked={privacy} onToggle={() => setPrivacy(!privacy)} required />
        <CheckRow label="마케팅 정보 수신" checked={marketing} onToggle={() => setMarketing(!marketing)} />
      </View>

      <ScreenFooter label="다음" onPress={handleNext} disabled={!allChecked} />
    </ScreenContainer>
  );
}
