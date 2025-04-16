// screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Image,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontStyles from '../utils/fontStyles';

// Import the local school icon
const schoolIcon = require('../assets/school-icon.png');

function SettingsScreen({ navigation }) {
  const [schoolName, setSchoolName] = useState('');
  const [className, setClassName] = useState('');
  const [numOnRoll, setNumOnRoll] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [term, setTerm] = useState('');
  const [schoolEndDate, setSchoolEndDate] = useState(new Date());
  const [nextTermDate, setNextTermDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showNextTermDatePicker, setShowNextTermDatePicker] = useState(false);
  const [schoolBadge, setSchoolBadge] = useState(null);
  const [useDefaultIcon, setUseDefaultIcon] = useState(false);

  // Load saved settings when component mounts
  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setSchoolName(settings.schoolName || '');
        setClassName(settings.className || '');
        setNumOnRoll(settings.numOnRoll ? settings.numOnRoll.toString() : '');
        setAcademicYear(settings.academicYear || '');
        setTerm(settings.term || '');
        
        if (settings.schoolEndDate) {
          setSchoolEndDate(new Date(settings.schoolEndDate));
        }
        
        if (settings.nextTermDate) {
          setNextTermDate(new Date(settings.nextTermDate));
        }
        
        if (settings.schoolBadge) {
          setSchoolBadge(settings.schoolBadge);
          setUseDefaultIcon(settings.useDefaultIcon || false);
        }
      }
    } catch (error) {
      console.error('Error loading settings', error);
    }
  };

  const handleImageUpload = () => {
    // Show options to select from camera roll or use default icon
    Alert.alert(
      'School Badge',
      'Choose an option',
      [
        {
          text: 'Use Default Icon',
          onPress: () => {
            // Set the default school icon
            setSchoolBadge({
              isDefaultIcon: true,
              source: 'local'
            });
            setUseDefaultIcon(true);
          }
        },
        {
          text: 'Choose from Gallery',
          onPress: () => {
            const options = {
              mediaType: 'photo',
              includeBase64: true,
              maxHeight: 300,
              maxWidth: 300,
            };

            launchImageLibrary(options, (response) => {
              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Error', 'Failed to pick image: ' + response.errorMessage);
              } else if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                // Store both the URI and base64 data for different use cases
                setSchoolBadge({
                  uri: selectedImage.uri,
                  base64: selectedImage.base64,
                  type: selectedImage.type,
                  source: 'gallery'
                });
                setUseDefaultIcon(false);
              }
            });
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleSaveSettings = async () => {
    try {
      const settings = {
        schoolName,
        className,
        numOnRoll: parseInt(numOnRoll) || 0,
        academicYear,
        term,
        schoolEndDate: schoolEndDate.toISOString(),
        nextTermDate: nextTermDate.toISOString(),
        schoolBadge,
        useDefaultIcon,
      };
      
      await AsyncStorage.setItem('@settings', JSON.stringify(settings));
      Alert.alert('Success', 'Settings saved successfully!');
      
      // Navigate to the next screen or dashboard
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error saving settings', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Function to render the badge image based on its source
  const renderBadgeImage = () => {
    if (!schoolBadge) {
      return null;
    }

    if (schoolBadge.isDefaultIcon) {
      return <Image source={schoolIcon} style={styles.badgeImage} />;
    } else {
      return (
        <Image 
          source={{ uri: `data:${schoolBadge.type};base64,${schoolBadge.base64}` }} 
          style={styles.badgeImage}
        />
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>School Settings</Text>
        <TextInput
          style={styles.input}
          placeholder="School Name"
          value={schoolName}
          onChangeText={setSchoolName}
        />
        
        {/* School Badge Upload Section */}
        <View style={styles.badgeContainer}>
          {renderBadgeImage()}
          <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
            <Text style={styles.uploadButtonText}>
              {schoolBadge ? 'Change School Badge' : 'Upload School Badge'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Class Settings</Text>
        <TextInput
          style={styles.input}
          placeholder="Class Name"
          value={className}
          onChangeText={setClassName}
        />
        <TextInput
          style={styles.input}
          placeholder="Number on Roll"
          value={numOnRoll}
          onChangeText={setNumOnRoll}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Academic Year"
          value={academicYear}
          onChangeText={setAcademicYear}
        />
        <TextInput
          style={styles.input}
          placeholder="Term"
          value={term}
          onChangeText={setTerm}
        />

        <Text style={styles.label}>School End Date:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text>{formatDate(schoolEndDate)}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={schoolEndDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setSchoolEndDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.label}>Next Term Begin Date:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowNextTermDatePicker(true)}
        >
          <Text>{formatDate(nextTermDate)}</Text>
        </TouchableOpacity>
        {showNextTermDatePicker && (
          <DateTimePicker
            value={nextTermDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowNextTermDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setNextTermDate(selectedDate);
              }
            }}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveSettings}
      >
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontStyles.bold.fontFamily,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
  },
  label: {
    fontSize: 16,
    fontFamily: fontStyles.regular.fontFamily,
    color: '#333',
    marginBottom: 5,
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  badgeImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  uploadButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f9ff',
    width: '100%',
  },
  uploadButtonText: {
    color: '#3498db',
  },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsScreen;