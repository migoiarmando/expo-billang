/* --------------------------------------------------------------------------------------------------------------

    Last edited: 

        Miguel Armand B. Sta. Ana [May 9, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    
    Feature Title: Guardian of Gold Badge Screen
    Description: This is the Guardian of Gold Badge Screen

-------------------------------------------------------------------------------------------------------------- */
import React from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GuardianOfGoldSVG from "../../assets/bigbadges/big_guardian_of_gold.svg";
import Exit from "../../assets/bigbadges/exit.svg";
import Trophy from "../../assets/bigbadges/trophy.svg";
import Save from "../../assets/bigbadges/save.svg";
import Continue from "../../assets/bigbadges/continue.svg";
import { useNavigation } from "@react-navigation/native";

// Define props type for clarity and type safety
type GuardianOfGoldProps = {
    onExit?: () => void;
};

const GuardianOfGold: React.FC<GuardianOfGoldProps> = ({ onExit }) => {
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
                {/* Exit icon at top right */}
                <TouchableOpacity style={styles.exitIcon} onPress={handleExit}>
                    <Exit width={28} height={28} />
                </TouchableOpacity>
                <LinearGradient
                    colors={["#E5A423", "#FBFBFB"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.container}
                >
                    <Trophy />
                    <Text style={styles.incomplete}>Incomplete</Text>
                    <GuardianOfGoldSVG />
                    <Text style={styles.title}>Guardian of Gold</Text>
                    <Text style={styles.subtitle}>You have protected your savings!</Text>
                </LinearGradient>
                {/* Bottom action buttons */}
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
        paddingRight: 24,
    },
    saveButton: {
        marginRight: 16,
    },
});

export default GuardianOfGold;
