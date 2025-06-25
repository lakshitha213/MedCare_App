import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import SlideBar from './SlideBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Channeling = () => {
  const [doctors, setDoctors] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const [isSlideBarOpen, setIsSlideBarOpen] = useState(false);

  const morningSlots = [
    '8:30 a.m.', '9:30 a.m.', '10:30 a.m.', '11:30 a.m.', '12:30 p.m.'
  ];
  const afternoonSlots = [
    '1:30 p.m.', '2:30 p.m.', '3:30 p.m.', '4:30 p.m.', '5:30 p.m.'
  ];
  const allSlots = [...morningSlots, ...afternoonSlots];
  const [selectedTimes, setSelectedTimes] = useState({});

  const categories = [
    'All Doctors',
    'General & Primary Care',
    'Cardiology & Related',
    'Neurology & Psychology',
    'Musculoskeletal',
    'Hematology & Oncology',
    'Pulmonary & Chest',
    'Digestive System',
    'Endocrine & Metabolic',
    'Kidney & Urology',
    'Pediatrics & Related',
    "Women's Health",
    "Men's Health",
    'Eye & Vision',
    'Ear, Nose, Throat (ENT)',
    'Teeth & Mouth',
    'Skin & Hair',
    'Emergency & Critical Care',
    'Infection & Immunity',
  ];
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8082/api/doctors/all')
      .then(res => {
        if (route.params && route.params.doctorName) {
          setDoctors(res.data.filter(doc => doc.name === route.params.doctorName));
        } else {
          setDoctors(res.data);
        }
      })
      .catch(err => console.error('Error fetching doctors:', err));
  }, [route.params]);

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  // Group doctors by category
  const doctorsByCategory = doctors.reduce((acc, doctor) => {
    const cat = doctor.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doctor);
    return acc;
  }, {});

  // Filter doctors by selected category
  const filteredDoctors = !selectedCategory || selectedCategory === 'All Doctors'
    ? doctors
    : (doctorsByCategory[selectedCategory] || []);

  return (
    <View style={{flex: 1, backgroundColor: '#e6c6f5'}}>
      <ScrollView contentContainerStyle={styles.container} style={{paddingTop: 60}}>
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
        {/* Main Channeling Content */}
        <Text style={styles.title}>Available Doctors</Text>
        {/* Category Dropdown */}
        <View style={{ width: '100%', marginBottom: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', padding: 8 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Select Category</Text>
            <View style={{ borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: '#ccc' }}>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{ width: '100%', padding: 10, fontSize: 16, border: 'none', outline: 'none' }}
              >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </View>
          </View>
        </View>
        {/* Show doctors in selected category or all doctors */}
        {filteredDoctors.length === 0 && (
          <Text>No doctors available in this category.</Text>
        )}
        {filteredDoctors.length > 0 && (
          <View style={{ width: '100%', marginBottom: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#3d2c8d' }}>{selectedCategory || 'All Doctors'}</Text>
            {filteredDoctors.map(doctor => (
              <View key={doctor.id} style={styles.card}>
                <Text style={styles.name}>{doctor.name}</Text>
                <Text>Category: {doctor.category}</Text>
                <Text>Degree: {doctor.degree}</Text>
                <Text>Doctor ID: {doctor.doctorId}</Text>
                <Text>Email: {doctor.email}</Text>
                {doctor.photo && (
                  <Image
                    source={{ uri: doctor.photo }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                )}
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10}}>
                  {allSlots.map(slot => (
                    <TouchableOpacity
                      key={slot}
                      style={{
                        backgroundColor: selectedTimes[doctor.id] === slot ? '#007bff' : '#e0e0e0',
                        padding: 8,
                        borderRadius: 5,
                        margin: 4,
                        minWidth: 80,
                        alignItems: 'center',
                      }}
                      onPress={() => setSelectedTimes(prev => ({ ...prev, [doctor.id]: slot }))}
                    >
                      <Text style={{ color: selectedTimes[doctor.id] === slot ? '#fff' : '#333', fontWeight: 'bold' }}>{slot}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.linkBtn, { backgroundColor: '#28a745', marginTop: 10 }]}
                  onPress={async () => {
                    const userEmail = await AsyncStorage.getItem('userEmail');
                    const selectedTime = selectedTimes[doctor.id] || allSlots[0];
                    const channelingData = {
                      userEmail,
                      doctorName: doctor.name,
                      channelingName: "General Channeling",
                      date: new Date().toISOString().split('T')[0],
                      time: selectedTime
                    };
                    await axios.post('http://localhost:8082/api/channeling/add', channelingData);
                    navigation.navigate('Profile');
                  }}
                >
                  <Text style={styles.linkText}>Book</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
     alignItems: 'center',
     padding: 20
     },
  title: { fontSize: 24,
     fontWeight: 'bold',
      marginBottom: 20 
    },
  card: { backgroundColor: '#fff',
     borderRadius: 10,
     padding: 15,
     marginBottom: 15,
     alignItems: 'center',
     width: '100%'
    },
  name: { fontSize: 18,
     fontWeight: 'bold'
     
    },
  photo: { width: 80,
     height: 80,
     borderRadius: 40,
     marginTop: 5 
  },
  linkBtn: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuBtn: {
    marginTop: 10,
    marginLeft: 10,
    width: 30,
    height: 30,
    zIndex: 200,
  },
});

export default Channeling; 