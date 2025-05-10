/* --------------------------------------------------------------------------------------------------------------

    Last edited: 

        Miguel Armand B. Sta. Ana [May 10, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    
    Feature Title: Expense Explorer Badge Screen
    Description: This is the Expense Explorer Badge Screen

-------------------------------------------------------------------------------------------------------------- */
import React from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ExpenseExplorerSVG from "../../assets/bigbadges/big_expense_explorer.svg";
import Exit from "../../assets/bigbadges/exit.svg";
import Trophy from "../../assets/bigbadges/trophy.svg";
import Save from "../../assets/bigbadges/save.svg";
import Continue from "../../assets/bigbadges/continue.svg";
import { useNavigation } from "@react-navigation/native";

type ExpenseExplorerProps = {
    userName?: string;
    onExit?: () => void;
};

const ExpenseExplorer: React.FC<ExpenseExplorerProps> = ({
    userName = "User",
    onExit,
}) => {
    const navigation = useNavigation();
    const handleExit = onExit || (() => navigation.goBack());

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <View style={{ flex: 1, position: "relative" }}>
                <TouchableOpacity style={styles.exitIcon} onPress={handleExit}>
                    <Exit width={28} height={28} />
                </TouchableOpacity>
                <LinearGradient
                    colors={["#FBBC69", "#FBFBFB"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.container}
                >
                    <Trophy />
                    <Text style={styles.congrats}>{`Congrats, ${userName}!`}</Text>
                    <Text style={styles.unlocked}>You've Unlocked a Badge!</Text>
                    <ExpenseExplorerSVG />
                    <Text style={styles.title}>Expense Explorer</Text>
                    <Text style={styles.subtitle}>
                        You have spent money for the first time!
                    </Text>
                </LinearGradient>
                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={styles.saveButton}>
                        <Save />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleExit}>
                        <Continue />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 80,
    },
    congrats: {
        fontFamily: "Lexend_600SemiBold",
        fontSize: 16,
        color: "#fff",
        marginBottom: 2,
        textAlign: "center",
    },
    unlocked: {
        fontFamily: "Lexend_400Regular",
        fontSize: 16,
        color: "#fff",
        marginBottom: 18,
        textAlign: "center",
    },
    title: {
        fontFamily: "Lexend_600SemiBold",
        fontSize: 24,
        color: "#fff",
        marginTop: 15,
        marginBottom: 19,
    },
    subtitle: {
        fontFamily: "Lexend_400Regular",
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
    },
    exitIcon: {
        position: "absolute",
        top: 55,
        right: 30,
        zIndex: 10,
    },
    bottomButtons: {
        position: "absolute",
        bottom: 40,
        left: 2,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "flex-end",
        paddingRight: 24,
    },
    saveButton: {
        marginRight: 16,
    },
});

export default ExpenseExplorer;
