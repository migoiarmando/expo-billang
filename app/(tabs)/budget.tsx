/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        John Bicierro [Mar 17, 2025]
        Miguel Armand B. Sta. Ana [Feb 23, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-2
    Feature Title: Budget Screen
    Description:
        - The Budget Screen provides an overview of user's budgets with a searchable list of budgets.
        - Users can add new budgets by selecting between default or structured budget.

-------------------------------------------------------------------------------------------------------------- */

import { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Plus } from "lucide-react-native";
import BudgetCard from "@/components/BudgetCard";
import BudgetTypeSelectorModal from "@/components/BudgetTypeSelectorModal";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { db } from "@/database";
import { budget_tb } from "@/database/schema";
import { useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "@/components/SearchBar";

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
                Add Budget!
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
}

export default function BudgetScreen() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    useFocusEffect(
        useCallback(() => {
            async function fetchBudget() {
                try {
                    const budgets = await db.select().from(budget_tb);
                    setBudgets(budgets);
                } catch (err) {
                    console.error("[error] Failed to fetch budget.*:", err);
                }
            }
            fetchBudget();
        }, []),
    );

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleBudgetCardPress = (budgetName: string) => {
        router.push({
            pathname: "/budget/transactions",
            params: { budgetName },
        });
    };

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

    return (
        <SafeAreaView className="h-full" style={{ backgroundColor: "#fff" }}>
            <View className="flex-1 max-w-[440px] self-center w-full px-[20px] mt-[20px] ">
                <Header name="Budget" />
                <SearchBar title="Search budget" className="mt-[20px]" />
                <ScrollView className="flex-1">
                    <View className="gap-3.5">
                        {budgets.map((budget) => (
                            <TouchableOpacity
                                key={budget.id}
                                onPress={() => handleBudgetCardPress("Aaweawe")}
                            >
                                <BudgetCard
                                    name={budget.title}
                                    amount={budget.amount}
                                    spent="0"
                                    percentage={1}
                                    themeColor={budget.themeColor}
                                    contentColor={budget.contentColor}
                                />
                            </TouchableOpacity>
                        ))}

                        <AddBudgetButton onPress={handleAddBudget} />
                    </View>
                </ScrollView>
            </View>

            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

            <BudgetTypeSelectorModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSelect={handleSelectBudgetType}
            />
        </SafeAreaView>
    );
}
