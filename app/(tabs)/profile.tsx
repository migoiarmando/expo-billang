/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
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

import React, { useState, useRef } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { Plus, ChevronRight } from "lucide-react-native";
import BudgetTypeSelectorModal from "@/components/BudgetTypeSelectorModal";
import { StatusBar } from "expo-status-bar";
import BudgetCard from "@/components/BudgetCard";
import { SvgXml } from "react-native-svg";
import ProfilePic from "@/assets/images/profilepic.svg";
import { Link } from "expo-router";
import StreakIcon from "@/assets/images/streak.svg";
import { useFonts, Lexend_300Light } from "@expo-google-fonts/lexend";

// Import SVG files directly
import SpendingSummary from "@/assets/images/spendingsummary.svg";
import StreaksBadges from "@/assets/images/streaksbadges.svg";
import ActivityLog from "@/assets/images/activitylog.svg";
import SettingsCustomization from "@/assets/images/settingscustomization.svg";
import Notifications from "@/assets/images/notifications.svg";
import About from "@/assets/images/about.svg";
import PrivacyPolicy from "@/assets/images/privacypolicy.svg";
import UserIcon from "@/assets/images/usericon.svg";
import NotificationIcon from "@/assets/images/notification.svg";

// Get screen width
const { width } = Dimensions.get("window");

const CustomStatusBar = () => (
    <View className="flex-row justify-between items-center px-5 pt-[23px]">
        <View className="flex-row gap-2">
            <View className="w-8 h-8" />
            <View className="w-8 h-8" />
            <View className="w-8 h-8" />
        </View>
    </View>
);

const Header = () => (
    <View className="flex-row justify-between items-center px-5">
        <Text className="text-2xl text-[#2B3854] font-lexend">Settings</Text>
        <View className="flex-row gap-3">
            <NotificationIcon width={32} height={32} className="w-8 h-8" />
        </View>
    </View>
);

const ProfileSection: React.FC = () => {
    const [fontsLoaded] = useFonts({
        Lexend_300Light,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View className="flex-row items-center p-8 bg-transparent rounded-xl mx-5 -mt-2.5 -mb-2.5">
            <View className="mr-8 ml-[-27px]">
                <ProfilePic
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] rounded-[35px]"
                />
            </View>
            <View className="flex-1">
                <View className="flex-row items-center mb-1.5">
                    <Text className="text-[22px] text-[#2B3854] font-lexend">
                        John Doe
                    </Text>
                    <View className="flex-row items-center ml-2.5">
                        <StreakIcon
                            width={35}
                            height={35}
                            className="w-[35px] h-[35px]"
                        />
                    </View>
                </View>
                <Text className="text-base text-[#666] font-lexend">
                    johndoe@gmail.com
                </Text>
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

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({
    icon,
    label,
    onPress,
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
        <Link href="/+not-found" asChild>
            <TouchableOpacity
                className="flex-row items-center justify-between py-2.5 pr-3.5"
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View className="flex-row items-center pl-5">
                    <IconComponent
                        width={16}
                        height={16}
                        className="w-4 h-4 mr-2"
                    />
                    <Text className="text-base text-[#2B3854] font-lexend ml-3">
                        {label}
                    </Text>
                </View>
                <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
        </Link>
    );
};

export default function ProfileScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const horizontalScrollViewRef = useRef<ScrollView>(null);
    const [showAddBudget, setShowAddBudget] = useState(false);

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

    return (
        <>
            <SafeAreaView className="flex-1 bg-white">
                <CustomStatusBar />
                <Header />

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >
                    <ProfileSection />

                    <View className="h-[180px] -mt-2.5">
                        <ScrollView
                            ref={horizontalScrollViewRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            className="px-0"
                        >
                            <View className="w-screen px-5 justify-center">
                                <BudgetCard
                                    name="Monthly Budget"
                                    amount={5000}
                                    spent="2500"
                                    percentage={50}
                                />
                            </View>
                            <View className="w-screen px-5 justify-center">
                                <AddBudgetButton onPress={handleAddBudget} />
                            </View>
                        </ScrollView>
                    </View>

                    <View className="px-5 py-2.5">
                        <Text className="text-lg text-[#2B3854] font-medium font-lexend">
                            Your Activity
                        </Text>
                    </View>

                    <SettingsMenuItem
                        icon="chart"
                        label="Spending Summary"
                        onPress={() => handleMenuPress("spending")}
                    />
                    <SettingsMenuItem
                        icon="badge"
                        label="Streaks & Badges"
                        onPress={() => handleMenuPress("streaks")}
                    />
                    <SettingsMenuItem
                        icon="history"
                        label="Activity Log"
                        onPress={() => handleMenuPress("activity")}
                    />

                    <View className="px-5 py-2.5">
                        <Text className="text-lg text-[#2B3854] font-medium font-lexend">
                            General
                        </Text>
                    </View>

                    <SettingsMenuItem
                        icon="settings"
                        label="Settings & Customizations"
                        onPress={() => handleMenuPress("settings")}
                    />
                    <SettingsMenuItem
                        icon="notification"
                        label="Notifications"
                        onPress={() => handleMenuPress("notifications")}
                    />
                    <SettingsMenuItem
                        icon="about"
                        label="About"
                        onPress={() => handleMenuPress("about")}
                    />
                    <SettingsMenuItem
                        icon="privacy policy & terms"
                        label="Privacy Policy & Terms"
                        onPress={() =>
                            handleMenuPress("privacy policy & terms")
                        }
                    />
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
