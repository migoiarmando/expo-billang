/* --------------------------------------------------------------------------------------------------------------

    Last edited: 

        Miguel Armand B. Sta. Ana [May 11, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    
    Feature Title: Piggy Pioneer Badge Screen
    Description: This is the Piggy Pioneer Badge Screen

-------------------------------------------------------------------------------------------------------------- */
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PiggyPioneerSVG from "../../assets/bigbadges/big_piggy_pioneer.svg";
import Trophy from "../../assets/bigbadges/trophy.svg";
import Exit from "../../assets/bigbadges/exit.svg";
import Save from "../../assets/bigbadges/save.svg";
import Continue from "../../assets/bigbadges/continue.svg";
import { useNavigation } from "@react-navigation/native";
import { db } from "@/database";
import { user_tb } from "@/database/schema";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

type PiggyPioneerProps = {
    userName?: string;
    onExit?: () => void;
};

const EarnedPiggyPioneerScreen = (props: PiggyPioneerProps) => {
    const [userName, setUserName] = useState("User");
    const badgeRef = React.useRef<View>(null);

    useEffect(() => {
        async function fetchUserName() {
            try {
                const users = await db.select().from(user_tb);
                if (users.length > 0) {
                    setUserName(users[0].name || "User");
                }
            } catch (err) {
                console.error("Error fetching user name:", err);
            }
        }
        fetchUserName();
    }, []);

    const navigation = useNavigation();

    const handleExit = props.onExit || (() => navigation.goBack());

    const handleSave = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission required", "Please allow access to save images.");
                return;
            }

            const uri = await captureRef(badgeRef, {
                format: "png",
                quality: 1,
            });

            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert("Saved!", "Badge image saved to your gallery.");
        } catch (err) {
            console.error("Error saving badge image:", err);
            Alert.alert("Error", "Failed to save image.");
        }
    };

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
                <ViewShot
                    ref={badgeRef}
                    options={{ format: "png", quality: 1 }}
                    style={{ flex: 1 }}
                >
                    <LinearGradient
                        colors={["#FF8383", "#FBFBFB"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.container}
                    >
                        <Trophy />
                        <Text
                            style={styles.congrats}
                        >{`Congrats, ${userName?.split(" ")[0] || "User"}!`}</Text>
                        <Text style={styles.unlocked}>You've Unlocked a Badge!</Text>

                        <PiggyPioneerSVG />

                        <Text style={styles.title}>Piggy Pioneer</Text>

                        <Text style={styles.subtitle}>
                            You have spent money for the first time!
                        </Text>
                    </LinearGradient>
                </ViewShot>
                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Save />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleExit} style={{ marginRight: -15 }}>
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

export default EarnedPiggyPioneerScreen;
