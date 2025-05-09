/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
         Miguel Armand B. Sta. Ana [May 9, 2025]
        John Bicierro [Mar 17, 2025]
        Miguel Armand B. Sta. Ana [Mar 10, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-17
    Feature Title: Profile Screen
    Description:
        - The Profile Screen provides an overview of the user's profile, including personal details, activity, and settings.
        - Users can manage their profile, view streaks, and access settings from this screen.

-------------------------------------------------------------------------------------------------------------- */

import React, { useState, useRef, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { Plus, ChevronRight } from "lucide-react-native";
import BudgetTypeSelectorModal from "@/components/BudgetTypeSelectorModal";
import { StatusBar } from "expo-status-bar";
import BudgetCard from "@/components/BudgetCard";
import ProfilePic from "@/assets/images/profilepic.svg";
import { Link, useRouter } from "expo-router";
import StreakIcon from "@/assets/images/streak.svg";

// Import SVG files directly
import SpendingSummary from "@/assets/images/spendingsummary.svg";
import StreaksBadges from "@/assets/images/streaksbadges.svg";
import ActivityLog from "@/assets/images/activitylog.svg";
import SettingsCustomization from "@/assets/images/settingscustomization.svg";
import Notifications from "@/assets/images/notifications.svg";
import About from "@/assets/images/about.svg";
import PrivacyPolicy from "@/assets/images/privacypolicy.svg";

import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "@/database";
import { eq, sql } from "drizzle-orm";
import { budget_tb, transactions_tb } from "@/database/schema";

// Get screen width
const { width } = Dimensions.get("window");

const ProfileSection: React.FC = () => {
    return (
        <View className="flex-row items-center mt-5 mb-5">
            <View className="mr-4">
                <ProfilePic width={60} height={60} className="rounded-[35px]" />
            </View>
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text className="text-[16px] text-[#2B3854] font-lexend">
                        John Doe
                    </Text>
                    <View className="flex-row items-center ml-2">
                        <StreakIcon width={35} height={35} />
                    </View>
                </View>
            </View>
        </View>
    );
};

interface AddBudgetButtonProps {
    onPress: () => void;
}

const AddBudgetButton = ({ onPress }: AddBudgetButtonProps) => (
    <TouchableOpacity
        className="border border-dashed border-[#dadada] rounded-xl p-11 w-[90%] items-center justify-center bg-transparent"
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View className="flex-row items-center gap-2.5">
            <Plus size={24} color="#828282" />
            <Text className="text-lg text-[#666] font-lexend">Add Budget</Text>
        </View>
    </TouchableOpacity>
);

interface SettingsMenuItemProps {
    icon:
        | "chart"
        | "badge"
        | "history"
        | "settings"
        | "notification"
        | "about"
        | "privacy policy & terms";
    label: string;
    onPress: () => void;
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ icon, label, onPress }) => {
    const iconComponents = {
        chart: SpendingSummary,
        badge: StreaksBadges,
        history: ActivityLog,
        settings: SettingsCustomization,
        notification: Notifications,
        about: About,
        "privacy policy & terms": PrivacyPolicy,
    };

    const IconComponent = iconComponents[icon];

    return (
        <TouchableOpacity
            className="flex-row items-center justify-between py-2.5 pr-3.5"
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View className="flex-row items-center pl-5">
                <IconComponent width={16} height={16} className="w-4 h-4 mr-2" />
                <Text className="text-base text-[#2B3854] font-lexend ml-3">{label}</Text>
            </View>
            <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
    );
};

export default function ProfileScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const horizontalScrollViewRef = useRef<ScrollView>(null);
    const [showAddBudget, setShowAddBudget] = useState(false);
    const router = useRouter();

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

    const handleMenuPress = (menuItem: string) => {
        console.log(`Menu item pressed: ${menuItem}`);
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        if (offsetX > width * 0.3) {
            // Adjust threshold as needed
            setShowAddBudget(true);
        } else {
            setShowAddBudget(false);
        }
    };

    const [budgetAmount, setBudgetAmount] = useState(0);
    const [budgetSpent, setBudgetSpent] = useState(0);

    useFocusEffect(
        useCallback(() => {
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

            GetBudgetSpendAll();
            GetBudgetAmountAll();
        }, []),
    );

    return (
        <>
            <SafeAreaView className="h-full" style={{ backgroundColor: "#fff" }}>
                <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                    <Header name="Profile" />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <ProfileSection />

                        <BudgetCard
                            name="Budget"
                            amount={budgetAmount}
                            spent={String(budgetSpent)}
                            percentage={1}
                        />

                        <View className="py-2 mt-[20px]">
                            <Text className="text-lg text-[#2B3854] font-medium font-lexend">
                                Your Activity
                            </Text>
                        </View>

                        <SettingsMenuItem
                            icon="chart"
                            label="Spending Summary"
                            onPress={() => router.push("/+not-found")}
                        />
                        <SettingsMenuItem
                            icon="badge"
                            label="Streaks & Badges"
                            onPress={() => router.push("/badges")}
                        />
                        <SettingsMenuItem
                            icon="history"
                            label="Activity Log"
                            onPress={() => router.push("/+not-found")}
                        />

                        <View className="py-2.5">
                            <Text className="text-lg text-[#2B3854] font-medium font-lexend">
                                General
                            </Text>
                        </View>

                        <SettingsMenuItem
                            icon="settings"
                            label="Settings & Customizations"
                            onPress={() => router.push("/+not-found")}
                        />
                        <SettingsMenuItem
                            icon="notification"
                            label="Notifications"
                            onPress={() => router.push("/+not-found")}
                        />
                        <SettingsMenuItem
                            icon="about"
                            label="About"
                            onPress={() => router.push("/+not-found")}
                        />
                        <SettingsMenuItem
                            icon="privacy policy & terms"
                            label="Privacy Policy & Terms"
                            onPress={() => router.push("/+not-found")}
                        />
                    </ScrollView>
                </View>
            </SafeAreaView>

            <BudgetTypeSelectorModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSelect={handleSelectBudgetType}
            />

            <StatusBar style="dark" backgroundColor="white" />
        </>
    );
}
