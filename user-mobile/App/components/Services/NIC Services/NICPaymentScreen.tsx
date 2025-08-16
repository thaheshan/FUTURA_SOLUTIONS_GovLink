import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

import { RootStackParamList } from '../../../Navigation/AppNavigator';
import TabNavigator from '../../../Navigation/TabNavigator';

type NICPaymentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Payment'>;
  route: RouteProp<RootStackParamList, 'Payment'>;
};

const BackArrowIcon = ({ color = '#0F172A', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M15 18L9 12L15 6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const CreditCardIcon = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M1 4C1 2.89543 1.89543 2 3 2H21C22.1046 2 23 2.89543 23 4V20C23 21.1046 22.1046 22 21 22H3C1.89543 22 1 21.1046 1 20V4Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="M1 10H23" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const BankIcon = ({ color = '#64748B', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 21H21M5 21V7L12 3L19 7V21M9 9V13M15 9V13" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const NICPaymentScreen: React.FC<NICPaymentScreenProps> = ({ navigation, route }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('online');

  // Get parameters from navigation route
  const { serviceType = 'correction', applicationData = {}, amount = 500 } = route.params || {};

  const paymentMethods = [
    {
      id: 'online',
      title: 'Online Payment',
      description: 'Pay using credit/debit card or digital wallet',
      icon: CreditCardIcon,
      color: '#4D7399'
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      description: 'Transfer payment directly from your bank account',
      icon: BankIcon,
      color: '#64748B'
    },
  ];

  // Determine fee details based on service type
  const getFeeDetails = () => {
    switch (serviceType) {
      case 'new':
        return {
          serviceType: 'New NIC Application',
          baseFee: amount || 500,
          processingFee: 0,
          total: amount || 500
        };
      case 'reissue':
        return {
          serviceType: 'NIC Re-issue',
          baseFee: amount || 1000,
          processingFee: 0,
          total: amount || 1000
        };
      case 'correction':
      default:
        return {
          serviceType: 'NIC Correction',
          baseFee: amount || 500,
          processingFee: 0,
          total: amount || 500
        };
    }
  };

  const feeDetails = getFeeDetails();

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePayNow = () => {
    // Generate tracking number based on service type
    const generateTrackingNumber = () => {
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      switch (serviceType) {
        case 'new':
          return `#NIC${dateStr}-NEW${randomNum}`;
        case 'reissue':
          return `#NIC${dateStr}-RE${randomNum}`;
        case 'correction':
        default:
          return `#NIC${dateStr}-COR${randomNum}`;
      }
    };

    const trackingNumber = generateTrackingNumber();

    // Navigate to appropriate confirmation screen based on service type
    switch (serviceType) {
      case 'new':
        navigation.navigate('ConfirmationNew', {
          trackingNumber,
          applicationData
        });
        break;
      case 'reissue':
        navigation.navigate('ConfirmationReissue', {
          trackingNumber,
          applicationData
        });
        break;
      case 'correction':
      default:
        navigation.navigate('Confirmation', {
          serviceType: 'correction',
          trackingNumber,
          applicationData
        });
        break;
    }
  };

  const getPaymentTitle = () => {
    switch (serviceType) {
      case 'new':
        return 'New NIC Application Fee';
      case 'reissue':
        return 'NIC Re-issue Fee';
      case 'correction':
      default:
        return 'NIC Correction Fee';
    }
  };

  const getPaymentDescription = () => {
    switch (serviceType) {
      case 'new':
        return 'Please review the fee for your new NIC application. This is a one-time payment for processing your new National Identity Card.';
      case 'reissue':
        return 'Please review the fee for your NIC re-issue application. The fee covers the cost of issuing a replacement NIC.';
      case 'correction':
      default:
        return 'Please review the fee for your NIC correction application. The fee may vary based on the type of correction required.';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <BackArrowIcon color="#0F172A" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Fee Summary */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{getPaymentTitle()}</Text>
            <Text style={styles.sectionDescription}>
              {getPaymentDescription()}
            </Text>

            <View style={styles.feeCard}>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>{feeDetails.serviceType}</Text>
                <Text style={styles.feeAmount}>LKR {feeDetails.baseFee}</Text>
              </View>
              
              {feeDetails.processingFee > 0 && (
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Processing Fee</Text>
                  <Text style={styles.feeAmount}>LKR {feeDetails.processingFee}</Text>
                </View>
              )}
              
              <View style={styles.feeDivider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>LKR {feeDetails.total}</Text>
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <View style={styles.paymentMethodsContainer}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodCard,
                    selectedPaymentMethod === method.id && styles.paymentMethodCardSelected
                  ]}
                  onPress={() => handlePaymentMethodSelect(method.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.paymentMethodContent}>
                    <View style={styles.paymentMethodLeft}>
                      <View style={[
                        styles.paymentMethodIconContainer,
                        selectedPaymentMethod === method.id && styles.paymentMethodIconContainerSelected
                      ]}>
                        <method.icon 
                          color={selectedPaymentMethod === method.id ? '#FFFFFF' : method.color} 
                          size={24} 
                        />
                      </View>
                      <View style={styles.paymentMethodInfo}>
                        <Text style={[
                          styles.paymentMethodTitle,
                          selectedPaymentMethod === method.id && styles.paymentMethodTitleSelected
                        ]}>
                          {method.title}
                        </Text>
                        <Text style={[
                          styles.paymentMethodDescription,
                          selectedPaymentMethod === method.id && styles.paymentMethodDescriptionSelected
                        ]}>
                          {method.description}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.radioContainer}>
                      <View style={[
                        styles.radioButton,
                        selectedPaymentMethod === method.id && styles.radioButtonSelected
                      ]}>
                        {selectedPaymentMethod === method.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pay Now Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.payButton}
              onPress={handlePayNow}
              activeOpacity={0.8}
            >
              <Text style={styles.payButtonText}>Pay Now - LKR {feeDetails.total}</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Bottom Tab Navigator */}
        <TabNavigator activeTab="Services" />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 20,
  },
  feeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feeLabel: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  feeAmount: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  feeDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '700',
  },
  totalAmount: {
    fontSize: 20,
    color: '#4D7399',
    fontWeight: '700',
  },
  paymentMethodsContainer: {
    gap: 16,
  },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentMethodCardSelected: {
    borderColor: '#4D7399',
    backgroundColor: '#EBF4FF',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  paymentMethodIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodIconContainerSelected: {
    backgroundColor: '#4D7399',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  paymentMethodTitleSelected: {
    color: '#4D7399',
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  paymentMethodDescriptionSelected: {
    color: '#1E40AF',
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#4D7399',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4D7399',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  payButton: {
    backgroundColor: '#4D7399',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4D7399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default NICPaymentScreen;

