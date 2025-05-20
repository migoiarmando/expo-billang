/* --------------------------------------------------------------------------------------------------------------

    Route -> "onboarding/ob.tsx"

    Last edited:
    Miguel Armand B. Sta. Ana [May 20, 2025]
        Romar Josh E. Castro [May 19, 2025]
        John Bicierro [Feb 22, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-1
    Feature Title: Onboarding Screen

-------------------------------------------------------------------------------------------------------------- */
import React from "react";
import { db } from "@/database";
import { budget_tb, transactions_tb } from "@/database/schema";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Paperclip } from "lucide-react-native";
import { useState, useEffect } from "react";

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
// import BudgetSelectModal, { Budget } from "@/components/BudgetSelectorModal";
import BudgetDropdown, { Budget } from "@/components/BudgetSelectorModal";

import { useFocusEffect } from "@react-navigation/native";

import FoodIcon from "@/assets/transaction-icons/food.svg";
import TransitIcon from "@/assets/transaction-icons/transit.svg";
import GroceryIcon from "@/assets/transaction-icons/grocery.svg";
import BillsIcon from "@/assets/transaction-icons/bills.svg";
import EntertainmentIcon from "@/assets/transaction-icons/entertainment.svg";
import WorkIcon from "@/assets/transaction-icons/work.svg";
import SubscriptionIcon from "@/assets/transaction-icons/subscription.svg";
import GrayIcon from "@/assets/smallbudgeticons/gray_smallbudgeticon.svg";
import BlueIcon from "@/assets/smallbudgeticons/blue_budgeticon.svg";
import OrangeIcon from "@/assets/smallbudgeticons/orange_budgeticon.svg";
import RedIcon from "@/assets/smallbudgeticons/red_budgeticon.svg";
import GreenIcon from "@/assets/smallbudgeticons/green_budgeticon.svg";
import PinkIcon from "@/assets/smallbudgeticons/pink_budgeticon.svg";
import { useActivityLogStore } from "@/utils/activityLogStore";
const addLog = useActivityLogStore.getState().addLog;

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

    // --- LIFTED STATE FOR BUDGET MODAL ---
    // These states were previously in ExpenseContent
    const [budgets, setBudgets] = useState<Budget[]>([]); // All budgets
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null); // Selected budget
    const [budgetId, setBudgetId] = useState<string>(""); // Selected budget id
    const [formKey, setFormKey] = useState(0);

    // Reset formKey every time the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            setAmount("");
            setSelectedBudget(null);
            setBudgetId("");
            setSelected("expense"); // Optional: reset to expense tab
            setFormKey((k) => k + 1);
        }, []),
    );

    // Fetch budgets once on mount
    useEffect(() => {
        async function fetchBudgets() {
            try {
                const res = await db.select().from(budget_tb);
                setBudgets(res);
            } catch (err) {
                console.error("Failed to fetch budgets:", err);
            }
        }
        fetchBudgets();
    }, []);

    useEffect(() => {
        return () => {
            setSelectedBudget(null);
            setBudgetId("");
        };
    }, []);

    const resetForm = () => {
        setAmount("");
        setSelectedBudget(null);
        setBudgetId("");
        setFormKey((k) => k + 1); // This will also reset child state
    };

    return (
        <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, position: "relative" }}
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
                                    Add Transaction
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
                                        className="font-lexend "
                                        style={{
                                            fontSize: 40,
                                        }}
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

                            <View className="flex-row mt-[30px] gap-[15px]">
                                <TouchableOpacity
                                    onPress={() => setSelected("expense")}
                                    className={`flex-grow items-center rounded-full px-4 py-3 ${
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
                                    className={`flex-grow items-center rounded-full px-4 py-3 ${
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
                                <ExpenseContent
                                    key={formKey}
                                    amount={amount}
                                    setAmount={setAmount}
                                    budgets={budgets}
                                    selectedBudget={selectedBudget}
                                    setSelectedBudget={setSelectedBudget}
                                    budgetId={budgetId}
                                    setBudgetId={setBudgetId}
                                    resetForm={resetForm}
                                />
                            ) : (
                                <IncomeContent
                                    key={formKey}
                                    amount={amount}
                                    budgets={budgets}
                                    selectedBudget={selectedBudget}
                                    setSelectedBudget={setSelectedBudget}
                                    budgetId={budgetId}
                                    setBudgetId={setBudgetId}
                                    resetForm={resetForm}
                                />
                            )}
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
                {/* --- Render BudgetSelectModal OUTSIDE the ScrollView --- */}
                {/* <BudgetSelectModal
                    isVisible={isBudgetModalVisible}
                    onClose={() => setBudgetModalVisible(false)}
                    budgets={budgets}
                    onSelect={(budget) => {
                        setSelectedBudget(budget);
                        setBudgetId(String(budget.id));
                    }}
                /> */}
            </KeyboardAvoidingView>

            <StatusBar style="dark" backgroundColor="white" />
        </SafeAreaView>
    );
}

