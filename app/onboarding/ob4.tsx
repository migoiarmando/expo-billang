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

import { Link } from "expo-router";
import { ChevronDown, User } from "lucide-react-native";
import { View, Text, Button, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingPage4() {
    return (
        <SafeAreaView>
            <View className="pt-[100px] h-screen flex items-center justify-start">
                <Text className="text-[24px] font-lexendBold text-[#0075B2]">
                    Set up Profile
                </Text>

                <View className="mb-5 mt-[100px] flex items-center justify-center">
                    <View className="w-[100px] h-[100px] bg-bgBorder-2 rounded-full flex items-center justify-center">
                        <User color="#C9C9C9" size={50} />
                    </View>

                    {/* Form */}
                    <View className="mt-10 mb-5 flex gap-3 items-center">
                        <View className="flex flex-row gap-2">
                            <Text className="font-lexendBold text-[24px] text-center flex items-center justify-center">
                                I'm
                            </Text>
                            <TextInput
                                placeholder="John"
                                placeholderTextColor="#999999"
                                className="font-lexendBold text-[24px] underline"
                            />
                        </View>

                        <Text className="font-lexendBold text-[24px] text-center">
                            and the currency I use is
                        </Text>
                        <View className="flex flex-row items-center gap-1">
                            <Text className="font-lexendBold text-[24px] text-center text-[#999999]">
                                Philippine Peso ($)
                            </Text>
                            <ChevronDown color="#71717a" size={16} />
                        </View>
                    </View>
                    <Text className="font-lexend text-[12px] text-[#8F8F8F]">
                        Tap to edit, You can update this anytime.
                    </Text>
                </View>

                <Link href="/onboarding/ob5" asChild>
                    <Pressable className="py-3 px-[80px] bg-[#0075B2] rounded-full">
                        <Text className="text-white font-lexend">Continue</Text>
                    </Pressable>
                </Link>
            </View>
        </SafeAreaView>
    );
}
