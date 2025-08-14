import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  isPassword?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  required?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  error,
  isPassword = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  required = false,
  helperText,
  value,
  onChangeText,
  ...textInputProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const getInputContainerStyle = () => {
    const baseStyle: ViewStyle[] = [styles.inputContainer];

    if (isFocused) {
      baseStyle.push(styles.inputContainerFocused);
    }

    if (error) {
      baseStyle.push(styles.inputContainerError);
    }

    return baseStyle;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons name={leftIcon} size={20} color="#4D7399" />
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPassword) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#4D7399"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#4D7399"
            />
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={rightIcon} size={20} color="#4D7399" />
          </TouchableOpacity>
        )}
      </View>

      {(error || helperText) && (
        <View style={styles.messageContainer}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}
    </View>
  );
};

type Style = {
  container: ViewStyle;
  labelContainer: ViewStyle;
  label: TextStyle;
  required: TextStyle;
  inputContainer: ViewStyle;
  inputContainerFocused: ViewStyle;
  inputContainerError: ViewStyle;
  input: TextStyle;
  inputWithLeftIcon: TextStyle;
  inputWithRightIcon: TextStyle;
  leftIconContainer: ViewStyle;
  rightIconContainer: ViewStyle;
  messageContainer: ViewStyle;
  errorText: TextStyle;
  helperText: TextStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0D141C',
  },
  required: {
    color: '#E53E3E',
  },
  inputContainer: {
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },
  inputContainerFocused: {
    borderColor: '#0D141C',
    backgroundColor: '#FFFFFF',
  },
  inputContainerError: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0D141C',
    minHeight: 50,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  rightIconContainer: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  messageContainer: {
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#E53E3E',
  },
  helperText: {
    fontSize: 14,
    color: '#4D7399',
  },
});