function ExpenseContent({
    amount,
    setAmount,
    budgets,
    selectedBudget,
    setSelectedBudget,
    budgetId,
    setBudgetId,
    resetForm,
}: {
    amount: string;
    setAmount: React.Dispatch<React.SetStateAction<string>>;
    budgets: Budget[];
    selectedBudget: Budget | null;
    setSelectedBudget: React.Dispatch<React.SetStateAction<Budget | null>>;
    budgetId: string;
    setBudgetId: React.Dispatch<React.SetStateAction<string>>;
    resetForm: () => void;
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
        { name: "Work", icon: <WorkIcon width={24} height={24} /> },
        {
            name: "Subscription",
            icon: <SubscriptionIcon width={24} height={24} />,
        },
    ];

    const [selectedCategory, setSelectedCategory] = useState(categoryIcons[0]);
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");

    async function saveTransaction() {
        try {
            const numericAmount = parseFloat(amount);

            if (!budgetId) {
                alert("Please select a budget.");
                return;
            }
            if (!selectedCategory.name) {
                alert("Please select a category.");
                return;
            }
            if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
                alert("Please enter a valid amount greater than 0.");
                return;
            }
            if (!title.trim()) {
                alert("Please enter a title for your transaction.");
                return;
            }

            // Insert the expense transaction
            await db.insert(transactions_tb).values({
                budgetId: Number(budgetId),
                type: "Expense",
                amount: Number(amount),
                category: selectedCategory.name,
                title: title || selectedCategory.name,
                notes: notes,
                date: new Date().toISOString(),
            });

            // --- NEW: Update the budget's amount after expense ---
            const budgetsRes = await db
                .select()
                .from(budget_tb)
                .where(eq(budget_tb.id, Number(budgetId)));
            const currentBudget = budgetsRes[0];
            if (currentBudget) {
                const newTotal = Number(currentBudget.amount) - Number(amount);
                await db
                    .update(budget_tb)
                    .set({ amount: newTotal })
                    .where(eq(budget_tb.id, Number(budgetId)));
            }
            // --- END NEW ---

            console.log("[debug] Transaction created successfully");
            router.replace("/transaction");

            // Reset parent state
            resetForm();
            // Reset child state
            setTitle("");
            setNotes("");
            setSelectedCategory(categoryIcons[0]);

            const expenses = await db
                .select()
                .from(transactions_tb)
                .where(eq(transactions_tb.type, "Expense"));

            if (expenses.length === 1) {
                await AsyncStorage.setItem("piggyPioneerEarned", "true");
                addLog({
                    type: "badge",
                    message: "You have unlocked the Piggy Pioneer badge!",
                });
                router.push("/badgescreen/earned_piggy_pioneer");
                return;
            }

            if (expenses.length === 10) {
                await AsyncStorage.setItem("expenseExplorerEarned", "true");
                addLog({
                    type: "badge",
                    message: "You have unlocked the Expense Explorer badge!",
                });
                router.push("/badgescreen/earned_expense_explorer");
                return;
            }

            if (selectedBudget) {
                addLog({
                    type: "expense",
                    message: `You have added an expense to ${selectedBudget.title} with an amount of ₱${Number(amount).toLocaleString()}.`,
                });
            }
        } catch (err) {
            alert("An error occurred while saving the transaction.");
            console.log("Error fetching or inserting data:", err);
        }
    }

    return (
        <View className="flex-grow mt-[20px]">
            <Text
                className="text-xs text-muted-foreground mb-2 font-medium text-[#767676]"
                style={{
                    color: "#676776",
                    marginLeft: 4,
                    fontSize: 12,
                    fontFamily: "Lexend_500Medium",
                }}
            >
                Select Category
            </Text>
            {/* Category Dropdown */}
            <View style={{ maxHeight: 80 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categoryIcons.map((item, index) => {
                        const isSelected = selectedCategory.name === item.name;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedCategory(item)}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 8,
                                        borderRadius: 12,
                                        paddingVertical: 8,
                                        paddingHorizontal: 15,
                                        marginRight: 8,
                                        backgroundColor: "#F3F4F6", // bg-bgBorder-2
                                        borderWidth: isSelected ? 2 : 0,
                                        borderColor: isSelected
                                            ? "#0075B2"
                                            : "transparent", // Use your highlight color
                                    }}
                                >
                                    {item.icon}
                                    <Text
                                        className="font-lexend font-semibold text-sm"
                                        style={{ color: "#767676" }}
                                    >
                                        {item.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View className="flex-row gap-3 my-3 mt-5">
                {/* Select Budget */}
                <View className="flex-1">
                    <Text
                        className="text-xs text-muted-foreground mb-3 font-medium text-[#767676]"
                        style={{
                            color: "#676776",
                            marginLeft: 4,
                            fontSize: 12,
                            fontFamily: "Lexend_500Medium",
                        }}
                    >
                        Budget
                    </Text>
                    <BudgetDropdown
                        selectedBudget={selectedBudget}
                        onSelect={(budget) => {
                            setSelectedBudget(budget);
                            setBudgetId(String(budget.id));
                        }}
                        budgets={budgets}
                    />
                </View>
            </View>

            {/* Title Input */}
            <View className="py-2 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl">
                <Text className="text-[#9D9D9D]">T</Text>
                <TextInput
                    placeholder="Title"
                    className="font-lexend flex-1"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            {/* Notes Input */}
            <View className="mt-3 py-3 px-5 bg-bgBorder-2 rounded-xl h-[130px]">
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
        </View>
    );
}

function IncomeContent({
    amount,
    budgets,
    selectedBudget,
    setSelectedBudget,
    budgetId,
    setBudgetId,
    resetForm,
}: {
    amount: string;
    budgets: Budget[];

    selectedBudget: Budget | null;
    setSelectedBudget: React.Dispatch<React.SetStateAction<Budget | null>>;
    budgetId: string;
    setBudgetId: React.Dispatch<React.SetStateAction<string>>;
    resetForm: () => void;
}) {
    const [title, setTitle] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    async function SaveTransactionIncome() {
        const numericAmount = parseFloat(amount);

        if (!budgetId) {
            alert("Please select a budget.");
            return;
        }
        if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
            alert("Please enter a valid amount greater than 0.");
            return;
        }
        if (!title.trim()) {
            alert("Please enter a title for your transaction.");
            return;
        }

        try {
            // Insert the income transaction
            await db.insert(transactions_tb).values({
                budgetId: Number(budgetId),
                type: "Income",
                amount: Number(amount),
                category: "Cash",
                title: title,
                notes: notes,
                date: new Date().toISOString(),
            });

            // Fetch the current budget
            const budgetsRes = await db
                .select()
                .from(budget_tb)
                .where(eq(budget_tb.id, Number(budgetId)));
            const currentBudget = budgetsRes[0];
            if (currentBudget) {
                // Update the budget's amount
                const newTotal = Number(currentBudget.amount) + Number(amount);
                await db
                    .update(budget_tb)
                    .set({ amount: newTotal })
                    .where(eq(budget_tb.id, Number(budgetId)));
            }

            console.log("[debug] Transaction created successfully");
            router.replace("/transaction");

            if (selectedBudget) {
                addLog({
                    type: "income",
                    message: `You have added an income to ${selectedBudget.title} with a value of ₱${Number(amount).toLocaleString()}.`,
                });
            }

            resetForm();
        } catch (err) {
            alert("An error occurred while saving the transaction.");
            console.log("Error fetching or inserting data:", err);
        }
    }

    return (
        <View className="flex-grow mt-[20px]">
            {/* Budget Selector (same as Expense) */}
            <BudgetDropdown
                selectedBudget={selectedBudget}
                onSelect={(budget) => {
                    setSelectedBudget(budget);
                    setBudgetId(String(budget.id));
                }}
                budgets={budgets}
            />
            <View
                className="mb-5 py-10 px-5 flex-row items-center gap-2 bg-bgBorder-2 rounded-xl"
                style={{ marginTop: 15 }}
            >
                {/* <Text className="text-[#9D9D9D]">T</Text> */}
                <TextInput
                    placeholder="Title"
                    className="font-lexend text-[#767676]"
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
