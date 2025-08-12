import React from "react";
import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet } from "react-native";

const MenuIcon = () => (
    <View style={styles.menuIconContainer}>
        <View style={styles.menuLineTop} />
        <View style={styles.menuLineMiddle} />
        <View style={styles.menuLineBottom} />
    </View>
);

const Header = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Text style={styles.logoText}>InsiderHUB</Text>
                {/* <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        // TODO: handle menu press
                    }}
                    accessibilityLabel="Open menu"
                >
                    <MenuIcon />
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: "center",
        flexDirection: "row",
        height: 56,
        justifyContent: "space-between",
        marginHorizontal: 16
    },
    logoText: {
        color: "#F3F4F6",
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    menuIconContainer: {
        alignItems: "center",
        height: 20,
        justifyContent: "center",
        width: 28,
    },
    menuLineBottom: {
        backgroundColor: "#B0B0B0",
        borderRadius: 2,
        height: 3,
        width: 16,
    },
    menuLineMiddle: {
        backgroundColor: "#A259FF",
        borderRadius: 2,
        height: 3,
        marginBottom: 4,
        width: 28,
    },
    menuLineTop: {
        backgroundColor: "#B0B0B0",
        borderRadius: 2,
        height: 3,
        marginBottom: 4,
        width: 22,
    },
    safeArea: {
        backgroundColor: "#09090B",
        paddingHorizontal: 16,
        paddingTop: 8,
    },
});

export default Header;
