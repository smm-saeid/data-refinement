import { useEffect, useRef, useState } from 'react';

type UseSessionStorageReturn<T> = [T, (value: T) => void];

const readValue = <T,>(key: string, defaultValue: T): T => {
  const storedValue = sessionStorage.getItem(key);
  if (!storedValue) {
    return defaultValue;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    return defaultValue;
  }
};

const useSessionStorage = <T,>(key: string, defaultValue: T): UseSessionStorageReturn<T> => {
  const [state, setState] = useState<T>(() => readValue<T>(key, defaultValue));
  const previousKeyRef = useRef(key);

  useEffect(() => {
    if (previousKeyRef.current !== key) {
      sessionStorage.removeItem(previousKeyRef.current);
    }
    previousKeyRef.current = key;
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default useSessionStorage;
