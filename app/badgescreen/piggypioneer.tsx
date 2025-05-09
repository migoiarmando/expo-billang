import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const PiggyPioneer = () => {
    return (
        <LinearGradient
            colors={["#FF8383", "#FBFBFB"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <Text style={styles.title}>Piggy Pioneer</Text>
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

export default PiggyPioneer;
