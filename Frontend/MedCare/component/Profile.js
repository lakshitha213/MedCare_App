import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Text, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const Profile = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [channelingData, setChannelingData] = useState(null);
    const [error, setError] = useState(null);

    const checkLoginAndLoadData = async () => {
        try {
            const userEmail = await AsyncStorage.getItem('userEmail');
            if (!userEmail) {
                setError('User not logged in');
                setLoading(false);
                return;
            }

            // Fetch user data
            console.log('Fetching profile for email:', userEmail);
            const response = await fetch(`${config.API_URL}/api/users/profile/${userEmail}`);
            console.log('Profile response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            
            const data = await response.json();
            console.log('Profile data received:', data);
            setUserData(data);

            // Fetch channeling data if available
            try {
                const channelingResponse = await fetch(`${config.API_URL}/api/channeling/user/${userEmail}`);
                if (channelingResponse.ok) {
                    const channelingData = await channelingResponse.json();
                    setChannelingData(channelingData);
                } else {
                    console.log('No channeling data available');
                    setChannelingData(null);
                }
            } catch (channelingError) {
                console.log('No channeling data available:', channelingError);
                setChannelingData(null);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load profile data');
            setLoading(false);
            Alert.alert(
                "Error",
                "Failed to load profile data. Please try again.",
                [{ text: "OK" }]
            );
        }
    };

    useEffect(() => {
        checkLoginAndLoadData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading your profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.retryButtonText}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={
                                userData?.profileImage 
                                    ? { uri: userData.profileImage }
                                    : require('../assets/logo.png')
                            }
                            style={styles.profileImage}
                            resizeMode="cover"
                            onError={(error) => {
                                console.error('Error loading profile image:', error.nativeEvent.error);
                                console.log('Image data:', userData?.profileImage);
                            }}
                        />
                    </View>
                    <Text style={styles.headerText}>Profile</Text>
                </View>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Patient Details</Text>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Name</Text>
                        <Text style={styles.detailValue}>{`${userData?.firstName} ${userData?.secondName}`}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Birth Day</Text>
                        <Text style={styles.detailValue}>{userData?.birthdate}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Telephone Number</Text>
                        <Text style={styles.detailValue}>{userData?.telephone}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Address</Text>
                        <Text style={styles.detailValue}>{userData?.address}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Email</Text>
                        <Text style={styles.detailValue}>{userData?.email}</Text>
                    </View>
                </View>
                
                {channelingData && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Channeling Details</Text>
                        
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Channeling Name</Text>
                            <Text style={styles.detailValue}>{channelingData.channelingName}</Text>
                        </View>
                        
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Doctor's Name</Text>
                            <Text style={styles.detailValue}>{channelingData.doctorName}</Text>
                        </View>
                        
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Date</Text>
                            <Text style={styles.detailValue}>{channelingData.date}</Text>
                        </View>
                        
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Time</Text>
                            <Text style={styles.detailValue}>{channelingData.time}</Text>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
    },
    safeArea: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#2d3436',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 25,
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    headerText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#2d3436',
        marginLeft: 15,
    },
    section: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3436',
        marginBottom: 20,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#dfe6e9',
    },
    detailItem: {
        marginBottom: 15,
    },
    detailLabel: {
        fontSize: 14,
        color: '#636e72',
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 16,
        color: '#2d3436',
        fontWeight: '500',
    },
});

export default Profile; 