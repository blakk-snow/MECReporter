// screens/RecordResultsScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function RecordResultsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentResults, setStudentResults] = useState({
    attendance: '',
    conduct: '',
    interests: '',
    remarks: '',
    headRemarks: '',
    subjects: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load students
      const storedStudents = await AsyncStorage.getItem('@students');
      if (storedStudents) {
        const parsedStudents = JSON.parse(storedStudents);
        setStudents(parsedStudents);
        if (parsedStudents.length > 0) {
          setSelectedStudent(parsedStudents[0].id);
        }
      }

      // Load subjects
      const storedSubjects = await AsyncStorage.getItem('@subjects');
      if (storedSubjects) {
        const parsedSubjects = JSON.parse(storedSubjects);
        setSubjects(parsedSubjects);
      }

      // Load existing results if available
      const storedResults = await AsyncStorage.getItem('@results');
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        if (parsedResults[selectedStudent]) {
          setStudentResults(parsedResults[selectedStudent]);
        }
      }
    } catch (error) {
      console.error('Error loading data', error);
    }
  };

  useEffect(() => {
    // When student selection changes, load their results
    loadStudentResults();
  }, [selectedStudent]);

  const loadStudentResults = async () => {
    if (!selectedStudent) return;

    try {
      const storedResults = await AsyncStorage.getItem('@results');
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        if (parsedResults[selectedStudent]) {
          setStudentResults(parsedResults[selectedStudent]);
        } else {
          // Reset form for new student
          setStudentResults({
            attendance: '',
            conduct: '',
            interests: '',
            remarks: '',
            headRemarks: '',
            subjects: subjects.reduce((acc, subject) => {
              acc[subject.id] = { classScore: '', examScore: '', total: '', remarks: '' };
              return acc;
            }, {})
          });
        }
      } else {
        // Initialize empty results
        setStudentResults({
          attendance: '',
          conduct: '',
          interests: '',
          remarks: '',
          headRemarks: '',
          subjects: subjects.reduce((acc, subject) => {
            acc[subject.id] = { classScore: '', examScore: '', total: '', remarks: '' };
            return acc;
          }, {})
        });
      }
    } catch (error) {
      console.error('Error loading student results', error);
    }
  };

  const handleGeneralInfoChange = (field, value) => {
    setStudentResults(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to determine remarks based on total score
  const generateRemarks = (totalScore) => {
    const score = parseInt(totalScore) || 0;
    
    if (score >= 80) return 'HIGHLY PROFICIENT';
    if (score >= 70) return 'PROFICIENT';
    if (score >= 60) return 'APPROACHING PROFICIENCY';
    if (score >= 50) return 'DEVELOPING';
    return 'EMERGING';
  };

  // Helper function to generate detailed remarks for teacher and headmaster
  const generateDetailedRemarks = (averageScore) => {
    // Teacher's remarks are more detailed
    let teacherRemarks = '';
    if (averageScore >= 80) {
      teacherRemarks = 'Excellent performance. Shows great understanding and application of concepts.';
    } else if (averageScore >= 70) {
      teacherRemarks = 'Good performance. Demonstrates solid understanding of most concepts.';
    } else if (averageScore >= 60) {
      teacherRemarks = 'Satisfactory performance. Shows basic understanding of concepts.';
    } else if (averageScore >= 50) {
      teacherRemarks = 'Needs improvement. Some concepts need more attention.';
    } else {
      teacherRemarks = 'Requires significant improvement. Additional support recommended.';
    }
    
    // Headmaster's remarks are more concise
    let headRemarks = '';
    if (averageScore >= 80) {
      headRemarks = 'Outstanding performance. Keep up the excellent work!';
    } else if (averageScore >= 70) {
      headRemarks = 'Good progress. Continue to work hard.';
    } else if (averageScore >= 60) {
      headRemarks = 'Satisfactory progress. Room for improvement.';
    } else if (averageScore >= 50) {
      headRemarks = 'Needs more effort. Focus on weak areas.';
    } else {
      headRemarks = 'Requires immediate attention. Parent consultation recommended.';
    }
    
    return { teacherRemarks, headRemarks };
  };

  // Calculate overall performance and generate remarks
  const calculateOverallPerformance = () => {
    if (!studentResults.subjects || Object.keys(studentResults.subjects).length === 0) {
      return { teacherRemarks: '', headRemarks: '' };
    }

    let totalMarks = 0;
    let subjectCount = 0;

    // Calculate average across all subjects
    Object.values(studentResults.subjects).forEach(subject => {
      if (subject.total) {
        totalMarks += parseInt(subject.total);
        subjectCount++;
      }
    });

    const averageScore = subjectCount > 0 ? totalMarks / subjectCount : 0;
    
    // Generate detailed remarks for teacher and headmaster
    return generateDetailedRemarks(averageScore);
  };

  const handleSubjectScoreChange = (subjectId, field, value) => {
    const subjectData = { ...studentResults.subjects[subjectId] };
    subjectData[field] = value;

    // Calculate total if either score is provided
    if (field === 'classScore' || field === 'examScore') {
      const classScore = field === 'classScore' ? parseInt(value) || 0 : parseInt(subjectData.classScore) || 0;
      const examScore = field === 'examScore' ? parseInt(value) || 0 : parseInt(subjectData.examScore) || 0;
      subjectData.total = (classScore + examScore).toString();
      
      // Auto-generate remarks based on total score
      subjectData.remarks = generateRemarks(subjectData.total);
    }

    // Update the subject data
    const updatedSubjects = {
      ...studentResults.subjects,
      [subjectId]: subjectData
    };

    // Calculate overall performance and generate remarks
    const { teacherRemarks, headRemarks } = calculateOverallPerformance();

    // Update the entire student results
    setStudentResults(prev => ({
      ...prev,
      subjects: updatedSubjects,
      remarks: teacherRemarks,
      headRemarks: headRemarks
    }));
  };

  const saveResults = async () => {
    try {
      // Get existing results or initialize empty object
      const storedResults = await AsyncStorage.getItem('@results');
      const results = storedResults ? JSON.parse(storedResults) : {};

      // Update results for selected student
      results[selectedStudent] = studentResults;

      // Save back to storage
      await AsyncStorage.setItem('@results', JSON.stringify(results));
      alert('Results saved successfully!');
    } catch (error) {
      console.error('Error saving results', error);
      alert('Failed to save results.');
    }
  };

  const getStudentName = (id) => {
    const student = students.find(s => s.id === id);
    return student ? `${student.lastName}, ${student.firstName}` : 'Select Student';
  };

  const getSubjectName = (id) => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : '';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Select Student:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStudent}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedStudent(itemValue)}
          >
            <Picker.Item label="Select a student..." value="" />
            {students.map(student => (
              <Picker.Item 
                key={student.id} 
                label={`${student.lastName}, ${student.firstName}`} 
                value={student.id} 
              />
            ))}
          </Picker>
        </View>
      </View>

      {selectedStudent && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Information</Text>
            
            <View style={styles.inputRow}>
              <Text style={styles.label}>Attendance:</Text>
              <TextInput
                style={styles.input}
                value={studentResults.attendance}
                onChangeText={(text) => handleGeneralInfoChange('attendance', text)}
                placeholder="Days Present / Total Days"
              />
            </View>
            
            <View style={styles.inputRow}>
              <Text style={styles.label}>Conduct:</Text>
              <TextInput
                style={styles.input}
                value={studentResults.conduct}
                onChangeText={(text) => handleGeneralInfoChange('conduct', text)}
                placeholder="Excellent, Good, Fair, etc."
              />
            </View>
            
            <View style={styles.inputRow}>
              <Text style={styles.label}>Interests:</Text>
              <TextInput
                style={styles.input}
                value={studentResults.interests}
                onChangeText={(text) => handleGeneralInfoChange('interests', text)}
                placeholder="Sports, Music, Art, etc."
              />
            </View>
            
            <View style={styles.inputRow}>
              <Text style={styles.label}>Teacher's Remarks:</Text>
              <TextInput
                style={[styles.input, styles.textArea, styles.readOnlyInput]}
                value={studentResults.remarks}
                placeholder="Auto-generated based on performance"
                multiline={true}
                numberOfLines={4}
                editable={false}
              />
            </View>
            
            <View style={styles.inputRow}>
              <Text style={styles.label}>Headmaster's Remarks:</Text>
              <TextInput
                style={[styles.input, styles.textArea, styles.readOnlyInput]}
                value={studentResults.headRemarks}
                placeholder="Auto-generated based on performance"
                multiline={true}
                numberOfLines={4}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subject Scores</Text>
            
            {subjects.map(subject => (
              <View key={subject.id} style={styles.subjectSection}>
                <Text style={styles.subjectTitle}>{subject.name}</Text>
                
                <View style={styles.scoreRow}>
                  <View style={styles.scoreField}>
                    <Text style={styles.label}>Class Score:</Text>
                    <TextInput
                      style={styles.scoreInput}
                      value={studentResults.subjects[subject.id]?.classScore || ''}
                      onChangeText={(text) => handleSubjectScoreChange(subject.id, 'classScore', text)}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.scoreField}>
                    <Text style={styles.label}>Exam Score:</Text>
                    <TextInput
                      style={styles.scoreInput}
                      value={studentResults.subjects[subject.id]?.examScore || ''}
                      onChangeText={(text) => handleSubjectScoreChange(subject.id, 'examScore', text)}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.scoreField}>
                    <Text style={styles.label}>Total:</Text>
                    <Text style={styles.totalScore}>
                      {studentResults.subjects[subject.id]?.total || '0'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Remarks:</Text>
                  <TextInput
                    style={[styles.input, styles.remarksInput]}
                    value={studentResults.subjects[subject.id]?.remarks || ''}
                    onChangeText={(text) => handleSubjectScoreChange(subject.id, 'remarks', text)}
                    placeholder="Auto-generated based on total"
                    editable={false}
                  />
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveResults}>
            <Text style={styles.saveButtonText}>Save Results</Text>
          </TouchableOpacity>
        </>
      )}
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
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  inputRow: {
    marginBottom: 12,
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
  remarksInput: {
    backgroundColor: '#f0f0f0',  // Light grey background to indicate read-only
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  subjectSection: {
    backgroundColor: '#edf5ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scoreField: {
    width: '30%',
  },
  scoreInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  totalScore: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#eee',
    fontWeight: 'bold',
    lineHeight: 40,
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
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#555',
  },
});

export default RecordResultsScreen;