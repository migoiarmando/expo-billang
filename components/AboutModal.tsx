/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Miguel Armand B. Sta. Ana [May 10, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature Title: About Modal
    Description:  
        - This is the modal that pops up if you tap the About on the Settings Screen.

-------------------------------------------------------------------------------------------------------------- */

import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import SvgBillangLogo from "@/assets/images/billang_logo.svg";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.5;
const SPRING_CONFIG = {
    damping: 50,
    stiffness: 300,
    mass: 0.5,
};

interface AboutModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isVisible, onClose }) => {
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const context = useSharedValue({ y: 0 });
    const active = useSharedValue(false);

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

    if (!isVisible) {
        return null;
    }

    return (
        <>
            <Animated.View style={[styles.backdrop, rBackdropStyle]}>
                <Pressable style={styles.backdropButton} onPress={handleClose} />
            </Animated.View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.modalContainer, rBottomSheetStyle]}>
                    <View style={styles.modalContent}>
                        <View style={styles.logoContainer}>
                            <SvgBillangLogo width={70} height={70} />
                        </View>
                        <Text style={styles.title}>Billang</Text>
                        <Text style={styles.version}>Version: 0.2.2</Text>
                        <Text style={styles.description}>
                            An expense management tracking system built for mobile devices
                            to efficiently track, manage, and allocate monetary expenses
                            and bills.
                        </Text>
                        <Text
                            style={[
                                styles.title,
                                { marginTop: -5, fontFamily: "Lexend_600SemiBold" },
                            ]}
                        >
                            Developers
                        </Text>
                        <Text style={styles.description}>
                            <Text style={{ fontFamily: "Lexend_600SemiBold" }}>
                                Lead Developer:{" "}
                            </Text>
                            Miguel Armand Sta. Ana{"\n"}
                            <Text style={{ fontFamily: "Lexend_600SemiBold" }}>
                                Back End Developer:{" "}
                            </Text>
                            John Kristoffer Bicierro{"\n"}
                            <Text style={{ fontFamily: "Lexend_600SemiBold" }}>
                                UI/UX / Front End Developer:{" "}
                            </Text>
                            Romar Josh Castro{"\n"}
                            <Text style={{ fontFamily: "Lexend_600SemiBold" }}>
                                Front End Developer:{" "}
                            </Text>
                            Peter Joshua Jornales
                        </Text>
                        <Text style={styles.copyright}>codekada™</Text>
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
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingTop: 21,
    },
    logoContainer: {
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: "#676666",
        marginBottom: 2,
        fontFamily: "Lexend_400Regular",
    },
    version: {
        fontSize: 16,
        color: "#888",
        marginBottom: 18,
        fontFamily: "Lexend_400Regular",
    },
    description: {
        fontSize: 14,
        color: "#676666",
        textAlign: "center",
        marginBottom: 15,
        fontFamily: "Lexend_300Light",
    },
    copyright: {
        fontSize: 14,
        color: "#676666",
        marginTop: 2,
        fontFamily: "Lexend_300Light",
    },
});

export default AboutModal;
