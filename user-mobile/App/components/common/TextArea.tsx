import React from "react";
import { Textarea } from "@components/ui/textarea";
import { StyleProp, ViewStyle } from "react-native";

interface TextAreaProps {
  isDisabled?: boolean;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
}

export const TextArea = ({
  isDisabled = false,
//   value,
//   onChange,
//   placeholder,
  style,
}: TextAreaProps) => {
  return (
    <Textarea
      isDisabled={isDisabled}
    //   value={value}
    //   onChangeText={onChange} // If your component uses React Native-style
    //   placeholder={placeholder}
      style={style}
    />
  );
};
