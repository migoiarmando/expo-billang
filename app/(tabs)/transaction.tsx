/* --------------------------------------------------------------------------------------------------------------
    Route -> "transaction.tsx"

    Last edited: 
        Miguel Armand B. Sta. Ana [Mar 18, 2025]
        John Bicierro [Mar 17, 2025]
        Peter Joshua O. Jornales [March  4, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-4
    Feature Title: Transaction Screen
    Description: Transaction screen for users to track their transaction history.

-------------------------------------------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import {
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { SearchBar } from "@/components/SearchBar";
import { transactions_tb } from "@/database/schema";
import { db } from "@/database";
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

import GrayArrow from "@/assets/images/grayarrow.svg";
import ExpenseArrow from "@/assets/images/expensearrow.svg";
import IncomeArrow from "@/assets/images/incomearrow.svg";

export default function TransactionScreen() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<"all" | "expense" | "income">(
        "all",
    );

    useEffect(() => {
        async function GetTransactions() {
            try {
                const res = await db.select().from(transactions_tb);
                setTransactions(res);
            } catch (err) {
                console.error("[error] Failed to fetch transactions:", err);
            }
        }
        GetTransactions();
    }, []);

    const filteredTransactions = transactions.filter((transaction) => {
        if (selectedFilter === "all") return true;
        if (selectedFilter === "expense") {
            return transaction.type === "Expense";
        }
        if (selectedFilter === "income") {
            return transaction.type === "Income";
        }
        return true;
    });
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.innerContainer}>
                    {/* Header row with left text and right icon */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title} className="font-lexend text-[24px]">
                            Transactions
                        </Text>
                        <TouchableOpacity
                            onPress={() => console.log("Settings / Edit icon pressed")}
                        >
                            <Image
                                source={require("../../assets/images/transaction-folders/editlogo.png")}
                                style={styles.headerIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <SearchBar title="Search transactions" />

                    {/* Filter Bar (All, Expense, Income) */}
                    <TransactionFilter
                        selectedFilter={selectedFilter}
                        setSelectedFilter={setSelectedFilter}
                    />

                    {/* ✅ Apply Filter to Each Transaction List */}

                    <View className="mt-5">
                        <Text className="mb-3 text-[16px] font-lexend text-[#676666]">
                            Transactions
                        </Text>
                        <ScrollView>
                            {filteredTransactions.map((transaction) => (
                                <TransactionItem
                                    key={transaction.id}
                                    title={transaction.title || transaction.category}
                                    date={transaction.date}
                                    amount={transaction.amount}
                                    iconUrl={transaction.category}
                                    amountColor={transaction.type}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    {/* <TransactionSection
                        title="March"
                        transactions={filterTransactions(transactions.todayTransactions)}
                    />
                    <TransactionSection
                        title="Febuary"
                        transactions={filterTransactions(transactions.pastTransactions)}
                    />
                    <TransactionSection
                        title="Overdue"
                        transactions={filterTransactions(transactions.overDue)}
                    /> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const TransactionFilter = ({
    selectedFilter,
    setSelectedFilter,
}: {
    selectedFilter: "all" | "expense" | "income";
    setSelectedFilter: (filter: "all" | "expense" | "income") => void;
}) => {
    return (
        <View className="flex-row justify-between items-center rounded-full gap-2.5">
            {/* All Button */}
            <TouchableOpacity
                onPress={() => setSelectedFilter("all")}
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
                onPress={() => setSelectedFilter("expense")}
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
                onPress={() => setSelectedFilter("income")}
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
                            ₱{amount}
                        </Text>
                    </>
                ) : (
                    <>
                        <IncomeIcon width={10} height={10} className="mr-1" />
                        <Text className="text-[16px] font-lexendMedium text-[#80B154]">
                            ₱{amount}
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
};

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
    /* --------------------------------------------------------------------------------------------------------------
        🔹 GLOBAL CONTAINER (Applies to All Elements)
    -------------------------------------------------------------------------------------------------------------- */
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    /* 🔹 Added New Inner Container */
    innerContainer: {
        marginTop: 20, // ✅ mt-30px applied globally
        marginHorizontal: 20, // ✅ mx-20px applied globally
    },

    /* --------------------------------------------------------------------------------------------------------------
        🔹 PAGE TITLE / HEADER
    -------------------------------------------------------------------------------------------------------------- */
    title: {
        color: "#2B3854", // ✅ Matches requested color
        marginBottom: 10, // Ensure spacing after title
    },

    /* 🔹 Header Row (NEW) */
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    headerIcon: {
        width: 32,
        height: 32,
        resizeMode: "contain",
    },

    /* --------------------------------------------------------------------------------------------------------------
        🔹 SEARCH BAR COMPONENT
    -------------------------------------------------------------------------------------------------------------- */
    searchlogo: {
        width: 20,
        height: 20,
        position: "absolute",
        left: 12,
        top: "50%",
        transform: [{ translateY: -10 }],
        zIndex: 1, // Ensures it appears above the search bar
    },
    searchBar: {
        width: "100%",
        paddingLeft: 40,
        paddingRight: 10,
        height: 42,
        backgroundColor: "#F5F5F5",
        borderRadius: 30,
        borderColor: "#F5F5F5",
        borderWidth: 1.5,
    },

    /* --------------------------------------------------------------------------------------------------------------
        🔹 TRANSACTION FILTER COMPONENT
    -------------------------------------------------------------------------------------------------------------- */

    /* ✅ Filter Wrapper */
    filterWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 100,
        gap: 10,
    },

    /* ✅ Default Filter Button */
    filterButton: {
        flexDirection: "row", // ✅ Icon & text in a row
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        paddingHorizontal: 30,
        borderRadius: 30,
        borderWidth: 1.5,
        flexGrow: 1,
        gap: 5, // ✅ Space between icon & text
    },

    filterIconInactive: {
        width: 8,
        height: 8,
        resizeMode: "contain",
        tintColor: "#BABABA", // ✅ Sets inactive icon color to BABABA
        marginRight: 2, // ✅ Adds space between icon & text
    },
    /* ✅ Expense & Income Icons */
    filterIcon: {
        width: 10, // ✅ Adjust icon size if needed
        height: 10,
        resizeMode: "contain",
    },

    /* ✅ Active States */
    activeFilterAll: {
        backgroundColor: "#E5F7FF",
        borderColor: "#E5F7FF",
    },
    activeFilterExpense: {
        backgroundColor: "#FD7474",
        borderColor: "#FD7474",
    },
    activeFilterIncome: {
        backgroundColor: "#80B154",
        borderColor: "#80B154",
    },

    /* ✅ Default Inactive Button */
    inactiveFilter: {
        backgroundColor: "#F5F5F5",
        borderColor: "#F5F5F5",
    },
    filterTextInactive: {
        color: "#6B7280", // ✅ Text color for inactive filter
        fontWeight: "500",
    },

    /* ✅ Text Colors */
    activeText: {
        color: "#5FA7C6",
        fontWeight: "600",
    },
    inactiveText: {
        color: "#BABABA",
        fontWeight: "500",
    },
    filterTextWhite: {
        color: "#FFFFFF",
        fontWeight: "600",
    },

    /* ✅ Icon Colors */
    filterIconExpense: {
        tintColor: "#CB4F4F", // ✅ Turns Red when Expense is active
    },
    filterIconIncome: {
        tintColor: "#FFFFFF", // ✅ Turns White when Income is active
    },

    /* --------------------------------------------------------------------------------------------------------------
        🔹 TRANSACTION SECTION HEADER
    -------------------------------------------------------------------------------------------------------------- */
    transactionSection: {
        fontSize: 16,
        fontWeight: "600",
        color: "#676666", // ✅ Updated to requested color
        marginTop: 10, // ✅ Ensures consistent spacing from the filter bar
        marginBottom: 5,
    },
    /* --------------------------------------------------------------------------------------------------------------
            🔹 TRANSACTION CARD COMPONENT
        -------------------------------------------------------------------------------------------------------------- */

    transactionAmountWrapper: {
        flexDirection: "row", // ✅ Align icon and text in a row
        alignItems: "center",
        justifyContent: "flex-start", // ✅ Ensures alignment to the left
        gap: 5, // ✅ Adds spacing between icon and text
    },

    transactionTypeIcon: {
        width: 10, // ✅ Adjust size as needed
        height: 10,
        resizeMode: "contain",
    },
    transactionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // ✅ Ensures both sides (title & amount) align properly
        paddingVertical: 12,
    },

    transactionDetails: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1, // ✅ Allows proper spacing
    },

    transactionAmount: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: "left", // ✅ Aligns the amount text to the right
        minWidth: 50, // ✅ Ensures alignment without shifting
    },

    expenseAmount: {
        color: "#FD7474", // Red for expenses
    },

    incomeAmount: {
        color: "#80B154", // Green for income
    },

    transactionDivider: {
        height: 1,
        backgroundColor: "#F8F8F8", // ✅ Light gray divider
    },

    transactionIcon: {
        width: 30,
        height: 30,
        borderRadius: 5,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#2C2C2C",
    },
    transactionTimestamp: {
        fontSize: 12,
        fontWeight: "400",
        color: "#9D9D9D",
    },
});
