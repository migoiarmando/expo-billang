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

import { Image } from "expo-image";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Info,
} from "lucide-react-native";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingPage5() {
    return (
        <SafeAreaView>
            <View className="mx-[20px] h-screen">
                <Link href="/onboarding/ob4" asChild>
                    <Pressable className="mt-[30px]">
                        <ChevronLeft color={"black"} size={20} />
                    </Pressable>
                </Link>

                <Text className="mt-[100px] font-lexendBold text-[24px] text-center text-[#0075B2]">
                    How do you manage your budget?
                </Text>
                <View className="mt-[100px] flex gap-5">
                    {/* Tailored */}
                    <Link href="/onboarding/budget/tailored" asChild>
                        <Pressable className="overflow-hidden bg-bgBorder-1 rounded-lg px-[20px] py-[15px] flex flex-row items-center justify-between">
                            <Image
                                source={require("@/assets/onboarding/vector0.png")}
                                style={{
                                    position: "absolute",
                                    width: 100,
                                    height: 65,

                                    right: 20,
                                    bottom: 0,
                                }}
                            />

                            <View className="flex gap-2">
                                <Text className="font-lexendBold text-[16px]">
                                    I prefer a tailored approach
                                </Text>
                                <Text className="font-lexend text-[12px] text-[#8F8F8F]">
                                    Adapts to your spending habits and financial
                                    goals based on your inputs.
                                </Text>
                            </View>
                            <ChevronRight color={"black"} size={16} />
                        </Pressable>
                    </Link>

                    {/* Structured */}
                    <Link href="/onboarding/budget/structured" asChild>
                        <Pressable className="overflow-hidden bg-bgBorder-1 rounded-lg px-[20px] py-[15px] flex flex-row items-center justify-between">
                            <Image
                                source={require("@/assets/onboarding/vector1.png")}
                                style={{
                                    position: "absolute",
                                    width: 80,
                                    height: 80,

                                    right: 0,
                                    bottom: -20,
                                }}
                            />

                            <View className="flex gap-2">
                                <Text className="font-lexendBold text-[16px]">
                                    I like a structured plan
                                </Text>
                                <Text className="font-lexend text-[12px] text-[#8F8F8F]">
                                    50% for needs, 30% for wants, and 20% for
                                    savings.
                                </Text>
                            </View>
                            <ChevronRight color={"black"} size={16} />
                        </Pressable>
                    </Link>

                    {/* Learn More */}
                    <View className="bg-bgBorder-1 rounded-lg px-[20px] py-[15px] flex flex-row items-center justify-between">
                        <View className="flex gap-2">
                            <Text className="font-lexendBold text-[16px]">
                                Learn more
                            </Text>
                            <Text className="font-lexend text-[12px] text-[#8F8F8F]">
                                Click this to know more about the budget types.
                            </Text>
                        </View>
                        <Info color={"black"} size={16} />
                    </View>
                </View>
            </View>

            <StatusBar style="dark" />
        </SafeAreaView>
    );
}
