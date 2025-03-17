/* --------------------------------------------------------------------------------------------------------------
    Route -> "transaction.tsx"

    Last edited: 
        John Bicierro [Mar 17, 2025]
        Peter Joshua O. Jornales [March  4, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-4
    Feature Title: Transaction Screen
    Description: Transaction screen for users to track their transaction history.

-------------------------------------------------------------------------------------------------------------- */

import React, { useEffect, useState } from "react";
import {
    Image,
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

// -----------------------------------------------------------------------------
// Interfaces & Utility Functions
// -----------------------------------------------------------------------------

interface Transaction {
    icon: number | { uri: string }; // ✅ Supports require() and remote URLs
    title: string;
    amount: string;
    timestamp: string;
    type: "expense" | "income";
}

// Format timestamp to "March 1 at 1:25 AM"
const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // AM/PM format
    };

    return date.toLocaleString("en-PH", options); // Output: "March 1 at 1:25 AM"
};

// function to format the date (e.g., "March 2")
const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
};

// Dynamically show "Today, Month" or fixed date
const getTransactionTitle = (timestamp?: string) => {
    if (!timestamp) return "";

    const transactionDate = new Date(timestamp);
    const today = new Date();

    // If the transaction is today, label it as "Today, Month Day"
    if (
        transactionDate.getDate() === today.getDate() &&
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
    ) {
        return `Today, ${formatDate(transactionDate)}`;
    }

    // Otherwise, return just "Month Day"
    return formatDate(transactionDate);
};

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

// TransactionCard Component
const TransactionCard = ({
    icon,
    title,
    amount,
    timestamp,
    type,
}: Transaction) => {
    return (
        <>
            <View style={styles.transactionRow}>
                <View style={styles.transactionDetails}>
                    <Image
                        source={typeof icon === "string" ? { uri: icon } : icon}
                        style={styles.transactionIcon}
                    />
                    <View>
                        <Text style={styles.transactionTitle}>{title}</Text>
                        <Text style={styles.transactionTimestamp}>
                            {formatTimestamp(timestamp)}
                        </Text>
                    </View>
                </View>

                {/* ✅ Amount with Icon */}
                <View style={styles.transactionAmountWrapper}>
                    <Image
                        source={
                            type === "expense"
                                ? require("../../assets/images/transaction-folders/expense.png")
                                : require("../../assets/images/transaction-folders/income.png")
                        }
                        style={styles.transactionTypeIcon}
                    />
                    <Text
                        style={[
                            styles.transactionAmount,
                            type === "expense"
                                ? styles.expenseAmount
                                : styles.incomeAmount,
                        ]}
                    >
                        {amount}
                    </Text>
                </View>
            </View>

            {/* ✅ Divider */}
            <View style={styles.transactionDivider} />
        </>
    );
};

