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
import Svg, { Path } from 'react-native-svg';

import { RootStackParamList } from '../../../Navigation/AppNavigator';
import TabNavigator from '../../../Navigation/TabNavigator';

type NICReissueDocumentUploadScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICReissueDocumentUpload'>;
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

const UploadIcon = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="M7 10L12 15L17 10" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="M12 15V3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const NICReissueDocumentUploadScreen: React.FC<NICReissueDocumentUploadScreenProps> = ({ navigation }) => {
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});

  const progressBar = {
    currentStep: 3,
    totalSteps: 5,
  };

  const documentCategories = [
    {
      reason: 'Lost',
      documents: [
        { id: 'police-report-lost', name: 'Police Report', formats: 'PDF, JPG, PNG | Max size: 5MB' },
        { id: 'affidavit-lost', name: 'Affidavit', formats: 'PDF, JPG, PNG | Max size: 5MB' },
      ]
    },
    {
      reason: 'Damaged',
      documents: [
        { id: 'damaged-nic', name: 'Damaged NIC', formats: 'PDF, JPG, PNG | Max size: 5MB' },
      ]
    },
    {
      reason: 'Stolen',
      documents: [
        { id: 'police-report-stolen', name: 'Police Report', formats: 'PDF, JPG, PNG | Max size: 5MB' },
        { id: 'affidavit-stolen', name: 'Affidavit', formats: 'PDF, JPG, PNG | Max size: 5MB' },
      ]
    }
  ];

  const handleUpload = (docId: string) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docId]: true
    }));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    // Navigate to Payment screen with proper parameters
    navigation.navigate('Payment', {
      serviceType: 'reissue',
      applicationData: {
        uploadedDocuments: uploadedDocs,
        documentCategories: documentCategories,
        uploadTimestamp: new Date().toISOString()
      },
      amount: 1500 // Adjust the amount as needed for document processing
    });
  };

  const hasUploads = Object.keys(uploadedDocs).length > 0;

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
          <Text style={styles.headerTitle}>NIC Re-issue</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step {progressBar.currentStep} of {progressBar.totalSteps}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(progressBar.currentStep / progressBar.totalSteps) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Upload Documents</Text>
            <Text style={styles.sectionDescription}>
              Please upload the required documents for your NIC re-issue application. Ensure all documents are clear and legible.
            </Text>

            {documentCategories.map((category) => (
              <View key={category.reason} style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>Reason: {category.reason}</Text>
                
                {category.documents.map((document) => (
                  <View key={document.id} style={styles.documentContainer}>
                    <Text style={styles.documentName}>{document.name}</Text>
                    <Text style={styles.documentFormats}>Accepted formats: {document.formats}</Text>
                    
                    <TouchableOpacity 
                      style={[
                        styles.uploadButton,
                        uploadedDocs[document.id] && styles.uploadButtonUploaded
                      ]}
                      onPress={() => handleUpload(document.id)}
                      activeOpacity={0.8}
                    >
                      <UploadIcon 
                        color={uploadedDocs[document.id] ? '#10B981' : '#4D7399'} 
                        size={24} 
                      />
                      <Text style={[
                        styles.uploadButtonText,
                        uploadedDocs[document.id] && styles.uploadButtonTextUploaded
                      ]}>
                        {uploadedDocs[document.id] ? 'Uploaded' : 'Upload'}
                      </Text>
                    </TouchableOpacity>

                    {uploadedDocs[document.id] && (
                      <View style={styles.uploadProgress}>
                        <Text style={styles.uploadProgressText}>Upload Complete</Text>
                        <View style={styles.uploadProgressBar}>
                          <View style={styles.uploadProgressFill} />
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.nextButton,
                !hasUploads && styles.nextButtonDisabled
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!hasUploads}
            >
              <Text style={[
                styles.nextButtonText,
                !hasUploads && styles.nextButtonTextDisabled
              ]}>
                Continue to Payment
              </Text>
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4D7399',
    borderRadius: 2,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 24,
  },
  categoryContainer: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  documentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  documentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  documentFormats: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    gap: 8,
  },
  uploadButtonUploaded: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
    borderStyle: 'solid',
  },
  uploadButtonText: {
    color: '#4D7399',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButtonTextUploaded: {
    color: '#10B981',
  },
  uploadProgress: {
    marginTop: 12,
  },
  uploadProgressText: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 8,
    fontWeight: '500',
  },
  uploadProgressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  uploadProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
    width: '100%',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  nextButton: {
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
  nextButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButtonTextDisabled: {
    color: '#94A3B8',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default NICReissueDocumentUploadScreen;

