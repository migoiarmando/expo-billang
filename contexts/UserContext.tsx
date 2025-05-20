import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/database";
import { user_tb } from "@/database/schema";
import { eq } from "drizzle-orm";

type UserContextType = {
    name: string;
    setName: (name: string) => void;
    profileImageUri: string | null;
    setProfileImageUri: (uri: string | null) => void;
    reloadUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [name, setNameState] = useState("");
    const [profileImageUri, setProfileImageUriState] = useState<string | null>(null);

    // Load user data from DB and AsyncStorage
    const reloadUser = async () => {
        // Load name from DB
        try {
            const users = await db.select().from(user_tb);
            if (users.length > 0) setNameState(users[0].name || "");
        } catch {}
        // Load profile image from AsyncStorage
        const uri = await AsyncStorage.getItem("profileImageUri");
        setProfileImageUriState(uri);
    };

    useEffect(() => {
        reloadUser();
    }, []);

    // Setters that also persist
    const setName = async (newName: string) => {
        setNameState(newName);
        // Update DB
        const users = await db.select().from(user_tb);
        if (users.length > 0) {
            await db
                .update(user_tb)
                .set({ name: newName })
                .where(eq(user_tb.id, users[0].id));
        }
    };

    const setProfileImageUri = async (uri: string | null) => {
        setProfileImageUriState(uri);
        if (uri) await AsyncStorage.setItem("profileImageUri", uri);
        else await AsyncStorage.removeItem("profileImageUri");
    };

    return (
        <UserContext.Provider
            value={{ name, setName, profileImageUri, setProfileImageUri, reloadUser }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
};
