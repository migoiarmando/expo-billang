import { View, Text, Platform } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Onboarding } from "@/components/onboarding";
import { StatusBar } from "expo-status-bar";

export default function OnboardingPage() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <View>
                <Onboarding />
                <View className="mb-[100px] absolute bottom-0 left-0 right-0 items-center gap-2">
                    <FontAwesome5 name="fingerprint" size={24} color="black" />
                    <Text className="font-lexend text-[12px]">
                        tap or swipe to next
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
