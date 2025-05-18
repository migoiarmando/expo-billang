/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Miguel Armand B. Sta. Ana [May 18, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    Feature Title: Off Notifications Screen
    Description: Off notifications displays if the notifications are off.

-------------------------------------------------------------------------------------------------------------- */
import { useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function OffNotificationsScreen() {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Notifications",
            headerTitleStyle: {
                fontFamily: "Lexend_400Regular",
                fontSize: 24,
                color: "#2B3854",
            },
        });
    }, [navigation]);

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 32,
            }}
        >
            <Text
                style={{
                    fontFamily: "Lexend_400Regular",
                    textAlign: "center",
                    fontSize: 20,
                    color: "#676666",
                }}
            >
                The notifications are off. Please turn them on in the Profile section.
            </Text>
        </View>
    );
}
