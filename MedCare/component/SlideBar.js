import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const SlideBar = ({ onClose, onNavigate }) => {
  return (
    <View style={styles.container}>
      {/* Top Logo and Close Button */}
      <View style={styles.topRow}>
        <Image
          source={require('../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>
      {/* Navigation Links */}
      <View style={styles.links}>
        <TouchableOpacity style={styles.linkBtn} onPress={() => onNavigate('Home')}>
          <Text style={styles.linkText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtn} onPress={() => onNavigate('Home')}>
          <Text style={styles.linkText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtn} onPress={() => onNavigate('Channeling')}>
          <Text style={styles.linkText}>Channeling</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtn} onPress={() => onNavigate('AboutUs')}>
          <Text style={styles.linkText}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtn} onPress={() => onNavigate('ContactUs')}>
          <Text style={styles.linkText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
      {/* Bottom Buttons */}
      <View style={styles.bottomBtns}>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => onNavigate('Login')}>
          <Text style={styles.bottomBtnText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => onNavigate('SignIn')}>
          <Text style={styles.bottomBtnText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '70%',
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  closeBtn: {
    padding: 10,
  },
  closeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  links: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 300,
  },
  linkBtn: {
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingVertical: 12,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomBtns: {
    marginBottom: 60,
  },
  bottomBtn: {
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingVertical: 12,
    alignItems: 'center',
    
  },
  bottomBtnText: {
    fontSize: 16,
    fontWeight: '600',
    
  },
});

export default SlideBar; 