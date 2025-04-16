// screens/GenerateReportScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function GenerateReportScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const [results, setResults] = useState({});
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load settings
      const storedSettings = await AsyncStorage.getItem('@settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }

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
        setSubjects(JSON.parse(storedSubjects));
      }

      // Load results
      const storedResults = await AsyncStorage.getItem('@results');
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      }
    } catch (error) {
      console.error('Error loading data', error);
    }
  };

  const getStudentName = (id) => {
    const student = students.find(s => s.id === id);
    return student ? `${student.firstName} ${student.lastName}` : '';
  };

  const getSubjectName = (id) => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : '';
  };

  const generatePDFHtml = () => {
    if (!selectedStudent || !settings || !results[selectedStudent]) {
      return '<p>No data available to generate report.</p>';
    }

    const student = students.find(s => s.id === selectedStudent);
    const studentResults = results[selectedStudent];
    
    // Prepare subject rows with remarks
    const subjectRows = subjects.map(subject => {
      const subjectResult = (studentResults.subjects && studentResults.subjects[subject.id]) || {};
      return `
        <tr>
          <td>${subject.name}</td>
          <td>${subjectResult.classScore || ''}</td>
          <td>${subjectResult.examScore || ''}</td>
          <td>${subjectResult.total || ''}</td>
          <td>${subjectResult.remarks || ''}</td>
        </tr>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            @page { size: A4; margin: 20mm; }
            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: #333;
              font-size: 11pt;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
            }
            .school-name {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 2px;
            }
            .report-title {
              font-size: 14px;
              margin-bottom: 10px;
            }
            .student-info {
              margin-bottom: 10px;
            }
            .info-row {
              display: flex;
              margin-bottom: 2px;
              font-size: 11pt;
            }
            .info-label {
              font-weight: bold;
              width: 100px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
              table-layout: fixed;
              font-size: 10pt;
            }
            th, td {
              border: 1px solid #bbb;
              padding: 4px 3px;
              text-align: left;
              word-break: break-word;
            }
            th {
              background-color: #f2f2f2;
              font-size: 10.5pt;
            }
            .remarks-section {
              margin-top: 8px;
              margin-bottom: 6px;
              font-size: 10.5pt;
            }
            .signature {
              margin-top: 16px;
              display: flex;
              justify-content: space-between;
              font-size: 10pt;
            }
            .signature-line {
              border-top: 1px solid #333;
              width: 120px;
              text-align: center;
              margin-top: 18px;
              font-size: 10pt;
            }
            .footer {
              margin-top: 10px;
              text-align: center;
              font-size: 10pt;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">${settings.schoolName || 'School Name'}</div>
            <div class="report-title">${settings.className || ''} - Academic Report Sheet</div>
            <div style="font-size:10pt;">${settings.schoolAddress || ''}</div>
            <div style="font-size:10pt;">${settings.schoolPhone || ''}</div>
          </div>
          <div class="student-info">
            <div class="info-row"><div class="info-label">Name:</div> <div>${student ? student.firstName + ' ' + student.lastName : ''}</div></div>
            <div class="info-row"><div class="info-label">Class:</div> <div>${settings.className || ''}</div></div>
            <div class="info-row"><div class="info-label">No. on Roll:</div> <div>${settings.numOnRoll || ''}</div></div>
            <div class="info-row"><div class="info-label">Term:</div> <div>${settings.academicTerm || ''}</div></div>
            <div class="info-row"><div class="info-label">Term Closes:</div> <div>${settings.schoolEndDate || ''}</div></div>
            <div class="info-row"><div class="info-label">Next Term:</div> <div>${settings.nextTermBegins || ''}</div></div>
          </div>
          <table>
            <tr>
              <th style="width:18%">Subject</th>
              <th style="width:13%">Class Score</th>
              <th style="width:13%">Exam Score</th>
              <th style="width:13%">Total</th>
              <th style="width:43%">Remarks</th>
            </tr>
            ${subjectRows}
          </table>
          <div class="remarks-section">
            <div><b>Attendance:</b> ${studentResults.attendance || ''}</div>
            <div><b>Conduct:</b> ${studentResults.conduct || ''}</div>
            <div><b>Best Subject:</b> ${studentResults.bestSubject || ''}</div>
          </div>
          <div class="remarks-section">
            <div><b>Class Teacher's Remarks:</b> ${studentResults.remarks || ''}</div>
            <div><b>Headmaster's Remarks:</b> ${studentResults.headRemarks || ''}</div>
          </div>
          <div class="signature">
            <div class="signature-line">Class Teacher</div>
            <div class="signature-line">Head Teacher</div>
          </div>
          <div class="footer">
            <div>School resumes on ${settings.nextTermBegins || ''} for the next term.</div>
          </div>
        </body>
      </html>
    `;
  };

  const generatePDF = async () => {
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    const html = generatePDFHtml();
    
    try {
      const { uri } = await Print.printToFileAsync({ html });
      
      const studentName = getStudentName(selectedStudent).replace(/\s+/g, '_');
      const fileName = `${studentName}_Report_${settings.academicTerm}_${settings.academicYear}.pdf`;
      
      if (showPreview) {
        await Print.printAsync({ uri });
      } else {
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf', dialogTitle: fileName });
      }
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Failed to generate report.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generate Student Report</Text>
        
        <View style={styles.inputRow}>
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
        
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setShowPreview(!showPreview)}
          >
            <View style={[styles.checkboxSquare, showPreview && styles.checkboxChecked]}>
              {showPreview && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Preview PDF</Text>
        </View>
      </View>

      {selectedStudent && settings && results[selectedStudent] && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Report Preview</Text>
          
          <View style={styles.previewHeader}>
            <Text style={styles.schoolName}>{settings.schoolName}</Text>
            <Text style={styles.reportTitle}>End of Term Report Card</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student:</Text>
            <Text>{getStudentName(selectedStudent)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Class:</Text>
            <Text>{settings.className}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Term:</Text>
            <Text>{settings.academicTerm} ({settings.academicYear})</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Attendance:</Text>
            <Text>{results[selectedStudent].attendance}</Text>
          </View>

          <Text style={styles.tableTitle}>Subject Results</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.subjectCell]}>Subject</Text>
            <Text style={styles.tableCell}>Class</Text>
            <Text style={styles.tableCell}>Exam</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          
          {subjects.map(subject => {
            const subjectResult = results[selectedStudent].subjects[subject.id] || {};
            return (
              <View key={subject.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.subjectCell]}>{subject.name}</Text>
                <Text style={styles.tableCell}>{subjectResult.classScore || '0'}</Text>
                <Text style={styles.tableCell}>{subjectResult.examScore || '0'}</Text>
                <Text style={styles.tableCell}>{subjectResult.total || '0'}</Text>
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity 
        style={[styles.generateButton, (!selectedStudent || !settings || !results[selectedStudent]) && styles.disabledButton]} 
        onPress={generatePDF}
        disabled={!selectedStudent || !settings || !results[selectedStudent]}
      >
        <Text style={styles.generateButtonText}>Generate & Save Report</Text>
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
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3498db',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  previewContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reportTitle: {
    fontSize: 14,
    color: '#555',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  subjectCell: {
    flex: 2,
    textAlign: 'left',
  },
  generateButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default GenerateReportScreen;