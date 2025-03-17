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
    Save,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTransaction() {
    const [amount, setAmount] = useState("");

    const [selected, setSelected] = useState<"expense" | "income">("expense");

    const inputRef = useRef<TextInput>(null); // Create the ref
    const [title, setTitle] = useState("");

    // Save budget
    async function SaveBudget() {
        // Set the onboarding to true
        await db.update(user_tb).set({ onboarding: true });

        // Save budget details
        // -- Budget name
        // -- Budget method type
        // -- First transaction (Amount)
        console.log(`[debug] amount: ${amount} | title: ${title}`);

        // Route home page
        router.replace("/");
        return;
    }

    return (
        <SafeAreaView style={{ backgroundColor: "#fff" }}>
            <View className="mx-[20px] h-screen flex">
                {/* Header */}
                <View className="mt-[30px] flex-row items-center justify-between">
                    <Text className="text-[#2B3854] font-lexend text-[24px]">
                        Add transaction
                    </Text>

                    <Pressable className="w-[32px] h-[32px] bg-[#F8F8F8] rounded-full items-center justify-center">
                        <Save color={"#8D8F9A"} size={20} />
                    </Pressable>
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

                <View className="flex-row mt-[50px] gap-[15px]">
                    <TouchableOpacity
                        onPress={() => setSelected("expense")}
                        className={`flex-grow items-center rounded-full py-2 ${
                            selected === "expense"
                                ? "bg-[#FD7474]"
                                : "bg-bgBorder-2"
                        }`}
                    >
                        <Text
                            className={`font-lexendMedium ${
                                selected === "expense"
                                    ? "text-white"
                                    : "text-[#BABABA]"
                            }`}
                        >
                            Expense
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelected("income")}
                        className={`flex-grow items-center rounded-full py-2 ${
                            selected === "income"
                                ? "bg-system-green"
                                : "bg-bgBorder-2"
                        }`}
                    >
                        <Text
                            className={`font-lexendMedium ${
                                selected === "income"
                                    ? "text-white"
                                    : "text-[#BABABA]"
                            }`}
                        >
                            Income
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Dynamic Content */}
                {selected === "expense" ? (
                    <ExpenseContent />
                ) : (
                    <IncomeContent />
                )}
            </View>

            <StatusBar style="dark" />
        </SafeAreaView>
    );
}

function ExpenseContent() {
    return (
        <View className="flex-grow mt-[20px]">
            <View className="py-3 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl">
                <RotateCw color="#9D9D9D" size={12} />
                <TextInput placeholder="Food" className="font-lexend" />
            </View>
        </View>
    );
}

function IncomeContent() {
    return (
        <View className="flex-grow mt-[20px]">
            <View className="py-3 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl">
                <RotateCw color="#9D9D9D" size={12} />
                <TextInput placeholder="Test" className="font-lexend" />
            </View>
        </View>
    );
}
