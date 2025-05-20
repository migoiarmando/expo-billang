/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        Romar Castro [May 20, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

   
    Feature Title: Duration Selector Modal
    Description:  
        - This is the modal that pops up if you tap the Duration Selector on the Budget Card.

-------------------------------------------------------------------------------------------------------------- */

import { RefreshCwIcon } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface DurationDropdownProps {
    selectedDuration: "weekly" | "monthly" | null;
    onSelect: (value: "weekly" | "monthly") => void;
}

const DurationDropdown: React.FC<DurationDropdownProps> = ({
    selectedDuration,
    onSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={styles.container}>
            <Pressable style={styles.dropdownButton} onPress={() => setIsOpen(!isOpen)}>
                <Text style={styles.dropdownText}>
                    {selectedDuration === "monthly"
                        ? "Monthly"
                        : selectedDuration === "weekly"
                          ? "Weekly"
                          : "Select Duration"}
                </Text>
                <RefreshCwIcon size={12} color="#9D9D9D" />
            </Pressable>

            {isOpen && (
                <View style={styles.dropdownList}>
                    <Pressable
                        style={styles.option}
                        onPress={() => {
                            onSelect("monthly");
                            setIsOpen(false);
                        }}
                    >
                        <Text style={styles.optionTitle}>Monthly</Text>
                        <Text style={styles.optionDesc}>
                            Your budget resets every month. Ideal if you manage bills,
                            salary, or long-term expenses.
                        </Text>
                    </Pressable>

                    <View style={styles.separator} />

                    <Pressable
                        style={styles.option}
                        onPress={() => {
                            onSelect("weekly");
                            setIsOpen(false);
                        }}
                    >
                        <Text style={styles.optionTitle}>Weekly</Text>
                        <Text style={styles.optionDesc}>
                            Duration resets every week. Great if you prefer frequent
                            check-ins on your expenses.
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    dropdownButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderRadius: 8,
        backgroundColor: "#eee",
    },
    dropdownText: {
        fontSize: 13,
        fontFamily: "Lexend_400Regular",
        textAlign: "left",
    },
    dropdownList: {
        marginTop: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    option: {
        paddingVertical: 12,
    },
    optionTitle: {
        fontSize: 15,
        fontFamily: "Lexend_500Medium",
        marginBottom: 4,
    },
    optionDesc: {
        fontSize: 13,
        color: "#666",
        fontFamily: "Lexend_400Regular",
    },
    separator: {
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 5,
    },
});

export default DurationDropdown;
