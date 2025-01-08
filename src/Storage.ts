import { EncryptionAdapter, KeychainAdapter, keypair, StorageAdapter } from './types';
import { KeyManager } from './KeyManager';

export class EncryptedAsyncStorage {
  private encryption: EncryptionAdapter;
  private keyManager: KeyManager;
  private storageAdapter: StorageAdapter;

  constructor(keychain: KeychainAdapter, encryption: EncryptionAdapter, storageAdapter:StorageAdapter) {
    if (!keychain || !encryption) {
      throw new Error('Keychain and Encryption instances are required.');
    }

    this.keyManager = new KeyManager(keychain, encryption);
    this.encryption = encryption;
    this.storageAdapter = storageAdapter;
  }

  /**
   * Get an item from encrypted storage.
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const encryptionKey = await this.keyManager.getEncryptionKey();
     
      const encryptedValue = await this.storageAdapter.getItem(key);
      if (!encryptedValue) return null;

      return await this.decryptData(encryptedValue, encryptionKey);
    } catch (error) {
      console.error('Failed to get item:', error);
      return null;
    }
  }

  /**
   * Store an encrypted item in storage.
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      const encryptionKey = await this.keyManager.getEncryptionKey();
      const encryptedValue = await this.encryptData(value, encryptionKey);
      console.log("STorage adapter is", this.storageAdapter)
      if(this.storageAdapter.setItem) {
        console.log("calling set function")
        await this.storageAdapter.setItem(key, encryptedValue);
      }
    } catch (error) {
      console.error('Failed to set item:', error);
    }
  }

  /**
   * Remove an item from storage.
   */
  async removeItem(key: string): Promise<void> {
    try {
      await this.storageAdapter.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  /**
   * Get all storage keys.
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await this.storageAdapter.getAllKeys();
      return Array.from(keys);
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  }

  /**
   * Retrieve multiple encrypted items.
   */
  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    try {
      const encryptionKey = await this.keyManager.getEncryptionKey();
      const encryptedItems = await this.storageAdapter.multiGet(keys);

      return await Promise.all(
        encryptedItems.map(async ([key, encryptedValue]) => [
          key,
          encryptedValue ? await this.decryptData(encryptedValue, encryptionKey) : null,
        ])
      );
    } catch (error) {
      console.error('Failed to get multiple items:', keys,error);
      return [];
    }
  }

  /**
   * Store multiple encrypted items.
   */
  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    try {
      const encryptionKey = await this.keyManager.getEncryptionKey();
      const encryptedPairs = await Promise.all(
        keyValuePairs.map(async ([key, value]) => [
          key,
          await this.encryptData(value, encryptionKey),
        ])
      );

   // console.log("keyValuePairs",keyValuePairs)
    console.log("encryptedPairs",encryptedPairs)

      await this.storageAdapter.multiSet(encryptedPairs as [string, string][]);
    } catch (error) {
      console.error('Failed to set multiple items:', error);
    }
  }


  
  /**
 * Merge multiple key-value pairs with existing items.
 */
async multiMerge(keyValuePairs: [string, string][]): Promise<void> {
  try {
    const encryptionKey = await this.keyManager.getEncryptionKey();

    // Step 1: Retrieve existing data and decrypt
    const existingPairs = await this.storageAdapter.multiGet(
      keyValuePairs.map(([key]) => key)
    );

    const decryptedExistingPairs = await Promise.all(
      existingPairs.map(async ([key, encryptedValue]) => {
        if (encryptedValue) {
          const decryptedValue = await this.decryptData(encryptedValue, encryptionKey);
          return [key, decryptedValue];
        }
        return [key, null];
      })
    );

    // Step 2: Merge decrypted existing data with incoming data
    const mergedPairs = keyValuePairs.map(([key, newValue]) => {
      const existingPair = decryptedExistingPairs.find(([existingKey]) => existingKey === key);
      let mergedValue = newValue;

      if (existingPair && existingPair[1]) {
        try {
          const existingValue = JSON.parse(existingPair[1]);
          const newValueParsed = JSON.parse(newValue);

          mergedValue = JSON.stringify({
            ...existingValue,
            ...newValueParsed,
          });
        } catch {
          // If parsing fails, overwrite with the new value
          mergedValue = newValue;
        }
      }

      return [key, mergedValue];
    });

    // Step 3: Encrypt merged data
    const encryptedPairs = await Promise.all(
      mergedPairs.map(async ([key, value]) => [
        key,
        await this.encryptData(value, encryptionKey),
      ])
    );

    console.log('Merged Encrypted Pairs:', encryptedPairs);

    // Step 4: Store encrypted merged data
    await this.storageAdapter.multiSet(encryptedPairs as [string, string][]);
  } catch (error) {
    console.error('Failed to merge multiple items:', error);
  }
}



