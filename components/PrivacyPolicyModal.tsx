/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Miguel Armand B. Sta. Ana [May 10, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature Title: Privacy Policy Modal
    Description:  
        - This is the modal that pops up if you tap the Privacy Policy on the Settings Screen.

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

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6;
const SPRING_CONFIG = {
    damping: 50,
    stiffness: 300,
    mass: 0.5,
};

interface PrivacyPolicyModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
    isVisible,
    onClose,
}) => {
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const context = useSharedValue({ y: 0 });
    const active = useSharedValue(false);

    const scrollTo = (destination: number) => {
        "worklet";
        active.value = destination !== SCREEN_HEIGHT;
        translateY.value = withSpring(destination, SPRING_CONFIG);
    };

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
    }, [isVisible]);

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
                        <Text style={styles.title}>Privacy Policy</Text>
                        <Text style={styles.effectiveDate}>
                            Effective Date: April 2025
                        </Text>
                        <View style={styles.divider} />
                        <Text style={styles.text}>
                            Billang values your privacy and is committed to protecting
                            your personal data. This Privacy Policy explains how we
                            collect, use, and safeguard your information.
                        </Text>
                        <Text style={styles.sectionTitle}>Information We Collect</Text>
                        <Text style={styles.text}>
                            • Personal details (e.g., name) when you register.{"\n"}•
                            Financial data you input for tracking expenses.{"\n"}• Usage
                            data for improving our services.
                        </Text>
                        <Text style={styles.sectionTitle}>
                            How We Use Your Information
                        </Text>
                        <Text style={styles.text}>
                            • To provide and enhance Billang’s features.{"\n"}• To secure
                            your account and prevent fraud.{"\n"}• To analyze usage trends
                            and improve user experience.
                        </Text>
                        <Text style={styles.sectionTitle}>Contact Us</Text>
                        <Text style={styles.text}>
                            For questions, email us at{" "}
                            <Text style={styles.bold}>billang@gmail.com</Text>
                            {"\n"}By using Billang, you agree to this Privacy Policy.
                        </Text>
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
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingHorizontal: 30,
        paddingTop: 30,
        width: "100%",
    },
    title: {
        fontSize: 16,
        color: "#121212",
        alignSelf: "center",
        fontFamily: "Lexend_600SemiBold",
        paddingBottom: 5,
    },
    effectiveDate: {
        fontSize: 13,
        color: "#535353",
        alignSelf: "center",
        marginBottom: 10,
        fontFamily: "Lexend_300Light",
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#E5E5E5",
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 14,
        color: "#535353",
        marginTop: 12,
        marginBottom: 2,
        fontFamily: "Lexend_700Bold",
    },
    text: {
        fontSize: 14,
        color: "#676666",
        marginBottom: 6,
        fontFamily: "Lexend_300Light",
    },
    bold: {
        fontFamily: "Lexend_700Bold",
        fontSize: 13,
        color: "#535353",
    },
});

export default PrivacyPolicyModal;
