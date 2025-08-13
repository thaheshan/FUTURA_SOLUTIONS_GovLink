import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../Hooks/UserAuth';
import { colors, spacing } from '../../styles';

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    login(mobile, password);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo/gov-logo.png')} 
        style={styles.logo} 
      />
      <Input 
        placeholder="Mobile Number" 
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      <Input 
        placeholder="Password" 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button 
        title="Login" 
        onPress={handleLogin} 
        style={styles.button}
      />
      <Button 
        title="Register New Account" 
        variant="outline"
        onPress={() => console.log('Navigate to signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    marginVertical: spacing.md,
  },
});