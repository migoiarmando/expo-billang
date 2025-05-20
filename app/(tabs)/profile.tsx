/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
         Miguel Armand B. Sta. Ana [May 20, 2025]
        John Bicierro [Mar 17, 2025]


    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-17
    Feature Title: Profile Screen
    Description:
        - The Profile Screen provides an overview of the user's profile, including personal details, activity, and settings.
        - Users can manage their profile, view streaks, and access settings from this screen.

-------------------------------------------------------------------------------------------------------------- */

import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import BudgetTypeSelectorModal from "@/components/BudgetTypeSelectorModal";
import { StatusBar } from "expo-status-bar";
import BudgetCard from "@/components/BudgetCard";
import ProfilePic from "@/assets/images/profilepic.svg";
import { useRouter } from "expo-router";
import StreakIcon from "@/assets/streaksandbadges/streakfire.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStreak } from "@/utils/streak";
import { getNotificationsEnabled } from "@/utils/notifications";

// Import SVG files directly
import SpendingSummary from "@/assets/images/spendingsummary.svg";
import StreaksBadges from "@/assets/images/streaksbadges.svg";
import ActivityLog from "@/assets/images/activitylog.svg";
import SettingsCustomization from "@/assets/images/settingscustomization.svg";
import Notifications from "@/assets/images/notifications.svg";
import About from "@/assets/images/about.svg";
import PrivacyPolicy from "@/assets/images/privacypolicy.svg";
import MiniPiggyPioneer from "@/assets/minibadges/mini_piggy_pioneer.svg";
import MiniExpenseExplorer from "@/assets/minibadges/mini_expense_explorer.svg";

import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "@/database";
import { eq, sql, and } from "drizzle-orm";
import { budget_tb, transactions_tb, user_tb } from "@/database/schema";
import * as ImagePicker from "expo-image-picker";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import AboutModal from "@/components/AboutModal";
import ToggleOn from "@/assets/icons/toggle_on.svg";
import ToggleOff from "@/assets/icons/toggle_off.svg";
import NotificationIcon from "@/assets/images/notification.svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useUser } from "@/contexts/UserContext";

const ProfileSection: React.FC<{
    profileImageUri: string | null;
    userName: string;
    streakCount: number;
    miniBadges?: React.ReactNode;
}> = ({ profileImageUri, userName, streakCount, miniBadges }) => {
    return (
        <View className="flex-row items-center mt-5 mb-5">
            <View className="mr-4">
                {profileImageUri ? (
                    <Image
                        source={{ uri: profileImageUri }}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                        }}
                    />
                ) : (
                    <ProfilePic width={100} height={100} className="rounded-[50px]" />
                )}
            </View>
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text className="text-[26px] text-[#2B3854] font-lexend">
                        {userName || "Your Name"}
                    </Text>
                    <View className="flex-row items-center ml-2">
                        <StreakIcon width={25} height={25} style={{ marginTop: 4 }} />
                        <Text
                            style={{
                                fontFamily: "Lexend_400Regular",
                                fontSize: 20,
                                color: "#FFB636",
                                marginLeft: 6,
                                marginTop: 3,
                            }}
                        >
                            {streakCount}
                        </Text>
                    </View>
                </View>
                {/* Mini badges row */}
                {miniBadges && <View className="flex-row mt-2 gap-2">{miniBadges}</View>}
            </View>
        </View>
    );
};

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
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: () => void;
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({
    icon,
    label,
    onPress,
    showToggle = false,
    toggleValue = false,
    onToggle,
}) => {
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
            className="flex-row items-center justify-between py-2 pr-3 mb-1"
            onPress={showToggle ? onToggle : onPress}
            activeOpacity={0.7}
        >
            <View className="flex-row items-center pl-3">
                <IconComponent width={20} height={20} className="w-4 h-4 mr-2" />
                <Text
                    className="text-base text-[#2B3854] font-lexend ml-2"
                    style={{ fontSize: 18, lineHeight: 24 }}
                >
                    {label}
                </Text>
            </View>
            {showToggle ? (
                toggleValue ? (
                    <ToggleOn width={38} height={28} />
                ) : (
                    <ToggleOff width={38} height={28} />
                )
            ) : (
                <ChevronRight size={20} color="#666" />
            )}
        </TouchableOpacity>
    );
};

export default function ProfileScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter();
    const { name, profileImageUri, setProfileImageUri } = useUser();
    const [privacyVisible, setPrivacyVisible] = useState(false);
    const [aboutVisible, setAboutVisible] = useState(false);
    const [streakCount, setStreakCount] = useState(0);
    const [piggyPioneerEarned, setPiggyPioneerEarned] = useState(false);
    const [expenseExplorerEarned, setExpenseExplorerEarned] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [budgetColor, setBudgetColor] = useState("#E6E6E6");

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleSelectBudgetType = (type: "default" | "structured") => {
        console.log("Selected budget type:", type);
        setIsModalVisible(false);
        // Handle the selected budget type here
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

    useFocusEffect(
        useCallback(() => {
            async function loadBadges() {
                try {
                    const piggy = await AsyncStorage.getItem("piggyPioneerEarned");
                    setPiggyPioneerEarned(piggy === "true");
                    const expense = await AsyncStorage.getItem("expenseExplorerEarned");
                    setExpenseExplorerEarned(expense === "true");
                } catch (err) {
                    console.error("Error loading badges:", err);
                }
            }
            loadBadges();
        }, []),
    );

    useEffect(() => {
        async function loadStreakCount() {
            try {
                const streak = await getStreak();
                setStreakCount(streak);
            } catch (err) {
                console.error("Error loading streak count:", err);
            }
        }
        async function loadNotificationsEnabled() {
            try {
                const val = await AsyncStorage.getItem("notificationsEnabled");
                if (val === null) {
                    setNotificationsEnabled(true);
                    AsyncStorage.setItem("notificationsEnabled", "true");
                } else {
                    setNotificationsEnabled(val === "true");
                }
            } catch (err) {
                console.error("Error loading notifications enabled:", err);
            }
        }
        async function loadHomeCardColor() {
            const color = await AsyncStorage.getItem("homeBudgetCardColor");
            if (color !== null && color !== undefined && color !== "")
                setBudgetColor(color);
            else setBudgetColor("#E6E6E6");
        }
        loadStreakCount();
        loadNotificationsEnabled();
        loadHomeCardColor();
    }, []);

    useFocusEffect(
        useCallback(() => {
            async function loadHomeCardColor() {
                const color = await AsyncStorage.getItem("homeBudgetCardColor");
                if (color !== null && color !== undefined && color !== "")
                    setBudgetColor(color);
                else setBudgetColor("#E6E6E6");
            }
            loadHomeCardColor();
        }, []),
    );

    // Function to handle profile picture tap
    const handleProfilePicPress = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access gallery is required!");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setProfileImageUri(uri);
            await AsyncStorage.setItem("profileImageUri", uri);
        }
    };

    // When toggling notifications
    const handleToggleNotifications = async () => {
        setNotificationsEnabled((prev) => {
            AsyncStorage.setItem("notificationsEnabled", (!prev).toString());
            return !prev;
        });
    };

    const handleExportCSV = async () => {
        try {
            // 1. Fetch all budgets
            const budgets = await db.select().from(budget_tb);

            // 2. For each budget, fetch expenses and incomes
            let csv = "Budget,Amount,Total Expense,Total Income\n";
            let overallBudget = 0;
            let overallExpense = 0;
            let overallIncome = 0;

            for (const budget of budgets) {
                const expenses = await db
                    .select()
                    .from(transactions_tb)
                    .where(
                        and(
                            eq(transactions_tb.budgetId, budget.id),
                            eq(transactions_tb.type, "Expense"),
                        ),
                    );
                const incomes = await db
                    .select()
                    .from(transactions_tb)
                    .where(
                        and(
                            eq(transactions_tb.budgetId, budget.id),
                            eq(transactions_tb.type, "Income"),
                        ),
                    );

                const totalExpense = expenses.reduce(
                    (sum, tx) => sum + (tx.amount || 0),
                    0,
                );
                const totalIncome = incomes.reduce(
                    (sum, tx) => sum + (tx.amount || 0),
                    0,
                );

                csv += `${budget.title},${budget.amount},${totalExpense},${totalIncome}\n`;

                overallBudget += budget.amount;
                overallExpense += totalExpense;
                overallIncome += totalIncome;
            }

            csv += "\n";
            csv += `Overall Budget,${overallBudget}\n`;
            csv += `Overall Expense,${overallExpense}\n`;
            csv += `Overall Income,${overallIncome}\n`;

            // 3. Write to file (cache)
            const fileUri = FileSystem.cacheDirectory + "spending_summary.csv";
            await FileSystem.writeAsStringAsync(fileUri, csv, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            // 4. Download to device (Android only)
            if (Platform.OS === "android") {
                const permissions =
                    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (permissions.granted) {
                    const base64 = await FileSystem.readAsStringAsync(fileUri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    const newUri =
                        await FileSystem.StorageAccessFramework.createFileAsync(
                            permissions.directoryUri,
                            "spending_summary.csv",
                            "text/csv",
                        );
                    await FileSystem.writeAsStringAsync(newUri, base64, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    Alert.alert("Success", "CSV file saved to Downloads!");
                } else {
                    Alert.alert(
                        "Permission denied",
                        "Cannot save file without permission.",
                    );
                }
            }

            // 5. Share the file (all platforms)
            await Sharing.shareAsync(fileUri, {
                mimeType: "text/csv",
                dialogTitle: "Share Spending Summary CSV",
            });
        } catch (err) {
            Alert.alert("Error", "Failed to export CSV: " + (err as Error).message);
        }
    };

    return (
        <>
            <SafeAreaView className="h-full" style={{ backgroundColor: "#fff" }}>
                <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Header name="Profile" />
                        <TouchableOpacity
                            onPress={async () => {
                                const enabled = await getNotificationsEnabled();
                                if (enabled) {
                                    router.push("/notifications");
                                } else {
                                    router.push("/offnotifications");
                                }
                            }}
                            style={{ marginLeft: 0 }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <NotificationIcon width={32} height={32} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <ProfileSection
                            profileImageUri={profileImageUri}
                            userName={name}
                            streakCount={streakCount}
                            miniBadges={
                                <>
                                    {piggyPioneerEarned && (
                                        <MiniPiggyPioneer width={32} height={32} />
                                    )}
                                    {expenseExplorerEarned && (
                                        <MiniExpenseExplorer width={32} height={32} />
                                    )}
                                </>
                            }
                        />

                        <BudgetCard
                            name="Overall Budget"
                            amount={budgetAmount}
                            spent={String(budgetSpent)}
                            percentage={1}
                            themeColor={budgetColor}
                        />

                        <View className="py-2 mt-[20px]">
                            <Text className="text-lg text-[#2B3854] font-medium font-lexend">
                                Your Activity
                            </Text>
                        </View>

                        <SettingsMenuItem
                            icon="chart"
                            label="Spending Summary"
                            onPress={handleExportCSV}
                        />
                        <SettingsMenuItem
                            icon="badge"
                            label="Streaks & Badges"
                            onPress={() => router.push("/badges")}
                        />
                        <SettingsMenuItem
                            icon="history"
                            label="Activity Log"
                            onPress={() => router.push("/activitylog")}
                        />

                        <View className="py-2.5">
                            <Text className="text-lg text-[#2B3854] font-medium font-lexend">
                                General
                            </Text>
                        </View>

                        <SettingsMenuItem
                            icon="notification"
                            label="Notifications"
                            showToggle
                            toggleValue={notificationsEnabled}
                            onToggle={handleToggleNotifications}
                            onPress={() => {}}
                        />
                        <SettingsMenuItem
                            icon="settings"
                            label="Settings & Customizations"
                            onPress={() => router.push("/settings")}
                        />
                        <SettingsMenuItem
                            icon="about"
                            label="About"
                            onPress={() => setAboutVisible(true)}
                        />
                        <SettingsMenuItem
                            icon="privacy policy & terms"
                            label="Privacy Policy & Terms"
                            onPress={() => setPrivacyVisible(true)}
                        />
                    </ScrollView>
                </View>
            </SafeAreaView>

            <BudgetTypeSelectorModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSelect={handleSelectBudgetType}
            />

            <PrivacyPolicyModal
                isVisible={privacyVisible}
                onClose={() => setPrivacyVisible(false)}
            />

            <AboutModal isVisible={aboutVisible} onClose={() => setAboutVisible(false)} />

            <StatusBar style="dark" backgroundColor="white" />
        </>
    );
}
