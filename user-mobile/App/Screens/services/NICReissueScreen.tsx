import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card } from '../../components/common';
import NICReissueForm from '../../components/services/NICReissueForm';
import { colors, spacing } from '../../styles';
import { submitNICReissue } from '../../services/api/servicesApi';

export default function NICReissueScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    oldNIC: '',
    reason: 'Lost',
    address: '',
    district: 'Colombo',
    contactNumber: ''
  });

  const handleSubmit = async () => {
    try {
      const response = await submitNICReissue(formData);
      navigation.navigate('RequestDetails', { 
        id: response.trackingId,
        service: 'NIC Reissue',
        status: 'Submitted'
      });
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card title="NIC Reissue Application">
        <NICReissueForm 
          formData={formData} 
          onChange={setFormData} 
        />
        <Button 
          title="Submit Application" 
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});