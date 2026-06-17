import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Log } from '../utils/logger';

interface ContextType {
  readIds: Set<string>;
  markRead: (id: string) => void;
  checkRead: (id: string) => boolean;
}

const Context = createContext<ContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  // keeping it in a Set to prevent duplicate IDs naturally
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // grab the array from local storage and convert it to a Set
    const saved = localStorage.getItem('read_status');
    if (saved) {
      try {
        const parsedArray = JSON.parse(saved);
        if (Array.isArray(parsedArray)) {
          setReadIds(new Set(parsedArray));
        }
      } catch (err) {
        Log('frontend', 'warn', 'state', 'Failed to parse localstorage read state');
      }
    }
  }, []);

  const markRead = (id: string) => {
    setReadIds(prev => {
      if (prev.has(id)) return prev; // already read
      
      const nextSet = new Set(prev);
      nextSet.add(id);
      
      // save back to localstorage as a simple array
      localStorage.setItem('read_status', JSON.stringify(Array.from(nextSet)));
      Log('frontend', 'info', 'state', `Marked ${id} as read`);
      
      return nextSet;
    });
  };

  const checkRead = (id: string) => readIds.has(id);

  return (
    <Context.Provider value={{ readIds, markRead, checkRead }}>
      {children}
    </Context.Provider>
  );
};

export const useNotificationContext = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Must be inside NotificationProvider');
  return ctx;
};
