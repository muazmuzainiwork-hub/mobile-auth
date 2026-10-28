import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const AuthContext = createContext(null);
const ACCOUNTS = '@nest/accounts/v1';
const SESSION = '@nest/session/v1';
const normalize = email => email.trim().toLowerCase();
const digest = (salt, password) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
const publicUser = ({ id, name, email }) => ({ id, name, email });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const session = await AsyncStorage.getItem(SESSION);
        const accounts = JSON.parse(await AsyncStorage.getItem(ACCOUNTS) || '[]');
        if (!Array.isArray(accounts)) throw new Error('Invalid account storage');
        const account = accounts.find(item => item.id === session);
        if (account) setUser(publicUser(account));
      } catch {
        setStorageError('Saved session could not be restored. Please sign in again.');
      } finally { setReady(true); }
    })();
  }, []);
  async function readAccounts() {
    const accounts = JSON.parse(await AsyncStorage.getItem(ACCOUNTS) || '[]');
    if (!Array.isArray(accounts)) throw new Error('Account storage is unavailable.');
    return accounts;
  }
  async function login(email, password) {
    const accounts = await readAccounts();
    const account = accounts.find(item => item.email === normalize(email));
    if (!account || await digest(account.salt, password) !== account.hash) {
      throw new Error('Incorrect email or password. Please try again.');
    }
    await AsyncStorage.setItem(SESSION, account.id);
    setStorageError('');
    setUser(publicUser(account));
  }
  async function signup(name, email, password) {
    const accounts = await readAccounts();
    if (accounts.some(item => item.email === normalize(email))) throw new Error('An account with this email already exists. Please log in.');
    const salt = Crypto.randomUUID();
    const account = { id: Crypto.randomUUID(), name: name.trim(), email: normalize(email), salt, hash: await digest(salt, password) };
    await AsyncStorage.setItem(ACCOUNTS, JSON.stringify([...accounts, account]));
    await AsyncStorage.setItem(SESSION, account.id);
    setStorageError('');
    setUser(publicUser(account));
  }
  async function logout() {
    await AsyncStorage.removeItem(SESSION);
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, ready, storageError, login, signup, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
