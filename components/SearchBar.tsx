import { TextInput, View, StyleSheet } from "react-native";
import SearchLogo from "@/assets/images/transaction-folders/searchlogo.svg";

interface Search {
    title: string;
    className?: string;
}

export function SearchBar(props: Search) {
    return (
        <View className={`relative mb-[20px] ${props.className}`}>
            <View className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <SearchLogo width={20} height={20} />
            </View>
            <TextInput
                placeholder={props.title}
                placeholderTextColor="D1D1D6"
                style={styles.searchBar}
                className="text-[16px] font-lexendRegular pl-10"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        width: "100%",
        paddingLeft: 40,
        paddingRight: 10,
        height: 42,
        backgroundColor: "#F5F5F5",
        borderRadius: 30,
        borderColor: "#F5F5F5",
        borderWidth: 1.5,
    },
});
