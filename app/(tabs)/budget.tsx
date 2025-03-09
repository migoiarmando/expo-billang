/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        John Bicierro [Feb 25, 2025]
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

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
} from "react-native";
import { Search, Plus } from "lucide-react-native";
import BudgetCard from "@/components/BudgetCard";
import BudgetTypeSelectorModal from "@/components/BudgetTypeSelectorModal";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

const CustomStatusBar = () => (
    <View style={styles.statusBar}>
        <View style={styles.statusIcons}>
            <View style={styles.icon} />
            <View style={styles.icon} />
            <View style={styles.icon} />
        </View>
    </View>
);

const Header = () => (
    <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: "Lexend_500Medium" }]}>
            Budgets
        </Text>
        <View style={styles.headerIcons}>
            <Image
                source={require("@/assets/images/usericon.png")}
                style={styles.icon}
            />
            <Image
                source={require("@/assets/images/notification.png")}
                style={styles.icon}
            />
        </View>
    </View>
);

const SearchBar = () => (
    <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
            style={styles.searchInput}
            placeholder="Search budgets"
            placeholderTextColor="#666"
        />
    </View>
);

interface AddBudgetButtonProps {
    onPress: () => void;
}

const AddBudgetButton = ({ onPress }: AddBudgetButtonProps) => (
    <TouchableOpacity
        style={styles.addBudgetContainer}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.addBudgetContent}>
            <Plus size={16} color="#828282" />
            <Text style={styles.addBudgetText}>Add Budget!</Text>
        </View>
    </TouchableOpacity>
);

export default function BudgetScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddBudget = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleSelectBudgetType = (type: "default" | "structured") => {
        console.log("Selected budget type:", type);
        setIsModalVisible(false);
        // Handle the selected budget type here
    };

    // Fetch data

    return (
        <>
            <SafeAreaView style={styles.container}>
                <CustomStatusBar />
                <Header />
                <SearchBar />
                <ScrollView style={styles.scrollView}>
                    <View style={styles.budgetList}>
                        <BudgetCard
                            name="Budget Name"
                            amount={1000}
                            spent="755"
                            percentage={1}
                        />
                        <AddBudgetButton onPress={handleAddBudget} />
                    </View>
                </ScrollView>
                <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
            </SafeAreaView>

            <BudgetTypeSelectorModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSelect={handleSelectBudgetType}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        maxWidth: 440,
        alignSelf: "center",
        width: "100%",
    },
    statusBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        marginTop: 5,
    },
    time: {
        fontFamily: "Lexend",
        fontSize: 16,
        fontWeight: "500",
    },
    statusIcons: {
        flexDirection: "row",
        gap: 8,
    },
    icon: {
        width: 32,
        height: 32,
        resizeMode: "contain",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: "Lexend",
        letterSpacing: -0.48,
        color: "#2B3854",
    },
    headerIcons: {
        flexDirection: "row",
        gap: 12,
    },
    searchContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 99,
        paddingVertical: 1,
        paddingHorizontal: 20,
        backgroundColor: "#F5F5F5",
        flexDirection: "row",
        alignItems: "center",
    },
    searchInput: {
        fontFamily: "Lexend",
        fontSize: 16,
        color: "#666",
        fontWeight: "400",
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    budgetList: {
        padding: 20,
        gap: 14,
    },
    addBudgetContainer: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#dadada",
        borderRadius: 12,
        padding: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    addBudgetContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    addBudgetText: {
        color: "#828282",
        fontFamily: "Lexend_400Regular",
        fontSize: 16,
    },
});
