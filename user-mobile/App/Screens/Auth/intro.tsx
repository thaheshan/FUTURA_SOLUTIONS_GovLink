import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface GovLinkLoginProps {
  onNavigateToSignup?: () => void;
  onLogin?: (userType: 'citizen' | 'government', credentials: { username: string; password: string }) => void;
}

const GovLinkLogin: React.FC<GovLinkLoginProps> = ({ 
  onNavigateToSignup, 
  onLogin 
}) => {
  const [selectedTab, setSelectedTab] = useState<'citizen' | 'government'>('citizen');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get placeholder text based on selected tab
  const getUsernamePlaceholder = () => {
    return selectedTab === 'citizen' ? 'Username/NIC' : 'Official ID Number';
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      return;
    }
    
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      onLogin?.(selectedTab, { username: username.trim(), password });
      setIsLoading(false);
    }, 1000);
  };

  const handleTabSwitch = (tab: 'citizen' | 'government') => {
    setSelectedTab(tab);
    setUsername('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>GL</Text>
            </View>
            <Text style={styles.logoText}>GovLink</Text>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Access government services and connect with your community
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Tab Selection */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'citizen' && styles.activeTab,
              ]}
              onPress={() => handleTabSwitch('citizen')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'citizen' && styles.activeTabText,
                ]}
              >
                Citizen
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'government' && styles.activeTab,
              ]}
              onPress={() => handleTabSwitch('government')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'government' && styles.activeTabText,
                ]}
              >
                Government Official
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {selectedTab === 'citizen' ? 'Username/NIC' : 'Official ID'}
              </Text>
              <TextInput
                style={[styles.input, username && styles.inputFilled]}
                placeholder={getUsernamePlaceholder()}
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
                textContentType="username"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.input, password && styles.inputFilled]}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                textContentType="password"
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            {/* Login Button */}
            <TouchableOpacity 
              style={[
                styles.loginButton,
                (!username.trim() || !password.trim()) && styles.loginButtonDisabled,
                isLoading && styles.loginButtonLoading
              ]}
              onPress={handleLogin}
              disabled={!username.trim() || !password.trim() || isLoading}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.loginButtonText,
                (!username.trim() || !password.trim()) && styles.loginButtonTextDisabled
              ]}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={styles.signUpButton}
              onPress={onNavigateToSignup}
              activeOpacity={0.7}
            >
              <Text style={styles.signUpButtonText}>Create New Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: '#0D141C',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoPlaceholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0D141C',
    letterSpacing: -0.5,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0D141C',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    minHeight: height * 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#0D141C',
  },
  formContainer: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0D141C',
    minHeight: 56,
  },
  inputFilled: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  actionContainer: {
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#0D141C',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#0D141C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonLoading: {
    backgroundColor: '#374151',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  loginButtonTextDisabled: {
    color: '#9CA3AF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    marginHorizontal: 16,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  footerContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  termsText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: width * 0.9,
  },
  linkText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});

export default GovLinkLogin;