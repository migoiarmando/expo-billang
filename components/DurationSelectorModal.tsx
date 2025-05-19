import React from "react";
import { useColorScheme } from "react-native";

import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.4;
const SPRING_CONFIG = {
    damping: 50,
    stiffness: 300,
    mass: 0.5,
};

interface DurationSelectModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (duration: "monthly" | "weekly") => void;
}

const DurationSelectModal: React.FC<DurationSelectModalProps> = ({
    isVisible,
    onClose,
    onSelect,
}) => {
    const colorScheme = useColorScheme(); // <--- light | dark

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
        translateY.value = isVisible
            ? withSpring(0, SPRING_CONFIG)
            : withSpring(MODAL_HEIGHT, SPRING_CONFIG);
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
    }));

    if (!isVisible) return null;
    return (
        <>
            <Animated.View
                style={[styles.backdrop, rBackdropStyle]}
                pointerEvents={isVisible ? "auto" : "none"} // ← this must go here, not in style
            >
                <Pressable style={styles.backdropButton} onPress={handleClose} />
            </Animated.View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.modalContainer, rBottomSheetStyle]}>
                    <Text style={styles.title}>Select Duration</Text>

                    <Pressable
                        style={styles.option}
                        onPress={() => {
                            onSelect("monthly");
                            handleClose();
                        }}
                    >
                        <View>
                            <Text style={styles.optionTitle}>Monthly</Text>
                        </View>

                        <Text style={styles.optionDesc}>
                            Your budget resets every month. Ideal if you manage bills,
                            salary, or long-term expenses.
                        </Text>
                    </Pressable>

                    <Pressable
                        style={styles.option}
                        onPress={() => {
                            onSelect("weekly");
                            handleClose();
                        }}
                    >
                        <Text style={styles.optionTitle}>Weekly</Text>
                        <Text style={styles.optionDesc}>
                            Duration resets every week. Great if you prefer frequent
                            check-ins on your expenses.
                        </Text>
                    </Pressable>
                </Animated.View>
            </GestureDetector>
        </>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#00000000",
        zIndex: 1,
    },
    backdropButton: {
        flex: 1,
    },
    modalContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: MODAL_HEIGHT,
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        zIndex: 2,
    },
    title: {
        fontSize: 18,
        fontFamily: "Lexend_600SemiBold",
        marginBottom: 20,
        textAlign: "center",
    },
    option: {
        paddingVertical: 16,
        borderBottomColor: "#e5e5e5",
        borderBottomWidth: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontFamily: "Lexend_500Medium",
        marginBottom: 4,
    },
    optionDesc: {
        fontSize: 14,
        color: "#666",
        fontFamily: "Lexend_400Regular",
    },
});

export default DurationSelectModal;
