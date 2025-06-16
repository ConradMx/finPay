import * as SecureStore from 'expo-secure-store'
import { StateStorage } from 'zustand/middleware'

export const zustandStorage: StateStorage = {
  setItem: async (name, value) => {
    await SecureStore.setItemAsync(name, value)
  },
  getItem: async (name) => {
    const value = await SecureStore.getItemAsync(name)
    return value ?? null
  },
  removeItem: async (name) => {
    await SecureStore.deleteItemAsync(name)
  }
}
