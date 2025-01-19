import React from "react";
import { Tabs } from "expo-router";

import Colors from "../../constants/Colors";
import { useColorScheme } from "../../components/useColorScheme";
import { useClientOnlyValue } from "../../components/useClientOnlyValue";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Tab One",
                }}
            />
            <Tabs.Screen
                name="onboarding/ob-page"
                options={{
                    headerShown: false,
                    tabBarStyle: { display: "none" },
                }}
            />
            <Tabs.Screen
                name="onboarding/ob-page2"
                options={{
                    headerShown: false,
                    tabBarStyle: { display: "none" },
                }}
            />
        </Tabs>
    );
}
