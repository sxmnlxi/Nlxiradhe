import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import { useUserData } from '../context/UserDataContext';
import { OFFERS as DEMO_OFFERS } from '../data/offers';
import AnimatedCoin from '../components/AnimatedCoin';
import OfferDetailScreen from './OfferDetailScreen';

const FILTERS = [
  {
    key: 'all',
    label: 'All offers',
    icon: 'apps-outline',
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: 'time-outline',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: 'checkmark-circle-outline',
  },
];

export default function OffersScreen() {
  const userData = useUserData();

  const offerStatuses = userData.offerStatuses || {};
  const contextOffers = Array.isArray(userData.offers)
    ? userData.offers
    : [];
  const offersLoading = Boolean(userData.offersLoading);
  const offersError = userData.offersError || null;
  const refreshOffers = userData.refreshOffers || (() => {});

  // If backend offers are not loaded yet, show local demo offers.
  // This prevents the "length of undefined" crash.
  const safeOffers =
    contextOffers.length > 0 ? contextOffers : DEMO_OFFERS;

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [filter, setFilter] = useState('all');
  const switchScale = useRef(new Animated.Value(1)).current;

  const counts = useMemo(() => {
    return {
      all: safeOffers.length,
      pending: safeOffers.filter(
        (offer) => offerStatuses[offer.id]?.status === 'pending'
      ).length,
      completed: safeOffers.filter(
        (offer) => offerStatuses[offer.id]?.status === 'completed'
      ).length,
    };
  }, [offerStatuses, safeOffers]);

  const visibleOffers = useMemo(() => {
    if (filter === 'all') {
      return safeOffers;
    }

    return safeOffers.filter(
      (offer) => offerStatuses[offer.id]?.status === filter
    );
  }, [filter, offerStatuses, safeOffers]);

  const changeFilter = (nextFilter) => {
    setFilter(nextFilter);

    switchScale.setValue(0.95);

    Animated.spring(switchScale, {
      toValue: 1,
      friction: 5,
      tension: 130,
      useNativeDriver: true,
    }).start();
  };

  if (selectedOffer) {
    return (
      <OfferDetailScreen
        offer={selectedOffer}
        onBack={() => setSelectedOffer(null)}
        onStarted={() => setSelectedOffer(null)}
      />
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.title}>Offers</Text>
          <Text style={styles.subtitle}>
            Choose an offer and earn coins.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshIcon}
          onPress={refreshOffers}
          disabled={offersLoading}
          activeOpacity={0.8}
        >
          <Ionicons
            name="refresh"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.filterBar,
          {
            transform: [{ scale: switchScale }],
          },
        ]}
      >
        {FILTERS.map((item) => {
          const isActive = filter === item.key;

          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.filter,
                isActive && styles.filterActive,
              ]}
              onPress={() => changeFilter(item.key)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.filterIcon,
                  isActive && styles.filterIconActive,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={
                    isActive
                      ? colors.white
                      : colors.textSecondary
                  }
                />
              </View>

              <Text
                style={[
                  styles.filterLabel,
                  isActive && styles.filterLabelActive,
                ]}
              >
                {item.label}
              </Text>

              <Text
                style={[
                  styles.filterCount,
                  isActive && styles.filterCountActive,
                ]}
              >
                {counts[item.key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      <View style={styles.listHeading}>
        <Text style={styles.sectionTitle}>
          {filter === 'all'
            ? 'All offers'
            : `${filter[0].toUpperCase()}${filter.slice(1)} offers`}
        </Text>

        <Text style={styles.offerCount}>
          {visibleOffers.length} shown
        </Text>
      </View>

      {offersLoading && contextOffers.length === 0 ? (
        <ActivityIndicator
          color={colors.primary}
          style={styles.loader}
        />
      ) : null}

      {offersError ? (
        <Text style={styles.errorText}>{offersError}</Text>
      ) : null}

      {!offersLoading && visibleOffers.length === 0 ? (
        <EmptyState filter={filter} />
      ) : null}

      {visibleOffers.map((offer, index) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          index={index}
          status={offerStatuses[offer.id]?.status}
          onPress={() => setSelectedOffer(offer)}
        />
      ))}
    </ScrollView>
  );
}

function EmptyState({ filter }) {
  const isCompleted = filter === 'completed';

  return (
    <View style={styles.emptyCard}>
      <Ionicons
        name={
          isCompleted
            ? 'ribbon-outline'
            : 'sparkles-outline'
        }
        size={31}
        color={colors.primary}
      />

      <Text style={styles.emptyTitle}>
        {isCompleted
          ? 'No completed offers yet'
          : 'Nothing here yet'}
      </Text>

      <Text style={styles.emptyText}>
        {isCompleted
          ? 'Finish a pending offer and its coin reward will appear here.'
          : 'Start an offer from All offers to see it here.'}
      </Text>
    </View>
  );
}

function OfferCard({ offer, index, status, onPress }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 60,
        friction: 8,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isCompleted = status === 'completed';
  const isPending = status === 'pending';

  const statusLabel = isCompleted
    ? 'Completed'
    : isPending
      ? 'Pending verification'
      : offer.isUnlimited
        ? 'Available anytime'
        : 'Available now';

  const statusColor = isCompleted
    ? colors.success
    : isPending
      ? colors.warning
      : colors.textSecondary;

  const statusIcon = isCompleted
    ? 'checkmark-circle'
    : isPending
      ? 'time'
      : 'flash-outline';

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      <TouchableOpacity
        style={styles.offerCard}
        activeOpacity={0.84}
        onPress={onPress}
      >
        <View
          style={[
            styles.logo,
            { backgroundColor: offer.logoColor || colors.primary },
          ]}
        >
          <Ionicons
            name={offer.icon || 'gift-outline'}
            size={24}
            color={colors.white}
          />
        </View>

        <View style={styles.offerContent}>
          <Text style={styles.offerName}>{offer.name}</Text>

          <View style={styles.statusRow}>
            <Ionicons
              name={statusIcon}
              size={13}
              color={statusColor}
            />

            <Text
              style={[
                styles.status,
                { color: statusColor },
              ]}
            >
              {statusLabel}
            </Text>
          </View>
        </View>

        <View style={styles.reward}>
          <AnimatedCoin size={25} />
          <Text style={styles.rewardText}>+{offer.reward}</Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textMuted}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg + 20,
    paddingBottom: 42,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    fontSize: 28,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  refreshIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 5,
    marginTop: spacing.lg,
  },
  filter: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: 9,
  },
  filterActive: {
    backgroundColor: colors.primary,
  },
  filterIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  filterLabel: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 10,
    marginTop: 4,
  },
  filterLabelActive: {
    color: colors.white,
  },
  filterCount: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '800',
    marginTop: 1,
  },
  filterCountActive: {
    color: colors.white,
  },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  offerCount: {
    ...typography.small,
    color: colors.textMuted,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  offerName: {
    ...typography.label,
    color: colors.textPrimary,
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  status: {
    ...typography.small,
    marginLeft: 4,
    fontSize: 11,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  rewardText: {
    ...typography.label,
    color: colors.primary,
    marginLeft: 5,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  errorText: {
    ...typography.small,
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.sm,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: spacing.sm,
  },
  emptyText: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 18,
  },
});
