import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext(null);

export function UserDataProvider({ deviceId, children }) {
  const [coinBalance, setCoinBalance] = useState(0);
  const [offerStatuses, setOfferStatuses] = useState({});
  const [loaded, setLoaded] = useState(false);
  const storageKey = `userdata_${deviceId}`;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          setCoinBalance(parsed.coinBalance ?? 0);
          setOfferStatuses(parsed.offerStatuses ?? {});
        }
      } catch (e) {} finally { setLoaded(true); }
    })();
  }, [deviceId]);

  const persist = async (nextBalance, nextStatuses) => {
    try { await AsyncStorage.setItem(storageKey, JSON.stringify({ coinBalance: nextBalance, offerStatuses: nextStatuses })); } catch (e) {}
  };

  const startOffer = (offer) => {
    setOfferStatuses((prev) => {
      const next = { ...prev, [offer.id]: { status: 'pending', reward: offer.reward, name: offer.name } };
      persist(coinBalance, next);
      return next;
    });
  };

  const completeOffer = (offerId) => {
    setOfferStatuses((prevStatuses) => {
      const entry = prevStatuses[offerId];
      if (!entry || entry.status === 'completed') return prevStatuses;
      const nextStatuses = { ...prevStatuses, [offerId]: { ...entry, status: 'completed' } };
      setCoinBalance((prevBalance) => {
        const nextBalance = prevBalance + entry.reward;
        persist(nextBalance, nextStatuses);
        return nextBalance;
      });
      return nextStatuses;
    });
  };

  const withdraw = (amount) => {
    setCoinBalance((prev) => {
      const next = Math.max(0, prev - amount);
      persist(next, offerStatuses);
      return next;
    });
  };

  return (
    <UserDataContext.Provider value={{ coinBalance, offerStatuses, loaded, startOffer, completeOffer, withdraw }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error('useUserData must be used inside a UserDataProvider');
  return ctx;
}
