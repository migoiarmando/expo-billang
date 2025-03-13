import { Link, Stack } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
    useFonts,
    Lexend_400Regular,
    Lexend_600SemiBold,
} from "@expo-google-fonts/lexend";
import { useRouter } from "expo-router";

import { View, Text } from "../components/expo/Themed";
import NotFoundImage from "@/assets/images/404notfound.svg";
import GoBackIcon from "@/assets/images/goback.svg";

export default function NotFoundScreen() {
    const [fontsLoaded] = useFonts({
        Lexend_400Regular,
        Lexend_600SemiBold,
    });

    const router = useRouter();

    if (!fontsLoaded) {
        return null;
    }

    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            // Fallback to home screen if there's no previous screen
            router.replace("/");
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <TouchableOpacity
                            className="ml-2"
                            onPress={handleGoBack}
                        >
                            <GoBackIcon width={8} height={14} />
                        </TouchableOpacity>
                    ),
                    title: "Go Back",
                    headerTitleStyle: {
                        fontFamily: "Lexend_600SemiBold",
                        fontSize: 16,
                        color: "#0075B2",
                    },
                    headerTitleAlign: "center",
                }}
            />
            <View className="flex-1 items-center justify-center p-5">
                <NotFoundImage width={300} height={200} />
                <Link href="/" className="mt-4 py-4">
                    <Text
                        style={{ fontFamily: "Lexend_400Regular" }}
                        className="text-sm text-[#676666] text-center"
                    >
                        We're working hard to bring you this feature. Stay tuned
                        for updates!
                    </Text>
                </Link>
            </View>
        </>
    );
}
