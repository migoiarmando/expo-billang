/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Miguel Armand B. Sta. Ana [May 20, 2025]
        John Bicierro [Mar 17, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-2
    Feature Title: Budget Screen
    Description:
        - The Budget Screen provides an overview of user's budgets with a searchable list of budgets.
        - Users can add new budgets by selecting between default or structured budget.

-------------------------------------------------------------------------------------------------------------- */
import { Alert } from "react-native";
import { useCallback, useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import BudgetCard from "@/components/BudgetCard";
import BudgetTypeSelectorModal from "@/components/BudgetTypeSelectorModal";
import { StatusBar } from "expo-status-bar";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { db } from "@/database";
import { budget_tb, transactions_tb } from "@/database/schema";
import { useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "@/components/SearchBar";
import { and, eq, sql } from "drizzle-orm";
import NotificationIcon from "@/assets/images/notification.svg";
import { getNotificationsEnabled } from "@/utils/notifications";
import { resetBudgetsIfNeeded } from "@/utils/budgetReset";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";

interface AddBudgetButtonProps {
    onPress: () => void;
}

const AddBudgetButton = ({ onPress }: AddBudgetButtonProps) => (
    <TouchableOpacity
        className="border border-dashed border-[#dadada] rounded-xl p-12 items-center justify-center mt-2"
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View className="flex-row items-center gap-1">
            <Plus size={16} color="#828282" />
            <Text className="text-[#828282] font-lexend-regular text-base">
                Add Budget
            </Text>
        </View>
    </TouchableOpacity>
);

interface Budget {
    id: number;
    title: string;
    amount: number;
    themeColor: string;
    contentColor: string;
    duration: string;
}

export default function BudgetScreen() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);

    const [search, setSearch] = useState("");

    const navigation = useNavigation();
    const keyboardVisible = useKeyboardVisible();

    useEffect(() => {
        navigation.setOptions({
            tabBarStyle: { display: keyboardVisible ? "none" : "flex" },
        });
    }, [keyboardVisible, navigation]);

    useFocusEffect(
        useCallback(() => {
            // Call the reset function when the screen is focused
            resetBudgetsIfNeeded();

            async function fetchBudget() {
                try {
                    const budgets = await db.select().from(budget_tb);
                    setBudgets(
                        budgets.map((b) => ({
                            ...b,
                            duration: b.duration ?? "",
                        })),
                    );
                } catch (err) {
                    console.error("[error] Failed to fetch budget.*:", err);
                }
            }

            fetchBudget();
        }, []),
    );

    const [isModalVisible, setIsModalVisible] = useState(false);

    function handleBudgetCardPress(budgetID: number) {
        router.push({
            pathname: "/budget/transactions",
            params: { budgetID },
        });
    }

    const handleAddBudget = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleSelectBudgetType = (type: "default" | "structured") => {
        setIsModalVisible(false);
        if (type === "default") {
            router.push("/budget/editbudget/tailored");
        } else if (type === "structured") {
            router.push("/budget/editbudget/structured");
        }
    };

    // Filter budgets based on search input (case-insensitive)
    const filteredBudgets = budgets.filter((budget) =>
        budget.title.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <SafeAreaView className="h-full" style={{ backgroundColor: "#fff" }}>
            <View className="flex-1 max-w-[440px] self-center w-full px-[20px] mt-[20px] ">
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                    }}
                >
                    <Header name="Budget" />
                    <TouchableOpacity
                        onPress={async () => {
                            const enabled = await getNotificationsEnabled();
                            if (enabled) {
                                router.push("/notifications");
                            } else {
                                router.push("/offnotifications");
                            }
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <NotificationIcon width={32} height={32} />
                    </TouchableOpacity>
                </View>
                <SearchBar
                    title="Search Budget"
                    className="mt-5"
                    value={search}
                    onChangeText={setSearch}
                />

                <ScrollView className="flex-1 mt-5" showsVerticalScrollIndicator={false}>
                    <View className="gap-3.5">
                        {filteredBudgets.map((budget) => (
                            <View key={budget.id}>
                                <TouchableOpacity
                                    onPress={() => handleBudgetCardPress(budget.id)}
                                    onLongPress={() => setSelectedBudgetId(budget.id)}
                                >
                                    <BudgetCardSpent
                                        id={budget.id}
                                        title={budget.title}
                                        amount={budget.amount}
                                        contentColor={budget.contentColor}
                                        themeColor={budget.themeColor}
                                        duration={budget.duration as "monthly" | "weekly"}
                                    />
                                </TouchableOpacity>

                                {/* Show edit/delete right after selected budget */}
                                {selectedBudgetId === budget.id && (
                                    <View className="flex-row justify-between mt-2 mb-4">
                                        <TouchableOpacity
                                            className="bg-bgBorder-2   py-2 px-4 rounded-xl flex-1 mr-2"
                                            onPress={() => {
                                                router.push({
                                                    pathname:
                                                        "/budget/editbudget/editbudgetfolder",
                                                    params: { budgetID: budget.id },
                                                });
                                                setSelectedBudgetId(null);
                                            }}
                                        >
                                            <Text className="text-center font-lexendRegular">
                                                Edit
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="bg-bgBorder-2 py-2 px-4 rounded-xl flex-1 ml-2"
                                            onPress={() => confirmDelete(budget.id)}
                                        >
                                            <Text className="text-center font-lexendRegular">
                                                Delete
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ))}

                        <AddBudgetButton onPress={handleAddBudget} />
                    </View>
                </ScrollView>
            </View>

            <StatusBar style="dark" backgroundColor="white" />

            <BudgetTypeSelectorModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSelect={handleSelectBudgetType}
            />
        </SafeAreaView>
    );
    function confirmDelete(id: number) {
        Alert.alert("Delete Budget", "Are you sure you want to delete this budget?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        // Delete the budget
                        await db.delete(budget_tb).where(eq(budget_tb.id, id));

                        // Also delete all transactions linked to this budget
                        await db
                            .delete(transactions_tb)
                            .where(eq(transactions_tb.budgetId, id));

                        // Update state
                        setBudgets((prev) =>
                            prev.filter((b: { id: number }) => b.id !== id),
                        );
                        setSelectedBudgetId(null);
                    } catch (err) {
                        console.error(
                            "[error] Failed to delete budget or transactions:",
                            err,
                        );
                    }
                },
            },
        ]);
    }
}

function BudgetCardSpent(budget: Budget) {
    const [spentBudget, setSpentBudget] = useState(0);

    useFocusEffect(
        useCallback(() => {
            async function fetchSpentBudget() {
                try {
                    const result = await db
                        .select({
                            totalAmount: sql<number>`SUM(${transactions_tb.amount})`,
                        })
                        .from(transactions_tb)
                        .where(
                            and(
                                eq(transactions_tb.budgetId, budget.id),
                                eq(transactions_tb.type, "Expense"),
                            ),
                        );

                    const total = result[0]?.totalAmount ?? 0;
                    setSpentBudget(total);
                } catch (err) {
                    console.error("[error] Failed to fetch transaction.*:", err);
                }
            }

            fetchSpentBudget();
        }, [budget.id]),
    );

    return (
        <BudgetCard
            name={budget.title}
            amount={budget.amount}
            spent={String(spentBudget)}
            percentage={0}
            themeColor={budget.themeColor}
            contentColor={budget.contentColor}
            duration={budget.duration as "monthly" | "weekly"}
        />
    );
}
