import React from "react";
import { Platform, SafeAreaView } from "react-native";
import { Text } from "../../components/Themed";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

export default function Home() {
    return (
        <SafeAreaView>
            <Text>Directory: /</Text>

            <Link href="/onboarding/ob-page">Onboarding Page</Link>

            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </SafeAreaView>
    );
}
