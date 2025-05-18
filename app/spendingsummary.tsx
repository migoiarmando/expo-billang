/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Miguel Armand B. Sta. Ana [May 18, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    Feature Title: Spending Summary Screen
    Description: Spending summary screen for users to track their overall spending.

-------------------------------------------------------------------------------------------------------------- */
import React, { useLayoutEffect } from "react";
import {
    View,
    Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function SpendingSummaryScreen() {
    const navigation = useNavigation();


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Spending Summary",
            headerTitleStyle: {
                fontFamily: "Lexend_400Regular",
                fontSize: 24,
                color: "#2B3854",
            },
        });
    }, [navigation]);

   

    return (
        <View>
            <Text>Spending Summary</Text>
        </View>
    );
}


