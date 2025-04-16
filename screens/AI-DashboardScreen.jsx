// screens/DashboardScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function DashboardScreen({ navigation }) {
  const menuItems = [
    { 
      title: 'Manage Students', 
      icon: '👨‍🎓', 
      screen: 'ManageStudents',
      description: 'Add, edit, or remove student records'
    },
    { 
      title: 'Manage Subjects', 
      icon: '📚', 
      screen: 'ManageSubjects',
      description: 'Define subjects for your class'
    },
    { 
      title: 'Record Results', 
      icon: '📝', 
      screen: 'RecordResults',
      description: 'Enter performance data for students'
    },
    { 
      title: 'Generate Report', 
      icon: '📊', 
      screen: 'GenerateReport',
      description: 'Create student performance reports'
    },
    { 
      title: 'Settings', 
      icon: '⚙️', 
      screen: 'Settings',
      description: 'Configure app and class details'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MyClass Dashboard</Text>
        <Text style={styles.subtitle}>Select a task to begin</Text>
      </View>
      
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 40,
    textAlign: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
});

export default DashboardScreen;