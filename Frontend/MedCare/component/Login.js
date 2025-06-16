import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, KeyboardAvoidingView, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SlideBar from './SlideBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { email, password });
      
      // Make API call to your backend
      const response = await fetch('http://192.168.8.106:8082/api/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Store the email in AsyncStorage
        await AsyncStorage.setItem('userEmail', email);
        
        // Show success message
        Alert.alert(
          'Success',
          'Login successful!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to Profile after successful login
                navigation.navigate('Profile');
              }
            }
          ]
        );
      } else {
        console.log('Login failed:', data);
        Alert.alert('Error', data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error details:', error);
      if (error.message) {
        console.error('Error message:', error.message);
      }
      Alert.alert('Error', 'Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  const handleNavigate = (screen) => {
    setSidebarVisible(false);
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.background}>
            {/* Menu Bar */}
            <View style={styles.menuBar}>
              <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuButton}>
                <Text style={styles.menuBtnText}>☰</Text>
              </TouchableOpacity>
              <Text style={styles.heroTitle}>Login</Text>
              <View style={styles.menuRightIcon} />
            </View>

            {/* Login Form */}
            <View style={styles.overlay}>
              <View style={styles.container}>
                <Image
                  source={require('../assets/logo.png')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
                
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  editable={!loading}
                />
                
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#999"
                  editable={!loading}
                />
                
                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.loginButtonText}>Login</Text>
                  )}
                </TouchableOpacity>
                
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account?</Text>
                  <TouchableOpacity onPress={navigateToSignup} disabled={loading}>
                    <Text style={styles.signupLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {sidebarVisible && (
        <SlideBar
          onClose={() => setSidebarVisible(false)}
          onNavigate={handleNavigate}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(218,166,231,255)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(218,166,231,255)',
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(218,166,231,255)',
    borderBottomWidth: 0,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  menuBtnText: {
    fontSize: 30,  
    color: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingBottom: 20, 
  },
  container: {
    backgroundColor: 'white',
    padding: 25,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 70,
    textAlign: 'center',
    color: '#333',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#555',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#a0c4e8',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    color: '#4a90e2',
    marginLeft: 5,
    fontWeight: '500',
  },
});

export default Login;