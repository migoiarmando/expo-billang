/* --------------------------------------------------------------------------------------------------------------

    Route -> "onboarding/ob.tsx"

    Last edited:
        Miguel Armand B. Sta. Ana [May 10, 2025]
        John Bicierro [Feb 22, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-1
    Feature Title: Onboarding Screen

-------------------------------------------------------------------------------------------------------------- */
import { db } from "@/database";
import { budget_tb, transactions_tb } from "@/database/schema";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Folder, Paperclip } from "lucide-react-native"
import { useState, useEffect } from "react";
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Pressable,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { eq } from "drizzle-orm";
import BudgetSelectModal, { Budget } from "@/components/BudgetSelectorModal";

import FoodIcon from "@/assets/transaction-icons/food.svg";
import TransitIcon from "@/assets/transaction-icons/transit.svg";
import GroceryIcon from "@/assets/transaction-icons/grocery.svg";
import BillsIcon from "@/assets/transaction-icons/bills.svg";
import EntertainmentIcon from "@/assets/transaction-icons/entertainment.svg";
import IncomeIcon from "@/assets/transaction-icons/income.svg";
import WorkIcon from "@/assets/transaction-icons/work.svg";
import SubscriptionIcon from "@/assets/transaction-icons/subscription.svg";
import GrayIcon from "@/assets/smallbudgeticons/gray_smallbudgeticon.svg";
import BlueIcon from "@/assets/smallbudgeticons/blue_budgeticon.svg";
import OrangeIcon from "@/assets/smallbudgeticons/orange_budgeticon.svg";
import RedIcon from "@/assets/smallbudgeticons/red_budgeticon.svg";
import GreenIcon from "@/assets/smallbudgeticons/green_budgeticon.svg";
import PinkIcon from "@/assets/smallbudgeticons/pink_budgeticon.svg";

// Map themeColor to icon
const iconMap: Record<string, React.FC<any>> = {
    "#E6E6E6": GrayIcon,
    "#87CDFF": BlueIcon,
    "#FEC794": OrangeIcon,
    "#FF8787": RedIcon,
    "#9FE0A9": GreenIcon,
    "#FADDFF": PinkIcon,
};

export default function AddTransaction() {
    const [amount, setAmount] = useState("");
    const [selected, setSelected] = useState<"expense" | "income">("expense");

    return (
        <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="mx-[20px] h-screen flex">
                            {/* Header */}
                            <View className="mt-[30px] flex-row items-center justify-between">
                                <Text className="text-[#2B3854] font-lexend text-[24px]">
                                    Add transaction
                                </Text>
                            </View>

                            {/* Edit number */}
                            <View className="items-center mt-[50px]">
                                <View className="flex-row items-center gap-1">
                                    <Text className="font-lexend text-[20px]">₱</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor="#3B3854"
                                        className="font-lexend text-[32px]"
                                        value={amount}
                                        onChangeText={(text) => {
                                            setAmount(text);
                                        }}
                                    />
                                </View>

                                <Text className="text-[12px] font-lexend text-gray-600">
                                    Click me to edit
                                </Text>
                            </View>

                            <View className="flex-row mt-[50px] gap-[15px]">
                                <TouchableOpacity
                                    onPress={() => setSelected("expense")}
                                    className={`flex-grow items-center rounded-full py-2 ${
                                        selected === "expense"
                                            ? "bg-[#FD7474]"
                                            : "bg-bgBorder-2"
                                    }`}
                                >
                                    <Text
                                        className={`font-lexendMedium ${
                                            selected === "expense"
                                                ? "text-white"
                                                : "text-[#BABABA]"
                                        }`}
                                    >
                                        Expense
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setSelected("income")}
                                    className={`flex-grow items-center rounded-full py-2 ${
                                        selected === "income"
                                            ? "bg-system-green"
                                            : "bg-bgBorder-2"
                                    }`}
                                >
                                    <Text
                                        className={`font-lexendMedium ${
                                            selected === "income"
                                                ? "text-white"
                                                : "text-[#BABABA]"
                                        }`}
                                    >
                                        Income
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Dynamic Content */}
                            {selected === "expense" ? (
                                <ExpenseContent amount={amount} setAmount={setAmount} />
                            ) : (
                                <IncomeContent amount={amount} />
                            )}
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            <StatusBar style="dark" backgroundColor="white" />
        </SafeAreaView>
    );
}

