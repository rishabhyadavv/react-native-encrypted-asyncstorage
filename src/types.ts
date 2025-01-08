
export interface KeyGenerator {
  generateKey(): string;
}

export interface KeyStorage {
  getKey(): Promise<string | null>;
  saveKey(key: string): Promise<void>;
}

export interface keypair {
  publicKey: string;
  privateKey: string;
}
// AES Configuration
interface AESAdapter {
  generateAESKey?: (number: number) => string;
  encryptAES?: (data: string, key: string) => string;
  decryptAES?: (data: string, key: string) => string;
  encryptAsyncAES?: (data: string, key: string) => Promise<string>;
  decryptAsyncAES?: (data: string, key: string) => Promise<string>;
}

// RSA Configuration
interface RSAAdapter {
  generateRSAKey?: () => keypair;
  encryptRSA?: (data: string, key: string) => string;
  decryptRSA?: (data: string, key: string) => string;
  encryptAsyncRSA?: (data: string, key: string) => Promise<string>;
  decryptAsyncRSA?: (data: string, key: string) => Promise<string>;
}

// Data Identity Configuration
interface DataIdentityAdapter {
  generateECDSAKeyPair?: () => keypair;
  signDataECDSA?: (data: string, key: string) => string;
  verifySignatureECDSA?: (data: string, signatureBase64: string, key: string) => boolean;
}

// Combined Encryption Adapter
export interface EncryptionAdapter {
  aes?: AESAdapter;
  rsa?: RSAAdapter;
  dataIdentity: DataIdentityAdapter;
}

// export interface EncryptionAdapter {
//   EncryptionLib:EncryptionMethods;
// }

export interface EncryptionMethods {
  encrypt(data: string): string;
  decrypt(data: string): string;
}

export type UserCredentials = {
  /** The username associated with the keychain item. */
  username: string;
  /** The password associated with the keychain item. */
  password: string;
}
export interface KeychainAdapter {
  Keychain:any;
  getGenericPassword(options?: any): Promise<false| UserCredentials>;
  setGenericPassword(service: string, password: string, options?: any): Promise<void>;
}

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
  multiGet(keys: string[]): Promise<[string, string | null][]>;
  multiSet(keyValuePairs: [string, string][]): Promise<void>;
  multiRemove(keys: string[]): Promise<void>;
  mergeItem(key: string, value: string): Promise<void>;
  multiMerge(keyValuePairs: [string, string][]): Promise<void>;
}
