/* --------------------------------------------------------------------------------------------------------------

    Route -> "onboarding/ob.tsx"

    Last edited: 
        John Bicierro [Feb 22, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-1
    Feature Title: Onboarding Screen

-------------------------------------------------------------------------------------------------------------- */

import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Image } from "expo-image";
import { FontAwesome5 } from "@expo/vector-icons";

export default function OnboardingPage() {
    return (
        <SafeAreaView className="h-[500px] bg-[#0075B2]">
            <Pressable
                onPress={() => router.replace("/onboarding/ob2")}
                className="h-screen"
            >
                <View className="h-[459px] w-full flex items-center justify-end overflow-hidden">
                    <Image
                        source={require("@/assets/onboarding/ob0.png")}
                        style={{
                            position: "absolute",
                            width: 450,
                            height: 400,
                            padding: 23,
                            bottom: -80,
                        }}
                    />
                </View>
                <View className="h-[200px] flex items-center justify-start pt-10 gap-5">
                    <View className="flex flex-row gap-2">
                        <View className="w-[25px] h-[5px] rounded-full bg-[#0075B2]"></View>
                        <View className="w-[25px] h-[5px] rounded-full bg-[#999999]"></View>
                        <View className="w-[25px] h-[5px] rounded-full bg-[#999999]"></View>
                    </View>
                    <Text className="font-lexendBold text-[24px] text-[#0075B2] mt-[50px]">
                        Track all in one place
                    </Text>
                    <Text className="font-lexend text-[16px] text-center w-[280px]">
                        Easily track all your bills, expenses, and needs
                        seamlessly
                    </Text>
                </View>

                <View className="animate-pulse h-[120px] flex items-center justify-end gap-3">
                    <FontAwesome5
                        name="fingerprint"
                        size={24}
                        color="#999999"
                    />
                    <Text className="font-lexend text-[12px] text-[#999999]">
                        tap to next
                    </Text>
                </View>
            </Pressable>

            {/* Light status bar because of blue background */}
            <StatusBar style="light" />
        </SafeAreaView>
    );
}
