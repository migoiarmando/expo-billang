/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Miguel Armand B. Sta. Ana [May 11 , 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    Feature Title: Notifications Screen
    Description: Notifications screen for users to track their notifications.

-------------------------------------------------------------------------------------------------------------- */
import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ReminderIcon from "@/assets/images/notifications.svg";

export default function NotificationsScreen() {
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
        <View style={styles.container}>
            {/* Today Label */}
            <Text style={styles.sectionLabel}>Today</Text>

            {/* Notification Card */}
            <View style={styles.notificationCard}>
                {/* Red dot */}
                <View style={styles.redDot} />
                {/* Notification icon */}
                <View style={styles.notificationIconWrapper}>
                    <ReminderIcon width={20} height={20} />
                </View>
                {/* Notification text */}
                <View style={{ flex: 1 }}>
                    <Text style={styles.notificationTitle}>
                        <Text
                            style={{
                                fontFamily: "Lexend_600SemiBold",
                                fontSize: 15,
                            }}
                        >
                            Reminder:
                        </Text>
                        <Text style={{ fontFamily: "Lexend_400Regular" }}>
                            {" "}
                            Netflix Subscription
                        </Text>
                    </Text>
                    <Text style={styles.notificationTime}>10:30 AM</Text>
                </View>
            </View>
            {/* Divider */}
            <View style={styles.divider} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF9F9",
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2B3854",
        fontFamily: "Lexend_400Regular",
    },
    headerIcons: {
        flexDirection: "row",
        gap: 12,
    },
    iconButton: {
        backgroundColor: "#EAF6FB",
        borderRadius: 20,
        padding: 6,
        marginLeft: 6,
    },
    sectionLabel: {
        color: "#2B3854",
        fontSize: 15,
        marginBottom: 10,
        fontFamily: "Lexend_400Regular",
    },
    notificationCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 10,
        paddingHorizontal: 0,
        backgroundColor: "transparent",
    },
    redDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FF6B6B",
        marginTop: 7,
        marginRight: 8,
    },
    notificationIconWrapper: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: "#7EC6E3",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    notificationTitle: {
        color: "#2B3854",
        fontSize: 15,
        fontFamily: "Lexend_400Regular",
    },
    notificationTime: {
        color: "#B0B0B0",
        fontSize: 12,
        marginTop: 2,
        fontFamily: "Lexend_400Regular",
    },
    divider: {
        height: 1,
        backgroundColor: "#F2EDED",
        marginTop: 10,
    },
});
