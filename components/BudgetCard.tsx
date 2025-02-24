/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Miguel Armand B. Sta. Ana [Feb 23, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-2
    Feature Title: Budget Screen
    Description:  This is the budget card component for the Budget Screen.

-------------------------------------------------------------------------------------------------------------- */

import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ViewStyle,
    DimensionValue,
} from "react-native";
import { useFonts, Lexend_500Medium } from "@expo-google-fonts/lexend";
import { History } from "lucide-react-native";

export interface BudgetCardProps {
    name: string;
    amount: string;
    spent: string;
    percentage: number;
    stripColor?: string;
    stripHeight?: number;
    stripStyle?: ViewStyle;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
    name,
    amount,
    spent,
    percentage,
    stripColor = "#107DB74D",
    stripHeight = 15,
    stripStyle,
}) => {
    let [fontsLoaded] = useFonts({
        Lexend_500Medium,
    });

    if (!fontsLoaded) {
        return null;
    }

    const dynamicStripStyle: ViewStyle = {
        height: stripHeight,
        backgroundColor: stripColor,
        width: "100%" as DimensionValue,
        ...stripStyle,
    };

    return (
        <View style={styles.budgetCard}>
            <View style={dynamicStripStyle} />
            <View style={styles.contentContainer}>
                <View style={styles.budgetHeader}>
                    <Text
                        style={[
                            styles.budgetName,
                            { fontFamily: "Lexend_500Medium" },
                        ]}
                    >
                        {name}
                    </Text>
                    <History size={20} color="#666" />
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.currency}>₱</Text>
                    <Text style={styles.amount}>{amount}</Text>
                </View>
                <View style={styles.progressContainer}>
                    <View
                        style={[
                            styles.progressBar,
                            { width: `${percentage}%` },
                        ]}
                    />
                </View>
                <View style={styles.budgetFooter}>
                    <Text style={styles.spentText}>₱{spent} spent</Text>
                    <Text style={styles.percentageText}>{percentage}%</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    budgetCard: {
        borderRadius: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },
    contentContainer: {
        padding: 20,
    },
    budgetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    budgetName: {
        fontSize: 18,
        color: "#2B3854",
    },
    amountContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 3,
        marginBottom: 15,
    },
    currency: {
        fontSize: 24,
        color: "#2B3854",
        fontFamily: "Lexend_300Light",
    },
    amount: {
        fontSize: 40,
        fontWeight: "300",
        color: "#2B3854",
        fontFamily: "Lexend_300Light",
    },
    progressContainer: {
        backgroundColor: "#eaeaea",
        borderRadius: 99,
        height: 12,
        overflow: "hidden",
        marginBottom: 8,
    },
    progressBar: {
        backgroundColor: "#5fa7c6",
        height: "100%",
    },
    budgetFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    spentText: {
        fontSize: 14,
        fontWeight: "300",
        color: "#929292",
        fontFamily: "Lexend_300Light",
    },
    percentageText: {
        fontSize: 16,
        fontWeight: "300",
        color: "#929292",
        fontFamily: "Lexend_300Light",
    },
});

export default BudgetCard;
