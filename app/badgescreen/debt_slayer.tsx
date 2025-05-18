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
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DebtSlayerSVG from "../../assets/bigbadges/big_debt_slayer.svg";
import Exit from "../../assets/bigbadges/exit.svg";
import Trophy from "../../assets/bigbadges/trophy.svg";
import Continue from "../../assets/bigbadges/continue.svg";
import { useNavigation } from "@react-navigation/native";

type DebtSlayerProps = {
    onExit?: () => void;
};

const DebtSlayer: React.FC<DebtSlayerProps> = ({ onExit }) => {
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
                    colors={["#EF5045", "#FBFBFB"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.container}
                >
                    <Trophy />
                    <Text style={styles.incomplete}>Incomplete</Text>
                    <DebtSlayerSVG />
                    <Text style={styles.title}>Debt Slayer</Text>
                    <Text style={styles.subtitle}>
                        You have paid off your first debt!
                    </Text>
                </LinearGradient>
                <View style={styles.bottomButtons}>
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
    incomplete: {
        fontFamily: "Lexend_400Regular",
        fontSize: 16,
        color: "#fff",
        marginTop: 10,
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
        paddingRight: 84,
    },
});

export default DebtSlayer;
