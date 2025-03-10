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
    StyleSheet,
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

// Get screen width
const { width } = Dimensions.get("window");

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
            Settings
        </Text>
        <View style={styles.headerIcons}>
            <UserIcon width={32} height={32} style={styles.icon} />
            <NotificationIcon width={32} height={32} style={styles.icon} />
        </View>
    </View>
);

const ProfileSection: React.FC = () => {
    const [fontsLoaded] = useFonts({
        Lexend_300Light,
    });

    if (!fontsLoaded) {
        return null; // Or a loading indicator
    }

    return (
        <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
                <ProfilePic width={100} height={100} style={styles.avatar} />
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.nameStreak}>
                    <Text
                        style={[
                            styles.name,
                            { fontFamily: "Lexend_400Regular" },
                        ]}
                    >
                        John Doe
                    </Text>
                    <View style={styles.streakContainer}>
                        <StreakIcon
                            width={35}
                            height={35}
                            style={styles.streakIcon}
                        />
                    </View>
                </View>
                <Text style={[styles.email, { fontFamily: "Lexend_300Light" }]}>
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
        style={styles.addBudgetContainer}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.addBudgetContent}>
            <Plus size={24} color="#828282" />
            <Text
                style={[
                    styles.addBudgetText,
                    { fontFamily: "Lexend_300Light" },
                ]}
            >
                Add Budget
            </Text>
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
                style={styles.menuItem}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View style={styles.menuItemLeft}>
                    <IconComponent
                        width={16}
                        height={16}
                        style={styles.menuIcon}
                    />
                    <Text
                        style={[
                            styles.menuItemText,
                            {
                                fontFamily: "Lexend_400Regular",
                                color: "#2B3854",
                            },
                        ]}
                    >
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
            <SafeAreaView style={styles.container}>
                <CustomStatusBar />
                <Header />

                <ScrollView
                    style={styles.mainScrollView}
                    showsVerticalScrollIndicator={false}
                >
                    <ProfileSection />

                    <View style={styles.budgetCardsSection}>
                        <ScrollView
                            ref={horizontalScrollViewRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            contentContainerStyle={styles.scrollViewContent}
                        >
                            <View style={styles.budgetCardWrapper}>
                                <BudgetCard
                                    name="Monthly Budget"
                                    amount={5000}
                                    spent="2500"
                                    percentage={50}
                                />
                            </View>
                            <View style={styles.budgetCardWrapper}>
                                <AddBudgetButton onPress={handleAddBudget} />
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionTitleText}>
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

                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionTitleText}>General</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollViewContent: {
        paddingHorizontal: 0,
    },
    budgetCardsSection: {
        height: 180,
        marginTop: -10,
    },
    budgetCardWrapper: {
        width: width,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    sectionTitle: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sectionTitleText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#2B3854",
        fontFamily: "Lexend_400Regular",
    },
    menuScrollView: {
        flex: 1,
    },
    statusBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 23,
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
        fontWeight: "400",
        letterSpacing: -0.48,
        color: "#2B3854",
    },
    headerIcons: {
        flexDirection: "row",
        gap: 12,
    },
    avatarContainer: {
        marginRight: 30,
        marginLeft: -27,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 35,
    },
    infoContainer: {
        flex: 1,
    },
    nameStreak: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    name: {
        fontSize: 22,
        color: "#2B3854",
    },
    email: {
        fontSize: 16,
        color: "#666",
    },
    streakContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    streakIcon: {
        width: 35,
        height: 35,
    },
    streakCount: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#FF9500",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 30,
        backgroundColor: "transparent",
        borderRadius: 12,
        marginHorizontal: 20,
        marginTop: -10,
        marginBottom: -10,
    },
    settingsContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingRight: 14,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 20,
    },
    menuIcon: {
        width: 16,
        height: 16,
        marginRight: 8,
    },
    menuItemText: {
        fontSize: 16,
        color: "#2B3854",
    },
    addBudgetContainer: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#dadada",
        borderRadius: 12,
        padding: 45,
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    addBudgetContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    addBudgetText: {
        fontSize: 18,
        color: "#666",
    },
    mainScrollView: {
        flex: 1,
    },
});
