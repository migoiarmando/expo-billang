import { Link, router } from "expo-router";
import React from "react";
import {
    View,
    Text,
    FlatList,
    useWindowDimensions,
    Button,
} from "react-native";

const onboardingList = [
    {
        id: 0,
        title: "Track all in one place",
        desc: "Easily track all your bills, expenses, and needs seamlessly",
        button: false,
    },
    {
        id: 1,
        title: "Stay organized",
        desc: "Keep track of every bill and expense to avoid surprises",
        button: false,
    },
    {
        id: 2,
        title: "Simplify your finances",
        desc: "Have everything in one place to manage your finances easily",
        button: true,
    },
];

export function Onboarding() {
    return (
        <View className="pt-[150px] items-center justify-center gap-[10px]">
            <FlatList
                data={onboardingList}
                renderItem={({ item }) => <OnboardingItem item={item} />}
                horizontal
                showsHorizontalScrollIndicator
                pagingEnabled
                bounces={false}
            />
        </View>
    );
}

function OnboardingItem({ item }: any) {
    const { width } = useWindowDimensions();

    function test() {
        router.replace("/");
    }

    return (
        <View className="items-center gap-5 " style={[{ width }]}>
            <Text className="font-lexendBold text-center text-[24px]">
                {item.title}
            </Text>
            <Text className="font-lexend text-center text-[16px]">
                {item.desc}
            </Text>
            {item.button ? <Button title="Get started" onPress={test} /> : ""}
        </View>
    );
}
