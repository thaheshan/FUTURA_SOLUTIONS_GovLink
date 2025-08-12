import React from 'react';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  return (
    <QRCode
      value={value}
      size={size}
      backgroundColor="white"
      color="black"
    />
  );
}
