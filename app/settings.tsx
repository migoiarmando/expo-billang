/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
         Miguel Armand B. Sta. Ana [May 20, 2025]


    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    Feature Title: Settings Screen
    Description:
        - The Settings Screen provides an overview of the user's settings, including changing profile picture, name, and other settings.


-------------------------------------------------------------------------------------------------------------- */

import { useLayoutEffect, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import ProfilePic from "@/assets/images/profilepic.svg";
import { useUser } from "@/contexts/UserContext";
import { useActivityLogStore } from "@/utils/activityLogStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/database";
import { user_tb } from "@/database/schema";

// Settings screen for changing profile picture and user name
export default function SettingsScreen() {
    const navigation = useNavigation();
    const { name, setName, profileImageUri, setProfileImageUri } = useUser();
    const [editingName, setEditingName] = useState(name);

    // NEW: Fetch profile image and name on mount
    useEffect(() => {
        // Fetch profile image from AsyncStorage
        AsyncStorage.getItem("profileImageUri").then((uri) => {
            if (uri && setProfileImageUri) setProfileImageUri(uri);
        });

        // Fetch name from database
        async function fetchName() {
            const users = await db.select().from(user_tb);
            if (users.length > 0 && setName) setName(users[0].name);
        }
        fetchName();
    }, [setName, setProfileImageUri]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Settings & Customization",
            headerTitleStyle: {
                fontFamily: "Lexend_400Regular",
                fontSize: 24,
                color: "#2B3854",
            },
        });
    }, [navigation]);

    useEffect(() => {
        setEditingName(name);
    }, [name]);

    // Handle profile picture change
    const handleProfilePicPress = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission required",
                "Permission to access gallery is required!",
            );
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            await setProfileImageUri(uri);
            useActivityLogStore.getState().addLog({
                type: "profile",
                message: "Updated profile picture.",
            });
        }
    };

    // Handle user name save
    const handleSaveName = async () => {
        if (editingName !== name) {
            // Update in context
            await setName(editingName);

            // Update in database
            await db.update(user_tb).set({ name: editingName });

            useActivityLogStore.getState().addLog({
                type: "profile",
                message: `Changed name from "${name}" to "${editingName}".`,
            });
            Alert.alert("Success", "Changes saved!");
        } else {
            Alert.alert("No changes", "Name is the same as before.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Profile Picture */}
            <TouchableOpacity
                onPress={handleProfilePicPress}
                style={styles.profilePicContainer}
            >
                {profileImageUri ? (
                    <Image source={{ uri: profileImageUri }} style={styles.profilePic} />
                ) : (
                    <ProfilePic width={120} height={100} />
                )}
                <Text style={styles.changePicText}>Change Profile Picture</Text>
            </TouchableOpacity>

            {/* User Name Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={editingName}
                    onChangeText={setEditingName}
                    placeholder="Enter your name"
                    placeholderTextColor="#B0B0B0"
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
                    <Text style={styles.saveButtonText}>Save Name</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF9F9",
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    profilePicContainer: {
        alignItems: "center",
        marginBottom: 30,
        marginTop: 30,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    changePicText: {
        color: "#0075B2",
        fontSize: 16,
        marginTop: 4,
        fontFamily: "Lexend_600SemiBold",
    },
    inputContainer: {
        width: "80%",
        marginTop: 5,
        alignSelf: "center",
    },
    label: {
        fontSize: 16,
        color: "#2B3854",
        marginBottom: 6,
        fontFamily: "Lexend_600SemiBold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: "#fff",
        fontFamily: "Lexend_600SemiBold",
    },
    saveButton: {
        backgroundColor: "#0075B2",
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 8,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Lexend_600SemiBold",
    },
});
