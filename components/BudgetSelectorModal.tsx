/* --------------------------------------------------------------------------------------------------------------
    
    Last edited:
        Miguel Armand B. Sta. Ana [May 17, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    
    Feature Title: Budget Selector Modal
    Description:
        - This is the modal that pops up when the user selects a budget from the budget screen.

-------------------------------------------------------------------------------------------------------------- */
import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions, FlatList } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";


import GrayIcon from "@/assets/smallbudgeticons/gray_smallbudgeticon.svg";
import BlueIcon from "@/assets/smallbudgeticons/blue_budgeticon.svg";
import OrangeIcon from "@/assets/smallbudgeticons/orange_budgeticon.svg";
import RedIcon from "@/assets/smallbudgeticons/red_budgeticon.svg";
import GreenIcon from "@/assets/smallbudgeticons/green_budgeticon.svg";
import PinkIcon from "@/assets/smallbudgeticons/pink_budgeticon.svg";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.55;
const SPRING_CONFIG = {
    damping: 50,
    stiffness: 300,
    mass: 0.5,
};

// Map themeColor to icon
const iconMap: Record<string, React.FC<any>> = {
    "#E6E6E6": GrayIcon,
    "#87CDFF": BlueIcon,
    "#FEC794": OrangeIcon,
    "#FF8787": RedIcon,
    "#9FE0A9": GreenIcon,
    "#FADDFF": PinkIcon,
};

export interface Budget {
    id: number;
    title: string;
    themeColor: string;
}

interface BudgetSelectModalProps {
    isVisible: boolean;
    onClose: () => void;
    budgets: Budget[];
    onSelect: (budget: Budget) => void;
}

const BudgetSelectModal: React.FC<BudgetSelectModalProps> = ({
    isVisible,
    onClose,
    budgets,
    onSelect,
}) => {
    const translateY = useSharedValue(MODAL_HEIGHT);
    const context = useSharedValue({ y: 0 });
    const active = useSharedValue(false);

    const scrollTo = (destination: number) => {
        "worklet";
        active.value = destination !== MODAL_HEIGHT;
        translateY.value = withSpring(destination, SPRING_CONFIG);
    };

    const handleClose = () => {
        scrollTo(MODAL_HEIGHT);
        runOnJS(onClose)();
    };

    React.useEffect(() => {
        if (isVisible) {
            translateY.value = withSpring(0, SPRING_CONFIG);
        } else {
            translateY.value = withSpring(MODAL_HEIGHT, SPRING_CONFIG);
        }
    }, [isVisible]);

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            const newTranslateY = event.translationY + context.value.y;
            translateY.value = Math.max(0, Math.min(newTranslateY, MODAL_HEIGHT));
        })
        .onEnd((event) => {
            if (event.velocityY > 500 || event.translationY > MODAL_HEIGHT / 3) {
                runOnJS(handleClose)();
            } else {
                translateY.value = withSpring(0, SPRING_CONFIG);
            }
        });

    const rBottomSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const rBackdropStyle = useAnimatedStyle(() => ({
        opacity: withTiming(active.value ? 1 : 0),
        pointerEvents: active.value ? "auto" : "none",
    }));

    if (!isVisible) return null;

    console.log("Budgets passed to modal:", budgets);

    return (
        <>
            <Animated.View style={[styles.backdrop, rBackdropStyle]}>
                <Pressable style={styles.backdropButton} onPress={handleClose} />
            </Animated.View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.modalContainer, rBottomSheetStyle]}>
                    <Text style={styles.title}>Select Budget</Text>
                    {budgets.length <= 2 ? (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                marginTop: 24,
                            }}
                        >
                            {budgets.map((item) => {
                                const Icon = iconMap[item.themeColor] || GrayIcon;
                                return (
                                    <Pressable
                                        key={item.id}
                                        style={{
                                            alignItems: "center",
                                            marginHorizontal: 16,
                                            width: 90,
                                        }}
                                        onPress={() => {
                                            onSelect(item);
                                            handleClose();
                                        }}
                                    >
                                        <Icon width={48} height={48} />
                                        <Text style={styles.folderText} numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    ) : (
                        <FlatList
                            data={budgets}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={3}
                            contentContainerStyle={styles.grid}
                            style={{ flexGrow: 1 }}
                            renderItem={({ item }) => {
                                const Icon = iconMap[item.themeColor] || GrayIcon;
                                return (
                                    <Pressable
                                        style={styles.folder}
                                        onPress={() => {
                                            onSelect(item);
                                            handleClose();
                                        }}
                                    >
                                        <Icon width={48} height={48} />
                                        <Text style={styles.folderText} numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                    </Pressable>
                                );
                            }}
                        />
                    )}
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
        backgroundColor: "transparent",
        zIndex: 1,
    },
    backdropButton: {
        flex: 1,
    },
    modalContainer: {
        height: MODAL_HEIGHT,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        zIndex: 2,
        paddingTop: 24,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    title: {
        fontSize: 18,
        marginBottom: 12,
        fontFamily: "Lexend_600SemiBold",
    },
    grid: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    folder: {
        flex: 1,
        alignItems: "center",
        margin: 8,
        minWidth: 90,
        maxWidth: 110,
    },
    folderText: {
        marginTop: 8,
        fontSize: 13,
        color: "#222",
        textAlign: "center",
        fontFamily: "Lexend_400Regular",
    },
});

export default BudgetSelectModal;
