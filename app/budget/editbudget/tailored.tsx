/* --------------------------------------------------------------------------------------------------------------

    Route -> "onboarding/ob.tsx"

    Last edited: 
        Miguel Armand B. Sta. Ana [May 18, 2025]
        John Bicierro [Feb 22, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-1
    Feature Title: Onboarding Screen

-------------------------------------------------------------------------------------------------------------- */

import { db } from "@/database";
import { budget_tb, user_tb } from "@/database/schema";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Calendar, ChevronLeft, Pencil, RotateCw } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActivityLogStore } from "@/utils/activityLogStore";
const addLog = useActivityLogStore.getState().addLog;

// Add this type definition
type ThemeColorKey =
    | "#E6E6E6"
    | "#87CDFF"
    | "#FEC794"
    | "#FF8787"
    | "#9FE0A9"
    | "#FADDFF";

export default function TailoredBudgetScreen() {
    const inputRef = useRef<TextInput>(null);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedColor, setSelectedColor] = useState<ThemeColorKey>("#E6E6E6");

    const THEME_COLORS: Record<ThemeColorKey, { content: string }> = {
        "#E6E6E6": { content: "#F6F6F6" }, // Gray
        "#87CDFF": { content: "#BAE4FC" }, // Blue
        "#FEC794": { content: "#FFEDDD" }, // Orange
        "#FF8787": { content: "#FFD1D1" }, // Red
        "#9FE0A9": { content: "#DEFDD3" }, // Green
        "#FADDFF": { content: "#E4A8C5" }, // Pink
    };

    const THEME_COLOR_LIST = Object.keys(THEME_COLORS);

    const [onboarding, setOnboarding] = useState<boolean | null>(null);
    useEffect(() => {
        async function fetchUser() {
            try {
                const [user] = await db.select().from(user_tb);
                setOnboarding(user.onboarding);
            } catch (err) {
                console.error("[error] Failed to fetch user.onboarding:", err);
            }
        }
        fetchUser();
    }, []);

    async function SaveBudget() {
        try {
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount)) {
                console.error("[error] Invalid amount entered:", amount);
                return;
            }

            await db.insert(budget_tb).values([
                {
                    title: title.trim() || "Budget",
                    amount: numericAmount,
                    themeColor: selectedColor,
                    contentColor: THEME_COLORS[selectedColor].content,
                },
            ]);

            // Add activity log here, after successful save
            addLog({
                type: "budget",
                message: `You have created a budget for ${title} containing ₱${Number(amount).toLocaleString()}.`,
            });

            if (!onboarding) {
                await db.update(user_tb).set({ onboarding: true });
                router.replace("/");
            } else {
                router.replace("..");
            }
        } catch (error) {
            console.error("[error] Failed to save budget:", error);
        }
    }

    async function LaterBudget() {
        try {
            await db.update(user_tb).set({ onboarding: true });
            router.replace("/");
        } catch (error) {
            console.error("[error] Failed to update user.onboarding:", error);
        }
        return;
    }

    return (
        <SafeAreaView>
            <View className="mx-[20px] h-screen flex">
                {/* Header */}
                <View className="mt-[30px] flex-row items-center">
                    <Link href=".." asChild>
                        <Pressable>
                            <ChevronLeft color={"black"} size={20} />
                        </Pressable>
                    </Link>

                    <View className="flex-1 items-center">
                        <Text className="text-primary font-lexendSemiBold">
                            Edit your tailored budget
                        </Text>
                    </View>
                </View>

                {/* Edit number */}
                <View className="items-center mt-[50px]">
                    <View className="flex-row items-center gap-1">
                        <Text className="font-lexend text-[20px]">₱</Text>
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
                    {/* <View className="flex-row gap-[20px]">
                        <View className="flex-grow">
                            <Text className="mb-[20px] font-lexend">Starting date</Text>
                            <View className="py-3 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl">
                                <Calendar color="#9D9D9D" size={12} />
                                <TextInput placeholder="Today" className="font-lexend" />
                            </View>
                        </View>
                        <View className="flex-grow">
                            <Text className="mb-[20px] font-lexend">Duration</Text>
                            <View className="py-3 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl">
                                <RotateCw color="#9D9D9D" size={12} />
                                <TextInput
                                    placeholder="Monthly"
                                    className="font-lexend"
                                />
                            </View>
                        </View>
                    </View> */}

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
                    <View className="flex-row justify-between">
                        {THEME_COLOR_LIST.map((color) => (
                            <Pressable
                                key={color}
                                onPress={() => setSelectedColor(color as ThemeColorKey)}
                                className="relative"
                            >
                                <View
                                    style={{
                                        backgroundColor: color,
                                    }}
                                    className={`w-[50px] h-[50px] rounded-full ${
                                        selectedColor === color
                                            ? "opacity-100"
                                            : "opacity-40"
                                    }`}
                                />
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View className="absolute bottom-0 left-0 right-0 mb-[20px]">
                    <Pressable
                        onPress={SaveBudget}
                        className="mt-3 bg-primary py-3 rounded-lg flex items-center"
                    >
                        <Text className="font-lexend text-white">Save Budget</Text>
                    </Pressable>

                    {!onboarding && (
                        <Pressable
                            onPress={LaterBudget}
                            className="mt-3 bg-bgBorder-2 py-3 rounded-lg flex items-center"
                        >
                            <Text className="font-lexend text-gray-700">
                                Ask me later
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>

            <StatusBar style="dark" backgroundColor="white" />
        </SafeAreaView>
    );
}
