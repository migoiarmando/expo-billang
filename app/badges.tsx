/* --------------------------------------------------------------------------------------------------------------
    Route -> "index.tsx" ->"badges.tsx"

    Last edited: 
        Miguel Armand B. Sta. Ana [May 10, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    Feature Title: Badges and Streaks Screen
    Description: Badges and streaks screen for users to track their badges and streaks.

-------------------------------------------------------------------------------------------------------------- */
import React, { useLayoutEffect, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import StreakFire from "../assets/streaksandbadges/streakfire.svg";
import GrayFire from "../assets/streaksandbadges/grayfire.svg";
import EarnedPiggyPioneer from "../assets/streaksandbadges/earned/earned_piggy_pioneer.svg";
import EarnedExpenseExplorer from "../assets/streaksandbadges/earned/earned_expense_explorer.svg";
import IncompletePiggyPioneer from "../assets/streaksandbadges/incomplete/incomplete_piggy_pioneer.svg";
import IncompleteExpenseExplorer from "../assets/streaksandbadges/incomplete/incomplete_expense_explorer.svg";
import IncompleteDebtSlayer from "../assets/streaksandbadges/incomplete/incomplete_debt_slayer.svg";
import IncompleteSovereignSavior from "../assets/streaksandbadges/incomplete/incomplete_sovereign_slayer.svg";
import IncompleteGOG from "../assets/streaksandbadges/incomplete/incomplete_gog.svg";
import BigFireStreak from "../assets/streaksandbadges/bigfirestreak.svg";
import { useNavigation, useRouter } from "expo-router";
import { getStreak } from "../utils/streak";
import { db } from "@/database";
import { transactions_tb } from "@/database/schema";
import { sql, eq } from "drizzle-orm";
import AsyncStorage from "@react-native-async-storage/async-storage";

const badgeRoutes: Record<string, string> = {
    "Piggy Pioneer": "/badgescreen/piggypioneer",
    "Expense Explorer": "/badgescreen/expense_explorer",
    "Debt Slayer": "/badgescreen/debt_slayer",
    "Sovereign Saver": "/badgescreen/sovereign_saver",
    "Guardian of Gold": "/badgescreen/gog",
};

const Badges: React.FC = () => {
    // Data
    const [streakCount, setStreakCount] = useState(0);
    const userName = "Doe";
    const [avgSpent, setAvgSpent] = useState<string>("₱1,000");
    const statsData = {
        weeks: Math.floor(streakCount / 7),
        days: streakCount,
        avgSpent,
    };
    const weekDays = ["Sun", "M", "T", "W", "Th", "F", "Sat"];
    const todayIndex = new Date().getDay();

    // Calculate which days should be active based on streakCount
    const days = weekDays.map((day, idx) => {
        const daysAgo = (todayIndex - idx + 7) % 7;
        return {
            day,
            isActive: streakCount > 0 && daysAgo < streakCount,
        };
    });
    const [piggyPioneerEarned, setPiggyPioneerEarned] = useState(false);
    const [expenseExplorerEarned, setExpenseExplorerEarned] = useState(false);

    const badges: {
        title: string;
        description: string;
        icon: React.FC<any>;
        status: "earned" | "incomplete";
        route: string;
    }[] = [
        {
            title: "Piggy Pioneer",
            description: "User has spent money for the first time.",
            icon: piggyPioneerEarned ? EarnedPiggyPioneer : IncompletePiggyPioneer,
            status: piggyPioneerEarned ? "earned" : "incomplete",
            route: piggyPioneerEarned
                ? "/badgescreen/earned_piggy_pioneer"
                : "/badgescreen/piggypioneer",
        },
        {
            title: "Expense Explorer",
            description: "User logs their first 10 expenses",
            icon: expenseExplorerEarned
                ? EarnedExpenseExplorer
                : IncompleteExpenseExplorer,
            status: expenseExplorerEarned ? "earned" : "incomplete",
            route: expenseExplorerEarned
                ? "/badgescreen/earned_expense_explorer"
                : "/badgescreen/expense_explorer",
        },
        {
            title: "Debt Slayer",
            description:
                "User makes on-time debt payments for a full month without missing a due date.",
            icon: IncompleteDebtSlayer,
            status: "incomplete",
            route: "/badgescreen/debt_slayer",
        },
        {
            title: "Sovereign Saver",
            description: "User successfully follows their budget for one full month",
            icon: IncompleteSovereignSavior,
            status: "incomplete",
            route: "/badgescreen/sovereign_saver",
        },
        {
            title: "Guardian of Gold",
            description:
                "User consistently saves at least 20% of their income for three consecutive months.",
            icon: IncompleteGOG,
            status: "incomplete",
            route: "/badgescreen/gog",
        },
    ];

    const navigation = useNavigation();
    const router = useRouter();
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Streaks",
            headerTitleStyle: {
                fontFamily: "Lexend_400Regular",
                fontSize: 24,
                color: "#2B3854",
            },
        });
    }, [navigation]);

    useEffect(() => {
        getStreak().then(setStreakCount);
    }, []);

    useEffect(() => {
        async function calculateAvgWeeklySpent() {
            try {
                const expenses = await db
                    .select({
                        amount: transactions_tb.amount,
                    })
                    .from(transactions_tb)
                    .where(eq(transactions_tb.type, "Expense"));

                const totalSpent = expenses.reduce(
                    (sum, tx) => sum + (tx.amount || 0),
                    0,
                );

                const avg = totalSpent / 7;

                setAvgSpent(
                    `₱${avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                );
            } catch (err) {
                console.error("Failed to calculate avg weekly spent:", err);
                setAvgSpent("₱0");
            }
        }

        calculateAvgWeeklySpent();
    }, []);

    useEffect(() => {
        AsyncStorage.getItem("piggyPioneerEarned").then((val) => {
            setPiggyPioneerEarned(val === "true");
        });
    }, []);

    useEffect(() => {
        AsyncStorage.getItem("expenseExplorerEarned").then((val) => {
            setExpenseExplorerEarned(val === "true");
        });
    }, []);

    // Streak Counter Component
    const StreakCounter = () => (
        <View className="flex flex-col justify-center items-center mb-6">
            <View className="relative flex items-center justify-center">
                <BigFireStreak width={63} height={71} />
                <Text
                    className="font-lexendSemiBold absolute text-white text-4xl tracking-[0.72px]"
                    style={{ bottom: 5, left: 0, right: 0, textAlign: "center" }}
                >
                    {streakCount}
                </Text>
            </View>
            <Text
                className="font-lexendSemiBold text-[#30] tracking-[0.48px] mt-2 mb-[7px]"
                style={{ fontSize: 24 }}
            >
                Days Streak
            </Text>
            <Text
                className="font-lexend text-[#606060] text-base font-normal tracking-[0.32px]"
                style={{ fontSize: 16 }}
            >
                Keep the flame burning, {userName}!
            </Text>
        </View>
    );

    const CalendarDay = ({ day, isActive }: { day: string; isActive: boolean }) => {
        return (
            <View className="flex flex-col items-center">
                {isActive ? (
                    <StreakFire width={16} height={16} />
                ) : (
                    <GrayFire width={16} height={16} />
                )}
                <Text
                    className={`font-lexend ${isActive ? "text-[#FF8F1F]" : "text-[#CACACA]"} text-xs font-normal mt-1`}
                    style={{ fontSize: 12 }}
                >
                    {day}
                </Text>
            </View>
        );
    };

    const StreakCalendar = () => (
        <View className="flex flex-row justify-between items-center mb-4">
            {days.map((day, index) => (
                <CalendarDay key={index} day={day.day} isActive={day.isActive} />
            ))}
        </View>
    );

    const StatItem = ({ label, value }: { label: string; value: string | number }) => (
        <View className="bg-[#F6F6F6] p-[15px] rounded-[9px]">
            <Text
                className="font-lexend text-[#727272] text-xs font-normal tracking-[0.24px] mb-[5px]"
                style={{ fontSize: 12 }}
            >
                {label}
            </Text>
            <Text
                className="font-lexendSemiBold text-[#413B35] text-base tracking-[0.32px]"
                style={{ fontSize: 16 }}
            >
                {value}
            </Text>
        </View>
    );

    const StatsGrid = () => (
        <View className="flex flex-row justify-between mb-3 gap-2">
            <View className="flex-1 mr-2">
                <StatItem label="No. of Weeks" value={statsData.weeks} />
            </View>
            <View className="flex-1 mx-1">
                <StatItem label="No. of Days" value={statsData.days} />
            </View>
            <View className="flex-1 ml-2">
                <StatItem label="Avg. Spent" value={statsData.avgSpent} />
            </View>
        </View>
    );

    const BadgeCard = ({
        title,
        description,
        icon: Icon,
        status,
        route,
    }: {
        title: string;
        description: string;
        icon: React.FC<any>;
        status: "earned" | "incomplete";
        route: string;
    }) => {
        const statusStyles = {
            earned: "text-[#80B154] bg-[#E9FFD4]",
            incomplete: "text-[#FE6B6B] bg-[#FFD4D4]",
        };

        return (
            <View className="flex flex-row items-start justify-between p-2 mb-1 border-b border-[#F8F8F8]">
                <View className="flex flex-row items-start gap-4 flex-1">
                    <Icon width={55} height={61} />
                    <View className="flex flex-col flex-1 flex-shrink mt-3">
                        <Text
                            className="font-lexendMedium text-[#616161] text-sm font-normal tracking-[-0.28px] flex-shrink"
                            style={{ fontSize: 14 }}
                        >
                            {title}
                        </Text>
                        <Text
                            className="font-lexendLight text-[#616161] text-xs font-normal tracking-[-0.24px] flex-shrink"
                            style={{ fontSize: 12 }}
                        >
                            {description}
                        </Text>
                    </View>
                </View>
                <View className="flex items-center justify-center self-stretch">
                    <Text
                        className={`font-lexend text-[11px] font-normal tracking-[-0.22px] px-2.5 py-[5px] rounded-[99px] ${
                            statusStyles[status]
                        }`}
                    >
                        {status === "earned" ? "Earned" : "Incomplete"}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <ScrollView className="w-full min-h-screen bg-white">
            <View className="flex flex-col px-5 py-[30px]">
                <StreakCounter />
                <StreakCalendar />
                <StatsGrid />
                <View>
                    <Text
                        className="font-lexend text-[#2B3854] text-2xl font-normal tracking-[-0.48px] mb-2"
                        style={{ fontSize: 24 }}
                    >
                        Badges
                    </Text>
                    {badges.map((badge, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => {
                                const route = badge.route;
                                if (route) router.push(route as any);
                            }}
                            activeOpacity={0.7}
                        >
                            <BadgeCard {...badge} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default Badges;
