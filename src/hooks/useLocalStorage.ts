import { useEffect, useState } from 'react';

type UseLocalStorageReturn<T> = [T, (value: T) => void];

const readValue = <T,>(key: string, defaultValue: T): T => {
  const storedValue = localStorage.getItem(key);
  if (!storedValue) {
    return defaultValue;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    return storedValue as unknown as T;
  }
};

const useLocalStorage = <T,>(key: string, defaultValue: T): UseLocalStorageReturn<T> => {
  const [value, setValue] = useState<T>(() => readValue<T>(key, defaultValue));

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }

      setValue(readValue<T>(key, defaultValue));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [defaultValue, key]);

  const updateValue = (nextValue: T) => {
    setValue(nextValue);
    localStorage.setItem(key, JSON.stringify(nextValue));
    window.dispatchEvent(new StorageEvent('storage', { key }));
  };

  return [value, updateValue];
};

export default useLocalStorage;
