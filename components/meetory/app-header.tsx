import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface AppHeaderProps {
  title: string;
  showSearch?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function AppHeader({ title, showSearch, onBack, right }: AppHeaderProps) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center gap-2 flex-1">
        {onBack ? (
          <TouchableOpacity onPress={onBack} className="w-10 h-10 items-center justify-center -ml-2">
            <Ionicons name="chevron-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        ) : null}
        <Text className="text-2xl font-bold text-foreground">{title}</Text>
      </View>
      {right}
      {showSearch && !right ? (
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="search-outline" size={22} color="#1F2937" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
