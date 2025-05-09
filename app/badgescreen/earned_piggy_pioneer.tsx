/* --------------------------------------------------------------------------------------------------------------

    Last edited: 

        Miguel Armand B. Sta. Ana [May 9, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    
    Feature Title: Piggy Pioneer Badge Screen
    Description: This is the Piggy Pioneer Badge Screen

-------------------------------------------------------------------------------------------------------------- */
import React from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PiggyPioneerSVG from "../../assets/bigbadges/big_piggy_pioneer.svg";
import Trophy from "../../assets/bigbadges/trophy.svg";
import Exit from "../../assets/bigbadges/exit.svg";
import Save from "../../assets/bigbadges/save.svg";
import Continue from "../../assets/bigbadges/continue.svg";
import { useNavigation } from "@react-navigation/native";

type PiggyPioneerProps = {
    userName?: string;
    onExit?: () => void;
};

const PiggyPioneer: React.FC<PiggyPioneerProps> = ({ userName = "User", onExit }) => {
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
                    colors={["#FF8383", "#FBFBFB"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.container}
                >
                    <Trophy />
                    <Text style={styles.congrats}>{`Congrats, ${userName}!`}</Text>
                    <Text style={styles.unlocked}>You've Unlocked a Badge!</Text>

                    <PiggyPioneerSVG />

                    <Text style={styles.title}>Piggy Pioneer</Text>

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

export default PiggyPioneer;
