// screens/WelcomeScreen.js
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import RandomGreeting from '../components/RandomGreeting';

function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/school-icon.png')} 
          style={styles.logo} 
        />
        <RandomGreeting style={styles.title} />
        <Text style={styles.subtitle}>Your digital teacher aid.</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.outlineButton}
            onPress={() => navigation.navigate('Guide')}
          >
            <Text style={styles.outlineButtonText}>Guide</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filledButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.filledButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.textButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.textButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  outlineButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
  filledButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  filledButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  textButton: {
    marginTop: 20,
  },
  textButtonText: {
    color: '#3498db',
    fontSize: 14,
  },
});

export default WelcomeScreen;