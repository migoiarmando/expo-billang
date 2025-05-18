/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
         Miguel Armand B. Sta. Ana [May 18, 2025]
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
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
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
import { eq, sql } from "drizzle-orm";
import { budget_tb, transactions_tb, user_tb } from "@/database/schema";
import * as ImagePicker from "expo-image-picker";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import AboutModal from "@/components/AboutModal";
import ToggleOn from "@/assets/icons/toggle_on.svg";
import ToggleOff from "@/assets/icons/toggle_off.svg";
import NotificationIcon from "@/assets/images/notification.svg";

const ProfileSection: React.FC<{
    profileImageUri: string | null;
    onPressProfilePic: () => void;
    userName: string;
    streakCount: number;
    miniBadges?: React.ReactNode;
}> = ({ profileImageUri, onPressProfilePic, userName, streakCount, miniBadges }) => {
    return (
        <View className="flex-row items-center mt-5 mb-5">
            <TouchableOpacity onPress={onPressProfilePic} className="mr-4">
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
            </TouchableOpacity>
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
    const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [privacyVisible, setPrivacyVisible] = useState(false);
    const [aboutVisible, setAboutVisible] = useState(false);
    const [streakCount, setStreakCount] = useState(0);
    const [piggyPioneerEarned, setPiggyPioneerEarned] = useState(false);
    const [expenseExplorerEarned, setExpenseExplorerEarned] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
        async function loadProfileImage() {
            const uri = await AsyncStorage.getItem("profileImageUri");
            if (uri) setProfileImageUri(uri);
        }
        async function loadUserName() {
            try {
                const users = await db.select().from(user_tb);
                if (users.length > 0) {
                    setUserName(users[0].name || "Your Name");
                }
            } catch (err) {
                console.error("Error loading user name:", err);
            }
        }
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
        loadProfileImage();
        loadUserName();
        loadStreakCount();
        loadNotificationsEnabled();
    }, []);

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
                            onPressProfilePic={handleProfilePicPress}
                            userName={userName}
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
                            onPress={() => router.push("/spendingsummary")}
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
                            onPress={() => router.push("/+not-found")}
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
