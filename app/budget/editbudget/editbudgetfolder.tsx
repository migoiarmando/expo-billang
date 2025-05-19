/* --------------------------------------------------------------------------------------------------------------

    

    Last edited: 
        Miguel Armand B. Sta. Ana [May 19, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    
    Feature Title: Edit Budget Screen  
    Decsription: This is the screen where the user can edit their budget name and color.

-------------------------------------------------------------------------------------------------------------- */

import { db } from "@/database";
import { budget_tb, user_tb } from "@/database/schema";
import { Link, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, Pencil, RefreshCwIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActivityLogStore } from "@/utils/activityLogStore";
import { eq } from "drizzle-orm";

const addLog = useActivityLogStore.getState().addLog;

// Add this type definition
type ThemeColorKey =
    | "#E6E6E6"
    | "#87CDFF"
    | "#FEC794"
    | "#FF8787"
    | "#9FE0A9"
    | "#FADDFF";

const COLOR_NAMES: Record<ThemeColorKey, string> = {
    "#E6E6E6": "Gray",
    "#87CDFF": "Blue",
    "#FEC794": "Orange",
    "#FF8787": "Red",
    "#9FE0A9": "Green",
    "#FADDFF": "Pink",
};

export default function TailoredBudgetScreen() {
    const inputRef = useRef<TextInput>(null);
    const { budgetID } = useLocalSearchParams();
    const [title, setTitle] = useState("");
    const [selectedColor, setSelectedColor] = useState<ThemeColorKey>("#E6E6E6");
    const [durationModalVisible, setDurationModalVisible] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState<"weekly" | "monthly" | null>(
        null,
    );
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
    const [loading, setLoading] = useState(true);
    const [originalTitle, setOriginalTitle] = useState("");
    const [originalColor, setOriginalColor] = useState<ThemeColorKey>("#E6E6E6");

    // Fetch budget if editing
    useEffect(() => {
        async function fetchData() {
            if (budgetID) {
                const id = Number(budgetID);
                const [budget] = await db
                    .select()
                    .from(budget_tb)
                    .where(eq(budget_tb.id, id));
                if (budget) {
                    setTitle(budget.title);
                    setOriginalTitle(budget.title);
                    setSelectedColor(budget.themeColor as ThemeColorKey);
                    setOriginalColor(budget.themeColor as ThemeColorKey);
                }
            }
            // Fetch onboarding as before
            try {
                const [user] = await db.select().from(user_tb);
                setOnboarding(user.onboarding);
            } catch (err) {
                console.error("[error] Failed to fetch user.onboarding:", err);
            }
            setLoading(false);
        }
        fetchData();
    }, [budgetID]);

    async function SaveBudget() {
        try {
            if (budgetID) {
                // Update existing budget
                await db
                    .update(budget_tb)
                    .set({
                        title: title.trim() || "Budget",
                        themeColor: selectedColor,
                        contentColor: THEME_COLORS[selectedColor].content,
                    })
                    .where(eq(budget_tb.id, Number(budgetID)));

                // Log name change
                if (title.trim() !== originalTitle.trim()) {
                    addLog({
                        type: "budget",
                        message: `You have changed the budget name of ${originalTitle.trim() || "Budget"} to ${title.trim() || "Budget"}.`,
                    });
                }
                // Log color change
                if (selectedColor !== originalColor) {
                    addLog({
                        type: "budget",
                        message: `You have changed the color of ${title.trim() || "Budget"} from ${COLOR_NAMES[originalColor]} to ${COLOR_NAMES[selectedColor]}.`,
                    });
                }
            } else {
                // Create new budget (fallback, should not happen from edit)
                await db.insert(budget_tb).values([
                    {
                        title: title.trim() || "Budget",
                        amount: 0,
                        themeColor: selectedColor,
                        contentColor: THEME_COLORS[selectedColor].content,
                    },
                ]);
                addLog({
                    type: "budget",
                    message: `You have created a budget for ${title} containing ₱${Number(0).toLocaleString()}.`,
                });
            }

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

    if (loading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
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
                            Edit your budget
                        </Text>
                    </View>
                </View>

                {/* Input fields */}
                <View className="gap-[10px] mt-[50px]">
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
