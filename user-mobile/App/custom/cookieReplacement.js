import * as SecureStore from 'expo-secure-store';

export const cookie = {
    set: (name, value, days) => {
        SecureStore.setItem(name, value);
    },
    get: (name) => {
        return SecureStore.getItem(name);
    },
    remove: (key) => {
        SecureStore.deleteItem(key);
    }
}