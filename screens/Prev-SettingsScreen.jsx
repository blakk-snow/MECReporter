// screens/SettingsScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SettingsScreen({ navigation }) {
  const [schoolName, setSchoolName] = useState('');
  const [className, setClassName] = useState('');
  const [numOnRoll, setNumOnRoll] = useState('');
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [academicTerm, setAcademicTerm] = useState('1');
  const [schoolEnding, setSchoolEnding] = useState('06/30/2025');
  const [nextTermBegins, setNextTermBegins] = useState('09/15/2025');

  const saveSettings = async () => {
    try {
      const settings = {
        schoolName,
        className,
        numOnRoll: parseInt(numOnRoll) || 0,
        academicYear,
        academicTerm,
        schoolEnding,
        nextTermBegins,
      };
      
      await AsyncStorage.setItem('@settings', JSON.stringify(settings));
      // Navigate to the next screen or dashboard
      navigation.navigate('ManageStudents');
    } catch (error) {
      console.error('Error saving settings', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <View style={styles.inputRow}>
          <Text style={styles.label}>School Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={schoolName}
              onChangeText={setSchoolName}
              placeholder="Enter school name"
            />
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Class Settings</Text>
        
        <View style={styles.inputRow}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={className}
            onChangeText={setClassName}
            placeholder="Enter class name"
          />
        </View>
        
        <View style={styles.inputRow}>
          <Text style={styles.label}>Num on Roll</Text>
          <TextInput
            style={styles.input}
            value={numOnRoll}
            onChangeText={setNumOnRoll}
            placeholder="Enter number of students"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputRow}>
          <Text style={styles.label}>Academic Year</Text>
          <TextInput
            style={styles.input}
            value={academicYear}
            onChangeText={setAcademicYear}
            placeholder="2024/2025"
          />
        </View>
        
        <View style={styles.inputRow}>
          <Text style={styles.label}>Academic Term</Text>
          <TextInput
            style={styles.input}
            value={academicTerm}
            onChangeText={setAcademicTerm}
            placeholder="1"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputRow}>
          <Text style={styles.label}>School Ending</Text>
          <TextInput
            style={styles.input}
            value={schoolEnding}
            onChangeText={setSchoolEnding}
            placeholder="MM/DD/YYYY"
          />
        </View>
        
        <View style={styles.inputRow}>
          <Text style={styles.label}>Next Term Begins</Text>
          <TextInput
            style={styles.input}
            value={nextTermBegins}
            onChangeText={setNextTermBegins}
            placeholder="MM/DD/YYYY"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  changeButton: {
    marginLeft: 10,
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
  },
  changeButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsScreen;