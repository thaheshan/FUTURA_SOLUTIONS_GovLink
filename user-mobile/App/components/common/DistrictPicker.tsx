import React from "react";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import { SRI_LANKAN_DISTRICTS } from "../../Utils/constants";
import { colors } from "../../Styles"; // assuming you have a colors file

interface DistrictPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export function DistrictPicker({ selectedValue, onValueChange }: DistrictPickerProps) {
  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={styles.picker}
    >
      <Picker.Item label="Select District" value="" />
      {SRI_LANKAN_DISTRICTS.map((district: string) => (
        <Picker.Item key={district} label={district} value={district} />
      ))}
    </Picker>
  );
}

const styles = StyleSheet.create({
  picker: {
    backgroundColor: colors.white,  // use your color variable here instead of literal "white"
  },
});
