/* --------------------------------------------------------------------------------------------------------------
    
    Last edited:
        Miguel Armand B. Sta. Ana [May 17, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    
    Feature Title: Budget Selector Modal
    Description:
        - This is the modal that pops up when the user selects a budget from the budget screen.

-------------------------------------------------------------------------------------------------------------- */
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";

import GrayIcon from "@/assets/smallbudgeticons/gray_smallbudgeticon.svg";
import BlueIcon from "@/assets/smallbudgeticons/blue_budgeticon.svg";
import OrangeIcon from "@/assets/smallbudgeticons/orange_budgeticon.svg";
import RedIcon from "@/assets/smallbudgeticons/red_budgeticon.svg";
import GreenIcon from "@/assets/smallbudgeticons/green_budgeticon.svg";
import PinkIcon from "@/assets/smallbudgeticons/pink_budgeticon.svg";
import { db } from "@/database";
import { budget_tb } from "@/database/schema";
import { LogBox } from "react-native";

const iconMap: Record<string, React.FC<any>> = {
    "#E6E6E6": GrayIcon,
    "#87CDFF": BlueIcon,
    "#FEC794": OrangeIcon,
    "#FF8787": RedIcon,
    "#9FE0A9": GreenIcon,
    "#FADDFF": PinkIcon,
};

export interface Budget {
    id: number;
    title: string;
    themeColor: string;
}

interface BudgetDropdownProps {
    selectedBudget: Budget | null;
    onSelect: (budget: Budget) => void;
    budgets: Budget[];
}
// type BudgetDropdownProps = {
//     selectedBudget: Budget | null; // or `Budget | undefined`
//     onSelect: (budget: Budget) => void;
// };

const BudgetDropdown: React.FC<BudgetDropdownProps> = ({ onSelect, selectedBudget }) => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        LogBox.ignoreLogs([
            "VirtualizedLists should never be nested", // ignore specific warning
        ]);
    }, []);

    useEffect(() => {
        async function fetchBudgets() {
            try {
                const data = await db.select().from(budget_tb);
                setBudgets(data);
            } catch (err) {
                console.error("Failed to fetch budgets:", err);
            }
        }

        fetchBudgets();
    }, []);

    return (
        <View style={styles.container}>
            <Pressable style={styles.dropdownButton} onPress={() => setIsOpen(!isOpen)}>
                {selectedBudget ? (
                    <>
                        {React.createElement(
                            iconMap[selectedBudget.themeColor] || GrayIcon,
                            {
                                width: 30,
                                height: 30,
                            },
                        )}
                        <Text style={styles.dropdownText}>{selectedBudget.title}</Text>
                    </>
                ) : (
                    <Text style={styles.dropdownText}>Select a Budget</Text>
                )}
            </Pressable>

            {isOpen && (
                <View style={styles.dropdownList}>
                    <FlatList
                        data={budgets}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            const Icon = iconMap[item.themeColor] || GrayIcon;
                            return (
                                <Pressable
                                    style={styles.option}
                                    onPress={() => {
                                        onSelect(item);
                                        setIsOpen(false);
                                    }}
                                >
                                    <Icon width={20} height={20} />
                                    <Text style={styles.optionText}>{item.title}</Text>
                                </Pressable>
                            );
                        }}
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        removeClippedSubviews={false}
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#ccc",
                                    marginVertical: 2,
                                }}
                            />
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    dropdownButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,

        borderRadius: 8,
        backgroundColor: "#eee",
    },
    dropdownText: {
        textAlign: "center",

        fontSize: 13,
        marginLeft: 10,
        fontFamily: "Lexend_400Regular",
    },
    dropdownList: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        maxHeight: 200,
        marginTop: 8,
        paddingHorizontal: 10,
    },
    option: {
        alignContent: "center",
        marginVertical: 6,
        paddingVertical: 12,
        paddingHorizontal: 5,
        flexDirection: "row",
        gap: 10,
    },

    optionText: {
        fontSize: 14,
        fontFamily: "Lexend_400Regular",
        textAlign: "center",
    },
});

export default BudgetDropdown;
