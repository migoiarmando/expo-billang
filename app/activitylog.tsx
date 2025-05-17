/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Miguel Armand B. Sta. Ana [May 18, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    Feature Title: Activity Log Screen
    Description: Activity log screen for users to track their activity.

-------------------------------------------------------------------------------------------------------------- */
import React, { useLayoutEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ActivityLogIcon from "@/assets/images/activitylogicon.svg";
import { useActivityLogStore } from "@/utils/activityLogStore";
//import { format } from "date-fns";
import type { ActivityLogEntry } from "@/utils/activityLogStore";

function groupLogsByDate(logs: ActivityLogEntry[]) {
    const groups: { [key: string]: ActivityLogEntry[] } = {};
    logs.forEach((log) => {
        const date = new Date(log.timestamp);
        const key = date.toISOString().split("T")[0];
        if (!groups[key]) groups[key] = [];
        groups[key].push(log);
    });
    return groups;
}

export default function ActivityLogScreen() {
    const navigation = useNavigation();
    const logs = useActivityLogStore((state) => state.logs);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Activity Log",
            headerTitleStyle: {
                fontFamily: "Lexend_400Regular",
                fontSize: 24,
                color: "#2B3854",
            },
        });
    }, [navigation]);

    // Group logs by date
    const groupedLogs = groupLogsByDate(logs);
    const todayKey = new Date().toISOString().split("T")[0];
    const sortedDates = Object.keys(groupedLogs).sort((a, b) => b.localeCompare(a)); // newest first

    return (
        <View style={styles.container}>
            {logs.length === 0 ? (
                <Text style={{ fontFamily: "Lexend_400Regular", color: "#B0B0B0" }}>No activity yet.</Text>
            ) : (
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {sortedDates.map((dateKey) => (
                        <View key={dateKey}>
                            <Text style={styles.sectionLabel}>
                                {dateKey === todayKey
                                    ? "Today"
                                    : new Date(dateKey).toLocaleDateString(undefined, {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      })}
                            </Text>
                            {groupedLogs[dateKey].map((log) => (
                                <View key={log.id} style={styles.notificationCard}>
                                    <ActivityLogIcon
                                        width={20}
                                        height={20}
                                        style={{ marginRight: 10, marginTop: 6 }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.notificationTitle}>
                                            {log.message}
                                        </Text>
                                        <Text style={styles.notificationTime}>
                                            {new Date(log.timestamp).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                },
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            )}
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
