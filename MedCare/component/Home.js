import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const Home = () => {
  return (
    <View style={styles.container}>
      {/* Top Purple Section */}
      <View style={styles.topSection}>
        <View style={styles.topBar}>
          <TouchableOpacity>
            <Text style={styles.menuBtn}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signInBtn}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Doctor"
            placeholderTextColor="#888"
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
    top: 200,
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
    marginTop: 37,
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