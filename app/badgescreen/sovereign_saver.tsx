/* --------------------------------------------------------------------------------------------------------------

    Last edited: 

        Miguel Armand B. Sta. Ana [May 9, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    
    Feature Title: Sovereign Saver Badge Screen
    Description: This is the Sovereign Saver Badge Screen

-------------------------------------------------------------------------------------------------------------- */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SovereignSaver = () => {
    return (
        <LinearGradient
            colors={["#E975A5", "#FBFBFB"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <Text style={styles.title}>Sovereign Saver</Text>
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

export default SovereignSaver;
