/* --------------------------------------------------------------------------------------------------------------

    Route -> "onboarding/ob.tsx"

    Last edited: 
        Miguel Armand B. Sta. Ana [May 11, 2025]
        John Bicierro [Feb 22, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-1
    Feature Title: Onboarding Screen

-------------------------------------------------------------------------------------------------------------- */

import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronDown } from "lucide-react-native";
import { View, Text, TextInput, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { user_tb } from "@/database/schema";
import { db } from "@/database";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfilePic from "@/assets/images/profilepic.svg";
import { Image } from "react-native";

/*const currencies = [
    { id: "PHP", name: "Philippine Peso (₱)" },
    { id: "USD", name: "US Dollar ($)" },
    { id: "EUR", name: "Euro (€)" },
    { id: "JPY", name: "Japanese Yen (¥)" },
    { id: "GBP", name: "British Pound (£)" },
];*/

export default function OnboardingPage4() {
    const inputRef = useRef<TextInput>(null);
    const [name, setName] = useState("");
    const [currency] = useState("Philippine Peso ($)");
    const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 500);

        // Load profile image if already set
        AsyncStorage.getItem("profileImageUri").then((uri) => {
            if (uri) setProfileImageUri(uri);
        });
    }, []);

    const handleProfilePicPress = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access gallery is required!");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setProfileImageUri(uri);
            await AsyncStorage.setItem("profileImageUri", uri);
        }
    };

    async function SaveUser() {
        try {
            if (!name) {
                console.log("[debug] You need to fill up the required fields");
                return;
            }
            await db.update(user_tb).set({
                name: name,
                currency: currency,
            });
            router.replace("/onboarding/ob5");

            console.log("[debug] User updated successfully");
        } catch (err) {
            console.error("Error fetching or updating data:", err);
        }
    }

    return (
        <SafeAreaView>
            <View className="pt-[100px] h-screen flex items-center justify-start">
                <Text className="w-[250px] text-center text-[24px] font-lexendBold text-[#0075B2]">
                    We'd love to know your name
                </Text>

                <View className="mb-5 mt-[100px] flex items-center justify-center">
                    <TouchableOpacity
                        onPress={handleProfilePicPress}
                        activeOpacity={0.7}
                        className="w-[120px] h-[120px] bg-bgBorder-1 rounded-full flex items-center justify-center"
                    >
                        {profileImageUri ? (
                            <Image
                                source={{ uri: profileImageUri }}
                                style={{ width: 120, height: 120, borderRadius: 60 }}
                            />
                        ) : (
                            <ProfilePic width={120} height={120} />
                        )}
                    </TouchableOpacity>

                    {/* Form */}
                    <View className="mt-10 mb-5 flex gap-3 items-center">
                        <View className="flex flex-row gap-2 items-center">
                            <Text className="font-lexendBold text-[24px] text-center flex items-center justify-center">
                                I'm
                            </Text>
                            <TextInput
                                ref={inputRef}
                                placeholder="Smith"
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
                    onPress={SaveUser}
                    className="py-3 px-[80px] bg-[#0075B2] rounded-full"
                >
                    <Text className="text-white font-lexend">Continue</Text>
                </Pressable>
            </View>

            <StatusBar style="dark" />
        </SafeAreaView>
    );
}