// TransactionFilter Component
const TransactionFilter = ({
    selectedFilter,
    setSelectedFilter,
}: {
    selectedFilter: "all" | "expense" | "income";
    setSelectedFilter: (filter: "all" | "expense" | "income") => void;
}) => {
    return (
        <View style={styles.filterWrapper} className="mb-[20px]">
            {/* ✅ ALL Button */}
            <TouchableOpacity
                style={[
                    styles.filterButton,
                    selectedFilter === "all"
                        ? styles.activeFilterAll
                        : styles.inactiveFilter,
                ]}
                onPress={() => setSelectedFilter("all")}
            >
                <Text
                    style={
                        selectedFilter === "all"
                            ? styles.activeText
                            : styles.inactiveText
                    }
                >
                    All
                </Text>
            </TouchableOpacity>

            {/* ✅ EXPENSE Button */}
            <TouchableOpacity
                style={[
                    styles.filterButton,
                    selectedFilter === "expense"
                        ? styles.activeFilterExpense
                        : styles.inactiveFilter,
                ]}
                onPress={() => setSelectedFilter("expense")}
            >
                <Image
                    source={require("../../assets/images/transaction-folders/expense.png")}
                    style={[
                        styles.filterIcon,
                        selectedFilter === "expense"
                            ? styles.filterIconExpense
                            : styles.filterIconInactive,
                    ]}
                />
                <Text
                    style={
                        selectedFilter === "expense"
                            ? styles.filterTextWhite
                            : styles.filterTextInactive
                    }
                >
                    Expense
                </Text>
            </TouchableOpacity>

            {/* ✅ INCOME Button */}
            <TouchableOpacity
                style={[
                    styles.filterButton,
                    selectedFilter === "income"
                        ? styles.activeFilterIncome
                        : styles.inactiveFilter,
                ]}
                onPress={() => setSelectedFilter("income")}
            >
                <Image
                    source={require("../../assets/images/transaction-folders/income.png")}
                    style={[
                        styles.filterIcon,
                        selectedFilter === "income"
                            ? styles.filterIconIncome
                            : styles.filterIconInactive,
                    ]}
                />
                <Text
                    style={
                        selectedFilter === "income"
                            ? styles.filterTextWhite
                            : styles.filterTextInactive
                    }
                >
                    Income
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// SearchBar Component
const SearchBar = () => {
    return (
        <View className="relative mb-[20px]">
            <Image
                source={require("../../assets/images/transaction-folders/searchlogo.png")}
                style={styles.searchlogo} // ✅ Correct
            />
            <TextInput
                placeholder="Search transaction"
                placeholderTextColor="D1D1D6"
                style={styles.searchBar}
            />
        </View>
    );
};

// TransactionSection Component
const TransactionSection = ({
    title,
    transactions,
}: {
    title: string;
    transactions: Transaction[];
}) => {
    if (!transactions || transactions.length === 0) return null;

    return (
        <View className="mb-[20px]">
            <Text style={styles.transactionSection}>{title}</Text>
            {transactions.map((transaction, index) => (
                <TransactionCard key={index} {...transaction} />
            ))}
        </View>
    );
};

// -----------------------------------------------------------------------------
// Data & Service
// -----------------------------------------------------------------------------

const DEFAULT_TRANSACTION_DATA = {
    upcoming: [
        {
            icon: require("../../assets/images/transaction-folders/category/billFees.png"),
            title: "Freelance Income",
            amount: "₱100,000",
            timestamp: "2025-03-3T10:30:00Z", // Fixed timestamp
            type: "income" as const,
        },
        {
            icon: require("../../assets/images/transaction-folders/category/billFees.png"),
            title: "Electricity Bill",
            amount: "₱7,700",
            timestamp: "2025-03-3T10:30:00Z", // Fixed timestamp
            type: "expense" as const,
        },
    ],
    todayTransactions: [
        {
            icon: require("../../assets/images/transaction-folders/category/entertainment.png"),
            title: "Cinema Captain America 4",
            amount: "₱333",
            timestamp: "2025-03-09T15:45:00Z",
            type: "expense" as const,
        },
        {
            icon: require("../../assets/images/transaction-folders/category/food.png"),
            title: "Lunch",
            amount: "₱237",
            timestamp: "2025-03-09T12:30:00Z",
            type: "expense" as const,
        },
        {
            icon: require("../../assets/images/transaction-folders/category/transit.png"),
            title: "Bus Fare",
            amount: "₱50",
            timestamp: "2025-03-09T08:10:00Z",
            type: "expense" as const,
        },
    ],
    pastTransactions: [
        {
            icon: require("../../assets/images/transaction-folders/category/subscription.png"),
            title: "Disney+ Subscription",
            amount: "₱149",
            timestamp: "2025-02-25T18:45:00Z",
            type: "expense" as const,
        },
        {
            icon: require("../../assets/images/transaction-folders/category/income.png"),
            title: "Freelance Income",
            amount: "₱18,000",
            timestamp: "2025-02-25T18:45:00Z",
            type: "income" as const,
        },
    ],
    overDue: [
        {
            icon: require("../../assets/images/transaction-folders/category/billFees.png"),
            title: "Water Bill",
            amount: "₱50",
            timestamp: "2025-02-10T09:00:00Z",
            type: "expense" as const,
        },
    ],
};

// -----------------------------------------------------------------------------
// Main Screen Component
// -----------------------------------------------------------------------------

export default function TransactionScreen() {
    const navigation = useNavigation();
    const [transactions, setTransactions] = useState(DEFAULT_TRANSACTION_DATA);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [selectedFilter, setSelectedFilter] = useState<
        "all" | "expense" | "income"
    >("all");

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const response = await fetch(
                    "https://your-backend.com/api/transactions",
                );
                const data = await response.json();
                setTransactions(data.transactions);
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
            <SafeAreaView style={styles.container}>
                <Text>Loading transactions...</Text>
            </SafeAreaView>
        );
    }

    // **Filter Transactions Based on Selected Filter**
    const filterTransactions = (transactionsList: Transaction[]) => {
        if (selectedFilter === "all") return transactionsList;
        return transactionsList.filter((txn) => txn.type === selectedFilter);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.innerContainer}>
                    {/* Header row with left text and right icon */}
                    <View style={styles.headerRow}>
                        <Text
                            style={styles.title}
                            className="font-lexend text-[24px]"
                        >
                            Transactions
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                console.log("Settings / Edit icon pressed")
                            }
                        >
                            <Image
                                source={require("../../assets/images/transaction-folders/editlogo.png")}
                                style={styles.headerIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <SearchBar />

                    {/* ✅ Transaction Filter Component */}
                    <TransactionFilter
                        selectedFilter={selectedFilter}
                        setSelectedFilter={setSelectedFilter}
                    />

                    {/* ✅ Apply Filter to Each Transaction List */}
                    <TransactionSection
                        title="Upcoming"
                        transactions={filterTransactions(transactions.upcoming)}
                    />
                    <TransactionSection
                        title="March"
                        transactions={filterTransactions(
                            transactions.todayTransactions,
                        )}
                    />
                    <TransactionSection
                        title="Febuary"
                        transactions={filterTransactions(
                            transactions.pastTransactions,
                        )}
                    />
                    <TransactionSection
                        title="Overdue"
                        transactions={filterTransactions(transactions.overDue)}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

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
        paddingVertical: 10,
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
        paddingVertical: 10,
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
        backgroundColor: "#E5E7EB", // ✅ Light gray divider
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
