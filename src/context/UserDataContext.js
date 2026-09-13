import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext(null);

export function UserDataProvider({ deviceId, children }) {
  const [coinBalance, setCoinBalance] = useState(0);
  const [offerStatuses, setOfferStatuses] = useState({});
  const [withdrawals, setWithdrawals] = useState([]);
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
          setWithdrawals(parsed.withdrawals ?? []);
        }
      } catch (e) {} finally { setLoaded(true); }
    })();
  }, [deviceId]);

  const persist = async (nextBalance, nextStatuses, nextWithdrawals) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify({ coinBalance: nextBalance, offerStatuses: nextStatuses, withdrawals: nextWithdrawals }));
    } catch (e) {}
  };

  const startOffer = (offer) => {
    setOfferStatuses((prev) => {
      const next = { ...prev, [offer.id]: { status: 'pending', reward: offer.reward, name: offer.name } };
      persist(coinBalance, next, withdrawals);
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
        persist(nextBalance, nextStatuses, withdrawals);
        return nextBalance;
      });
      return nextStatuses;
    });
  };

  const requestWithdrawal = (amount, method, details) => {
    const record = { id: `${Date.now()}`, amount, method, details: details || null, status: 'pending', date: new Date().toISOString() };
    setWithdrawals((prevWithdrawals) => {
      const nextWithdrawals = [record, ...prevWithdrawals];
      setCoinBalance((prevBalance) => {
        const nextBalance = Math.max(0, prevBalance - amount);
        persist(nextBalance, offerStatuses, nextWithdrawals);
        return nextBalance;
      });
      return nextWithdrawals;
    });
  };

  const completeWithdrawal = (id) => {
    setWithdrawals((prevWithdrawals) => {
      const nextWithdrawals = prevWithdrawals.map((w) => (w.id === id ? { ...w, status: 'successful' } : w));
      persist(coinBalance, offerStatuses, nextWithdrawals);
      return nextWithdrawals;
    });
  };

  return (
    <UserDataContext.Provider value={{ coinBalance, offerStatuses, withdrawals, loaded, startOffer, completeOffer, requestWithdrawal, completeWithdrawal }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error('useUserData must be used inside a UserDataProvider');
  return ctx;
}
