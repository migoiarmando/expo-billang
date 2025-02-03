import { Platform, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/database/drizzle/migrations";
import { user_tb } from "@/database/schema";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { db } from "@/database";

export default function HomeScreen() {
    const { success, error } = useMigrations(db, migrations);
    const [items, setItems] = useState<(typeof user_tb.$inferSelect)[] | null>(
        null,
    );

    useEffect(() => {
        if (!success) return;

        (async () => {
            await db.delete(user_tb);

            await db.insert(user_tb).values([
                {
                    name: "John",
                    onboarding: false,
                },
            ]);

            const users = await db.select().from(user_tb);
            setItems(users);
            if (users[0].onboarding === false) {
                //router.replace("/onboarding/ob");
            }
        })();
    }, [success]);

    if (error) {
        return (
            <View>
                <Text>Migration error: {error.message}</Text>
            </View>
        );
    }

    if (!success) {
        return (
            <View>
                <Text>Migration is in progress...</Text>
            </View>
        );
    }

    if (items === null || items.length === 0) {
        return (
            <View>
                <Text>Empty</Text>
            </View>
        );
    }

    return (
        <>
            <SafeAreaView className="h-full border border-red-500">
                <View className="border border-green-500">
                    {items.map((item) => (
                        <View key={item.id}>
                            <Text className="dark:text-white">
                                {item.name} | {item.onboarding ? "T" : "F"}
                            </Text>
                        </View>
                    ))}
                </View>
            </SafeAreaView>
        </>
    );
}
