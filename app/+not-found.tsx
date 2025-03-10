import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import {
    useFonts,
    Lexend_400Regular,
    Lexend_600SemiBold,
} from "@expo-google-fonts/lexend";

import React from "react";
import { View, Text } from "../components/expo/Themed";
import NotFoundImage from "@/assets/images/404notfound.svg";

export default function NotFoundScreen() {
    const [fontsLoaded] = useFonts({
        Lexend_400Regular,
        Lexend_600SemiBold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Go Back",
                    headerTitleStyle: {
                        fontFamily: "Lexend_600SemiBold",
                        fontSize: 16,
                        color: "#0075B2",
                    },
                    headerTitleAlign: "center",
                }}
            />
            <View style={styles.container}>
                <NotFoundImage width={300} height={200} />

                <Link href="/" style={styles.link}>
                    <Text
                        style={[
                            styles.linkText,
                            { fontFamily: "Lexend_400Regular" },
                        ]}
                    >
                        We're working hard to bring you this feature. Stay tuned
                        for updates!
                    </Text>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 16,
        color: "#2B3854",
        textAlign: "center",
    },
});
