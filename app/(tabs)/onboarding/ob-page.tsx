import { Pressable, TouchableOpacity, View, Text } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingPage() {
    return (
        <SafeAreaView className="my-[100px] flex-1 justify-between items-center gap-[100px]">
            <View className="flex-col items-center gap-[20px]">
                <Text className="text-base">Make every expense count with</Text>
                <Text className="text-4xl">Billang</Text>
            </View>

            <View>
                <View className="px-5 w-[330px] h-[60px] border rounded flex-row justify-between items-center">
                    <View>
                        <Text>Disney+ Subscription</Text>
                        <View className="flex-row gap-2">
                            <Text className="text-xs">November 12</Text>
                            <Text className="bg-red-300 rounded px-1 text-xs">
                                Today
                            </Text>
                        </View>
                    </View>
                    <Text>$249</Text>
                </View>
            </View>

            <View className="flex-col items-center gap-3">
                <Button title="Get Started" href="/onboarding/ob-page2" />

                <Pressable>
                    <Text className="text-sm underline">
                        Already have an account? Sign in
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

interface ButtonObj {
    title: string;
    variant?: string;
    href?: any;
}

export function Button(props: ButtonObj) {
    return (
        <TouchableOpacity
            className="bg-blue-400 w-[250px] h-[45px] rounded-full flex-row items-center justify-center"
            onPress={() => {
                if (props.href) router.push(props.href);
            }}
        >
            <Text className="font-bold text-white">{props.title}</Text>
        </TouchableOpacity>
    );
}
