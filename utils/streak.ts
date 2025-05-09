import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "user_streak";
const LAST_ACTIVE_KEY = "last_active_date";

export async function getStreak() {
    const streak = await AsyncStorage.getItem(STREAK_KEY);
    return streak ? parseInt(streak, 10) : 0;
}

export async function getLastActiveDate() {
    return await AsyncStorage.getItem(LAST_ACTIVE_KEY);
}

export async function updateStreakOnAppOpen() {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const lastActive = await getLastActiveDate();

    if (!lastActive) {
        // First time use
        await AsyncStorage.setItem(STREAK_KEY, "1");
        await AsyncStorage.setItem(LAST_ACTIVE_KEY, todayStr);
        return 1;
    }

    if (lastActive === todayStr) {
        // Already opened today
        return await getStreak();
    }

    const lastDate = new Date(lastActive);
    const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    let newStreak = 1;
    if (diffDays === 1) {
        // Consecutive day
        newStreak = (await getStreak()) + 1;
    }
    // If missed a day or more, reset to 1

    await AsyncStorage.setItem(STREAK_KEY, newStreak.toString());
    await AsyncStorage.setItem(LAST_ACTIVE_KEY, todayStr);
    return newStreak;
}