  /**
   * Remove multiple items from storage.
   */
  async multiRemove(keys: string[]): Promise<void> {
    try {
      await this.storageAdapter.multiRemove(keys);
    } catch (error) {
      console.error('Failed to remove multiple items:', error);
    }
  }

  /**
   * Merge a value with an existing item.
   */
  /**
 * Merge a value with an existing item.
 */
async mergeItem(key: string, value: string): Promise<void> {
  try {
    const encryptionKey = await this.keyManager.getEncryptionKey();

    // Step 1: Retrieve existing encrypted data
    const existingEncryptedValue = await this.storageAdapter.getItem(key);
    let mergedValue = value;

    if (existingEncryptedValue) {
      // Step 2: Decrypt the existing value
      const existingValue = await this.decryptData(existingEncryptedValue, encryptionKey);

      try {
        // Step 3: Parse and merge as JSON
        const existingJSON = JSON.parse(existingValue);
        const newValueJSON = JSON.parse(value);

        mergedValue = JSON.stringify({
          ...existingJSON,
          ...newValueJSON,
        });
      } catch {
        // If parsing fails, overwrite with the new value
        mergedValue = value;
      }
    }

    // Step 4: Encrypt the merged value
    const encryptedValue = await this.encryptData(mergedValue, encryptionKey);

    console.log('Merged Encrypted Value:', encryptedValue);

    // Step 5: Save the encrypted merged value back to storage
    await this.storageAdapter.setItem(key, encryptedValue);
  } catch (error) {
    console.error('Failed to merge item:', error);
  }
}


  /**
   * Encrypt data based on AES or RSA configuration.
   */
  private async encryptData(data: string, key: string | keypair): Promise<string> {
    if (this.encryption.aes) {
      return this.encryption.aes.encryptAsyncAES
        ? await this.encryption.aes.encryptAsyncAES(data, key as string)
        : this.encryption.aes.encryptAES?.(data, key as string) || data;
    } else if (this.encryption.rsa) {
      return this.encryption.rsa.encryptAsyncRSA
        ? await this.encryption.rsa.encryptAsyncRSA(data, (key as keypair)!.publicKey)
        : this.encryption.rsa.encryptRSA?.(data, (key as keypair).publicKey) || data;
    }
    throw new Error('No encryption method available.');
  }

  /**
   * Decrypt data based on AES or RSA configuration.
   */
  private async decryptData(data: string, key: string | keypair): Promise<string> {
    if (this.encryption.aes) {
      return this.encryption.aes.decryptAsyncAES
        ? await this.encryption.aes.decryptAsyncAES(data, key as string)
        : this.encryption.aes.decryptAES?.(data, key as string) || data;
    } else if (this.encryption.rsa) {
      return this.encryption.rsa.decryptAsyncRSA
        ? await this.encryption.rsa.decryptAsyncRSA(data, (key as keypair).privateKey)
        : this.encryption.rsa.decryptRSA?.(data,  (key as keypair).privateKey) || data;
    }
    throw new Error('No decryption method available.');
  }
}
