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

import { db } from "@/database";
import { user_tb } from "@/database/schema";
import { eq } from "drizzle-orm";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Info,
    Pencil,
    PhilippinePeso,
    RotateCw,
} from "lucide-react-native";
import { useRef, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TailoredBudgetScreen() {
    const [amount, setAmount] = useState("");

    const inputRef = useRef<TextInput>(null); // Create the ref
    const [title, setTitle] = useState("");

    // Save budget
    async function SaveBudget() {
        // Set the onboarding to true
        await db.update(user_tb).set({ onboarding: true });

        // Save budget details
        console.log(`[debug] amount: ${amount} | title: ${title}`);

        // Route home page
        router.replace("/");
        return;
    }

    // Ask me later
    async function LaterBudget() {
        // Set the onboarding to true
        await db.update(user_tb).set({ onboarding: true });

        // Route home page
        router.replace("/");
        return;
    }

    return (
        <SafeAreaView>
            <View className="mx-[20px] h-screen flex">
                {/* Header */}
                <View className="mt-[30px] flex-row items-center">
                    <Link href="/onboarding/ob5" asChild>
                        <Pressable>
                            <ChevronLeft color={"black"} size={20} />
                        </Pressable>
                    </Link>

                    <View className="flex-1 items-center">
                        <Text className="text-primary font-lexendSemiBold">
                            Edit your first tailored budget
                        </Text>
                    </View>
                </View>

                {/* Edit number */}
                <View className="items-center mt-[50px]">
                    <View className="flex-row items-center gap-1">
                        <Text className="font-lexend text-[20px]">$</Text>
                        <TextInput
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#3B3854"
                            className="font-lexend text-[32px]"
                            value={amount}
                            onChangeText={(text) => {
                                setAmount(text);
                            }}
                        />
                    </View>

                    <Text className="text-[12px] font-lexend text-gray-600">
                        Click me to edit
                    </Text>
                </View>

                {/* Input fields */}
                <View className="gap-[10px] mt-[50px]">
                    <View className="flex-row gap-[20px]">
                        <View className="flex-grow">
                            <Text className="mb-[20px] font-lexend">
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
                            <Text className="mb-[20px] font-lexend">
                                Duration
                            </Text>
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
                        <Pressable
                            className="flex-1"
                            onPress={() => inputRef.current?.focus()}
                        >
                            <TextInput
                                ref={inputRef}
                                placeholder="Title"
                                placeholderTextColor="#3B3854"
                                className="font-lexend"
                                value={title}
                                onChangeText={(text) => setTitle(text)}
                            />
                        </Pressable>
                        <Pencil color="#9D9D9D" size={12} />
                    </View>
                </View>

                {/* Budget Color */}
                <View className="mt-[20px] ">
                    <Text className="mb-[20px] font-lexend">Theme Color</Text>
                    <View className="flex-row justify-between ">
                        <View className="w-[50px] h-[50px] bg-[#E6E6E6] rounded-full"></View>
                        <View className="w-[50px] h-[50px] bg-[#FFE287] rounded-full"></View>
                        <View className="w-[50px] h-[50px] bg-[#FEC794] rounded-full"></View>
                        <View className="w-[50px] h-[50px] bg-[#FF8787] rounded-full"></View>
                        <View className="w-[50px] h-[50px] bg-[#9FE0A9] rounded-full"></View>
                        <View className="w-[50px] h-[50px] bg-[#FADDFF] rounded-full"></View>
                    </View>
                </View>

                <View className="absolute bottom-0 left-0 right-0 mb-[20px]">
                    <Pressable
                        onPress={SaveBudget}
                        className="mt-3 bg-primary py-3 rounded-lg flex items-center"
                    >
                        <Text className="font-lexend text-white">
                            Save Budget
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={LaterBudget}
                        className="mt-3 bg-bgBorder-2 py-3 rounded-lg flex items-center"
                    >
                        <Text className="font-lexend text-gray-700">
                            Ask me later
                        </Text>
                    </Pressable>
                </View>
            </View>

            <StatusBar style="dark" />
        </SafeAreaView>
    );
}
