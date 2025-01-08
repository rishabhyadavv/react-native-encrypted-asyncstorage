// export { EncryptedAsyncStorage } from './Storage';
// export { KeychainAdapter, EncryptionAdapter } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { encryptAES, decryptAES, generateAESKey, encryptAsyncAES, decryptAsyncAES, generateECDSAKeyPair, signDataECDSA, verifySignatureECDSA, generateRSAKeyPair, encryptRSA, decryptRSA, encryptAsyncRSA, decryptAsyncRSA } from 'rn-encryption';
import * as Keychain from 'react-native-keychain';
import { EncryptionAdapter, KeychainAdapter } from './types';
import { EncryptedAsyncStorage } from './Storage';

// Adapter Instances
const keychainAdapter: KeychainAdapter = {
    Keychain:Keychain,
    async getGenericPassword(options) {
      return await Keychain.getGenericPassword(options);
    },
    async setGenericPassword(service, password, options) {
      await Keychain.setGenericPassword(service, password, options);
    },
  };
  
  
  const encryptionAdapter: EncryptionAdapter = {
    // AES Configuration
    aes: {
      generateAESKey: (number: number) => generateAESKey(number),
      encryptAES: (data: string, key: string) => encryptAES(data, key),
      decryptAES: (data: string, key: string) => decryptAES(data, key),
      encryptAsyncAES: async (data: string, key: string) => await encryptAsyncAES(data, key),
      decryptAsyncAES: async (data: string, key: string) => await decryptAsyncAES(data, key),
    },
  
    // RSA Configuration
    rsa: {
      generateRSAKey: () => generateRSAKeyPair(),
      encryptRSA: (data: string, key: string) => encryptRSA(data, key),
      decryptRSA: (data: string, key: string) => decryptRSA(data, key),
      encryptAsyncRSA: async (data: string, key: string) => await encryptAsyncRSA(data, key),
      decryptAsyncRSA: async (data: string, key: string) => await decryptAsyncRSA(data, key),
    },
  
    // Data Identity Configuration
    dataIdentity: {
      generateECDSAKeyPair: () => generateECDSAKeyPair(),
      signDataECDSA: (data: string, key: string) => signDataECDSA(data, key),
      verifySignatureECDSA: (data: string, signatureBase64: string, key: string) =>
        verifySignatureECDSA(data, signatureBase64, key),
    },
  };
  
  const storageAdapter = {
    getItem: async (key: string) => await AsyncStorage.getItem(key),

    setItem: async (key: string, value: string) => await AsyncStorage.setItem(key, value),
  
    removeItem: async (key: string) => await AsyncStorage.removeItem(key),
  
    getAllKeys: async (): Promise<string[]> => {
        const keys = await AsyncStorage.getAllKeys();
        return [...keys]; // Explicitly convert readonly array to mutable array
      },
  
    multiGet: async (keys: string[]): Promise<[string, string | null][]> => {
        const result = await AsyncStorage.multiGet(keys);
        return result.map(([key, value]) => [key, value]); // Ensures mutable array structure
      },
  
    multiSet: async (keyValuePairs: [string, string][]) =>
      await AsyncStorage.multiSet(keyValuePairs),
  
    multiRemove: async (keys: string[]) => await AsyncStorage.multiRemove(keys),
  
    mergeItem: async (key: string, value: string) =>
      await AsyncStorage.mergeItem(key, value),
  
    multiMerge: async (keyValuePairs: [string, string][]) =>  await AsyncStorage.multiMerge(keyValuePairs)
     
  };

const EncrypedAsyncStorage = new EncryptedAsyncStorage(keychainAdapter, encryptionAdapter, storageAdapter);
export default EncrypedAsyncStorage
  
