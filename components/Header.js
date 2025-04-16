import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import fontStyles from '../utils/fontStyles';


function Header({ title, showBackButton = true}) {
  const navigation = useNavigation();

  // Get current date in a formatted string
  const getCurrentDate = () => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.appInfo}>
          {/* Apply font style to Text components if needed, though often done in StyleSheet */}
          <Text style={styles.appName}>MEC Report</Text>
          <Text style={styles.date}>{getCurrentDate()}</Text>
        </View>

        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Apply font style to the screen title */}
      <Text style={styles.screenTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3949AB',
    paddingTop: 40, // Consider using SafeAreaView for top padding instead
    paddingBottom: 20, // Adjusted padding
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    // --- Font Usage ---
    fontFamily: fontStyles.bold.fontFamily, // <-- 2. Use bold font family
    fontSize: 18,
    // fontWeight: 'bold', // <-- 3. Remove fontWeight
    color: '#fff',
    marginRight: 10,
  },
  date: {
    // --- Font Usage ---
    fontFamily: fontStyles.regular.fontFamily, // <-- 2. Use regular font family (or light, etc.)
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    // --- Font Usage ---
    fontFamily: fontStyles.bold.fontFamily, // <-- Apply font to title too
    fontSize: 24,
    // fontWeight: 'bold', // <-- Remove fontWeight here too
    color: '#fff',
    marginTop: 5,
  },
});

export default Header;
