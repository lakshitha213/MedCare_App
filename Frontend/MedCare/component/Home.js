import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import SlideBar from './SlideBar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Home = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8082/api/doctors/all')
      .then(res => setDoctors(res.data))
      .catch(err => console.error('Error fetching doctors:', err));
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setSuggestions([]);
    } else {
      setSuggestions(
        doctors.filter(doc =>
          doc.name.toLowerCase().includes(search.toLowerCase()) ||
          (doc.category && doc.category.toLowerCase().includes(search.toLowerCase()))
        )
      );
    }
  }, [search, doctors]);

  useEffect(() => {
    const checkLogin = async () => {
      const userEmail = await AsyncStorage.getItem('userEmail');
      setLoggedIn(!!userEmail);
    };
    checkLogin();
    // Listen for focus to update login state
    const unsubscribe = navigation.addListener('focus', checkLogin);
    return unsubscribe;
  }, [navigation]);

  const handleNavigate = (screen) => {
    setSidebarVisible(false);
    navigation.navigate(screen);
  };

  const handleSuggestionPress = (name) => {
    setSearch(name);
    setSuggestions([]);
    navigation.navigate('Channeling', { doctorName: name });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userEmail');
    setLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Purple Section */}
      <View style={styles.topSection}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <Text style={styles.menuBtn}>☰</Text>
          </TouchableOpacity>
          {loggedIn ? (
            <TouchableOpacity style={styles.signInBtn} onPress={handleLogout}>
              <Text style={styles.signInText}>LOGOUT</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.signInBtn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInText}>LOGIN</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Doctor"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <View style={styles.verticalLine} />
          <TouchableOpacity>
            <Text style={styles.searchIcon}>
              <Image
                source={require('../assets/—Pngtree—search icon_4699282.png')}
                style={styles.SearchiconImg}
                resizeMode="contain"
              />
            </Text>
          </TouchableOpacity>
        </View>
        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <View style={{ backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 8, maxHeight: 150, elevation: 3, zIndex: 10 }}>
            <FlatList
              data={suggestions}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                  onPress={() => handleSuggestionPress(item.name)}
                >
                  <Text style={{ fontSize: 16 }}>{item.name} <Text style={{ color: '#888', fontSize: 14 }}>({item.category})</Text></Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        {/* Show doctor list if searching and not using suggestions dropdown */}
        {search.trim() !== '' && suggestions.length === 0 && (
          <View style={{ backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 8, maxHeight: 200, elevation: 3, zIndex: 10, marginTop: 8, padding: 8 }}>
            <Text style={{ color: '#888', textAlign: 'center' }}>No doctors found.</Text>
          </View>
        )}
      </View>

      {/* Lower Section with arc */}
      <View style={styles.lowerSection}>
        {/* SVG Arc */}
        <Svg
          height="700"
          width={width}
          style={styles.arc}
        >
          <Path
            d={`
              M ${width/2} 100
              A 250 250 0 1 1 ${width/2} 600
              A 250 250 0 1 1 ${width/2} 100
              Z
            `}
            fill="#3d2c8d"
          />
        </Svg>
        <Text style={styles.heroTitle}>Med Care</Text>
        <Text style={styles.heroSubtitle}>Your Health. Our Priority.</Text>
        <Image
          source={require('../assets/doctor.png')}
          style={styles.doctorImg}
          resizeMode="contain"
        />
      </View>
      {sidebarVisible && (
        <SlideBar
          onClose={() => setSidebarVisible(false)}
          onNavigate={handleNavigate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6c6f5',
  },
  topSection: {
    backgroundColor: '#7b2ff2',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 32,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  menuBtn: {
    fontSize: 28,
    color: '#000',
  },
  signInBtn: {
    backgroundColor: '#f2a7f2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  signInText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    fontSize: 22,
    paddingHorizontal: 8,
  },
  lowerSection: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e6c6f5',
    position: 'relative',
    paddingTop: 40,
  },
  arc: {
    position: 'absolute',
    top: 260,
    right: 0,
    left: 0,
    height: '200%',
    width: '200%',
  },
  heroTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    marginTop: 40,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 32,
  },
  doctorImg: {
    width: 400,
    height: 400,
    borderRadius: 24,
    marginTop: 60,
  },
  SearchiconImg: {
    width: 30,
    height: 30,
  },
  verticalLine: {
    width: 1,
    height: 24,
    backgroundColor: '#000',
    marginHorizontal: 8,
  },
});

export default Home;