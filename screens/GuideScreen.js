import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function GuideScreen({ navigation }) {
  const guideSteps = [
    {
      title: 'Welcome to MEC Report',
      description: 'This app helps you manage your class, record student results, and generate reports easily.',
      icon: 'school-outline',
    },
    {
      title: 'Step 1: App Settings',
      description: 'Start by setting up your school details, class information, and academic calendar in the Settings screen.',
      icon: 'settings-outline',
    },
    {
      title: 'Step 2: Manage Students',
      description: 'Add your students to the class. You can add, edit, or remove student records as needed.',
      icon: 'people-outline',
    },
    {
      title: 'Step 3: Manage Subjects',
      description: 'Define the subjects taught in your class. Add all subjects that will be assessed.',
      icon: 'book-outline',
    },
    {
      title: 'Step 4: Record Results',
      description: 'Enter student performance data including class scores, exam scores, attendance, and conduct.',
      icon: 'pencil-outline',
    },
    {
      title: 'Step 5: Generate Reports',
      description: 'Create professional PDF reports for each student with their academic performance and remarks.',
      icon: 'document-text-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>A simple guide to get you started</Text>
        
        {guideSteps.map((step, index) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.stepIconContainer}>
              <Ionicons name={step.icon} size={32} color="#3949AB" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GuideScreen; 