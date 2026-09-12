import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'gift-outline',
    title: 'Earn from everywhere',
    subtitle:
      'Complete simple offers and tasks in the app and watch your coin balance grow.',
  },
  {
    icon: 'people-outline',
    title: 'Invite & multiply',
    subtitle:
      'Share your invite link — every friend who joins earns you bonus coins too.',
  },
  {
    icon: 'flash-outline',
    title: 'Instant payouts',
    subtitle:
      'Cash out straight to UPI or your bank account, with zero hidden fees.',
  },
];

export default function OnboardingScreen({ onFinish }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
    } else {
      onFinish && onFinish();
    }
  };

  const isLast = index === SLIDES.length - 1;

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.skipBtn} onPress={onFinish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <Ionicons name={slide.icon} size={54} color={colors.primary} />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={goNext}>
        <Text style={styles.ctaText}>{isLast ? 'Get Started' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  skipBtn: { alignSelf: 'flex-end', padding: spacing.md, marginTop: spacing.lg },
  skipText: { ...typography.label, color: colors.textSecondary },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.h1, fontSize: 24, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border, marginHorizontal: 4 },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    paddingVertical: 15,
    alignItems: 'center',
  },
  ctaText: { color: colors.white, ...typography.h2, fontSize: 16 },
});
