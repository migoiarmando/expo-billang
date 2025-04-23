/* --------------------------------------------------------------------------------------------------------------

    Last edited:
        Romar Castro [Mar 9, 2025]
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
    Image,
    Text,
    StyleSheet,
    ViewStyle,
    DimensionValue,
} from "react-native";
import { useFonts, Lexend_500Medium } from "@expo-google-fonts/lexend";
import { History } from "lucide-react-native";
import SpentPercentageIcon from "@/assets/images/spentpercentageicon.svg";

export interface BudgetCardProps {
    name: string;
    amount: number;
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
    stripColor = "#107DB74D",
    stripHeight = 12,
    stripStyle,
}) => {
    let [fontsLoaded] = useFonts({
        Lexend_500Medium,
    });

    if (!fontsLoaded) {
        return null;
    }

    const spentNumber = parseFloat(spent.replace(/,/g, ""));

    const percentage = Math.min((spentNumber / amount) * 100, 100);

    // const dynamicStripStyle: ViewStyle = {
    //     height: stripHeight,
    //     backgroundColor: stripColor,
    //     width: "100%" as DimensionValue,
    //     ...stripStyle,
    // };

    return (
        <View style={styles.budgetCard}>
            {/* <View style={dynamicStripStyle} /> */}
            <View style={styles.contentContainer}>
                <Image
                    source={require("@/assets/budget-folders/default.png")}
                    style={{
                        width: 430,
                        height: 330,
                        zIndex: -1,
                        position: "absolute",
                        bottom: -180,
                        left: -50,
                    }}
                />
                <View style={styles.budgetHeader}>
                    <Text
                        style={[
                            styles.budgetName,
                            { fontFamily: "Lexend_500Medium" },
                        ]}
                    >
                        {name}
                    </Text>
                    <History
                        color="#8D8F9A"
                        width={15}
                        style={{
                            position: "absolute",
                            top: 25,
                            right: 5,
                        }}
                    />
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amount} numberOfLines={1}>
                        ₱{amount}
                    </Text>
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
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Text style={styles.percentageText}>
                            {percentage.toFixed(1)}%
                        </Text>
                        <SpentPercentageIcon
                            width={8}
                            height={8}
                            style={{ marginLeft: 5, marginRight: 7 }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    budgetCard: {
        borderRadius: 14,
        backgroundColor: "#EDEDED",
        overflow: "hidden",
        height: 150,
    },
    contentContainer: {
        padding: 12,
    },
    budgetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
        paddingLeft: 7,
        paddingVertical: 5,
        paddingHorizontal: 12,
    },
    budgetName: {
        fontSize: 14,
        color: "#2B3854",
    },
    amountContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 3,
        marginBottom: 10,
        paddingLeft: 9,
    },
    currency: {
        fontSize: 22,
        color: "#2B3854",
        fontFamily: "Lexend_300Light",
    },
    amount: {
        fontSize: 32,
        fontWeight: "300",
        color: "#2B3854",
        fontFamily: "Lexend_400Regular",
    },
    progressContainer: {
        backgroundColor: "#eaeaea",
        borderRadius: 99,
        height: 12,
        overflow: "hidden",
        marginBottom: 11,
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
        fontSize: 13,
        fontWeight: "300",
        color: "#929292",
        fontFamily: "Lexend_300Light",
    },
    percentageText: {
        fontSize: 13,
        fontWeight: "300",
        color: "#FE6B6B",
        fontFamily: "Lexend_300Light",
    },
});

export default BudgetCard;
