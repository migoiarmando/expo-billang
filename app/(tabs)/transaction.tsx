import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

// ----------------------
// Components
// ----------------------

// A simple search bar with a search icon
const SearchBar = () => {
    return (
        <View className="relative mb-6">
            {/* Positioned search icon */}
            <Image
                source={require("../../assets/images/searchlogo.png")}
                style={{
                    width: 20,
                    height: 20,
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: [{ translateY: -10 }],
                }}
            />

            {/* Search Input */}
            <TextInput
                placeholder="Search transaction"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-500 border-[#D9D9D9] border-[1.5px]"
            />
        </View>
    );
};

// Define the shape of a transaction object
interface Transaction {
    icon: string;
    title: string;
    amount: string;
    date: string;
    type: "expense" | "income";
    status?: "paid" | "pending";
}

// A card component to display each transaction’s details
const TransactionCard = ({
    icon,
    title,
    amount,
    date,
    type,
    status,
}: Transaction) => {
    return (
        <View className="flex flex-row justify-between p-3 bg-white rounded-xl border-[#D9D9D9] border-[1.5px] mb-2">
            <View className="flex flex-row items-center space-x-3">
                <View
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        type === "expense" ? "bg-red-100" : "bg-green-100"
                    }`}
                >
                    <View className="h-13 rounded-lg flex items-center justify-start bg-gray-100 px-5">
                        {typeof icon === "string" ? (
                            <Text className="text-lg">{icon}</Text>
                        ) : (
                            <Image
                                source={icon}
                                style={{
                                    width: 24,
                                    height: 24,
                                    resizeMode: "contain",
                                }}
                            />
                        )}
                    </View>
                </View>
                <View>
                    {/* Title with Updated Font & Color */}
                    <Text
                        style={{
                            fontFamily: "Lexend",
                            fontSize: 14,
                            color: "#2C2C2C",
                            fontWeight: "400",
                        }}
                    >
                        {title}
                    </Text>

                    {/* Date with Updated Font & Color */}
                    <Text
                        style={{
                            fontFamily: "Lexend",
                            fontSize: 12,
                            color: "#9D9D9D",
                            fontWeight: "300",
                        }}
                    >
                        {date}
                    </Text>
                </View>
            </View>

            {/* Status, Down Arrow, and Amount */}
            <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
                {/* Show "Paid" only if status is paid */}
                {status === "paid" && (
                    <View
                        style={{
                            backgroundColor: "#D1F2E4",
                            paddingVertical: 3,
                            paddingHorizontal: 5,
                            borderRadius: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: "600",
                                color: "#34D399",
                            }}
                        >
                            Paid
                        </Text>
                    </View>
                )}

                {/* Down Arrow PNG */}
                <Image
                    source={require("../../assets/images/down.png")}
                    style={{
                        width: 9,
                        height: 9,
                        resizeMode: "contain",
                    }}
                />

                {/* Transaction Amount */}
                <Text
                    style={{
                        color: type === "expense" ? "#FD7474" : "#34D399",
                        fontWeight: "600",
                    }}
                >
                    {amount}
                </Text>
            </View>
        </View>
    );
};

// ----------------------
// Data & Service
// ----------------------

// Default static transaction data for development.
const DEFAULT_TRANSACTION_DATA = {
    upcoming: [
        {
            icon: require("../../assets/images/category/billFees.png"),
            title: "Electricity Bill",
            amount: "₱2,700",
            date: "January 30",
            type: "expense" as const,
            status: "paid" as const,
        },
    ],
    todayTransactions: [
        {
            icon: require("../../assets/images/category/billFees.png"),
            title: "Water Bill",
            amount: "₱50",
            date: "February 11",
            type: "expense" as const,
            status: "paid" as const,
        },
    ],
    pastTransactions: [
        {
            icon: require("../../assets/images/category/billFees.png"),
            title: "Water Bill",
            amount: "₱50",
            date: "February 11",
            type: "expense" as const,
            status: "pending" as const,
        },
    ],
    overdue: [
        {
            icon: require("../../assets/images/category/billFees.png"),
            title: "Water Bill",
            amount: "₱50",
            date: "February 11",
            type: "expense" as const,
            status: "pending" as const,
        },
        {
            icon: require("../../assets/images/category/entertainment.png"),
            title: "Disney+ Subscription",
            amount: "₱149",
            date: "February 10",
            type: "expense" as const,
            status: "paid" as const,
        },
    ],
};

// ----------------------
// Main Screen Component
// ----------------------

export default function TransactionScreen() {
    const navigation = useNavigation(); // Ensure navigation works properly

    const [transactions, setTransactions] = useState(DEFAULT_TRANSACTION_DATA);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const getTransactions = async () => {
            try {
            } catch (err) {
                setError("Error fetching transactions");
            } finally {
                setLoading(false);
            }
        };

        getTransactions();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <Text>Loading transactions...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <Text>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{
                    backgroundColor: "#FFFFFF",
                    paddingBottom: 50,
                }}
            >
                <View className="px-4 py-6">
                    <View className="flex flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-bold text-gray-900">
                            Transactions
                        </Text>
                        <TouchableOpacity className="p-2 rounded-full">
                            <Image
                                source={require("../../assets/images/editlogo.png")}
                                style={{
                                    width: 40,
                                    height: 40,
                                    resizeMode: "contain",
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    <SearchBar />

                    {/* Display Transactions */}
                    {Object.entries(transactions).map(([key, items]) => (
                        <View key={key} className="mb-4">
                            <Text className="text-lg font-semibold text-gray-900 mb-2">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Text>
                            {items.map((transaction, index) => (
                                <TransactionCard key={index} {...transaction} />
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
