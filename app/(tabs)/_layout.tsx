/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        John Bicierro [Feb 22, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

-------------------------------------------------------------------------------------------------------------- */

import { Tabs } from "expo-router";
import Colors from "../../constants/Colors";
import { useClientOnlyValue } from "../../components/expo/useClientOnlyValue";
import { Home, Plus, Search, User, WalletCards } from "lucide-react-native";
import { View } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#00A3E9",
                tabBarInactiveTintColor: "#676666",
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Home color={color} size={20} />,
                }}
            />
            <Tabs.Screen
                name="transaction"
                options={{
                    title: "Transaction",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Search color={color} size={20} />,
                }}
            />

            {/* Add Transaction */}
            <Tabs.Screen
                name="addtransaction"
                options={{
                    title: "Add transaction",
                    tabBarLabel: () => null,
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <View className="w-[40px] h-[40px] bg-[#E0F6FF] rounded-full flex items-center justify-center mt-4">
                            <Plus color={color} size={24} />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="budget"
                options={{
                    title: "Budget",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <WalletCards color={color} size={20} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <User color={color} size={20} />,
                }}
            />
        </Tabs>
    );
}
