import * as Keychain from 'react-native-keychain';


// Define all possible secure storage keys
type SecureStorageKey = 
  | 'accessToken'
  | 'refreshToken'
  | 'biometricCredentials'
  | 'encryptionKey';


/**
 * Securely stores a string value
 * @param key Secure storage key
 * @param value Value to store
 */
export const secureStore = async (key: SecureStorageKey, value: string): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword(key, value, {
      service: key,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    });
    return true;
  } catch (error) {
    console.error(`SecureStorage store error for key ${key}:`, error);
    return false;
  }
};

/**
 * Retrieves a securely stored string
 * @param key Secure storage key
 * @returns Stored value or null if not found
 */
export const secureGet = async (key: SecureStorageKey): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: key });
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error(`SecureStorage get error for key ${key}:`, error);
    return null;
  }
};

/**
 * Removes a securely stored item
 * @param key Secure storage key to remove
 */
export const secureRemove = async (key: SecureStorageKey): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({ service: key });
  } catch (error) {
    console.error(`SecureStorage remove error for key ${key}:`, error);
  }
};

/**
 * Clears all secure storage items
 */
export const clearSecureStorage = async (): Promise<void> => {
  try {
    const keys: SecureStorageKey[] = ['accessToken', 'refreshToken', 'biometricCredentials'];
    for (const key of keys) {
      await secureRemove(key);
    }
  } catch (error) {
    console.error('SecureStorage clear error:', error);
  }
};

// Specific helper functions for authentication tokens

export const storeAuthTokens = async (tokens: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> => {
  await secureStore('accessToken', tokens.accessToken);
  await secureStore('refreshToken', tokens.refreshToken);
};

export const getAuthTokens = async (): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> => {
  return {
    accessToken: await secureGet('accessToken'),
    refreshToken: await secureGet('refreshToken'),
  };
};

export const clearAuthTokens = async (): Promise<void> => {
  await secureRemove('accessToken');
  await secureRemove('refreshToken');
};

export const storeBiometricCredentials = async (credentials: {
  username: string;
  password: string;
}): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword(
      credentials.username,
      credentials.password,
      {
        service: 'biometricCredentials',
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
      }
    );
    return true;
  } catch (error) {
    console.error('Biometric credentials store error:', error);
    return false;
  }
};

export const getBiometricCredentials = async (): Promise<{
  username: string | null;
  password: string | null;
}> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'biometricCredentials',
      authenticationPrompt: {
        title: 'Authenticate to access your account',
      },
    });
    return credentials 
      ? { username: credentials.username, password: credentials.password } 
      : { username: null, password: null };
  } catch (error) {
    console.error('Biometric credentials get error:', error);
    return { username: null, password: null };
  }
};