// screens/ManageSubjectsScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontStyles from '../utils/fontStyles';


function ManageSubjectsScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({ id: '', name: '' });
  const [isEditing, setIsEditing] = useState(false);
  
  // Predefined list of subject options
  const subjectOptions = [
    'English Language',
    'Ghanaian Language',
    'French Language',
    'Mathematics',
    'Numeracy',
    'Integrated Science',
    'History',
    'Social Studies',
    'RME',
    'Creative Arts & Design',
    'Career Technology',
    'Computing'
  ];

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const storedSubjects = await AsyncStorage.getItem('@subjects');
      if (storedSubjects) {
        setSubjects(JSON.parse(storedSubjects));
      }
    } catch (error) {
      console.error('Error loading subjects', error);
    }
  };

  const saveSubjects = async (updatedSubjects) => {
    try {
      await AsyncStorage.setItem('@subjects', JSON.stringify(updatedSubjects));
      setSubjects(updatedSubjects);
    } catch (error) {
      console.error('Error saving subjects', error);
    }
  };

  const addSubject = () => {
    setCurrentSubject({ id: Date.now().toString(), name: subjectOptions[0] });
    setIsEditing(false);
    setModalVisible(true);
  };

  const editSubject = (subject) => {
    setCurrentSubject(subject);
    setIsEditing(true);
    setModalVisible(true);
  };

  const deleteSubject = (id) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    saveSubjects(updatedSubjects);
  };

  const handleSaveSubject = () => {
    if (!currentSubject.name.trim()) {
      return; // Don't save empty subject names
    }

    // Check if subject already exists to prevent duplicates
    if (!isEditing && subjects.some(subject => subject.name === currentSubject.name)) {
      alert('This subject has already been added');
      return;
    }

    let updatedSubjects;
    if (isEditing) {
      updatedSubjects = subjects.map(subject => 
        subject.id === currentSubject.id ? currentSubject : subject
      );
    } else {
      updatedSubjects = [...subjects, currentSubject];
    }

    saveSubjects(updatedSubjects);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.subjectItem}>
      <Text style={styles.subjectName}>{item.name}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => editSubject(item)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSubject(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Subjects</Text>
        <TouchableOpacity style={styles.addButton} onPress={addSubject}>
          <Text style={styles.addButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={subjects}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No subjects added yet. Tap "Add Subject" to begin.</Text>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Subject' : 'Add Subject'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Subject</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={currentSubject.name}
                  onValueChange={(value) => setCurrentSubject({...currentSubject, name: value})}
                >
                  {subjectOptions.map((subject, index) => (
                    <Picker.Item key={index} label={subject} value={subject} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveSubject}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: fontStyles.bold.fontFamily,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontFamily: fontStyles.bold.fontFamily, // <-- Updated to use bold font family
  },
  list: {
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
  subjectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  subjectName: {
    fontSize: 16,
    fontFamily: fontStyles.regular.fontFamily,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 10,
    padding: 5,
  },
  editButtonText: {
    color: '#3498db',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: 'red',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ManageSubjectsScreen;