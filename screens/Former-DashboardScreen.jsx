// screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

function DashboardScreen({ navigation }) {
  const [settings, setSettings] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);

  // Use useFocusEffect to reload data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      // Load settings
      const storedSettings = await AsyncStorage.getItem('@settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        setSettings(null); // Reset if no settings found
      }

      // Load student count
      const storedStudents = await AsyncStorage.getItem('@students');
      setStudentCount(storedStudents ? JSON.parse(storedStudents).length : 0);


      // Load subject count
      const storedSubjects = await AsyncStorage.getItem('@subjects');
      setSubjectCount(storedSubjects ? JSON.parse(storedSubjects).length : 0);

    } catch (error) {
      console.error('Error loading dashboard data', error);
      // Optionally, set default values or show an error message
      setSettings(null);
      setStudentCount(0);
      setSubjectCount(0);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MyClass Dashboard</Text>
        {settings && settings.schoolName ? (
          <Text style={styles.subtitle}>{settings.schoolName}</Text>
        ) : (
          <Text style={styles.subtitle}>School Name Not Set</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{studentCount}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{subjectCount}</Text>
          <Text style={styles.statLabel}>Subjects</Text>
        </View>
        {settings && settings.academicTerm ? (
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{settings.academicTerm}</Text>
            <Text style={styles.statLabel}>Current Term</Text>
          </View>
        ) : (
           <View style={styles.statCard}>
            <Text style={styles.statNumber}>-</Text>
            <Text style={styles.statLabel}>Current Term</Text>
          </View>
        )}
      </View>

      <View style={styles.menuContainer}>
        {/* Settings */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.menuItemText}>App Settings</Text>
        </TouchableOpacity>

        {/* Manage Students */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ManageStudents')}
        >
          <Text style={styles.menuItemText}>Manage Students</Text>
        </TouchableOpacity>

        {/* Manage Subjects */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ManageSubjects')}
        >
          <Text style={styles.menuItemText}>Manage Subjects</Text>
        </TouchableOpacity>

        {/* Record Results */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('RecordResults')}
        >
          <Text style={styles.menuItemText}>Record Results</Text>
        </TouchableOpacity>

        {/* Generate Report */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('GenerateReport')}
        >
          <Text style={styles.menuItemText}>Generate Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Lighter background
  },
  header: {
    backgroundColor: '#3498db', // Primary color
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ecf0f1', // Lighter text color
    textAlign: 'center',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1, // Make cards take equal space
    marginHorizontal: 5, // Add spacing between cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3498db', // Primary color
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d', // Secondary text color
    marginTop: 5,
  },
  menuContainer: {
    paddingHorizontal: 15,
  },
  menuItem: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row', // Align icon and text if needed later
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemText: {
    fontSize: 16,
    color: '#34495e', // Darker text color
    fontWeight: '500',
  },
});

export default DashboardScreen;
