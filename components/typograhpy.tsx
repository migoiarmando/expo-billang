/* --------------------------------------------------------------------------------------------------------------

    Route -> "onboarding/ob.tsx"

    Last edited: 
        John Bicierro [Feb 22, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

    <Ticket Info>
    Feature ID: BL-1
    Feature Title: Onboarding Screen

-------------------------------------------------------------------------------------------------------------- */

import { Text } from "react-native";

interface Typography {
    title: string;
}

export function Heading(props: Typography) {
    return <Text className="text-2xl font-lexendBold">{props.title}</Text>;
}
