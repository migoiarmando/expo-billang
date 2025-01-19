import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { Button } from "./ob-page";


export default function OnboardingPage2() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center gap-[30px]">
            <Link href="/onboarding/ob-page">
                <Text>Go back</Text>
            </Link>
            <Text className="text-3xl font-bold">Track all in One Place</Text>
            <View className="w-[200px] h-[200px] border">
                <Text>Image</Text>
            </View>
            <Text>
                Easily track all our bills, expenses, and needs seamlessly
            </Text>

            <Button title="Next" />
        </SafeAreaView>
    );
}
