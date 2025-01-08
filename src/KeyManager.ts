import { KeychainAdapter, EncryptionAdapter, keypair } from './types';

export class KeyManager {
  private keychain: KeychainAdapter;
  private encryption: EncryptionAdapter;
  private encryptionKey: string | keypair | null = null;

  constructor(keychain: KeychainAdapter, encryption: EncryptionAdapter) {
    if (!keychain || !encryption) {
      throw new Error('Both Keychain and Encryption instances are required.');
    }
    this.keychain = keychain;
    this.encryption = encryption;
  }

  /**
   * Retrieve AES encryption key, generate if not available.
   */
  async getEncryptionKey(): Promise<string | keypair> {
    if (typeof this.encryptionKey === 'string' && this.encryptionKey) {
      return this.encryptionKey;
    }

    const storedKey = await this.getKeyFromKeychain('encrypted_storage_key');
    if (storedKey) {
      this.encryptionKey = storedKey;
      return storedKey;
    } else {

    }

    const newKey = await this.setEncryptionKey();

    this.encryptionKey = newKey;
    return newKey!;
  }

  /**
   * Retrieve RSA encryption keypair, generate if not available.
   */
  async getRSAEncryptionKey(): Promise<keypair> {
    if (this.encryptionKey && typeof this.encryptionKey === 'object') {
      return this.encryptionKey;
    }

    const storedKey = await this.getKeyFromKeychain('encrypted_rsa_storage_key', true);
    if (storedKey) {
      this.encryptionKey = storedKey as keypair;
      return storedKey as keypair;
    }

    const newKey = await this.setRSAEncryptionKey();

    this.encryptionKey = newKey;
    return newKey!;
  }

  /**
   * Generate and persist AES encryption key.
   */
  async setEncryptionKey(): Promise<string> {
    const key = this.encryption.aes?.generateAESKey?.(256);

    if (!key) {
      throw new Error('Failed to generate AES encryption key.');
    }

    await this.saveKeyToKeychain('encrypted_storage_key', key);
    this.encryptionKey = key;
    return key;
  }

  /**
   * Generate and persist RSA encryption keypair.
   */
  async setRSAEncryptionKey(): Promise<keypair> {
    const keys = this.encryption.rsa?.generateRSAKey?.();

    if (!keys) {
      throw new Error('Failed to generate RSA encryption keypair.');
    }

    await this.saveKeyToKeychain('encrypted_rsa_storage_key', JSON.stringify(keys));
    this.encryptionKey = keys;
    return keys;
  }

  /**
   * Common method to retrieve a key from Keychain.
   */
  private async getKeyFromKeychain(service: string, parseAsJson = false): Promise<string | keypair | null> {
    try {
      const credentials = await this.keychain.getGenericPassword({ service });

      if (credentials) {
        return credentials.password;
      }
    } catch (error) {
      console.error(`Failed to retrieve key from Keychain (${service}):`, error);
    }

    return null;
  }

  /**
   * Common method to save a key to Keychain.
   */
  private async saveKeyToKeychain(service: string, key: string): Promise<void> {
    try {
      await this.keychain.setGenericPassword(service, key, { service });
    } catch (error) {
      throw new Error(`Failed to save key to Keychain (${service}): ${error}`);
    }
  }
}
