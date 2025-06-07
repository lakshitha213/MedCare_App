import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, View, StyleSheet, Text, Image } from "react-native";

const Profile = () => {
    const navigation = useNavigation();
    const handleNavigate = (screen) => {
        navigation.navigate(screen);
    }
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.label}>Profile</Text>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    label: {
        fontSize: 16,
    },
});

export default Profile;