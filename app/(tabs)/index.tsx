/* --------------------------------------------------------------------------------------------------------------

    Route -> "(tabs)/index.tsx"

    Last edited: 
        Romar Castro [Mar 9, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-5
    Feature Title: Home Screen v2
    Description: Home screen for the app providing the user an overview of all the details


    npm run start
    press s (switch to expo go)
    press a (switch to android emulator)
-------------------------------------------------------------------------------------------------------------- */

import {
    StyleSheet,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/database/drizzle/migrations";
import { user_tb } from "@/database/schema";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import React from "react";
import { db } from "@/database";
import { User, Bell, Search, Filter, History } from "lucide-react-native";

// Reusable Components
import BudgetCard from "@/components/BudgetCard";

export default function HomeScreen() {
    const days = ["S", "M", "T", "W", "Th", "F", "S"];
    const { success, error } = useMigrations(db, migrations);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [items, setItems] = useState<(typeof user_tb.$inferSelect)[] | null>(
        null,
    );

    const [user, setUser] = useState();
    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setTransactions([
                { title: "Grocery", amount: 500 },
                { title: "Salary", amount: 5000 },
            ]);
        }, 1500);
    }, []);
    // Onboarding
    useEffect(() => {
        if (!success) return;

        (async () => {
            // Notice: comment this if you want to see onboarding
            //await db.delete(user_tb);

            // Insert user
            await db.insert(user_tb).values([
                {
                    name: "",
                    onboarding: false,
                },
            ]);

            const users = await db.select().from(user_tb);
            const user = users[0];
            setItems(users);

            if (user.onboarding === false) {
                router.replace("/onboarding/ob");
                return;
            }

            console.log(
                `[debug] name: ${user.name} | onboarding: ${user.onboarding}`,
            );
        })();
    }, [success]);

    // States
    if (error) {
        return (
            <View>
                <Text>Migration error: {error.message}</Text>
            </View>
        );
    }
    if (!success) {
        return (
            <View>
                <Text>Migration is in progress...</Text>
            </View>
        );
    }
    if (items === null || items.length === 0) {
        return (
            <View>
                <Text>Empty</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="h-full" style={{ backgroundColor: "#fff" }}>
            <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                {/* Top Navigation */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text className="font-lexend text-[24px] text-[#2B3854]">
                        Good Day, {items[0].name}!
                    </Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity>
                            <Image
                                source={require("@/assets/images/usericon.png")}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={require("@/assets/images/notification.png")}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Home Content */}

                {/* Budget Card */}
                <View
                    style={{
                        marginVertical: 15,
                    }}
                >
                    <BudgetCard
                        name="Budget Name"
                        amount={2000}
                        spent="0"
                        percentage={1}
                    />
                </View>

                {/* Expenses and Income  */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <View
                        className="flex-row justify-between gap-2 "
                        style={{
                            backgroundColor: "#FFE9E9",
                            width: "48%",
                            height: 65,
                            borderRadius: 12,
                            padding: 12,
                            alignContent: "center",
                        }}
                    >
                        <View>
                            <Text
                                className="font-lexendSemiBold text-[#FE6B6B]"
                                style={{
                                    color: "#FD7474",
                                }}
                            >
                                Expenses
                            </Text>
                            <Text
                                className="font-lexend text-gray-700"
                                style={{ fontSize: 12, color: "#929292" }}
                            >
                                0 Transactions
                            </Text>
                        </View>
                        <Text
                            className="font-lexend"
                            style={{
                                color: "#FD7474",
                                fontSize: 14,
                                flexShrink: 1,
                                textAlign: "right",
                            }}
                            numberOfLines={1}
                        >
                            ₱0
                        </Text>
                    </View>
                    <View
                        className="flex-row justify-between gap-2"
                        style={{
                            backgroundColor: "#E8FFE8",

                            width: "48%",
                            height: 65,
                            borderRadius: 12,
                            padding: 12,
                        }}
                    >
                        <View>
                            <Text
                                className="font-lexendSemiBold"
                                style={{
                                    color: "#67AC69",
                                }}
                            >
                                Income
                            </Text>
                            <Text
                                className="font-lexend"
                                style={{ fontSize: 12, color: "#929292" }}
                            >
                                0 Transactions
                            </Text>
                        </View>
                        <Text
                            className="font-lexend"
                            style={{
                                color: "#67AC69",
                                fontSize: 14,
                                flexShrink: 1,
                                textAlign: "right",
                            }}
                            numberOfLines={1}
                        >
                            ₱0
                        </Text>
                    </View>
                </View>
                {/* Streaks */}
                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        width: "100%",
                        height: 50,
                        borderRadius: 20,
                        marginTop: 20,
                        justifyContent: "space-around",
                    }}
                >
                    {days.map((day, index) => (
                        <View
                            key={index}
                            style={{
                                alignItems: "center",
                            }}
                        >
                            <Image
                                source={require("@/assets/home/no-flame.svg")}
                                style={{
                                    width: 16,
                                    height: 16,
                                }}
                            />
                            <Text
                                className="font-lexend text-[12px]"
                                style={{
                                    color: "#CACACA",
                                }}
                            >
                                {day}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Recent Transactions */}
                <View style={{ marginTop: 30 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text className="font-lexend text-[16px]">
                            Recent Transactions
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#F8F8F8",
                                borderRadius: 99,
                                paddingVertical: 8,
                                paddingHorizontal: 8,
                            }}
                        >
                            <Image
                                source={require("@/assets/home/filter.svg")}
                                style={{
                                    width: 12,
                                    height: 12,
                                    resizeMode: "contain",
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    {transactions.length === 0 ? (
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                marginVertical: 20,
                                height: 280,
                                borderColor: "#D9D9D9",
                                borderWidth: 2,
                                borderRadius: 10,
                                borderStyle: "dashed",
                            }}
                        >
                            <Text className="font-lexend text-[14px] text-gray-700">
                                + Add Transaction!
                            </Text>
                        </View>
                    ) : (
                        <View style={{ marginTop: 15 }}>
                            {transactions.map((tx, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 12,
                                        borderBottomColor: "#EFEFEF",
                                        borderBottomWidth: 1,
                                    }}
                                >
                                    {/* Icon */}
                                    <View
                                        style={{
                                            width: 40,
                                            height: 40,
                                            marginRight: 12,
                                        }}
                                    >
                                        <Image
                                            source={tx.icon}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                resizeMode: "contain",
                                            }}
                                        />
                                    </View>

                                    {/* Text Section */}
                                    <View style={{ flex: 1 }}>
                                        <Text className="font-lexend text-[15px] text-black">
                                            {tx.title}
                                        </Text>
                                        <Text className="font-lexend text-[12px] text-gray-500">
                                            {tx.date}
                                        </Text>
                                    </View>

                                    {/* Amount */}
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Image
                                            source={require("@/assets/icons/downArrow.svg")}
                                            style={{
                                                width: 12,
                                                height: 12,
                                                marginRight: 4,
                                            }}
                                        />
                                        <Text className="font-lexend text-[14px] text-[#FF4D4F]">
                                            ₱{tx.amount}
                                        </Text>
                                    </View>
                                </View>
                            ))}

                            {/* View More */}
                            <TouchableOpacity
                                style={{ marginTop: 10, alignItems: "center" }}
                            >
                                <Text className="font-lexend text-[13px] text-gray-500 underline">
                                    View more
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    icon: {
        width: 32,
        height: 32,
        resizeMode: "contain",
    },
    headerIcons: {
        flexDirection: "row",
        gap: 12,
    },
});
