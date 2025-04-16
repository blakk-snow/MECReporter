import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import fontStyles from '../utils/fontStyles';

const FontDemo = () => {
  useEffect(() => {
    console.log('FontDemo mounted');
    console.log('Font styles:', fontStyles);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, fontStyles.h1]}>MECReport Font Demo</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, fontStyles.h3]}>Headings</Text>
        <Text style={[styles.text, fontStyles.h1]}>Heading 1 - Montserrat Bold</Text>
        <Text style={[styles.text, fontStyles.h2]}>Heading 2 - Montserrat Bold</Text>
        <Text style={[styles.text, fontStyles.h3]}>Heading 3 - Montserrat SemiBold</Text>
        <Text style={[styles.text, fontStyles.h4]}>Heading 4 - Montserrat SemiBold</Text>
        <Text style={[styles.text, fontStyles.h5]}>Heading 5 - Montserrat Medium</Text>
        <Text style={[styles.text, fontStyles.h6]}>Heading 6 - Montserrat Medium</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, fontStyles.h3]}>Body Text</Text>
        <Text style={[styles.text, fontStyles.bodyLarge]}>
          Body Large - Montserrat Regular. This is a sample of body text that would be used for paragraphs and longer content.
        </Text>
        <Text style={[styles.text, fontStyles.bodyMedium]}>
          Body Medium - Montserrat Regular. This is a sample of body text that would be used for paragraphs and longer content.
        </Text>
        <Text style={[styles.text, fontStyles.bodySmall]}>
          Body Small - Montserrat Regular. This is a sample of body text that would be used for paragraphs and longer content.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, fontStyles.h3]}>Special Text</Text>
        <Text style={[styles.text, fontStyles.caption]}>Caption - Montserrat Light</Text>
        <Text style={[styles.text, fontStyles.button]}>Button - Montserrat Medium</Text>
        <Text style={[styles.text, fontStyles.label]}>Label - Montserrat Medium</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, fontStyles.h3]}>Italic Variants</Text>
        <Text style={[styles.text, fontStyles.italic]}>Italic - Montserrat Regular Italic</Text>
        <Text style={[styles.text, fontStyles.boldItalic]}>Bold Italic - Montserrat Bold Italic</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, fontStyles.h3]}>Weight Variants</Text>
        <Text style={[styles.text, fontStyles.thin]}>Thin - Montserrat Thin</Text>
        <Text style={[styles.text, fontStyles.light]}>Light - Montserrat Light</Text>
        <Text style={[styles.text, fontStyles.regular]}>Regular - Montserrat Regular</Text>
        <Text style={[styles.text, fontStyles.medium]}>Medium - Montserrat Medium</Text>
        <Text style={[styles.text, fontStyles.semiBold]}>Semi Bold - Montserrat SemiBold</Text>
        <Text style={[styles.text, fontStyles.bold]}>Bold - Montserrat Bold</Text>
        <Text style={[styles.text, fontStyles.extraBold]}>Extra Bold - Montserrat ExtraBold</Text>
        <Text style={[styles.text, fontStyles.black]}>Black - Montserrat Black</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#3498db',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  sectionTitle: {
    marginBottom: 10,
    color: '#333',
  },
  text: {
    marginBottom: 8,
    color: '#555',
  },
});

export default FontDemo; 