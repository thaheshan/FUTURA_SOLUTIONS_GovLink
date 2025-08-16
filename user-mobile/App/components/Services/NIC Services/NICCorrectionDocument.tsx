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

type NICCorrectionsDocumentUploadScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICCorrectionsDocumentUpload'>;
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

const DocumentIcon = ({ color = '#4D7399', size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="M14 2V8H20" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const NICCorrectionsDocumentUploadScreen: React.FC<NICCorrectionsDocumentUploadScreenProps> = ({ navigation }) => {
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, number>>({});

  const documents = [
    {
      id: 'birth-certificate',
      name: 'Birth Certificate',
      formats: 'PDF, JPG | Max size: 5MB',
      required: true
    },
    {
      id: 'nic-copy',
      name: 'NIC Copy',
      formats: 'PDF, JPG | Max size: 5MB',
      required: true
    },
    {
      id: 'gramaseva-certificate',
      name: 'Gramaseva Certificate',
      formats: 'PDF, JPG | Max size: 5MB',
      required: true
    },
    {
      id: 'other-documents',
      name: 'Other Supporting Documents',
      formats: 'PDF, JPG | Max size: 5MB',
      required: false
    },
  ];

  const handleUpload = (docId: string) => {
    // Simulate upload progress
    setUploadedDocs(prev => ({
      ...prev,
      [docId]: 100
    }));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    navigation.navigate('Payment', { serviceType: 'correction' });
  };

  const requiredDocsUploaded = documents
    .filter(doc => doc.required)
    .every(doc => uploadedDocs[doc.id] === 100);

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
          <Text style={styles.headerTitle}>NIC Correction</Text>
          <View style={styles.headerRight} />
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
              Please upload the required documents for your NIC correction application. Ensure all documents are clear, legible, and within the specified file size limits.
            </Text>

            <View style={styles.documentsContainer}>
              {documents.map((document) => (
                <View key={document.id} style={styles.documentCard}>
                  <View style={styles.documentHeader}>
                    <View style={styles.documentIconContainer}>
                      <DocumentIcon color="#4D7399" size={32} />
                    </View>
                    <View style={styles.documentInfo}>
                      <View style={styles.documentTitleRow}>
                        <Text style={styles.documentName}>{document.name}</Text>
                        {document.required && (
                          <View style={styles.requiredBadge}>
                            <Text style={styles.requiredText}>Required</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.documentFormats}>Accepted formats: {document.formats}</Text>
                    </View>
                  </View>

                  {uploadedDocs[document.id] === 100 ? (
                    <View style={styles.uploadedState}>
                      <View style={styles.uploadedInfo}>
                        <Text style={styles.uploadedText}>✓ Document uploaded successfully</Text>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.uploadArea}
                      onPress={() => handleUpload(document.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.uploadText}>Tap to upload {document.name.toLowerCase()}</Text>
                    </TouchableOpacity>
                  )}

                  {uploadedDocs[document.id] && uploadedDocs[document.id] < 100 && (
                    <View style={styles.uploadProgress}>
                      <Text style={styles.uploadProgressText}>Upload Progress</Text>
                      <View style={styles.uploadProgressBar}>
                        <View 
                          style={[
                            styles.uploadProgressFill, 
                            { width: `${uploadedDocs[document.id]}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.submitButton,
                !requiredDocsUploaded && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={!requiredDocsUploaded}
            >
              <Text style={[
                styles.submitButtonText,
                !requiredDocsUploaded && styles.submitButtonTextDisabled
              ]}>
                Submit
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
  documentsContainer: {
    gap: 20,
  },
  documentCard: {
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
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  requiredText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  documentFormats: {
    fontSize: 14,
    color: '#64748B',
  },
  uploadArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#4D7399',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadedState: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  uploadedInfo: {
    alignItems: 'center',
  },
  uploadedText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadProgress: {
    marginTop: 12,
  },
  uploadProgressText: {
    fontSize: 14,
    color: '#64748B',
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
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: '#94A3B8',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default NICCorrectionsDocumentUploadScreen;