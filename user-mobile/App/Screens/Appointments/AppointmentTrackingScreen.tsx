import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

import { RootStackParamList } from '../../Navigation/AppNavigator';
import { servicesApi, ApplicationStatus, ApplicationStage } from '../../Services/API/ServiceAPI';

type ApplicationTrackingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ApplicationTracking'>;
  route: RouteProp<RootStackParamList, 'ApplicationTracking'>;
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

const CheckCircleIcon = ({ color = '#10B981', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path 
      d="M9 12L11 14L15 10" 
      stroke="#FFFFFF" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const InProgressIcon = ({ color = '#3B82F6', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Circle cx="12" cy="12" r="3" fill="#FFFFFF" />
  </Svg>
);

const PendingIcon = ({ color = '#F59E0B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="#FFFFFF" />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FailedIcon = ({ color = '#EF4444', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M15 9L9 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 9L15 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ApplicationTrackingScreen: React.FC<ApplicationTrackingScreenProps> = ({ navigation, route }) => {
  const { referenceNumber: initialReferenceNumber } = route.params || {};
  
  const [applicationData, setApplicationData] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load application data
  const loadApplicationData = async (showLoader = true) => {
    if (!initialReferenceNumber) {
      setError('No reference number provided');
      return;
    }

    try {
      if (showLoader) setLoading(true);
      setError(null);

      const response = await servicesApi.getApplicationStatus(initialReferenceNumber);
      
      if (response.success && response.data) {
        setApplicationData(response.data);
      } else {
        setError(response.message || 'Failed to load application data');
        Alert.alert('Error', response.message || 'Failed to load application data');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Network error occurred';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadApplicationData();
  }, [initialReferenceNumber]);

  // Refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      if (initialReferenceNumber) {
        loadApplicationData(false);
      }
    }, [initialReferenceNumber])
  );

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadApplicationData(false);
  };

  // Retry function
  const handleRetry = () => {
    loadApplicationData();
  };

  // Navigate back
  const handleBack = () => {
    navigation.goBack();
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#F59E0B';
      case 'processing':
      case 'in_progress':
        return '#3B82F6';
      case 'approved':
      case 'completed':
        return '#10B981';
      case 'rejected':
      case 'failed':
        return '#EF4444';
      case 'cancelled':
        return '#6B7280';
      default:
        return '#9CA3AF';
    }
  };

  // Get status text
  const getStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending Review';
      case 'processing':
        return 'Under Processing';
      case 'in_progress':
        return 'In Progress';
      case 'approved':
        return 'Approved';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown Status';
    }
  };

  // Get stage icon
  const getStageIcon = (stage: ApplicationStage) => {
    switch (stage.status) {
      case 'completed':
        return <CheckCircleIcon color="#10B981" size={20} />;
      case 'in_progress':
        return <InProgressIcon color="#3B82F6" size={20} />;
      case 'failed':
        return <FailedIcon color="#EF4444" size={20} />;
      default:
        return <PendingIcon color="#F59E0B" size={20} />;
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Handle document download
  const handleDocumentDownload = async (documentId: string) => {
    try {
      if (!initialReferenceNumber) return;
      
      const response = await servicesApi.downloadDocument(initialReferenceNumber, documentId);
      if (response.success) {
        // Handle document download - this would typically open the document
        Alert.alert('Success', 'Document downloaded successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to download document');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to download document');
    }
  };

  // Handle support contact
  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact support?',
      [
        { text: 'Call', onPress: () => Linking.openURL('tel:+94112345678') },
        { text: 'Email', onPress: () => Linking.openURL('mailto:support@nic.gov.lk') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Loading state
  if (loading && !applicationData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <BackArrowIcon color="#0F172A" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Application Tracking</Text>
            <View style={styles.headerRight} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading application data...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Error state
  if (error && !applicationData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <BackArrowIcon color="#0F172A" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Application Tracking</Text>
            <View style={styles.headerRight} />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Unable to Load Application</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Application Tracking</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
        >
          {applicationData && (
            <>
              {/* Application Details */}
              <View style={styles.detailsContainer}>
                <Text style={styles.applicationTitle}>NIC Service Application</Text>
                
                <View style={styles.detailsCard}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                      <Text style={styles.detailLabel}>Reference Number</Text>
                    </View>
                    <View style={styles.detailRight}>
                      <Text style={styles.detailLabel}>Current Status</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                      <Text style={styles.detailValue}>
                        {applicationData.referenceNumber}
                      </Text>
                    </View>
                    <View style={styles.detailRight}>
                      <Text style={[
                        styles.detailValue,
                        { color: getStatusColor(applicationData.status) }
                      ]}>
                        {getStatusText(applicationData.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailSpacer} />
                  
                  <View style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                      <Text style={styles.detailLabel}>Submitted On</Text>
                    </View>
                    <View style={styles.detailRight}>
                      <Text style={styles.detailLabel}>
                        {applicationData.estimatedCompletionDate ? 'Est. Completion' : 'Last Updated'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                      <Text style={styles.detailValue}>
                        {formatDate(applicationData.submittedAt)}
                      </Text>
                    </View>
                    <View style={styles.detailRight}>
                      <Text style={styles.detailValue}>
                        {applicationData.estimatedCompletionDate 
                          ? formatDate(applicationData.estimatedCompletionDate)
                          : formatDate(applicationData.lastUpdated)
                        }
                      </Text>
                    </View>
                  </View>

                  {applicationData.currentStage && (
                    <>
                      <View style={styles.detailSpacer} />
                      <View style={styles.currentStageContainer}>
                        <Text style={styles.currentStageLabel}>Current Stage</Text>
                        <Text style={styles.currentStageValue}>{applicationData.currentStage}</Text>
                      </View>
                    </>
                  )}

                  {applicationData.remarks && (
                    <>
                      <View style={styles.detailSpacer} />
                      <View style={styles.remarksContainer}>
                        <Text style={styles.remarksLabel}>Remarks</Text>
                        <Text style={styles.remarksValue}>{applicationData.remarks}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>

              {/* Tracking Timeline */}
              <View style={styles.timelineContainer}>
                <Text style={styles.timelineTitle}>Application Progress</Text>
                
                {applicationData.stages && applicationData.stages.length > 0 ? (
                  applicationData.stages
                    .sort((a, b) => a.order - b.order)
                    .map((stage, index) => (
                      <View key={stage.id} style={styles.timelineItem}>
                        <View style={styles.timelineLeft}>
                          <View style={styles.timelineIconContainer}>
                            {getStageIcon(stage)}
                          </View>
                          {index < applicationData.stages.length - 1 && (
                            <View style={[
                              styles.timelineLine,
                              { backgroundColor: stage.status === 'completed' ? '#10B981' : '#E2E8F0' }
                            ]} />
                          )}
                        </View>
                        
                        <View style={styles.timelineContent}>
                          <Text style={[
                            styles.timelineTitle,
                            { color: stage.status === 'completed' ? '#0F172A' : '#64748B' }
                          ]}>
                            {stage.name}
                          </Text>
                          <Text style={styles.timelineDescription}>{stage.description}</Text>
                          {stage.completedAt && (
                            <Text style={styles.timelineDate}>
                              Completed: {formatDate(stage.completedAt)}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No timeline data available</Text>
                  </View>
                )}
              </View>

              {/* Required Documents Section */}
              {applicationData.documentsRequired && applicationData.documentsRequired.length > 0 && (
                <View style={styles.documentsContainer}>
                  <Text style={styles.documentsTitle}>Required Documents</Text>
                  <View style={styles.documentsCard}>
                    {applicationData.documentsRequired.map((doc, index) => (
                      <View key={index} style={styles.documentItem}>
                        <Text style={styles.documentName}>{doc}</Text>
                        <Text style={[
                          styles.documentStatus,
                          { 
                            color: applicationData.documentsSubmitted?.includes(doc) 
                              ? '#10B981' 
                              : '#F59E0B' 
                          }
                        ]}>
                          {applicationData.documentsSubmitted?.includes(doc) 
                            ? 'Submitted' 
                            : 'Pending'
                          }
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleContactSupport}
                >
                  <Text style={styles.actionButtonText}>Contact Support</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={() => loadApplicationData()}
                >
                  <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                    Refresh Status
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
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
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsContainer: {
    marginBottom: 32,
  },
  applicationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLeft: {
    flex: 1,
  },
  detailRight: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  detailSpacer: {
    height: 16,
  },
  currentStageContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  currentStageLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  currentStageValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  remarksContainer: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
  },
  remarksLabel: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
  },
  remarksValue: {
    fontSize: 14,
    color: '#92400E',
  },
  timelineContainer: {
    marginBottom: 32,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 20,
  },
  timelineIconContainer: {
    marginBottom: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: '#64748B',
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#64748B',
  },
  documentsContainer: {
    marginBottom: 32,
  },
  documentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  documentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  documentName: {
    fontSize: 14,
    color: '#0F172A',
    flex: 1,
  },
  documentStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: '#64748B',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ApplicationTrackingScreen;