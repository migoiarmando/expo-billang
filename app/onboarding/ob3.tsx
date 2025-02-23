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

import {
    View,
    Text,
    FlatList,
    useWindowDimensions,
    Button,
    TouchableWithoutFeedback,
    Pressable,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useAssets } from "expo-asset";
import { FontAwesome5 } from "@expo/vector-icons";

export default function OnboardingPage3() {
    function nextRoute() {
        console.log("press");
        router.replace("/onboarding/ob4");
    }
    return (
        <SafeAreaView className="h-[500px] bg-[#0075B2]">
            <Pressable onPress={nextRoute} className="h-screen">
                <View className="h-[459px] w-full flex items-center justify-end overflow-hidden">
                    <Image
                        source={require("@/assets/onboarding/ob2.png")}
                        style={{
                            position: "absolute",
                            width: 450,
                            height: 400,
                            padding: 23,
                            bottom: -60,
                        }}
                    />
                </View>
                <View className="h-[200px] flex items-center justify-start pt-10 gap-10">
                    <View className="flex flex-row gap-2">
                        <View className="w-[25px] h-[5px] rounded-full bg-[#999999]"></View>
                        <View className="w-[25px] h-[5px] rounded-full bg-[#999999]"></View>
                        <View className="w-[25px] h-[5px] rounded-full bg-[#0075B2]"></View>
                    </View>
                    <Text className="font-lexendBold text-[24px] text-center text-[#0075B2] w-[350px] mt-[50px]">
                        Start your financial journey with Billang
                    </Text>
                </View>

                <View className="h-[120px] flex items-center justify-end gap-3">
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
