import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type ComingSoonScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ComingSoon'>;
};

const ComingSoonScreen: React.FC<ComingSoonScreenProps> = ({ navigation }) => {
  
  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Feature Preview</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          
          {/* Illustration/Icon */}
          <View style={styles.illustrationContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.mainIcon}>🚀</Text>
            </View>
          </View>

          {/* Coming Soon Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.comingSoonTitle}>Coming Soon</Text>
            <Text style={styles.subtitle}>
              This exciting feature is under development and will be available soon!
            </Text>
          </View>

          {/* Feature Preview Cards */}
          <View style={styles.featurePreviewContainer}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>⚡</Text>
              </View>
              <Text style={styles.featureTitle}>Enhanced Performance</Text>
              <Text style={styles.featureDescription}>
                Lightning-fast processing for all your government services
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🔒</Text>
              </View>
              <Text style={styles.featureTitle}>Advanced Security</Text>
              <Text style={styles.featureDescription}>
                Bank-level encryption to keep your data completely secure
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>📱</Text>
              </View>
              <Text style={styles.featureTitle}>Smart Integration</Text>
              <Text style={styles.featureDescription}>
                Seamless connection with all government departments
              </Text>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Development Progress</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>75% Complete</Text>
          </View>

          {/* Notification Setup */}
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationTitle}>Stay Updated</Text>
            <Text style={styles.notificationSubtitle}>
              Get notified when this feature becomes available
            </Text>
            <TouchableOpacity style={styles.notifyButton}>
              <Text style={styles.notifyButtonText}>🔔  Notify Me</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {/* Back to Home Button */}
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={handleBackToHome}
          >
            <Text style={styles.homeButtonText}>🏠  Back to Home</Text>
          </TouchableOpacity>

          {/* Secondary Action Button */}
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleGoBack}
          >
            <Text style={styles.secondaryButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for your patience as we work to improve GovLink
          </Text>
          <Text style={styles.footerSubtext}>
            Expected release: Q3 2025
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#4D7399',
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#0D141C',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  illustrationContainer: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mainIcon: {
    fontSize: 48,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  comingSoonTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0D141C',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4D7399',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featurePreviewContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4D7399',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4D7399',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D141C',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#4D7399',
    textAlign: 'center',
    lineHeight: 20,
  },
  progressContainer: {
    width: '100%',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D141C',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E8EDF2',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    width: '75%',
    height: '100%',
    backgroundColor: '#4D7399',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#4D7399',
    fontWeight: '500',
  },
  notificationContainer: {
    width: '100%',
    backgroundColor: '#26303B',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#E8EDF2',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  notifyButton: {
    backgroundColor: '#4D7399',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 140,
    alignItems: 'center',
  },
  notifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  homeButton: {
    backgroundColor: '#26303B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#E8EDF2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4D7399',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4D7399',
  },
  footer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#4D7399',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

export default ComingSoonScreen;