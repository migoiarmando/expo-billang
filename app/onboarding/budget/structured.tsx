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

import { Input } from "@/components/input";
import { Image } from "expo-image";
import { Link } from "expo-router";
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    ChevronRight,
    Info,
    Pencil,
    PhilippinePeso,
    RotateCw,
} from "lucide-react-native";
import { View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TailoredBudgetScreen() {
    return (
        <SafeAreaView>
            <View className="mx-[20px] h-screen flex gap-5">
                <Link href="/onboarding/ob5" asChild>
                    <Pressable className="mt-[30px]">
                        <ArrowLeft color={"black"} size={20} />
                    </Pressable>
                </Link>

                <View className="flex-row justify-between items-center">
                    <Text className="text-[24px] text-primary font-lexendSemiBold">
                        Let's set up!
                    </Text>
                    <View className="bg-[#CDF0FF] py-2 px-3 rounded-lg flex-row items-center gap-1">
                        <Text className="text-primary text-[14px] font-lexend">
                            Structured Budget
                        </Text>
                        <ChevronDown color="#0075B2" size={14} />
                    </View>
                </View>

                <View className="flex items-center">
                    <Text className="underline font-lexend text-[20px] text-gray-600">
                        First Budget
                    </Text>
                    <Text className="text-[64px] text-[#2B3854] font-lexend">
                        $100
                    </Text>

                    <View className="mt-5 w-full flex-row justify-between">
                        <View className="flex-row gap-2">
                            <View className="rounded-full bg-[#FFE8CD] w-[40px] h-[40px] flex items-center justify-center">
                                <Text className="font-lexendBold text-[#F6921E]">
                                    50%
                                </Text>
                            </View>
                            <View className="flex justify-center">
                                <Text className="font-lexend text-[12px]">
                                    Needs
                                </Text>
                                <Text className="font-lexend text-[12px] text-gray-700">
                                    $50
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row gap-2">
                            <View className="rounded-full bg-[#FFD0CD] w-[40px] h-[40px] flex items-center justify-center">
                                <Text className="font-lexendBold text-[#F6451E]">
                                    30%
                                </Text>
                            </View>
                            <View className="flex justify-center">
                                <Text className="font-lexend text-[12px]">
                                    Wants
                                </Text>
                                <Text className="font-lexend text-[12px] text-gray-700">
                                    $30
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row gap-2">
                            <View className="rounded-full bg-[#FFF1CD] w-[40px] h-[40px] flex items-center justify-center">
                                <Text className="font-lexendBold text-[#F6931E]">
                                    20%
                                </Text>
                            </View>
                            <View className="flex justify-center">
                                <Text className="font-lexend text-[12px]">
                                    Savings
                                </Text>
                                <Text className="font-lexend text-[12px] text-gray-700">
                                    $20
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="gap-3">
                    <View className="flex-row gap-3">
                        <View className="flex-grow">
                            <Text className="mb-2 font-lexend">
                                Starting date
                            </Text>
                            <View className="py-3 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl">
                                <Calendar color="#9D9D9D" size={12} />
                                <TextInput
                                    placeholder="Today"
                                    className="font-lexend"
                                />
                            </View>
                        </View>
                        <View className="flex-grow">
                            <Text className="mb-2 font-lexend">Duration</Text>
                            <View className="py-3 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl">
                                <RotateCw color="#9D9D9D" size={12} />
                                <TextInput
                                    placeholder="Monthly"
                                    className="font-lexend"
                                />
                            </View>
                        </View>
                    </View>
                    <View className="py-3 px-5 flex-row justify-between items-center gap-2 bg-bgBorder-2 rounded-xl">
                        <TextInput
                            placeholder="Title"
                            className="font-lexend"
                        />
                        <Pencil color="#9D9D9D" size={12} />
                    </View>
                </View>

                <View>
                    <Text className="mb-2 font-lexend">Currency</Text>
                    <View className="py-3 px-5 flex-row items-center justify-between gap-2 bg-bgBorder-2 rounded-xl">
                        <TextInput
                            placeholder="Philippine Peso (PHP)"
                            className="font-lexend"
                        />
                        <PhilippinePeso color="#9D9D9D" size={12} />
                    </View>
                </View>

                <View>
                    <Text className="mb-3 font-lexend">Select Color</Text>
                    <View className="flex-row justify-between">
                        <View className="w-[50px] h-[50px] bg-system-red rounded-full"></View>
                        <View className="w-[50px] h-[50px] bg-system-red rounded-full"></View>
                        <View className="w-[50px] h-[50px] bg-system-red rounded-full"></View>
                        <View className="w-[50px] h-[50px] bg-system-red rounded-full"></View>
                        <View className="w-[50px] h-[50px] bg-system-red rounded-full"></View>
                        <View className="w-[50px] h-[50px] bg-system-red rounded-full"></View>
                    </View>
                </View>

                <View>
                    <Text className="mb-3 font-lexend">
                        Included Categories
                    </Text>
                    <View className="flex-row justify-between">
                        <View className="flex items-center gap-2">
                            <View className="w-[60px] h-[60px] bg-secondary rounded-xl"></View>
                            <Text className="font-lexend text-[12px]">All</Text>
                        </View>
                        <View className="flex items-center gap-2">
                            <View className="w-[60px] h-[60px] bg-secondary rounded-xl"></View>
                            <Text className="font-lexend text-[12px]">
                                Food
                            </Text>
                        </View>
                        <View className="flex items-center gap-2">
                            <View className="w-[60px] h-[60px] bg-secondary rounded-xl"></View>
                            <Text className="font-lexend text-[12px]">
                                Groceries
                            </Text>
                        </View>
                        <View className="flex items-center gap-2">
                            <View className="w-[60px] h-[60px] bg-secondary rounded-xl"></View>
                            <Text className="font-lexend text-[12px]">
                                Transit
                            </Text>
                        </View>
                        <View className="flex items-center gap-2">
                            <View className="w-[60px] h-[60px] bg-secondary rounded-xl"></View>
                            <Text className="font-lexend text-[12px]">
                                Work
                            </Text>
                        </View>
                    </View>
                </View>

                <Link href={"/"} asChild>
                    <Pressable className="mt-3 bg-primary py-3 rounded-lg flex items-center">
                        <Text className="font-lexend text-white">Continue</Text>
                    </Pressable>
                </Link>
            </View>
        </SafeAreaView>
    );
}