function ExpenseContent({
    amount,
    setAmount,
}: {
    amount: string;
    setAmount: React.Dispatch<React.SetStateAction<string>>;
}) {
    const categoryIcons = [
        { name: "Food", icon: <FoodIcon width={24} height={24} /> },
        { name: "Transit", icon: <TransitIcon width={24} height={24} /> },
        { name: "Grocery", icon: <GroceryIcon width={24} height={24} /> },
        { name: "Bills", icon: <BillsIcon width={24} height={24} /> },
        {
            name: "Entertainment",
            icon: <EntertainmentIcon width={24} height={24} />,
        },
        { name: "Income", icon: <IncomeIcon width={24} height={24} /> },
        { name: "Work", icon: <WorkIcon width={24} height={24} /> },
        {
            name: "Subscription",
            icon: <SubscriptionIcon width={24} height={24} />,
        },
    ];

    const [selectedCategory, setSelectedCategory] = useState(categoryIcons[0]);
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [budgetId, setBudgetId] = useState<string>("");
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

    useEffect(() => {
        async function fetchBudgets() {
            try {
                const res = await db.select().from(budget_tb);
                console.log("All budgets fetched:", res);
                setBudgets(res);
            } catch (err) {
                console.error("Failed to fetch budgets:", err);
            }
        }
        fetchBudgets();
    }, []);

    async function saveTransaction() {
        try {
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                console.error("[error] Invalid amount:", amount);
                return;
            }
            if (!budgetId) {
                console.error("[error] No specific budget linked");
                return;
            }
            if (!selectedCategory.name) {
                console.error("[error] Category is required");
                return;
            }

            await db.insert(transactions_tb).values({
                budgetId: Number(budgetId),
                type: "Expense",
                amount: Number(amount),
                category: selectedCategory.name,
                title: title || selectedCategory.name,
                notes: notes,
                date: new Date().toISOString(),
            });

            console.log("[debug] Transaction created successfully");
            router.replace("/transaction");

            setTitle("");
            setNotes("");
            setAmount("");
            setSelectedCategory(categoryIcons[0]);

            const expenses = await db
                .select()
                .from(transactions_tb)
                .where(eq(transactions_tb.type, "Expense"));

            if (expenses.length === 1) {
                await AsyncStorage.setItem("piggyPioneerEarned", "true");
                router.push("/badgescreen/earned_piggy_pioneer");
                return;
            }

            if (expenses.length === 10) {
                await AsyncStorage.setItem("expenseExplorerEarned", "true");
                router.push("/badgescreen/earned_expense_explorer");
                return;
            }
        } catch (err) {
            console.log("Error fetching or inserting data:", err);
        }
    }

    return (
        <View className="flex-grow mt-[20px]">
            <View className="mb-5 py-3 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl">
                <Pressable
                    style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                    onPress={() => setBudgetModalVisible(true)}
                >
                    {selectedBudget ? (
                        <>
                            {(iconMap[selectedBudget.themeColor] || iconMap["#E6E6E6"])({
                                width: 24,
                                height: 24,
                            })}
                            <Text style={{ marginLeft: 8 }}>{selectedBudget.title}</Text>
                        </>
                    ) : (
                        <Text style={{ color: "#9D9D9D" }}>Select Budget</Text>
                    )}
                </Pressable>
            </View>

            {/* Category Dropdown */}
            <View style={{ maxHeight: 60 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categoryIcons.map((item, index) => {
                        const isSelected = selectedCategory.name === item.name;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedCategory(item)}
                            >
                                <View
                                    className={`flex-row items-center gap-2 rounded-xl py-2 px-5 mr-2 bg-bgBorder-2 ${
                                        isSelected ? "opacity-100" : "opacity-50"
                                    }`}
                                >
                                    {item.icon}
                                    <Text
                                        className={`font-lexend font-semibold ${
                                            isSelected
                                                ? "text-[#9D9D9D] "
                                                : "text-[#9D9D9D]"
                                        }`}
                                    >
                                        {item.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Title Input */}
            <View className="py-3 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl mt-[20px]">
                <Text className="text-[#9D9D9D]">T</Text>
                <TextInput
                    placeholder="Title"
                    className="font-lexend flex-1"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            {/* Notes Input */}
            <View className="mt-5 py-3 px-5 bg-bgBorder-2 rounded-xl h-[130px]">
                <View className="flex-row gap-2 items-center">
                    <Paperclip color="#9D9D9D" size={12} />
                    <TextInput
                        placeholder="Notes"
                        className="font-lexend flex-1 text-base"
                        multiline
                        textAlignVertical="top"
                        maxLength={130}
                        value={notes}
                        onChangeText={(text) => {
                            setNotes(text);
                        }}
                    />
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
                className="mt-5 bg-primary py-3 rounded-lg flex items-center"
                onPress={saveTransaction}
            >
                <Text className="font-lexend text-white">Save Transaction</Text>
            </TouchableOpacity>

            <BudgetSelectModal
                isVisible={isBudgetModalVisible}
                onClose={() => setBudgetModalVisible(false)}
                budgets={budgets}
                onSelect={(budget) => {
                    setSelectedBudget(budget);
                    setBudgetId(String(budget.id));
                }}
            />
        </View>
    );
}

type IncomeProps = {
    amount: string;
};

function IncomeContent(props: IncomeProps) {
    const [budgetId, setBudgetId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    async function SaveTransactionIncome() {
        if (!budgetId) {
            console.log("[debug] No specific budget linked");
            return;
        }
        if (isNaN(Number(budgetId))) {
            console.log("[debug] Invalid budget ID");
            return;
        }
        if (!props.amount) {
            console.log("[debug] You need to edit the amount");
            return;
        }

        try {
            await db.insert(transactions_tb).values({
                budgetId: Number(budgetId),
                type: "Income",
                amount: Number(props.amount),
                category: "Cash",
                title: title,
                notes: notes,
                date: new Date().toISOString(),
            });

            console.log("[debug] Transaction created successfully");
            router.replace("/transaction");
        } catch (err) {
            console.log("Error fetching or inserting data:", err);
        }
    }

    /*
        Developer Note: Logging for transaction database

        useEffect(() => {
            async function ShowTransactions() {
                try {
                    const res = await db.select().from(transactions_tb);
                    console.log(res);
                } catch (err) {
                    console.error("Error fetching data:", err);
                }
            }
            ShowTransactions();
        }, []);
    */

    return (
        <View className="flex-grow mt-[20px]">
            <View className="mb-5 py-3 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl">
                <Folder color="#9D9D9D" size={12} />
                <TextInput
                    placeholder="Select Budget ID"
                    className="font-lexend"
                    value={String(budgetId)}
                    onChangeText={(text) => {
                        setBudgetId(text);
                    }}
                />
            </View>

            <View className="mb-5 py-3 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl">
                <Text className="text-[#9D9D9D]">T</Text>
                <TextInput
                    placeholder="Title"
                    className="font-lexend"
                    value={title}
                    onChangeText={(text) => {
                        setTitle(text);
                    }}
                />
            </View>

            <View className="py-3 px-5 bg-bgBorder-2 rounded-xl h-[130px]">
                <View className="flex-row gap-2 items-center">
                    <Paperclip color="#9D9D9D" size={12} />
                    <TextInput
                        placeholder="Notes"
                        className="font-lexend flex-1 text-base"
                        multiline
                        textAlignVertical="top"
                        maxLength={130}
                        value={notes}
                        onChangeText={(text) => {
                            setNotes(text);
                        }}
                    />
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
                onPress={SaveTransactionIncome}
                className="mt-5 bg-primary py-3 rounded-lg flex items-center"
            >
                <Text className="font-lexend text-white">Save Transaction</Text>
            </TouchableOpacity>
        </View>
    );
}
