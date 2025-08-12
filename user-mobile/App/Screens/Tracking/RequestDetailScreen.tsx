import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Card, QRCodeDisplay } from '../../components/common';
import { colors, spacing, typography } from '../../Styles';

export default function RequestDetailsScreen({ route }) {
  const { id, service = 'NIC Reissue', status = 'Processing' } = route.params;

  // Request details
  const requestDetails = {
    reference: id,
    service,
    status,
    submittedDate: '2023-08-10',
    estimatedCompletion: '2023-08-25',
    assignedOffice: 'Colombo DS Office',
    officer: 'K. Perera',
  };

  return (
    <ScrollView style={styles.container}>
      <Card title="Request Details">
        <View style={styles.detailRow}>
          <Text style={styles.label}>Reference No:</Text>
          <Text style={styles.value}>{requestDetails.reference}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Service:</Text>
          <Text style={styles.value}>{requestDetails.service}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, styles.status]}>{requestDetails.status}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Submitted Date:</Text>
          <Text style={styles.value}>{requestDetails.submittedDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Assigned Office:</Text>
          <Text style={styles.value}>{requestDetails.assignedOffice}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Assigned Officer:</Text>
          <Text style={styles.value}>{requestDetails.officer}</Text>
        </View>
      </Card>

      <Card title="QR Code for Verification" style={styles.qrCard}>
        <QRCodeDisplay 
          value={`SERVICE:${service}|REF:${id}|OFFICE:${requestDetails.assignedOffice}`} 
          size={200} 
        />
        <Text style={styles.qrNote}>
          Show this QR code at the DS office for verification
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  qrCard: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  qrNote: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  status: {
    color: colors.warning,
  },
  value: {
    ...typography.body,
    fontWeight: '500',
  },
});
