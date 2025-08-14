import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Define the RootStackParamList type here or import it
export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  OTPVerification: {
    mobileNumber: string;
    fromScreen: 'registration' | 'login' | 'profile';
  };
};

type OTPVerificationProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OTPVerification'>;
  route: RouteProp<RootStackParamList, 'OTPVerification'>;
};

const OTPVerification: React.FC<OTPVerificationProps> = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  // Safely extract route params with proper typing
  const { mobileNumber, fromScreen } = route.params || { mobileNumber: '', fromScreen: 'registration' as const };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    
    // Focus first input
    inputRefs.current[0]?.focus();
    
    Alert.alert('OTP Sent', 'A new OTP has been sent to your mobile number.');
  };

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a complete 6-digit OTP.');
      return;
    }

    // Simulate OTP verification
    if (otpString === '123456') {
      Alert.alert('Success', 'Phone number verified successfully!', [
        {
          text: 'OK',
          onPress: () => {
            if (fromScreen === 'registration') {
              navigation.navigate('Login');
            } else {
              navigation.goBack();
            }
          }
        }
      ]);
    } else {
      Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#0D141C" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Verify Phone Number</Text>
        
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="phone-portrait" size={32} color="#4D7399" />
          </View>
        </View>
        
        <Text style={styles.subtitle}>
          We've sent a 6-digit verification code to
        </Text>
        <Text style={styles.phoneNumber}>{mobileNumber}</Text>
        
        <Text style={styles.instructionText}>
          Enter the code below to verify your phone number
        </Text>
        
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : styles.otpInputEmpty
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>
        
        <View style={styles.timerContainer}>
          {!canResend ? (
            <Text style={styles.timerText}>
              Resend code in {formatTimer(timer)}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.verifyButton,
            otp.join('').length === 6 ? styles.verifyButtonActive : styles.verifyButtonInactive
          ]} 
          onPress={handleVerifyOTP}
          disabled={otp.join('').length !== 6}
        >
          <Text style={[
            styles.verifyButtonText,
            otp.join('').length === 6 ? styles.verifyButtonTextActive : styles.verifyButtonTextInactive
          ]}>
            Verify & Continue
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.changeNumberButton}>
          <Text style={styles.changeNumberText}>Change Phone Number</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backArrow: {
    padding: 24,
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0D141C',
    textAlign: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4D7399',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D141C',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#4D7399',
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderRadius: 8,
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: '#E8EDF2',
  },
  otpInputEmpty: {
    color: '#4D7399',
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  otpInputFilled: {
    color: '#0D141C',
    backgroundColor: '#E8EDF2',
    borderWidth: 2,
    borderColor: '#0D141C',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 14,
    color: '#4D7399',
  },
  resendText: {
    fontSize: 14,
    color: '#0D141C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verifyButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonActive: {
    backgroundColor: '#0D141C',
  },
  verifyButtonInactive: {
    backgroundColor: '#E8EDF2',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButtonTextActive: {
    color: '#FFFFFF',
  },
  verifyButtonTextInactive: {
    color: '#4D7399',
  },
  changeNumberButton: {
    alignItems: 'center',
  },
  changeNumberText: {
    fontSize: 14,
    color: '#4D7399',
    textDecorationLine: 'underline',
  },
});

export default OTPVerification;