import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

// No external imports needed - completely self-contained components

interface ButtonProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
  [key: string]: any;
}

export const UiButton = ({ children, style = {}, textStyle = {}, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.baseButton,
        styles.transparentButton,
        style
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.baseText, styles.outlineText, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export const UiFilledButton = ({ children, style = {}, textStyle = {}, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.baseButton,
        styles.filledButton,
        style
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.baseText, styles.filledText, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export const UiOutlinedButton = ({ children, style = {}, textStyle = {}, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.baseButton,
        styles.outlinedButton,
        style
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.baseText, styles.outlineText, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  transparentButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6D28D9',
  },
  filledButton: {
    backgroundColor: '#6D28D9',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6D28D9',
  },
  baseText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  filledText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#6D28D9',
  },
});