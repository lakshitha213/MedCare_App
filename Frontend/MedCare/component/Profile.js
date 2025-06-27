import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Text, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import SlideBar from './SlideBar';

const Profile = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [channelingData, setChannelingData] = useState(null);
    const [error, setError] = useState(null);
    const [isSlideBarOpen, setIsSlideBarOpen] = useState(false);

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

    useFocusEffect(
        React.useCallback(() => {
            const checkAndRedirect = async () => {
                const userEmail = await AsyncStorage.getItem('userEmail');
                if (!userEmail) {
                    navigation.navigate('Login', { redirectTo: 'Profile' });
                } else {
                    checkLoginAndLoadData();
                }
            };
            checkAndRedirect();
        }, [])
    );

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
        <View style={{flex: 1, backgroundColor: '#e6c6f5'}}>
            <ScrollView style={{ paddingBottom: 30 }}>
                {/* SlideBar Button */}
                <TouchableOpacity style={styles.menuBtn} onPress={() => setIsSlideBarOpen(true)}>
                    <Image source={require('../assets/png-transparent-hamburger-button-drop-down-list-computer-icons-navigation-bars-and-page-menu-templates-text-rectangle-black-thumbnail-removebg-preview.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                {/* SlideBar Overlay */}
                {isSlideBarOpen && (
                    <View style={{ position: 'absolute', top: 0, left: 0, width: '70%', height: '100%', zIndex: 300 }}>
                        <SlideBar
                            onClose={() => setIsSlideBarOpen(false)}
                            onNavigate={(screen) => {
                                setIsSlideBarOpen(false);
                                navigation.navigate(screen);
                            }}
                        />
                    </View>
                )}
                {/* Main Profile Content */}
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Profile</Text>
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
                    
                    {channelingData === null && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Channeling Details</Text>
                            <Text style={{color: 'red', fontWeight: 'bold', marginBottom: 10}}>Appointment deleted</Text>
                        </View>
                    )}
                    
                    {channelingData && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Channeling Details</Text>
                            {channelingData.status === 'approved' ? (
                              <Text style={{color: 'green', fontWeight: 'bold', marginBottom: 10}}>Appointment approved</Text>
                            ) : (
                              <Text style={{color: 'orange', fontWeight: 'bold', marginBottom: 10}}>Appointment pending due to doctor approval</Text>
                            )}
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
                            <TouchableOpacity
                                style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' }}
                                onPress={async () => {
                                    try {
                                        await fetch(`${config.API_URL}/api/channeling/delete/${channelingData.id}`, { method: 'DELETE' });
                                        setChannelingData(null);
                                        Alert.alert('Success', 'Channeling deleted successfully');
                                    } catch (err) {
                                        Alert.alert('Error', 'Failed to delete channeling');
                                    }
                                }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Channeling</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </SafeAreaView>
            </ScrollView>
        </View>
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
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10,
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
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2d3436',
        marginTop: 0,
        marginBottom: 10,
    },
    section: {
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        paddingHorizontal: 25,
        paddingVertical: 30,
        marginHorizontal: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
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
    menuBtn: {
        marginTop: 10,
        marginLeft: 10,
        width: 30,
        height: 30,
        zIndex: 200,
    },
});

export default Profile; 