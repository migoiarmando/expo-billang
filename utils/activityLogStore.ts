import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ActivityLogType = "budget" | "expense" | "income" | "badge" | "profile";

export interface ActivityLogEntry {
    id: string;
    type: ActivityLogType;
    message: string;
    timestamp: Date;
}

interface ActivityLogState {
    logs: ActivityLogEntry[];
    addLog: (entry: Omit<ActivityLogEntry, "id" | "timestamp">) => void;
}

export const useActivityLogStore = create<ActivityLogState>()(
    persist(
        (set) => ({
            logs: [],
            addLog: (entry) =>
                set((state) => ({
                    logs: [
                        {
                            ...entry,
                            id: Math.random().toString(36).slice(2),
                            timestamp: new Date(),
                        },
                        ...state.logs,
                    ],
                })),
        }),
        {
            name: "activity-log-storage",
            storage: createJSONStorage(() => AsyncStorage),
            // Convert Date strings back to Date objects on rehydrate
            partialize: (state) => ({
                ...state,
                logs: state.logs.map((log) => ({
                    ...log,
                    timestamp:
                        typeof log.timestamp === "string"
                            ? new Date(log.timestamp)
                            : log.timestamp,
                })),
            }),
        },
    ),
);
