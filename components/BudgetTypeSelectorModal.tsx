/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Miguel Armand B. Sta. Ana [Feb 23, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-2
    Feature Title: Budget Screen
    Description:  This is the modal that pops up when you tap the Add Budget on the Budget Screen.

-------------------------------------------------------------------------------------------------------------- */

import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Pressable,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.5;
const SPRING_CONFIG = {
    damping: 50,
    stiffness: 300,
    mass: 0.5,
};

interface BudgetTypeSelectorModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect?: (type: "default" | "structured") => void;
}

const BudgetTypeSelectorModal: React.FC<BudgetTypeSelectorModalProps> = ({
    isVisible,
    onClose,
    onSelect,
}) => {
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const context = useSharedValue({ y: 0 });
    const active = useSharedValue(false);
    const [selectedType, setSelectedType] = useState<
        "default" | "structured" | null
    >(null);

    const scrollTo = useCallback((destination: number) => {
        "worklet";
        active.value = destination !== SCREEN_HEIGHT;
        translateY.value = withSpring(destination, SPRING_CONFIG);
    }, []);

    const handleClose = useCallback(() => {
        scrollTo(SCREEN_HEIGHT);
        runOnJS(onClose)();
    }, [onClose]);

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
            if (
                event.velocityY > 500 ||
                event.translationY > MODAL_HEIGHT / 3
            ) {
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

    if (!isVisible) {
        return null;
    }

    const handleSelect = (type: "default" | "structured") => {
        setSelectedType(type);
        onSelect?.(type);
    };

    const BudgetOption = ({
        type,
        title,
        description,
    }: {
        type: "default" | "structured";
        title: string;
        description: string;
    }) => (
        <TouchableOpacity
            onPress={() => handleSelect(type)}
            style={[
                styles.optionContainer,
                selectedType === type && styles.selectedOption,
            ]}
        >
            <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{title}</Text>
                <Text style={styles.optionDescription}>{description}</Text>
            </View>
            <Image
                source={require("@/assets/images/rightarrow.png")}
                style={styles.optionArrow}
            />
        </TouchableOpacity>
    );

    return (
        <>
            <Animated.View style={[styles.backdrop, rBackdropStyle]}>
                <Pressable
                    style={styles.backdropButton}
                    onPress={handleClose}
                />
            </Animated.View>
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[styles.modalContainer, rBottomSheetStyle]}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.handle} />

                        <View style={styles.header}>
                            <Text style={styles.headerText}>
                                Select Budget Type
                            </Text>
                            <Image
                                source={require("@/assets/images/information.png")}
                                style={styles.headerIcon}
                            />
                        </View>

                        <BudgetOption
                            type="default"
                            title="Default"
                            description="Adapts to your spending habits and financial goals based on your inputs."
                        />

                        <BudgetOption
                            type="structured"
                            title="Structured Template"
                            description="Split income into needs, wants, and savings"
                        />
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
        top: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 51,
        borderTopRightRadius: 51,
        zIndex: 2,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 33,
        paddingTop: 18,
    },
    handle: {
        alignSelf: "center",
        width: 69,
        height: 5,
        backgroundColor: "transparent",
        borderColor: "rgba(208, 208, 208, 1)",
        borderWidth: 2.5,
        borderRadius: 2.5,
        marginBottom: 29,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 29,
    },
    headerText: {
        fontSize: 20,
        color: "rgba(68, 68, 68, 1)",
        fontWeight: "600",
        letterSpacing: -0.4,
        fontFamily: "Lexend_500Medium",
    },
    headerIcon: {
        width: 24,
        height: 24,
    },
    optionContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        borderColor: "rgba(248, 248, 248, 1)",
        borderWidth: 1,
        padding: 20,
        marginVertical: 5,
        backgroundColor: "#F8F8F8",
    },
    selectedOption: {
        backgroundColor: "#F8F8F8",
    },
    optionContent: {
        flex: 1,
        gap: 5,
    },
    optionTitle: {
        fontSize: 16,
        color: "rgba(43, 43, 43, 1)",
        fontWeight: "500",
        letterSpacing: 0.32,
        fontFamily: "Lexend_500Medium",
    },
    optionDescription: {
        fontSize: 12,
        color: "rgba(143, 143, 143, 1)",
        fontWeight: "300",
        letterSpacing: 0.24,
        fontFamily: "Lexend_300Light",
    },
    optionArrow: {
        width: 13,
        height: 24,
        marginLeft: 38,
    },
});

export default BudgetTypeSelectorModal;
