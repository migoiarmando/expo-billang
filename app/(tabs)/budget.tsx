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
    ScrollView,
    TextInput,
    TouchableOpacity,
    Platform,
} from "react-native";
import { Search, Plus } from "lucide-react-native";
import BudgetCard from "@/components/BudgetCard";
import BudgetTypeSelectorModal from "@/components/BudgetTypeSelectorModal";
import { StatusBar } from "expo-status-bar";
import { router, useNavigation } from "expo-router";
import UserIcon from "@/assets/images/usericon.svg";
import NotificationIcon from "@/assets/images/notification.svg";

const CustomStatusBar = () => (
    <View className="flex-row justify-between items-center px-5 pt-5 mt-1">
        <View className="flex-row gap-2">
            <View className="w-8 h-8" />
            <View className="w-8 h-8" />
            <View className="w-8 h-8" />
        </View>
    </View>
);

const Header = () => {
    return (
        <View className="flex-row justify-between items-center px-5">
            <Text className="text-[24px] text-[#2B3854] tracking-tight font-lexend-regular">
                Budgets
            </Text>
            <View className="flex-row gap-3">
                <TouchableOpacity onPress={() => router.replace("/profile")}>
                    <UserIcon width={32} height={32} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <NotificationIcon width={32} height={32} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const SearchBar = () => (
    <View className="mt-5 mx-5 rounded-full py-0.5 px-5 bg-[#F5F5F5] flex-row items-center">
        <Search size={20} color="#666" className="mr-2" />
        <TextInput
            className="flex-1 font-lexend text-base text-[#666] font-normal"
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

export default function BudgetScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleBudgetCardPress = (budgetId: string) => {
        router.push("/budget/editbudget/structured");
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
        <View className="flex-1 bg-white max-w-[440px] self-center w-full">
            <ScrollView className="flex-1">
                <CustomStatusBar />
                <Header />
                <SearchBar />
                <View className="p-5 gap-3.5">
                    <TouchableOpacity
                        onPress={() => handleBudgetCardPress("A")}
                    >
                        <BudgetCard
                            name="A Budget"
                            amount={1500}
                            spent="545"
                            percentage={1}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleBudgetCardPress("B")}
                    >
                        <BudgetCard
                            name="B Budget"
                            amount={2500}
                            spent="545"
                            percentage={1}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleBudgetCardPress("C")}
                    >
                        <BudgetCard
                            name="C Budget"
                            amount={8550}
                            spent="545"
                            percentage={1}
                        />
                    </TouchableOpacity>
                    <AddBudgetButton onPress={handleAddBudget} />
                </View>
            </ScrollView>
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

            <BudgetTypeSelectorModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSelect={handleSelectBudgetType}
            />
        </View>
    );
}
