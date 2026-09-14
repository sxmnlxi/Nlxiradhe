import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OFFERS } from '../data/offers';

const UserDataContext = createContext(null);

export function UserDataProvider({ deviceId, children }) {
  const [coinBalance, setCoinBalance] = useState(0);
  const [offerStatuses, setOfferStatuses] = useState({});
  const [withdrawals, setWithdrawals] = useState([]);

  // These are required by the new OffersScreen.
  const [offers, setOffers] = useState(OFFERS);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState(null);

  const [loaded, setLoaded] = useState(false);

  const storageKey = `userdata_${deviceId}`;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);

        if (raw) {
          const parsed = JSON.parse(raw);

          setCoinBalance(parsed.coinBalance || 0);
          setOfferStatuses(parsed.offerStatuses || {});
          setWithdrawals(parsed.withdrawals || []);
        }
      } catch (error) {
        console.log('Could not load local user data');
      } finally {
        setLoaded(true);
      }
    };

    loadUserData();
  }, [deviceId]);

  // For now this refreshes local offers.
  // Later, you can replace this with a backend API request.
  const refreshOffers = async () => {
    setOffersLoading(true);

    try {
      setOffers(Array.isArray(OFFERS) ? OFFERS : []);
      setOffersError(null);
    } catch (error) {
      setOffers([]);
      setOffersError('Could not load offers. Please try again.');
    } finally {
      setOffersLoading(false);
    }
  };

  const persist = async (
    nextBalance,
    nextStatuses,
    nextWithdrawals
  ) => {
    try {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({
          coinBalance: nextBalance,
          offerStatuses: nextStatuses,
          withdrawals: nextWithdrawals,
        })
      );
    } catch (error) {
      console.log('Could not save user data');
    }
  };

  // When a user starts an offer, it goes to Pending.
  const startOffer = (offer) => {
    setOfferStatuses((previousStatuses) => {
      const nextStatuses = {
        ...previousStatuses,
        [offer.id]: {
          status: 'pending',
          reward: offer.reward,
          name: offer.name,
          startedAt: new Date().toISOString(),
        },
      };

      persist(coinBalance, nextStatuses, withdrawals);

      return nextStatuses;
    });
  };

  // When an offer is verified, it goes to Completed
  // and its reward is added to the wallet.
  const completeOffer = (offerId) => {
    setOfferStatuses((previousStatuses) => {
      const currentOffer = previousStatuses[offerId];

      if (
        !currentOffer ||
        currentOffer.status === 'completed'
      ) {
        return previousStatuses;
      }

      const nextStatuses = {
        ...previousStatuses,
        [offerId]: {
          ...currentOffer,
          status: 'completed',
          completedAt: new Date().toISOString(),
        },
      };

      setCoinBalance((previousBalance) => {
        const nextBalance =
          previousBalance + Number(currentOffer.reward || 0);

        persist(nextBalance, nextStatuses, withdrawals);

        return nextBalance;
      });

      return nextStatuses;
    });
  };

  const requestWithdrawal = (amount, method, details) => {
    const withdrawal = {
      id: `${Date.now()}`,
      amount,
      method,
      details: details || null,
      status: 'pending',
      date: new Date().toISOString(),
    };

    setWithdrawals((previousWithdrawals) => {
      const nextWithdrawals = [
        withdrawal,
        ...previousWithdrawals,
      ];

      setCoinBalance((previousBalance) => {
        const nextBalance = Math.max(
          0,
          previousBalance - amount
        );

        persist(
          nextBalance,
          offerStatuses,
          nextWithdrawals
        );

        return nextBalance;
      });

      return nextWithdrawals;
    });
  };

  const completeWithdrawal = (withdrawalId) => {
    setWithdrawals((previousWithdrawals) => {
      const nextWithdrawals = previousWithdrawals.map(
        (withdrawal) => {
          if (withdrawal.id === withdrawalId) {
            return {
              ...withdrawal,
              status: 'successful',
            };
          }

          return withdrawal;
        }
      );

      persist(
        coinBalance,
        offerStatuses,
        nextWithdrawals
      );

      return nextWithdrawals;
    });
  };

  return (
    <UserDataContext.Provider
      value={{
        coinBalance,
        offerStatuses,
        withdrawals,

        offers,
        offersLoading,
        offersError,
        refreshOffers,

        loaded,
        startOffer,
        completeOffer,
        requestWithdrawal,
        completeWithdrawal,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);

  if (!context) {
    throw new Error(
      'useUserData must be used inside a UserDataProvider'
    );
  }

  return context;
    }
