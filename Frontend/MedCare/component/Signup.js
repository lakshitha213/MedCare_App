import React, { useState } from 'react';
import { View,Text,TextInput, TouchableOpacity,StyleSheet,SafeAreaView,Image,KeyboardAvoidingView,ScrollView,Platform,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import SlideBar from './SlideBar';

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

  const [image, setImage] = useState(null);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignup = () => {
    console.log("Signup data:", form);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.heroTitle}>Sign In</Text>

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
                {image ? 'Change Image' : 'Upload Image'}
              </Text>
            </TouchableOpacity>

            {image && (
              <Image source={{ uri: image }} style={styles.uploadedImage} />
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
    backgroundColor: 'rgba(218,166,231,255)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  imagePicker: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  signupButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLogin: {
    textAlign: 'center',
    marginTop: 15,
    color: '#4a90e2',
    fontWeight: '500',
  },
});

export default Signup;
