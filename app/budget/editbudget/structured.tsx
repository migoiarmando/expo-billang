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
import { ChevronLeft, Pencil, RefreshCwIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActivityLogStore } from "@/utils/activityLogStore";
import DurationSelectModal from "@/components/DurationSelectorModal";
const addLog = useActivityLogStore.getState().addLog;

type ThemeColorKey =
    | "#E6E6E6"
    | "#87CDFF"
    | "#FEC794"
    | "#FF8787"
    | "#9FE0A9"
    | "#FADDFF";

export default function StructuredScreen() {
    const inputRef = useRef<TextInput>(null); // Create the ref
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [needs, setNeeds] = useState(0);
    const [wants, setWants] = useState(0);
    const [savings, setSavings] = useState(0);
    const [onboarding, setOnboarding] = useState<boolean | null>(null);
    const [selectedColor, setSelectedColor] = useState<ThemeColorKey>("#E6E6E6");
    const [durationModalVisible, setDurationModalVisible] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState<"weekly" | "monthly" | null>(
        null,
    );
    // Define theme colors with the type
    const THEME_COLORS: Record<ThemeColorKey, { content: string }> = {
        "#E6E6E6": { content: "#F6F6F6" }, // Gray
        "#87CDFF": { content: "#BAE4FC" }, // Blue
        "#FEC794": { content: "#FFEDDD" }, // Orange
        "#FF8787": { content: "#FFD1D1" }, // Red
        "#9FE0A9": { content: "#DEFDD3" }, // Green
        "#FADDFF": { content: "#E4A8C5" }, // Pink
    };

    // Function to divide the amount based on 50-30-20 rule
    const divideAmount = (value: string) => {
        const num = parseFloat(value);
        if (!isNaN(num)) {
            setNeeds(num * 0.5);
            setWants(num * 0.3);
            setSavings(num * 0.2);
        } else {
            setNeeds(0);
            setWants(0);
            setSavings(0);
        }
    };

    useEffect(() => {
        divideAmount(amount);
    }, [amount]);

    const THEME_COLOR_LIST = Object.keys(THEME_COLORS);

    useEffect(() => {
        async function fetchUser() {
            try {
                const [user] = await db.select().from(user_tb);
                setOnboarding(user.onboarding);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        }
        fetchUser();
    }, []);

    async function SaveBudget() {
        try {
            const numericAmount = parseFloat(amount);

            // Check for required fields
            if (!title.trim()) {
                Alert.alert("Missing Title", "Please enter a title for your budget.");
                return;
            }
            if (isNaN(numericAmount) || numericAmount <= 0) {
                Alert.alert(
                    "Invalid Amount",
                    "Please enter a valid amount greater than 0.",
                );
                return;
            }
            if (!selectedDuration) {
                Alert.alert(
                    "Missing Duration",
                    "Please select a duration for your budget.",
                );
                return;
            }

            await db.insert(budget_tb).values({
                title: title.trim() || "Budget",
                amount: numericAmount,
                originalAmount: numericAmount,
                themeColor: selectedColor,
                contentColor: THEME_COLORS[selectedColor].content,
                duration: selectedDuration,
                lastReset: new Date().toISOString(),
            });

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
                            Edit your structured budget
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

                {/* Need, wants, savings */}
                <View className="flex items-center mt-[50px]">
                    <View className="mt-5 w-full flex-row justify-between">
                        <View className="flex-row gap-2">
                            <View className="rounded-full bg-[#FFE8CD] w-[40px] h-[40px] flex items-center justify-center">
                                <Text className="font-lexendBold text-[#F6921E]">
                                    50%
                                </Text>
                            </View>
                            <View className="flex justify-center">
                                <Text className="font-lexend text-[12px]">Needs</Text>
                                <Text className="font-lexend text-[12px] text-gray-700">
                                    ₱{needs.toFixed(2)}
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
                                <Text className="font-lexend text-[12px]">Wants</Text>
                                <Text className="font-lexend text-[12px] text-gray-700">
                                    ₱{wants.toFixed(2)}
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
                                <Text className="font-lexend text-[12px]">Savings</Text>
                                <Text className="font-lexend text-[12px] text-gray-700">
                                    ₱{savings.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Input fields */}
                {/* Set Duration */}
                <View className=" mt-[20px]" style={{ marginBottom: 10 }}>
                    <Text
                        style={{
                            color: "#676776",
                            marginLeft: 4,
                            fontSize: 12,
                            fontFamily: "Lexend_500Medium",
                        }}
                    >
                        Duration
                    </Text>

                    <Pressable
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#EEEEE",
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 12,
                            marginTop: 4,
                        }}
                        onPress={() => setDurationModalVisible(true)}
                    >
                        <RefreshCwIcon size={16} color="#9D9D9D" />
                        <View style={{ width: 6 }} />
                        <Text
                            style={{
                                fontFamily: selectedDuration
                                    ? "Lexend_500Medium"
                                    : "Lexend_400Regular",
                                color: selectedDuration ? "#2B3854" : "#9D9D9D",
                            }}
                        >
                            {selectedDuration
                                ? selectedDuration === "monthly"
                                    ? "Monthly"
                                    : "Weekly"
                                : "Select Duration"}
                        </Text>
                    </Pressable>
                </View>

                <View className="gap-[10px]">
                    <View className="mt-2 py-3 px-5 flex-row justify-between items-center gap-2 bg-bgBorder-2 rounded-xl">
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

                {/* Theme Color */}
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
                                        borderWidth: selectedColor === color ? 3 : 0,
                                        borderColor:
                                            selectedColor === color
                                                ? "#2C2C2C"
                                                : "transparent",
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
            <DurationSelectModal
                isVisible={durationModalVisible}
                onClose={() => setDurationModalVisible(false)}
                onSelect={(duration) => {
                    setSelectedDuration(duration);
                }}
            />
            <StatusBar style="dark" backgroundColor="white" />
        </SafeAreaView>
    );
}
