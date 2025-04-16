import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light_Italic,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black_Italic,
} from '@expo-google-fonts/montserrat';

export const FontContext = React.createContext();

export const FontProvider = ({ children }) => {
  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Thin': Montserrat_100Thin,
    'Montserrat-ExtraLight': Montserrat_200ExtraLight,
    'Montserrat-Light': Montserrat_300Light,
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
    'Montserrat-ExtraBold': Montserrat_800ExtraBold,
    'Montserrat-Black': Montserrat_900Black,
    'Montserrat-Thin-Italic': Montserrat_100Thin_Italic,
    'Montserrat-ExtraLight-Italic': Montserrat_200ExtraLight_Italic,
    'Montserrat-Light-Italic': Montserrat_300Light_Italic,
    'Montserrat-Regular-Italic': Montserrat_400Regular_Italic,
    'Montserrat-Medium-Italic': Montserrat_500Medium_Italic,
    'Montserrat-SemiBold-Italic': Montserrat_600SemiBold_Italic,
    'Montserrat-Bold-Italic': Montserrat_700Bold_Italic,
    'Montserrat-ExtraBold-Italic': Montserrat_800ExtraBold_Italic,
    'Montserrat-Black-Italic': Montserrat_900Black_Italic,
  });

  if (fontError) {
    console.error('Font loading error:', fontError);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading fonts: {fontError.message}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10 }}>Loading fonts...</Text>
      </View>
    );
  }

  console.log('Fonts loaded successfully');
  return (
    <FontContext.Provider value={{ fontsLoaded }}>
      {children}
    </FontContext.Provider>
  );
};

export default FontProvider; 