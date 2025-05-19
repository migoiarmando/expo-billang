/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Miguel Armand B. Sta. Ana [M, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
 
    Feature Title: Streak Modal
    Description:  
        - This is the modal that pops up when logged in first time of.

-------------------------------------------------------------------------------------------------------------- */
import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ModalFire from "@/assets/images/modalfire.svg";
import { db } from "@/database";
import { transactions_tb } from "@/database/schema";
import { eq } from "drizzle-orm";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.7;
const SPRING_CONFIG = {
    damping: 50,
    stiffness: 300,
    mass: 0.5,
};

const MOTIVATIONAL_SENTENCES = [
    "You're on fire! Keep it up!",
    "Consistency is key—great job!",
    "Stay on track, you're doing amazing!",
    "Your streak is growing strong!",
    "Keep the momentum going!",
    "Smart budgeting pays off!",
    "Another day, another win!",
];

interface StreakModalProps {
    isVisible: boolean;
    onClose: () => void;
    streakCount: number;
    userName: string;
    avgMonthly: number;
    avgDaily: number;
    weekStreak: boolean[];
}

const StreakModal: React.FC<StreakModalProps> = ({
    isVisible,
    onClose,
    streakCount,
    userName,
    avgMonthly: avgMonthlyProp,
    avgDaily: avgDailyProp,
    weekStreak,
}) => {
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const context = useSharedValue({ y: 0 });
    const active = useSharedValue(false);
    const streakViewRef = useRef(null);
    const [hideShare, setHideShare] = useState(false);

    // Pick a random motivational sentence each time the modal is shown
    const [sentence, setSentence] = React.useState(MOTIVATIONAL_SENTENCES[0]);
    React.useEffect(() => {
        if (isVisible) {
            setSentence(
                MOTIVATIONAL_SENTENCES[
                    Math.floor(Math.random() * MOTIVATIONAL_SENTENCES.length)
                ],
            );
        }
    }, [isVisible]);

    const [avgDaily, setAvgDaily] = React.useState<number>(0);
    const [avgMonthly, setAvgMonthly] = React.useState<number>(0);

    React.useEffect(() => {
        if (!isVisible) return;

        async function calculateAverages() {
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

                const avgDay = totalSpent / 7;
                setAvgDaily(avgDay);

                const avgMonth = totalSpent / 30;
                setAvgMonthly(avgMonth);
            } catch (err) {
                console.error("Failed to calculate averages:", err);
                setAvgDaily(0);
                setAvgMonthly(0);
            }
        }

        calculateAverages();
    }, [isVisible]);

    const scrollTo = React.useCallback(
        (destination: number) => {
            "worklet";
            active.value = destination !== SCREEN_HEIGHT;
            translateY.value = withSpring(destination, SPRING_CONFIG);
        },
        [active, translateY],
    );

    const handleClose = () => {
        scrollTo(SCREEN_HEIGHT);
        runOnJS(onClose)();
    };

    React.useEffect(() => {
        if (isVisible) {
            scrollTo(SCREEN_HEIGHT - MODAL_HEIGHT);
        } else {
            scrollTo(SCREEN_HEIGHT);
        }
    }, [isVisible, scrollTo]);

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            const newTranslateY = event.translationY + context.value.y;
            translateY.value = Math.max(
                Math.min(newTranslateY, SCREEN_HEIGHT),
                SCREEN_HEIGHT - MODAL_HEIGHT,
            );
        })
        .onEnd((event) => {
            if (event.velocityY > 500 || event.translationY > MODAL_HEIGHT / 3) {
                runOnJS(handleClose)();
            } else {
                scrollTo(SCREEN_HEIGHT - MODAL_HEIGHT);
            }
        });

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const rBackdropStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(active.value ? 1 : 0),
            pointerEvents: active.value ? "auto" : "none",
        };
    });

    const handleShare = async () => {
        setHideShare(true);
        setTimeout(async () => {
            try {
                const uri = await captureRef(streakViewRef, {
                    format: "png",
                    quality: 1,
                });
                await Sharing.shareAsync(uri);
            } catch (error) {
                console.error("Error sharing streak:", error);
            }
            setHideShare(false);
        }, 200); // Increased delay for reliability
    };

    if (!isVisible) {
        return null;
    }

    // Days of the week for the streak bar
    const days = ["Sun", "M", "T", "W", "Th", "F", "Sat"];

    return (
        <>
            <Animated.View style={[styles.backdrop, rBackdropStyle]}>
                <Pressable style={styles.backdropButton} onPress={handleClose} />
            </Animated.View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.modalContainer, rBottomSheetStyle]}>
                    <View style={styles.modalContent}>
                        <View
                            ref={streakViewRef}
                            collapsable={false}
                            style={{ width: "100%" }}
                        >
                            <View style={styles.fireContainer}>
                                <ModalFire width={90} height={90} />
                                <Text style={styles.streakNumber}>{streakCount}</Text>
                            </View>
                            <Text style={styles.streakLabel}>Days Streak</Text>
                            <Text style={styles.motivation}>
                                {sentence.replace("Doe", userName)}
                            </Text>
                            <View style={styles.streakBar}>
                                {days.map((day, idx) => (
                                    <View key={idx} style={styles.streakDay}>
                                        <ModalFire
                                            width={22}
                                            height={22}
                                            opacity={weekStreak[idx] ? 1 : 0.2}
                                            fill={weekStreak[idx] ? "#FF9900" : "#BDBDBD"}
                                        />
                                        <Text
                                            style={[
                                                styles.streakDayLabel,
                                                {
                                                    color: weekStreak[idx]
                                                        ? "#FF9900"
                                                        : "#BDBDBD",
                                                },
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.statsRow}>
                                <View style={styles.statsBox}>
                                    <Text style={styles.statsLabel}>
                                        Avg. Monthly Spending
                                    </Text>
                                    <Text style={styles.statsValue}>
                                        ₱
                                        {avgMonthly.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })}
                                    </Text>
                                </View>
                                <View style={styles.statsBox}>
                                    <Text style={styles.statsLabel}>
                                        Avg. Daily Spending
                                    </Text>
                                    <Text style={styles.statsValue}>
                                        ₱
                                        {avgDaily.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {!hideShare && (
                            <TouchableOpacity
                                style={styles.shareButton}
                                onPress={handleShare}
                            >
                                <Text style={styles.shareButtonText}>Share Streak</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </GestureDetector>
        </>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 1,
    },
    backdropButton: {
        flex: 1,
    },
    modalContainer: {
        height: MODAL_HEIGHT,
        width: "100%",
        backgroundColor: "white",
        position: "absolute",
        top: 145,
        left: 0,
        right: 0,
        borderTopLeftRadius: 51,
        borderTopRightRadius: 51,
        zIndex: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingBottom: 160,
        width: "100%",
    },
    fireContainer: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    streakNumber: {
        position: "absolute",
        top: 28,
        left: 2,
        right: 0,
        textAlign: "center",
        fontSize: 42,
        color: "#FFFFFF",
        fontFamily: "Lexend_700Bold",
    },
    streakLabel: {
        fontSize: 24,
        textAlign: "center",
        color: "#2B3854",
        marginTop: 8,
        fontFamily: "Lexend_600SemiBold",
    },
    motivation: {
        fontSize: 16,
        color: "#676666",
        marginTop: 2,
        marginBottom: 10,
        fontFamily: "Lexend_400Regular",
        textAlign: "center",
    },
    streakBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        gap: 25,
    },
    streakDay: {
        alignItems: "center",
        marginHorizontal: 2,
    },
    streakDayLabel: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 2,
        fontFamily: "Lexend_400Regular",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
        marginBottom: 18,
        gap: 10,
    },
    statsBox: {
        flex: 1,
        backgroundColor: "#F6F6F6",
        borderRadius: 12,
        padding: 10,
        alignItems: "center",
        marginHorizontal: 4,
    },
    statsLabel: {
        fontSize: 12,
        color: "#676666",
        marginBottom: 4,
        fontFamily: "Lexend_400Regular",
    },
    statsValue: {
        fontSize: 16,
        color: "#2B3854",
        fontFamily: "Lexend_600SemiBold",
    },
    shareButton: {
        backgroundColor: "#E87809",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 100,
        minWidth: 160,
        alignSelf: "center",
        marginTop: 10,
        alignItems: "center",
    },
    shareButtonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Lexend_400Regular",
    },
});

export default StreakModal;
