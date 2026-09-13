import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Easing } from 'react-native';
import { colors } from '../theme/colors';

export default function AnimatedCoin({ size = 16 }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.18, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[styles.coin, { width: size, height: size, borderRadius: size / 2, transform: [{ scale }] }]}>
      <Text style={[styles.symbol, { fontSize: size * 0.55 }]}>₹</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  coin: { backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#C9820A' },
  symbol: { color: '#7A4E00', fontWeight: '800' },
});
