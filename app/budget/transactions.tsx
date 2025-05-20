/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        John Bicierro [April 30, 2025]
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

import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useLocalSearchParams } from "expo-router";

import GrayArrow from "@/assets/images/grayarrow.svg";
import ExpenseArrow from "@/assets/images/expensearrow.svg";
import IncomeArrow from "@/assets/images/incomearrow.svg";
import UpIncomeArrow from "@/assets/images/upgrayarrow.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "@/database";
import { transactions_tb } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { Transaction } from "@/database/models";

import ExpenseIcon from "@/assets/images/expense.svg";
import IncomeIcon from "@/assets/images/income.svg";

import IncomeTrans from "@/assets/transaction-icons/income.svg";
import CashIcon from "@/assets/images/cash.svg";
import FoodIcon from "@/assets/transaction-icons/food.svg";
import TransitIcon from "@/assets/transaction-icons/transit.svg";
import GroceryIcon from "@/assets/transaction-icons/grocery.svg";
import BillsIcon from "@/assets/transaction-icons/bills.svg";
import EntertainmentIcon from "@/assets/transaction-icons/entertainment.svg";
import WorkIcon from "@/assets/transaction-icons/work.svg";
import SubscriptionIcon from "@/assets/transaction-icons/subscription.svg";

function formatWithCommas(value: number | string): string {
    const str = String(value).replace(/,/g, "");
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function BudgetTransactionScreen() {
    const [selectedFilter, setSelectedFilter] = useState("all");

    const { budgetID } = useLocalSearchParams();
    const numericBudgetID = Number(budgetID);

    useEffect(() => {
        console.log("Budget ID from params:", numericBudgetID);
    }, [numericBudgetID]);

    return (
        <SafeAreaView>
            <View className="mx-[20px] mt-[30px]">
                {/* Header */}
                <View className="flex-row items-center">
                    <Link href=".." asChild>
                        <Pressable>
                            <ChevronLeft color={"black"} size={20} />
                        </Pressable>
                    </Link>

                    <View className="flex-1 items-center">
                        <Text className="text-primary font-lexendSemiBold">
                            Budget Transactions
                        </Text>
                    </View>
                </View>

                <ScrollView className="mt-8">
                    <TransactionFilters
                        selectedFilter={selectedFilter}
                        onFilterChange={setSelectedFilter}
                    />
                    <TransactionList
                        selectedFilter={selectedFilter}
                        budgetID={numericBudgetID}
                    />
                </ScrollView>
                <StatusBar style="dark" backgroundColor="white" />
            </View>
        </SafeAreaView>
    );
}

const TransactionFilters = ({
    selectedFilter,
    onFilterChange,
}: {
    selectedFilter: string;
    onFilterChange: (filter: string) => void;
}) => {
    return (
        <View className="flex-row justify-between items-center rounded-full gap-2.5">
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
                    <UpIncomeArrow width={10} height={10} className="mr-1" />
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
    amount: number;
    iconUrl: string;
    amountColor: string;
}) => {
    const categoryIconMap: Record<string, JSX.Element> = {
        Food: <FoodIcon width={40} height={40} />,
        Transit: <TransitIcon width={40} height={40} />,
        Grocery: <GroceryIcon width={40} height={40} />,
        Bills: <BillsIcon width={40} height={40} />,
        Entertainment: <EntertainmentIcon width={40} height={40} />,
        Income: <IncomeTrans width={40} height={40} />,
        Work: <WorkIcon width={40} height={40} />,
        Subscription: <SubscriptionIcon width={40} height={40} />,
        Cash: <CashIcon width={40} height={40} />,
    };
    const formattedDate = new Date(date).toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    return (
        <View className="flex-row items-center justify-between py-3 border-b border-[#F8F8F8]">
            <View className="flex-row items-center">
                {categoryIconMap[iconUrl] ? (
                    <View className="mr-3 flex items-center justify-center">
                        {categoryIconMap[iconUrl]}
                    </View>
                ) : (
                    <Text>No Icon</Text>
                )}
                <View>
                    <Text className="text-[16px] font-lexend text-[#2C2C2C]">
                        {title}
                    </Text>
                    <View className="mt-1">
                        <Text className="text-[12px] font-lexend text-[#9D9D9D]">
                            {formattedDate}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="flex-row items-center gap-1">
                {amountColor === "Expense" ? (
                    <>
                        <ExpenseIcon width={10} height={10} className="mr-1" />
                        <Text className="text-[16px] font-lexendMedium text-[#FD7474]">
                            ₱{formatWithCommas(amount)}
                        </Text>
                    </>
                ) : (
                    <>
                        <IncomeIcon width={10} height={10} className="mr-1" />
                        <Text className="text-[16px] font-lexendMedium text-[#80B154]">
                            ₱{formatWithCommas(amount)}
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
};

/*const AddTransactionButton = ({ onPress }: { onPress: () => void }) => (
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
); */

const TransactionList = ({
    selectedFilter,
    budgetID,
}: {
    selectedFilter: string;
    budgetID: number;
}) => {
    const [transaction, setTransaction] = useState<Transaction[]>([]);

    const filteredTransactions = transaction.filter((transaction) => {
        if (selectedFilter === "all") return true;
        if (selectedFilter === "expense") {
            return transaction.type === "Expense";
        }
        if (selectedFilter === "income") {
            return transaction.type === "Income";
        }
        return true;
    });

    useEffect(() => {
        async function ShowTransactions() {
            try {
                const res = await db
                    .select()
                    .from(transactions_tb)
                    .where(eq(transactions_tb.budgetId, budgetID))
                    .orderBy(desc(transactions_tb.date));

                setTransaction(res);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }
        ShowTransactions();
    }, [budgetID]);

    return (
        <View className="flex-1">
            <Text className="mt-5 mb-3 text-[16px] font-lexend text-[#676666]">
                Transactions
            </Text>
            <ScrollView>
                {filteredTransactions.map((transaction) => (
                    <TransactionItem
                        key={transaction.id}
                        title={transaction.title || "Cash"}
                        date={transaction.date}
                        amount={transaction.amount}
                        iconUrl={transaction.category}
                        amountColor={transaction.type}
                    />
                ))}
            </ScrollView>
        </View>
    );
};
