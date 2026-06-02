import { Text, View } from "react-native";

export function MeetoryLogo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const bubble = size === "lg" ? "w-14 h-14" : "w-10 h-10";
  const title = size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <View className="items-center gap-3">
      <View className="flex-row items-center">
        <View className={`${bubble} rounded-2xl bg-[#3B82F6] items-center justify-center -mr-3 z-10`}>
          <Text className="text-2xl">💬</Text>
        </View>
        <View className={`${bubble} rounded-2xl bg-[#EF4444] items-center justify-center`}>
          <Text className="text-2xl">💬</Text>
        </View>
      </View>
      <Text className={`${title} font-bold text-foreground tracking-tight`}>Meetory</Text>
    </View>
  );
}
