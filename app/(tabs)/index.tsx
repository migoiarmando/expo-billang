/* --------------------------------------------------------------------------------------------------------------

    Route -> "(tabs)/index.tsx"

    Last edited: 
        Miguel Sta. Ana [May 9, 2025]
        John Bicierro [May 8, 2025]
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

import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/database/drizzle/migrations";
import { budget_tb, transactions_tb, user_tb } from "@/database/schema";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "@/database";
import BudgetCard from "@/components/BudgetCard";
import NoFlame from "@/assets/home/no-flame.svg";
import { useFocusEffect } from "@react-navigation/native";
import { desc, eq, sql } from "drizzle-orm";
import StreakFire from "../../assets/streaksandbadges/streakfire.svg";
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
import { updateStreakOnAppOpen, getStreak } from "../../utils/streak";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StreakModal from "@/components/StreakModal";
import NotificationIcon from "@/assets/images/notification.svg";

function formatWithCommas(value: number | string): string {
    const str = String(value).replace(/,/g, "");
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function HomeScreen() {
    const days = ["Sun", "M", "T", "W", "Th", "F", "Sat"];
    const [items, setItems] = useState<(typeof user_tb.$inferSelect)[] | null>(null);
    const [streakCount, setStreakCount] = useState(0);
    const [showStreakModal, setShowStreakModal] = useState(false);

    useEffect(() => {
        async function GetUser() {
            try {
                //await db.delete(budget_tb);
                //await db.delete(transactions_tb);
                //await db.delete(user_tb);

                const users = await db.select().from(user_tb);

                if (!users.length) {
                    await db.insert(user_tb).values({
                        name: "",
                    });

                    router.replace("/onboarding/ob");
                    console.log("[debug] Created user data successfully");
                    return;
                }
                if (!users[0].onboarding) {
                    router.replace("/onboarding/ob");
                    console.log("[debug] User required onboarding phase");
                    return;
                }

                setItems(users);
            } catch (err) {
                console.error("[GetUser] Error fetching or inserting data:", err);
            }
        }

        GetUser();
    }, []);

    const [totalExpense, setTotalExpense] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [countExpense, setCountExpense] = useState(0);
    const [countIncome, setCountIncome] = useState(0);
    const [budgetAmount, setBudgetAmount] = useState(0);
    const [budgetSpent, setBudgetSpent] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            async function GetRecentTransaction() {
                try {
                    const result = await db
                        .select()
                        .from(transactions_tb)
                        .orderBy(desc(transactions_tb.date))
                        .limit(3);

                    setTransactions(result);
                } catch (err) {
                    console.error(err);
                }
            }
            async function GetExpenseAmountAll() {
                try {
                    const result = await db
                        .select({
                            total: sql<number>`SUM(${transactions_tb.amount})`,
                        })
                        .from(transactions_tb)
                        .where(eq(transactions_tb.type, "Expense"));

                    const totalAmount = result[0]?.total ?? 0;

                    setTotalExpense(totalAmount);
                } catch (err) {
                    console.error(err);
                }
            }
            async function GetIncomeAmountAll() {
                try {
                    const result = await db
                        .select({
                            total: sql<number>`SUM(${transactions_tb.amount})`,
                        })
                        .from(transactions_tb)
                        .where(eq(transactions_tb.type, "Income"));

                    const totalAmount = result[0]?.total ?? 0;

                    setTotalIncome(totalAmount);
                } catch (err) {
                    console.error(err);
                }
            }
            async function CountExpenseTransaction() {
                try {
                    const result = await db
                        .select({
                            count: sql<number>`COUNT(*)`,
                        })
                        .from(transactions_tb)
                        .where(eq(transactions_tb.type, "Expense"));

                    const count = result[0]?.count ?? 0;

                    setCountExpense(count);
                } catch (err) {
                    console.error(err);
                }
            }
            async function CountIncomeTransaction() {
                try {
                    const result = await db
                        .select({
                            count: sql<number>`COUNT(*)`,
                        })
                        .from(transactions_tb)
                        .where(eq(transactions_tb.type, "Income"));

                    const count = result[0]?.count ?? 0;

                    setCountIncome(count);
                } catch (err) {
                    console.error(err);
                }
            }

            async function GetBudgetAmountAll() {
                try {
                    const result = await db
                        .select({
                            total: sql<number>`SUM(${budget_tb.amount})`,
                        })
                        .from(budget_tb);

                    const totalBudget = result[0]?.total ?? 0;
                    setBudgetAmount(totalBudget);
                } catch (err) {
                    console.error(err);
                }
            }
            async function GetBudgetSpendAll() {
                try {
                    const result = await db
                        .select({
                            total: sql<number>`SUM(${transactions_tb.amount})`,
                        })
                        .from(transactions_tb)
                        .where(eq(transactions_tb.type, "Expense"));

                    const totalSpent = result[0]?.total ?? 0;
                    setBudgetSpent(totalSpent);
                } catch (err) {
                    console.error(err);
                }
            }

            GetRecentTransaction();
            GetBudgetSpendAll();
            GetBudgetAmountAll();
            CountIncomeTransaction();
            CountExpenseTransaction();
            GetExpenseAmountAll();
            GetIncomeAmountAll();
            updateStreakOnAppOpen().then(setStreakCount);
        }, []),
    );

    useFocusEffect(
        useCallback(() => {
            async function checkStreakModal() {
                const today = new Date().toISOString().slice(0, 10);
                const lastShown = await AsyncStorage.getItem("lastStreakModalDate");
                if (lastShown !== today) {
                    setShowStreakModal(true);
                    await AsyncStorage.setItem("lastStreakModalDate", today);
                }
            }
            checkStreakModal();
        }, []),
    );

    if (items === null || items.length === 0) {
        return <View></View>;
    }

    function formatAmount(amount: number): string {
        if (amount >= 1_000_000) {
            return `${(amount / 1_000_000).toFixed(1)}M`;
        } else if (amount >= 1_000) {
            return `${(amount / 1_000).toFixed(1)}K`;
        }
        return amount.toString();
    }

    // Use the same logic as in Badges Screen
    const weekDays = ["Sun", "M", "T", "W", "Th", "F", "Sat"];
    const todayIndex = new Date().getDay();
    const streakDays = weekDays.map((day, idx) => {
        const daysAgo = (todayIndex - idx + 7) % 7;
        return {
            day,
            isActive: streakCount > 0 && daysAgo < streakCount,
        };
    });

    return (
        <SafeAreaView className="h-full" style={{ backgroundColor: "#fff" }}>
            <View className="mx-[20px] mt-[20px]">
                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                    }}
                >
                    <Text className="font-lexend text-[24px] text-[#2B3854]">
                        Good Day, {items[0].name}!
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            // TODO: Add notification navigation or modal here
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <NotificationIcon width={32} height={32} />
                    </TouchableOpacity>
                </View>

                {/* Budget Card */}
                <View className="mt-5">
                    <TouchableOpacity
                        onPress={() => {
                            router.push("/budget");
                        }}
                    >
                        <BudgetCard
                            name="Budget"
                            amount={budgetAmount}
                            spent={String(budgetSpent)}
                            percentage={1}
                        />
                    </TouchableOpacity>
                </View>

                {/* Expenses and Income  */}
                <View className="mt-5 flex-row justify-between gap-5">
                    <View className="p-[12px] flex-1 flex-row justify-between bg-[#FFE9E9] rounded-[12px]">
                        <View>
                            <Text className="font-lexendSemiBold text-[#FE6B6B]">
                                Expenses
                            </Text>
                            <Text className="mt-1 font-lexend text-gray-700 text-[12px]">
                                {countExpense} Transactions
                            </Text>
                        </View>
                        <Text className="font-lexend text-[14px] text-[#FD7474]">
                            ₱{formatAmount(totalExpense)}
                        </Text>
                    </View>
                    <View className="p-[12px] flex-1 flex-row justify-between bg-[#E8FFE8] rounded-[12px]">
                        <View>
                            <Text className="font-lexendSemiBold text-[#67AC69]">
                                Income
                            </Text>
                            <Text className="mt-1 font-lexend text-[12px] text-[#929292]">
                                {countIncome} Transactions
                            </Text>
                        </View>

                        <Text className="font-lexend text-[14px] text-[#67AC69]">
                            ₱{formatAmount(totalIncome)}
                        </Text>
                    </View>
                </View>

                {/* Streaks */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push("/badges")}
                >
                    <View className="mt-5 flex-row gap-10 w-full h-[50px] rounded-[20px] justify-around">
                        {streakDays.map((day, idx) => (
                            <View key={idx} className="items-center">
                                {day.isActive ? (
                                    <StreakFire width={16} height={16} />
                                ) : (
                                    <NoFlame width={16} height={16} />
                                )}
                                <Text
                                    className={`font-lexend text-[12px] ${
                                        day.isActive ? "text-[#FF8F1F]" : "text-[#CACACA]"
                                    }`}
                                >
                                    {day.day}
                                </Text>
                            </View>
                        ))}
                    </View>
                </TouchableOpacity>

                {/* Recent Transactions */}
                <View>
                    <View>
                        <Text className="font-lexend text-[16px]">
                            Recent Transactions
                        </Text>
                    </View>

                    {!transactions.length ? (
                        <TouchableOpacity
                            onPress={() => {
                                router.replace("/addtransaction");
                            }}
                            className="mt-5 justify-center items-center h-[280px] border-2 border-dashed border-[#D9D9D9] rounded-[10px]"
                        >
                            <Text className="font-lexend text-[14px] text-gray-700">
                                + Add Transaction
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="mt-2">
                            {transactions.map((tx) => (
                                <TransactionItem
                                    key={tx.id}
                                    title={tx.title || tx.category}
                                    date={tx.date}
                                    amount={tx.amount}
                                    iconUrl={tx.category}
                                    amountColor={tx.type}
                                />
                            ))}

                            {/* View More */}
                            <TouchableOpacity
                                onPress={() => {
                                    router.replace("/transaction");
                                }}
                                className="mt-5 items-center"
                            >
                                <Text className="font-lexend text-[13px] text-[#9D9D9D]">
                                    View more
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
            <StreakModal
                isVisible={showStreakModal}
                onClose={() => setShowStreakModal(false)}
                streakCount={streakCount}
                userName={items?.[0]?.name || "Doe"}
                avgMonthly={10000}
                avgDaily={1000}
                weekStreak={streakDays.map((day) => day.isActive)}
            />
            <StatusBar style="dark" backgroundColor="white" />
        </SafeAreaView>
    );
}

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
