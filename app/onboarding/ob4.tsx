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

import React, { useEffect, useRef, useState } from "react";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronDown, User } from "lucide-react-native";
import { View, Text, Button, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { user_tb } from "@/database/schema";
import { db } from "@/database";

const currencies = [
    { id: "PHP", name: "Philippine Peso (₱)" },
    { id: "USD", name: "US Dollar ($)" },
    { id: "EUR", name: "Euro (€)" },
    { id: "JPY", name: "Japanese Yen (¥)" },
    { id: "GBP", name: "British Pound (£)" },
];

export default function OnboardingPage4() {
    const inputRef = useRef<TextInput>(null);
    useEffect(() => {
        // Automatically open the keyboard when the screen is mounted
        setTimeout(() => {
            inputRef.current?.focus();
        }, 500); // Adding delay for smooth transition
    }, []);

    // Save name and currency in database
    const [name, setName] = useState("");
    const [currency, setCurrency] = useState("Philippine Peso ($)");
    async function OnUserContinue() {
        if (!name) {
            console.log("[debug] OnUserContinue: no user name value");
            return;
        }

        await db.update(user_tb).set({
            name: name,
        });

        router.replace("/onboarding/ob5");
    }

    return (
        <SafeAreaView>
            <View className="pt-[100px] h-screen flex items-center justify-start">
                <Text className="w-[250px] text-center text-[24px] font-lexendBold text-[#0075B2]">
                    We'd love to know your name
                </Text>

                <View className="mb-5 mt-[100px] flex items-center justify-center">
                    <View className="w-[120px] h-[120px] bg-bgBorder-1 rounded-full flex items-center justify-center">
                        <View className="bg-bgBorder-2 rounded-full p-8">
                            <User color="#C9C9C9" size={50} />
                        </View>
                    </View>

                    {/* Form */}
                    <View className="mt-10 mb-5 flex gap-3 items-center">
                        <View className="flex flex-row gap-2 justify-center">
                            <Text className="font-lexendBold text-[24px] text-center flex items-center justify-center">
                                I'm
                            </Text>
                            <TextInput
                                ref={inputRef}
                                placeholder="Text"
                                placeholderTextColor="#999999"
                                className="font-lexendBold text-[24px] text-primary"
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                }}
                            />
                        </View>

                        <Text className="font-lexendBold text-[24px] text-center">
                            and the currency I use is
                        </Text>
                        <View className="flex flex-row items-center gap-1">
                            <Text className="font-lexendBold text-[24px] text-center text-[#999999]">
                                {currency}
                            </Text>
                            <ChevronDown color="#71717a" size={16} />
                        </View>
                    </View>
                    <Text className="font-lexend text-[12px] text-[#8F8F8F]">
                        Tap to edit, You can update this anytime.
                    </Text>
                </View>

                <Pressable
                    onPress={OnUserContinue}
                    className="py-3 px-[80px] bg-[#0075B2] rounded-full"
                >
                    <Text className="text-white font-lexend">Continue</Text>
                </Pressable>
            </View>

            <StatusBar style="dark" />
        </SafeAreaView>
    );
}
