import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

const RandomGreeting = ({ style }) => {
  // Array of greetings
  const greetings = ['Woezor', 'Omanye Aba', 'Akwaaba', 'Barka da zuwa', 'Akoaba'];
  
  // State to store the selected greeting
  const [greeting, setGreeting] = useState('');
  
  // Function to select a random greeting
  const selectRandomGreeting = () => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  };
  
  // Set a random greeting when the component mounts
  useEffect(() => {
    setGreeting(selectRandomGreeting());
  }, []);
  
  return (
    <Text style={style}>
      {greeting}
    </Text>
  );
};

export default RandomGreeting;