// screens/ManageStudentsScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontStyles from '../utils/fontStyles';


function ManageStudentsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ id: '', firstName: '', lastName: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('@students');
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }
    } catch (error) {
      console.error('Error loading students', error);
    }
  };

  const saveStudents = async (updatedStudents) => {
    try {
      await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));
      setStudents(updatedStudents);
    } catch (error) {
      console.error('Error saving students', error);
    }
  };

  const addStudent = () => {
    setCurrentStudent({ id: Date.now().toString(), firstName: '', lastName: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const editStudent = (student) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setModalVisible(true);
  };

  const deleteStudent = (id) => {
    const updatedStudents = students.filter(student => student.id !== id);
    saveStudents(updatedStudents);
  };

  const handleSaveStudent = () => {
    if (!currentStudent.firstName.trim() || !currentStudent.lastName.trim()) {
      return; // Don't save empty names
    }

    let updatedStudents;
    if (isEditing) {
      updatedStudents = students.map(student => 
        student.id === currentStudent.id ? currentStudent : student
      );
    } else {
      updatedStudents = [...students, currentStudent];
    }

    saveStudents(updatedStudents);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentName}>{item.lastName}, {item.firstName}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => editStudent(item)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteStudent(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Students</Text>
        <TouchableOpacity style={styles.addButton} onPress={addStudent}>
          <Text style={styles.addButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
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
              {isEditing ? 'Edit Student' : 'Add Student'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={currentStudent.firstName}
                onChangeText={(text) => setCurrentStudent({...currentStudent, firstName: text})}
                placeholder="First Name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={currentStudent.lastName}
                onChangeText={(text) => setCurrentStudent({...currentStudent, lastName: text})}
                placeholder="Last Name"
              />
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
                onPress={handleSaveStudent}
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
    fontFamily: fontStyles.bold.fontFamily,
  },
  list: {
    width: '100%',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  studentName: {
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
    fontFamily: fontStyles.bold.fontFamily,
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
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
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

export default ManageStudentsScreen;