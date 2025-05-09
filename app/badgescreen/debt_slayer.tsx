/* --------------------------------------------------------------------------------------------------------------

    Last edited: 

        Miguel Armand B. Sta. Ana [May 9, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    
    Feature Title: Debt Slayer Badge Screen
    Description: This is the Debt Slayer Badge Screen

-------------------------------------------------------------------------------------------------------------- */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const DebtSlayer  = () => {
    return (
        <LinearGradient
            colors={["#EF5045", "#FBFBFB"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <Text style={styles.title}>Debt Slayer</Text>
            {/* Add more content here as needed */}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default DebtSlayer;
