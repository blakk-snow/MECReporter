// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ManageStudentsScreen from '../screens/ManageStudentsScreen';
import ManageSubjectsScreen from '../screens/ManageSubjectsScreen';
import RecordResultsScreen from '../screens/RecordResultsScreen';
import GenerateReportScreen from '../screens/GenerateReportScreen';
import GuideScreen from '../screens/GuideScreen';

// Import custom header
import Header from '../components/Header';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          header: ({ route, navigation }) => {
            // Don't show header for Welcome screen
            if (route.name === 'Welcome') {
              return null;
            }
            
            return (
              <Header 
                title={route.name} 
                showBackButton={route.name !== 'Dashboard'}
              />
            );
          },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Guide" component={GuideScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ManageStudents" component={ManageStudentsScreen} />
        <Stack.Screen name="ManageSubjects" component={ManageSubjectsScreen} />
        <Stack.Screen name="RecordResults" component={RecordResultsScreen} />
        <Stack.Screen name="GenerateReport" component={GenerateReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;