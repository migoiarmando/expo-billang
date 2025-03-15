import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Platform,
} from "react-native";
import { Search } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import UserIcon from "@/assets/images/usericon.svg";
import NotificationIcon from "@/assets/images/notification.svg";
import Svg, { Path, Circle } from "react-native-svg";
import CashIcon from "@/assets/images/cash.svg";
import ExpenseIcon from "@/assets/images/expense.svg";
import IncomeIcon from "@/assets/images/income.svg";
import GrayArrow from "@/assets/images/grayarrow.svg";
import ExpenseArrow from "@/assets/images/expensearrow.svg";
import IncomeArrow from "@/assets/images/incomearrow.svg";
import EditLogo from "@/assets/images/editlogo.svg";

const CustomStatusBar = () => (
    <View className="flex-row justify-between items-center px-5 pt-5 mt-1">
        <View className="flex-row gap-2">
            <View className="w-8 h-8" />
            <View className="w-8 h-8" />
            <View className="w-8 h-8" />
        </View>
    </View>
);

const Header = () => {
    return (
        <View className="flex-row justify-between items-center ml-5 mt-4 mr-6 pb-1">
            <Text className="text-[24px] text-[#2B3854] tracking-tight font-lexend ml-1">
                A Budget
            </Text>
            <View className="flex-row gap-3.5">
                <TouchableOpacity onPress={() => router.replace("/profile")}>
                    <EditLogo width={36} height={36} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const SearchBar = () => (
    <View className="mt-5 mx-5 rounded-full py-0.5 px-5 bg-[#F5F5F5] flex-row items-center">
        <Search size={20} color="#666" className="mr-2" />
        <TextInput
            className="flex-1 font-lexend text-base text-[#666] font-normal"
            placeholder="Search transaction"
            placeholderTextColor="#666"
        />
    </View>
);

const TransactionFilters = ({ selectedFilter, onFilterChange }) => {
    return (
        <View className="flex-row justify-evenly items-center px-5 py-4">
            <TouchableOpacity
                onPress={() => onFilterChange("all")}
                style={{
                    backgroundColor:
                        selectedFilter === "all" ? "#E5F7FF" : "#F5F5F5",
                }}
                className="flex-1 mx-2 rounded-full py-2 items-center"
            >
                <Text
                    className={`font-lexend text-base ${
                        selectedFilter === "all"
                            ? "text-[#5FA7C6]"
                            : "text-[#666]"
                    }`}
                >
                    All
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onFilterChange("expense")}
                className={`flex-1 mx-2 rounded-full py-2 bg-[#F5F5F5] items-center ${
                    selectedFilter === "expense"
                        ? "bg-[#FD7474]"
                        : "bg-[#F5F5F5]"
                }`}
            >
                <View className="flex-row items-center gap-2">
                    {selectedFilter === "expense" ? (
                        <ExpenseArrow width={10} height={10} className="mr-1" />
                    ) : (
                        <GrayArrow width={10} height={10} className="mr-1" />
                    )}
                    <Text
                        className={`font-lexend text-base ${
                            selectedFilter === "expense"
                                ? "text-white"
                                : "text-[#666]"
                        }`}
                    >
                        Expense
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onFilterChange("income")}
                className={`flex-1 mx-2 rounded-full py-2 items-center ${
                    selectedFilter === "income"
                        ? "bg-[#80B154]"
                        : "bg-[#F5F5F5]"
                }`}
            >
                <View className="flex-row items-center gap-1">
                    {selectedFilter === "income" ? (
                        <View style={{ transform: [{ rotate: "0deg" }] }}>
                            <IncomeArrow
                                width={10}
                                height={10}
                                className="ml-1"
                            />
                        </View>
                    ) : (
                        <View style={{ transform: [{ rotate: "180deg" }] }}>
                            <GrayArrow
                                width={10}
                                height={10}
                                className="ml-1"
                            />
                        </View>
                    )}
                    <Text
                        className={`font-lexend text-base ${
                            selectedFilter === "income"
                                ? "text-white"
                                : "text-[#666]"
                        }`}
                    >
                        Income
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const TransactionItem = ({ title, date, amount, iconUrl, amountColor }) => {
    return (
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-[#F8F8F8]">
            <View className="flex-row items-center">
                {iconUrl === "cash" ? (
                    <View className="mr-3 -ml-1">
                        <CashIcon width={40} height={40} />
                    </View>
                ) : (
                    <Image
                        source={iconUrl}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                )}
                <View>
                    <Text className="text-[16px] font-lexend text-[#2C2C2C]">
                        {title}
                    </Text>
                    <View className="mt-1">
                        <Text className="text-[12px] font-lexend text-[#9D9D9D]">
                            {date}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="flex-row items-center gap-1">
                {amountColor === "#FD7474" ? (
                    <>
                        <ExpenseIcon width={10} height={10} className="mr-1" />
                    </>
                ) : (
                    <>
                        <IncomeIcon width={10} height={10} className="mr-1" />
                    </>
                )}
                <Text
                    style={{ color: amountColor }}
                    className="text-[16px] font-lexendMedium"
                >
                    {amount}
                </Text>
            </View>
        </View>
    );
};

const TransactionList = ({ selectedFilter }) => {
    const transactions = [
        {
            id: "1",
            title: "Electricity Bill",
            date: "February 30",
            amount: "₱7,700",
            iconUrl: "cash",
            amountColor: "#FD7474",
        },
        {
            id: "2",
            title: "Electricity Bill",
            date: "February 30",
            amount: "₱7,700",
            iconUrl: "cash",
            amountColor: "#80B154",
        },
    ];

    const filteredTransactions = transactions.filter((transaction) => {
        if (selectedFilter === "all") return true;
        if (selectedFilter === "expense")
            return transaction.amountColor === "#FD7474";
        if (selectedFilter === "income")
            return transaction.amountColor === "#80B154";
        return true;
    });

    return (
        <View className="flex-1">
            <Text className="px-5 py-3 text-[16px] font-lexend text-[#676666]">
                Transactions
            </Text>
            <ScrollView>
                {filteredTransactions.map((transaction) => (
                    <TransactionItem
                        key={transaction.id}
                        title={transaction.title}
                        date={transaction.date}
                        amount={transaction.amount}
                        iconUrl={transaction.iconUrl}
                        amountColor={transaction.amountColor}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export const AllBudgetTransaction = () => {
    const [selectedFilter, setSelectedFilter] = useState("all");

    return (
        <View className="flex-1 bg-white max-w-[440px] self-center w-full">
            <ScrollView className="flex-1">
                <CustomStatusBar />
                <Header />
                <SearchBar />
                <TransactionFilters
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                />
                <TransactionList selectedFilter={selectedFilter} />
            </ScrollView>
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
};

export default AllBudgetTransaction;
