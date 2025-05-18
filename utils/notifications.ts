import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getNotificationsEnabled(): Promise<boolean> {
    const val = await AsyncStorage.getItem("notificationsEnabled");
    return val === null ? true : val === "true";
}
