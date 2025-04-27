/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        John Bicierro [Feb 22, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

-------------------------------------------------------------------------------------------------------------- */

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "../components/expo/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
    useFonts,
    Lexend_100Thin,
    Lexend_200ExtraLight,
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
    Lexend_900Black,
} from "@expo-google-fonts/lexend";

// Nativewind
import "../global.css";
import Colors from "@/constants/Colors";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Lexend_100Thin,
        Lexend_200ExtraLight,
        Lexend_300Light,
        Lexend_400Regular,
        Lexend_500Medium,
        Lexend_600SemiBold,
        Lexend_700Bold,
        Lexend_800ExtraBold,
        Lexend_900Black,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    contentStyle: {
                        backgroundColor:
                            Colors[colorScheme ?? "light"].background,
                    },
                    navigationBarColor:
                        colorScheme === "dark"
                            ? "rgb(0, 0, 0)"
                            : "rgb(255, 255, 255)",
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Onboarding */}
                <Stack.Screen
                    name="onboarding/ob"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="onboarding/ob2"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="onboarding/ob3"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="onboarding/ob4"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="onboarding/ob5"
                    options={{
                        title: "Onboarding 5",
                        headerShown: false,
                    }}
                />

                {/* Budget Routes */}
                <Stack.Screen
                    name="budget/editbudget/tailored"
                    options={{
                        title: "Tailored Budget Method",
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="budget/editbudget/structured"
                    options={{
                        title: "Structured Budget Method",
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="budget/transactions"
                    options={{
                        title: "All Budget Transactions",
                        headerShown: false,
                    }}
                />
            </Stack>
        </GestureHandlerRootView>
    );
}
