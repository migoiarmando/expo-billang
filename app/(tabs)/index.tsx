/* --------------------------------------------------------------------------------------------------------------

    Route -> "(tabs)/index.tsx"

    Last edited: 
        John Bicierro [Mar 17, 2025]
        Romar Castro [Mar 9, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-5
    Feature Title: Home Screen v2
    Description: Home screen for the app providing the user an overview of all the details

-------------------------------------------------------------------------------------------------------------- */

import {
    StyleSheet,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/database/drizzle/migrations";
import { budget_tb, user_tb } from "@/database/schema";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { db } from "@/database";

// Reusable Components
import BudgetCard from "@/components/BudgetCard";
import { Header } from "@/components/Header";

export default function HomeScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const days = ["S", "M", "T", "W", "Th", "F", "S"];
    const { success, error } = useMigrations(db, migrations);
    const [items, setItems] = useState<(typeof user_tb.$inferSelect)[] | null>(
        null,
    );

    const [budget, setBudget] = useState<
        (typeof budget_tb.$inferSelect)[] | null
    >(null);

    // Onboarding
    useEffect(() => {
        if (!success) return;

        (async () => {
            // Notice: comment this if you want to see onboarding
            //await db.delete(user_tb);

            // Insert user
            await db.insert(user_tb).values([
                {
                    onboarding: false,
                },
            ]);

            // Budget
            const budget = await db.select().from(budget_tb);
            setBudget(budget);

            console.log(budget);

            // User
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
                <Header name={`Good Day, ${items[0].name}!`} />

                {/* Home Content */}

                {budget && <></>}

                {/* Budget Card */}
                <View
                    style={{
                        marginVertical: 20,
                    }}
                >
                    <BudgetCard
                        name={"Test"}
                        amount={1000}
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
                <View>
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

                    {/* Recent Transactions Stack */}
                    <View>
                        <Text
                            className="font-lexend text-[13px]"
                            style={{ color: "#C2C2C2" }}
                        >
                            {/* Dynamic Time */}
                            Today, 12:00 PM
                        </Text>

                        {/* Empty State */}
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                marginVertical: 10,
                                height: 280,
                                borderColor: "#D9D9D9",
                                borderWidth: 2,
                                borderRadius: 10,
                                borderStyle: "dashed",
                            }}
                        >
                            <Text className="font-lexend text-[14px] text-gray-700">
                                {" "}
                                + Add Transaction!
                            </Text>

                            {/* Loading State */}
                            {/* <View
                            className="flex-col justify-center gap-2"
                            style={{
                                marginVertical: 10,
                               
                            }}
                            > */}
                            {/* <View
                                style={{
                                    backgroundColor: "#F5F5F5",
                                    width: "100%",
                                    height: 50,
                                    borderRadius: 10,
                                }}
                            /> */}

                            {/* onPress={nextRoute}  */}
                            {/* <Pressable>
                                <Text className="text-center">View more</Text>
                            </Pressable> */}
                        </View>
                    </View>
                </View>
                {/* <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#F5F5F5",
                            width: "48%",
                            height: 90,
                            borderRadius: 10,
                            padding: 10,
                            gap: 5,
                        }}
                    >
                        <Image
                            source={require("@/assets/home/view-transactions.svg")}
                            style={{
                                width: 38,
                                height: 38,
                            }}
                        />
                        <Text className="font-lexend text-[12px] text-gray-900">
                            View Transactions
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#F5F5F5",
                            width: "48%",
                            height: 90,
                            borderRadius: 10,
                            padding: 10,
                            gap: 5,
                        }}
                    >
                        <Image
                            source={require("@/assets/home/add-transactions.svg")}
                            style={{
                                width: 55,
                                height: 38,
                            }}
                        />

                        <Text className="font-lexend text-[12px] text-gray-900">
                            Add Transactions
                        </Text>
                    </TouchableOpacity>
                </View> */}
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

function EmptyScreen() {
    return;
}
