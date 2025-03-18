/* --------------------------------------------------------------------------------------------------------------
    

    Last edited: 
        
        Miguel Armand B. Sta. Ana [March  18, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-10
    Feature Title: Budget Screen v2
    Description:
        - The Budget Screen provides an overview of user's budgets with a searchable list of budgets.
        - Users can add new budgets by selecting between default or structured budget.
        - Users can track their transaction history.

-------------------------------------------------------------------------------------------------------------- */

import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
} from "react-native";
import { Search, Plus } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import CashIcon from "@/assets/images/cash.svg";
import ExpenseIcon from "@/assets/images/expense.svg";
import IncomeIcon from "@/assets/images/income.svg";
import GrayArrow from "@/assets/images/grayarrow.svg";
import ExpenseArrow from "@/assets/images/expensearrow.svg";
import IncomeArrow from "@/assets/images/incomearrow.svg";
import EditLogo from "@/assets/images/editlogo.svg";
import { SearchBar } from "@/components/SearchBar";

const CustomStatusBar = () => (
    <View className="flex-row justify-between items-center px-5 pt-2 mt-2">
        <View className="flex-row gap-2">
            <View className="w-8 h-8" />
            <View className="w-8 h-8" />
            <View className="w-8 h-8" />
        </View>
    </View>
);

const Header = () => {
    return (
        <View className="flex-row justify-between items-center ml-5 mt-1 mr-6 pb-1">
            <Text className="text-[24px] text-[#2B3854] tracking-tight font-lexend ml-1">
                My Budget
            </Text>
            <View className="flex-row gap-3.5">
                <TouchableOpacity onPress={() => router.replace("/profile")}>
                    <EditLogo width={36} height={36} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const TransactionFilters = ({
    selectedFilter,
    onFilterChange,
}: {
    selectedFilter: string;
    onFilterChange: (filter: string) => void;
}) => {
    return (
        <View className="flex-row justify-between items-center rounded-full gap-2.5 mb-5 px-5 mt-2">
            {/* All Button */}
            <TouchableOpacity
                onPress={() => onFilterChange("all")}
                className={`
                    flex-1 h-10 px-7 rounded-full border-1.5 items-center justify-center
                    ${
                        selectedFilter === "all"
                            ? "bg-[#E5F7FF] border-[#E5F7FF]"
                            : "bg-[#F5F5F5] border-[#F5F5F5]"
                    }
                `}
            >
                <Text
                    className={`
                    font-lexend text-base
                    ${
                        selectedFilter === "all"
                            ? "text-[#5FA7C6] font-semibold"
                            : "text-[#BABABA] font-medium"
                    }
                `}
                >
                    All
                </Text>
            </TouchableOpacity>

            {/* Expense Button */}
            <TouchableOpacity
                onPress={() => onFilterChange("expense")}
                className={`
                    flex-1 h-10 px-7 rounded-full border-1.5 flex-row items-center justify-center gap-1
                    ${
                        selectedFilter === "expense"
                            ? "bg-[#FD7474] border-[#FD7474]"
                            : "bg-[#F5F5F5] border-[#F5F5F5]"
                    }
                `}
            >
                {selectedFilter === "expense" ? (
                    <ExpenseArrow width={10} height={10} className="mr-1" />
                ) : (
                    <GrayArrow width={10} height={10} className="mr-1" />
                )}
                <Text
                    className={`
                    font-lexend text-base
                    ${
                        selectedFilter === "expense"
                            ? "text-white font-semibold"
                            : "text-[#6B7280] font-medium"
                    }
                `}
                >
                    Expense
                </Text>
            </TouchableOpacity>

            {/* Income Button */}
            <TouchableOpacity
                onPress={() => onFilterChange("income")}
                className={`
                    flex-1 h-10 px-7 rounded-full border-1.5 flex-row items-center justify-center gap-1
                    ${
                        selectedFilter === "income"
                            ? "bg-[#80B154] border-[#80B154]"
                            : "bg-[#F5F5F5] border-[#F5F5F5]"
                    }
                `}
            >
                {selectedFilter === "income" ? (
                    <IncomeArrow width={10} height={10} className="mr-1" />
                ) : (
                    <GrayArrow width={10} height={10} className="mr-1" />
                )}
                <Text
                    className={`
                    font-lexend text-base
                    ${
                        selectedFilter === "income"
                            ? "text-white font-semibold"
                            : "text-[#6B7280] font-medium"
                    }
                `}
                >
                    Income
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const TransactionItem = ({
    title,
    date,
    amount,
    iconUrl,
    amountColor,
}: {
    title: string;
    date: string;
    amount: string;
    iconUrl: string | "cash";
    amountColor: string;
}) => {
    return (
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-[#F8F8F8]">
            <View className="flex-row items-center">
                {iconUrl === "cash" ? (
                    <View className="mr-3 -ml-1">
                        <CashIcon width={40} height={40} />
                    </View>
                ) : (
                    <Image
                        source={{ uri: iconUrl }}
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

const AddTransactionButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
        className="border border-dashed border-[#dadada] rounded-xl px-32 py-12 mx-5 items-center justify-center mt-2"
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View className="flex-row items-center gap-1">
            <Plus size={16} color="#828282" />
            <Text className="text-[#828282] font-lexend-regular text-base">
                Add Transaction!
            </Text>
        </View>
    </TouchableOpacity>
);

const EmptyState = () => (
    <View className="flex-1 items-center justify-center mt-10">
        <AddTransactionButton
            onPress={() => console.log("Add transaction pressed")}
        />
    </View>
);

const TransactionList = ({ selectedFilter }: { selectedFilter: string }) => {
    // Dummy transactions data
    const transactions = [
        {
            id: 1,
            title: "Electricity Bill",
            date: "March 3, 2025",
            amount: "₱7,700",
            iconUrl: "cash",
            amountColor: "#FD7474", // Red for expense
        },
        {
            id: 2,
            title: "Freelance Income",
            date: "March 3, 2025",
            amount: "₱7,700",
            iconUrl: "cash",
            amountColor: "#80B154", // Green for income
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
                <SearchBar title="Search transaction" className="mt-3 mx-5" />
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
