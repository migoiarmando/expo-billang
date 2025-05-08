import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import StreakFire from "../assets/streaksandbadges/streakfire.svg";
import GrayFire from "../assets/streaksandbadges/grayfire.svg";
import EarnedPiggyPioneer from "../assets/streaksandbadges/earned/earned_piggy_pioneer.svg";
import IncompleteExpenseExplorer from "../assets/streaksandbadges/incomplete/incomplete_expense_explorer.svg";
import IncompleteDebtSlayer from "../assets/streaksandbadges/incomplete/incomplete_debt_slayer.svg";
import IncompleteSovereignSavior from "../assets/streaksandbadges/incomplete/incomplete_sovereign_slayer.svg";
import IncompleteGOG from "../assets/streaksandbadges/incomplete/incomplete_gog.svg";
import BigFireStreak from "../assets/streaksandbadges/bigfirestreak.svg";

const Badges: React.FC = () => {
    // Data
    const streakCount = 2;
    const userName = "Doe";
    const statsData = { weeks: 0, days: 2, avgSpent: "₱1,000" };
    const days = [
        { day: "S", isActive: true },
        { day: "M", isActive: true },
        { day: "T", isActive: false },
        { day: "W", isActive: false },
        { day: "Th", isActive: false },
        { day: "F", isActive: false },
        { day: "S", isActive: false },
    ];
    const badges = [
        {
            title: "Piggy Pioneer",
            description: "User has spent money for the first time.",
            icon: EarnedPiggyPioneer,
            status: "earned" as const,
        },
        {
            title: "Expense Explorer",
            description: "User logs their first 10 expenses",
            icon: IncompleteExpenseExplorer,
            status: "incomplete" as const,
        },
        {
            title: "Debt Slayer",
            description:
                "User makes on-time debt payments for a full month without missing a due date.",
            icon: IncompleteDebtSlayer,
            status: "incomplete" as const,
        },
        {
            title: "Sovereign Saver",
            description: "User successfully follows their budget for one full month",
            icon: IncompleteSovereignSavior,
            status: "incomplete" as const,
        },
        {
            title: "Guardian of Gold",
            description:
                "User consistently saves at least 20% of their income for three consecutive months.",
            icon: IncompleteGOG,
            status: "incomplete" as const,
        },
    ];

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
            <Text className="font-lexendSemiBold text-[#303030] text-2xl tracking-[0.48px] mt-2 mb-[7px]">
                Days Streak
            </Text>
            <Text className="font-lexend text-[#606060] text-base font-normal tracking-[0.32px]">
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
                >
                    {day}
                </Text>
            </View>
        );
    };

    const StreakCalendar = () => (
        <View className="flex flex-row justify-between items-center mb-[30px]">
            {days.map((day, index) => (
                <CalendarDay key={index} day={day.day} isActive={day.isActive} />
            ))}
        </View>
    );


    const StatItem = ({ label, value }: { label: string; value: string | number }) => (
        <View className="bg-[#F6F6F6] p-[15px] rounded-[9px]">
            <Text className="font-lexend text-[#727272] text-xs font-normal tracking-[0.24px] mb-[5px]">
                {label}
            </Text>
            <Text className="font-lexendSemiBold text-[#413B35] text-base tracking-[0.32px]">
                {value}
            </Text>
        </View>
    );

    const StatsGrid = () => (
        <View className="flex flex-row justify-between mb-6 gap-2">
            <View className="flex-1 mr-2">
                <StatItem label="No. of Weeks" value={statsData.weeks} />
            </View>
            <View className="flex-1 mx-1">
                <StatItem label="No. of Days" value={statsData.days} />
            </View>
            <View className="flex-1 ml-2">
                <StatItem label="Avg. Daily Spent" value={statsData.avgSpent} />
            </View>
        </View>
    );

    const BadgeCard = ({
        title,
        description,
        icon: Icon,
        status,
    }: {
        title: string;
        description: string;
        icon: React.FC<any>;
        status: "earned" | "incomplete";
    }) => {
        const statusStyles = {
            earned: "text-[#80B154] bg-[#E9FFD4]",
            incomplete: "text-[#FE6B6B] bg-[#FFD4D4]",
        };

        return (
            <View className="flex flex-row items-start justify-between p-2.5 mb-2">
                <View className="flex flex-row items-start gap-5 flex-1">
                    <Icon width={55} height={61} />
                    <View className="flex flex-col flex-1 flex-shrink">
                        <Text className="font-lexendMedium text-[#616161] text-sm font-normal tracking-[-0.28px] flex-shrink">
                            {title}
                        </Text>
                        <Text className="font-lexendLight text-[#616161] text-xs font-normal tracking-[-0.24px] flex-shrink">
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
                    <Text className="font-lexend text-[#2B3854] text-2xl font-normal tracking-[-0.48px] mb-[25px]">
                        Badges
                    </Text>
                    {badges.map((badge, idx) => (
                        <BadgeCard key={idx} {...badge} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default Badges;
