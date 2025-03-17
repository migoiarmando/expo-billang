import { TextInput, View, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface Search {
    title: string;
    className?: string;
}

export function SearchBar(props: Search) {
    return (
        <View className={`relative mb-[20px] ${props.className}`}>
            <Image
                source={require("@/assets/images/transaction-folders/searchlogo.png")}
                style={styles.searchlogo} // ✅ Correct
            />
            <TextInput
                placeholder={props.title}
                placeholderTextColor="D1D1D6"
                style={styles.searchBar}
                className="text-[16px] font-lexendRegular"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        width: "100%",
        paddingLeft: 45,
        paddingRight: 10,
        height: 42,
        backgroundColor: "#F5F5F5",
        borderRadius: 30,
        borderColor: "#F5F5F5",
        borderWidth: 1.5,
    },
    searchlogo: {
        width: 20,
        height: 20,
        position: "absolute",
        left: 20,
        top: "50%",
        transform: [{ translateY: -10 }],
        zIndex: 1, // Ensures it appears above the search bar
    },
});
