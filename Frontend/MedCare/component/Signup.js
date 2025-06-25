import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import SlideBar from './SlideBar'; // Assuming SlideBar is a local component
import axios from 'axios'; // Although you're using fetch, axios is imported. Keeping it for context.
import config from '../config'; // Assuming config holds your API_URL

const Signup = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    birthdate: '',
    telephone: '',
  });

  // State to store image URI and its MIME type
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [profileImageMimeType, setProfileImageMimeType] = useState(null);
  const [profileImageName, setProfileImageName] = useState(null); // To store a suitable filename

  const [isSlideBarOpen, setIsSlideBarOpen] = useState(false);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      // Replaced alert with React Native Alert
      Alert.alert("Permission Required", "Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // Corrected: Use ImagePicker.MediaType instead of deprecated ImagePicker.MediaTypeOptions
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      base64: false, // We don't need base64 for multipart upload unless explicitly sending base64
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setProfileImageUri(asset.uri);
      setProfileImageMimeType(asset.mimeType); // Crucial: Get the exact MIME type
      // Extract filename from URI for better naming on backend
      const filename = asset.uri.split('/').pop();
      setProfileImageName(filename);

      console.log("ImagePicker Result Asset:", asset);
      console.log("Selected Image URI:", asset.uri);
      console.log("Selected Image MIME Type:", asset.mimeType);
    }
  };

  const handleSignup = async () => {
    try {
      if (form.password !== form.confirmPassword) {
        Alert.alert("Password Mismatch", "Passwords do not match!");
        return;
      }

      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('secondName', form.secondName);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('confirmPassword', form.confirmPassword); // confirmPassword is not used in backend, but keeping for form validation
      formData.append('address', form.address);
      formData.append('birthdate', form.birthdate);
      formData.append('telephone', form.telephone);

      // Append image if selected
      if (profileImageUri && profileImageMimeType) {
        // *** CRITICAL CHANGE HERE ***
        // Convert the data URI (base64 string) to a Blob object
        const response = await fetch(profileImageUri);
        const blob = await response.blob();

        // Ensure a suitable filename, falling back to a generic one
        const fileName = profileImageName || `profile_${Date.now()}.${profileImageMimeType.split('/')[1] || 'jpeg'}`;

        // Append the Blob directly. FormData will handle it correctly as a file.
        formData.append('profileImage', blob, fileName);

        console.log("Converted data URI to Blob and appending to FormData:", {
          uri: profileImageUri,
          type: profileImageMimeType,
          name: fileName,
          blobSize: blob.size
        });
      } else {
        console.log("No profile image selected or available to send.");
      }

      console.log('Sending FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, typeof value === 'object' && value instanceof Blob ? `[Blob: ${value.type}, ${value.size} bytes]` : value);
      }

      const response = await fetch(`${config.API_URL}/api/auth/signup`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // IMPORTANT: Do NOT set 'Content-Type': 'multipart/form-data'.
          // Fetch automatically sets the correct Content-Type header with the boundary.
        },
      });

      const responseText = await response.text(); // Get response as text first
      console.log("Backend Response Status:", response.status);
      console.log("Backend Response Text:", responseText);

      if (response.ok) {
        Alert.alert('Success', 'User registered successfully!');
        // Clear form fields
        setForm({
          firstName: '',
          secondName: '',
          email: '',
          password: '',
          confirmPassword: '',
          address: '',
          birthdate: '',
          telephone: ''
        });
        setProfileImageUri(null);
        setProfileImageMimeType(null);
        setProfileImageName(null);
        navigation.navigate('Login');
      } else {
        // Parse error message from backend
        let errorMessage = "Unknown error during signup.";
        try {
          const errorJson = JSON.parse(responseText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          } else {
            errorMessage = responseText;
          }
        } catch (e) {
          errorMessage = responseText; // If not JSON, use the raw text
        }
        Alert.alert('Signup Failed', errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Error during signup. Please try again later.');
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          {/* Main Signup Content */}
          <View style={styles.container}>
            <Text style={styles.heroTitle}>Sign Up</Text>

            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={form.firstName}
              onChangeText={text => handleChange('firstName', text)}
              placeholder="Enter your first name"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Second Name</Text>
            <TextInput
              style={styles.input}
              value={form.secondName}
              onChangeText={text => handleChange('secondName', text)}
              placeholder="Enter your second name"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={text => handleChange('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={form.password}
              onChangeText={text => handleChange('password', text)}
              placeholder="Enter password"
              secureTextEntry
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={form.confirmPassword}
              onChangeText={text => handleChange('confirmPassword', text)}
              placeholder="Confirm password"
              secureTextEntry
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={text => handleChange('address', text)}
              placeholder="Enter your address"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Birthdate</Text>
            <TextInput
              style={styles.input}
              value={form.birthdate}
              onChangeText={text => handleChange('birthdate', text)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Telephone Number</Text>
            <TextInput
              style={styles.input}
              value={form.telephone}
              onChangeText={text => handleChange('telephone', text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
              <Text style={styles.imagePickerText}>
                {profileImageUri ? 'Change Image' : 'Upload Profile Image'}
              </Text>
            </TouchableOpacity>

            {profileImageUri && (
              <Image source={{ uri: profileImageUri }} style={styles.uploadedImage} />
            )}

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.backToLogin}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e6c6f5'
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 80, // Space for the hamburger icon
    paddingBottom: 20,
  },
  container: {
    paddingHorizontal: 25,
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fefefe',
  },
  imagePicker: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadedImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make it circular
    alignSelf: 'center',
    marginBottom: 20,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    resizeMode: 'cover', // Ensures image covers the area
  },
  signupButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  backToLogin: {
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  menuBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 200,
  },
});

export default Signup;
