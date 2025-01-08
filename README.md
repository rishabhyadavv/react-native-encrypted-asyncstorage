# 📦 **React Native Encrypted Async Storage**

**Secure Storage Middleware for React Native Applications**

---

## 🚀 **Introduction**

**React Native Encrypted Async Storage** is a secure storage library that acts as a middleware, combining the strengths of:

- **`rn-encryption`**: Provides encryption capabilities for secure data handling.
- **`react-native-async-storage`**: A robust, community-driven storage solution for React Native applications.

This library ensures all your storage operations, such as setting, getting, and merging data, are encrypted securely using industry-standard AES-GCM encryption.

---

## 🛠️ **Installation**

```bash
npm i @rrishuyadav/react-native-encrypted-async-storage
# or
yarn add @rrishuyadav/react-native-encrypted-async-storage
```

Ensure `rn-encryption` and `react-native-async-storage` are also installed as dependencies.

```bash
npm install rn-encryption @react-native-async-storage/async-storage
```

---

## 📝 **Key Features**

- 🔒 **AES-GCM Encryption**: Ensures your data is encrypted and secure at rest.
- ⚡ **Async Operations**: Fully supports asynchronous operations for all storage methods.
- 🗝️ **Key Management**: Seamless encryption key management.
- 🧩 **Data Merge**: Merge complex JSON objects while maintaining encryption.
- 📊 **Batch Operations**: Efficient batch operations like `multiSet`, `multiGet`, and `multiRemove`.

---

## 📚 **API Reference**

### ✅ **1. `setItem` & `getItem`**

**Store and Retrieve Encrypted Data**

```typescript
await EncryptedAsyncStorage.setItem('testKey', 'Hello, Encrypted World!');
const value = await EncryptedAsyncStorage.getItem('testKey');
console.log('Decrypted Value:', value); // Output: Hello, Encrypted World!
```

### ✅ **2. `removeItem`**

**Remove an Item from Storage**

```typescript
await EncryptedAsyncStorage.removeItem('testKey');
const value = await EncryptedAsyncStorage.getItem('testKey');
console.log('Value after removeItem:', value); // Output: null
```

### ✅ **3. `multiSet` & `multiGet`**

**Store and Retrieve Multiple Encrypted Items**

```typescript
await EncryptedAsyncStorage.multiSet([
  ['key1', 'value1'],
  ['key2', 'value2'],
]);

const values = await EncryptedAsyncStorage.multiGet(['key1', 'key2']);
console.log('MultiGet Values:', values);
// Output: [['key1', 'value1'], ['key2', 'value2']]
```

### ✅ **4. `getAllKeys`**

**Retrieve All Keys from Storage**

```typescript
const keys = await EncryptedAsyncStorage.getAllKeys();
console.log('All Keys:', keys);
// Output: ['key1', 'key2']
```

### ✅ **5. `multiRemove`**

**Remove Multiple Items**

```typescript
await EncryptedAsyncStorage.multiRemove(['key1', 'key2']);
const keysAfterRemove = await EncryptedAsyncStorage.getAllKeys();
console.log('Keys after multiRemove:', keysAfterRemove);
// Output: []
```

### ✅ **6. `mergeItem`**

**Merge JSON Data for a Single Item**

```typescript
await EncryptedAsyncStorage.setItem('mergeKey', JSON.stringify({ name: 'John' }));
await EncryptedAsyncStorage.mergeItem('mergeKey', JSON.stringify({ age: 30 }));

const mergedValue = await EncryptedAsyncStorage.getItem('mergeKey');
console.log('Merged Value:', mergedValue);
// Output: {"name": "John", "age": 30}
```

### ✅ **7. `multiMerge`**

**Merge JSON Data for Multiple Items**

```typescript
await EncryptedAsyncStorage.multiSet([
  ['user1', JSON.stringify({ name: 'Alice' })],
  ['user2', JSON.stringify({ name: 'Bob' })],
]);

await EncryptedAsyncStorage.multiMerge([
  ['user1', JSON.stringify({ age: 25 })],
  ['user2', JSON.stringify({ age: 28 })],
]);

const mergedUsers = await EncryptedAsyncStorage.multiGet(['user1', 'user2']);
console.log('MultiMerged Users:', mergedUsers);
// Output: [['user1', '{"name": "Alice", "age": 25}'], ['user2', '{"name": "Bob", "age": 28}']]
```

---

## 📊 **Example Usage**

### 🔑 **Initialization & Testing**

```typescript
import EncryptedAsyncStorage from 'react-native-encrypted-asyncstorage';

useEffect(() => {
  const init = async () => {
    try {
      console.log('--- Testing EncryptedAsyncStorage ---');

      // Set and Get Item
      await EncryptedAsyncStorage.setItem('testKey', 'Hello, Encrypted World!');
      const value = await EncryptedAsyncStorage.getItem('testKey');
      console.log('Decrypted Value:', value);

      // Remove Item
      await EncryptedAsyncStorage.removeItem('testKey');

      // MultiSet & MultiGet
      await EncryptedAsyncStorage.multiSet([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]);
      const multiValues = await EncryptedAsyncStorage.multiGet(['key1', 'key2']);
      console.log('MultiGet Values:', multiValues);

      // Merge Items
      await EncryptedAsyncStorage.setItem('mergeKey', JSON.stringify({ name: 'John' }));
      await EncryptedAsyncStorage.mergeItem('mergeKey', JSON.stringify({ age: 30 }));
      const mergedValue = await EncryptedAsyncStorage.getItem('mergeKey');
      console.log('Merged Value:', mergedValue);

      console.log('--- EncryptedAsyncStorage Test Completed Successfully ---');
    } catch (error) {
      console.error('Error in EncryptedAsyncStorage:', error);
    }
  };

  init();
}, []);
```

---

## 🛡️ **Security Features**

1. **AES-GCM Encryption:** Industry-standard AES encryption ensures data confidentiality and integrity.
2. **Key Management:** Keys are securely stored and retrieved.
3. **Data Integrity:** Prevents tampering by verifying encrypted payloads.

---

## 📦 **Configuration**

No additional configuration is required. Install the library and start using the API.

---

## 📚 **Best Practices**

- Always validate inputs before encrypting and storing them.
- Avoid storing highly sensitive data in Async Storage; use native keychain solutions for secrets.

---

## 🐛 **Troubleshooting**

- **Issue:** Data not decrypting correctly.  
  **Solution:** Ensure encryption keys are not rotated or lost.  

- **Issue:** Merging fails after encryption.  
  **Solution:** Always fetch, decrypt, and merge JSON objects before re-encrypting.

---

## 🤝 **Contributing**

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

---

## 📄 **License**

MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 📣 **Connect with Me – Let's Build Something Great Together!** 🚀

Hey there! 👋 I'm **Rishabh**, the creator of **React Native Encrypted Async Storage** – a library designed to make secure storage seamless and reliable in React Native applications.  

I'm passionate about building innovative mobile and web solutions, mentoring teams, and solving real-world problems with clean and efficient code.

### 🤝 **Let's Collaborate!**
- 💌 **Email me:** [your.email@example.com](mailto:rrishuyadav@example.com)  
- 💼 **Connect on LinkedIn:** [linkedin.com/in/rishabhyadav](https://www.linkedin.com/in/rishabhyadav)  
- 🧑‍💻 **GitHub:** [github.com/your-username](https://github.com/rishabhyadavv)  
- 💬 **Let's Chat:** Always happy to discuss tech, startups, or new ideas!  

Please do not hesitate to contact me in case some modification or additional functionality required from the library.

Looking forward to hearing from you! 🚀✨  


