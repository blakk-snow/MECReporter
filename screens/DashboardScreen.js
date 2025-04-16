// screens/DashboardScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import fontStyles from '../utils/fontStyles';

function DashboardScreen({ navigation }) {
  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [settings, setSettings] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
      return () => {};
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      // Load settings
      const storedSettings = await AsyncStorage.getItem('@settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }

      // Load student count
      const storedStudents = await AsyncStorage.getItem('@students');
      setStudentCount(storedStudents ? JSON.parse(storedStudents).length : 0);

      // Load subject count
      const storedSubjects = await AsyncStorage.getItem('@subjects');
      setSubjectCount(storedSubjects ? JSON.parse(storedSubjects).length : 0);
    } catch (error) {
      console.error('Error loading dashboard data', error);
      setSettings(null);
      setStudentCount(0);
      setSubjectCount(0);
    }
  };

  const menuItems = [
    {
      title: 'Manage Students',
      icon: '👨‍🎓',
      screen: 'ManageStudents',
      description: 'Add, edit, or remove student records',
      color: '#3949AB'
    },
    {
      title: 'Manage Subjects',
      icon: '📚',
      screen: 'ManageSubjects',
      description: 'Define subjects for your class',
      color: '#3949AB'
    },
    {
      title: 'Record Results',
      icon: '📝',
      screen: 'RecordResults',
      description: 'Enter performance data for students',
      color: '#3949AB'
    },
    {
      title: 'Generate Report',
      icon: '📊',
      screen: 'GenerateReport',
      description: 'Create student performance reports',
      color: '#3949AB'
    },
    {
      title: 'Settings',
      icon: '⚙️',
      screen: 'Settings',
      description: 'Configure app and class details',
      color: '#3949AB'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3949AB" />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.statValue}>{studentCount}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.statValue}>{subjectCount}</Text>
            <Text style={styles.statLabel}>Subjects</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Access</Text>
        
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: item.color + '15' }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '30' }]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    // backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: '#eaeaea',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fontStyles.bold.fontFamily, // <-- Apply font to title too
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: fontStyles.regular.fontFamily, // <-- Apply font to subtitle too
    color: '#666',
    marginTop: 4,
  },
  contentContainer: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3949AB',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: fontStyles.regular.fontFamily, // <-- Apply font to label too
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontStyles.bold.fontFamily, // <-- Apply font to title too
    color: '#333',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: fontStyles.bold.fontFamily, // <-- Apply font to title too
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    fontFamily: fontStyles.regular.fontFamily, // <-- Apply font to description too
    color: '#666',
    lineHeight: 16,
  },
});

export default DashboardScreen;