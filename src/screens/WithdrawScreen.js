import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, 
  Animated, Dimensions, Easing, TextInput, Modal, UIManager, Platform, LayoutAnimation 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Enable LayoutAnimation for Android to make the form expansion smooth
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WithdrawScreen() {
  const [balance, setBalance] = useState('350.00'); // Mock balance
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('');
  
  // Form States
  const [upiDetails, setUpiDetails] = useState({ upiId: '', name: '' });
  const [bankDetails, setBankDetails] = useState({ accNo: '', payeeName: '', ifsc: '', bankName: '' });
  
  const [showSuccess, setShowSuccess] = useState(false);

  const withdrawMethods = [
    { id: 'upi', name: 'UPI Transfer', icon: 'phone-portrait', color: '#FF7A00', subtitle: 'Instant transfer to UPI ID' },
    { id: 'bank', name: 'Bank Transfer', icon: 'business', color: '#0052FF', subtitle: 'Direct to Bank Account' },
  ];

  // --- Ultra Animation Values ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const floatValue = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  
  const cardAnims = useRef(withdrawMethods.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // 1. Fade in the whole screen
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    // 2. Staggered bouncy entrance for payment methods
    Animated.stagger(200, cardAnims.map(anim => 
      Animated.spring(anim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true })
    )).start();

    // 3. Continuous Bouncing for Coins
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.25, duration: 500, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 500, useNativeDriver: true })
      ])
    ).start();

    // 4. Continuous Pulsing for Main CTA Button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, { toValue: 1.03, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseValue, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();

    // 5. Floating background elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, { toValue: 10, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatValue, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();

  }, []);

  const handleMethodSelect = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMethod(selectedMethod === id ? null : id);
  };

  const isFormValid = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 50) return false;
    
    if (selectedMethod === 'upi') {
      return upiDetails.upiId.length > 3 && upiDetails.name.length > 2;
    }
    if (selectedMethod === 'bank') {
      return bankDetails.accNo.length > 5 && bankDetails.payeeName.length > 2 && bankDetails.ifsc.length > 4 && bankDetails.bankName.length > 2;
    }
    return false;
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    
    // Animate Success Modal Pop-up
    setShowSuccess(true);
    Animated.spring(successScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeSuccess = () => {
    Animated.timing(successScale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSuccess(false);
      setSelectedMethod(null);
      setAmount('');
      setUpiDetails({ upiId: '', name: '' });
      setBankDetails({ accNo: '', payeeName: '', ifsc: '', bankName: '' });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.fullScreenAnimatedContainer, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Withdraw</Text>
            <TouchableOpacity style={styles.historyButton}>
              <Ionicons name="time-outline" size={16} color="#FF3E86" style={{ marginRight: 4 }} />
              <Text style={styles.historyText}>History</Text>
            </TouchableOpacity>
          </View>

          {/* Ultra Animated Balance Card */}
          <View style={styles.balanceCard}>
            <Animated.View style={[styles.floatingCircle1, { transform: [{ translateY: floatValue }] }]} />
            <Animated.View style={[styles.floatingCircle2, { transform: [{ translateY: Animated.multiply(floatValue, -1) }] }]} />
            
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <View style={styles.balanceRow}>
              <Animated.View style={{ transform: [{ scale: bounceValue }], marginRight: 10 }}>
                <View style={styles.roundCoinLarge}>
                  <Text style={styles.rupeeIconLarge}>₹</Text>
                </View>
              </Animated.View>
              <Text style={styles.balanceValue}>{balance}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Select Payout Method</Text>

          {/* Payment Methods */}
          <View style={styles.methodsContainer}>
            {withdrawMethods.map((method, index) => {
              const animScale = cardAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });
              const animTranslate = cardAnims[index].interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
              const isSelected = selectedMethod === method.id;

              return (
                <Animated.View key={method.id} style={{ transform: [{ scale: animScale }, { translateY: animTranslate }] }}>
                  <TouchableOpacity 
                    style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                    onPress={() => handleMethodSelect(method.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.methodCardHeader}>
                      <View style={[styles.iconCircle, { backgroundColor: isSelected ? method.color : '#FFF0F5' }]}>
                        <Ionicons name={method.icon} size={24} color={isSelected ? '#FFFFFF' : method.color} />
                      </View>
                      <View style={styles.methodTextContainer}>
                        <Text style={styles.methodName}>{method.name}</Text>
                        <Text style={styles.methodSub}>{method.subtitle}</Text>
                      </View>
                      <View style={styles.radioCircle}>
                        {isSelected && <View style={[styles.radioDot, { backgroundColor: method.color }]} />}
                      </View>
                    </View>

                    {/* Expandable Form */}
                    {isSelected && (
                      <View style={styles.formContainer}>
                        
                        {/* Minimum Amount Badge */}
                        <View style={styles.minBadgeWrapper}>
                           <View style={styles.minBadge}>
                             <Ionicons name="information-circle" size={14} color="#D84315" style={{marginRight: 4}}/>
                             <Text style={styles.minBadgeText}>Minimum Withdrawal: ₹50</Text>
                           </View>
                        </View>

                        {/* Amount Input */}
                        <Text style={styles.inputLabel}>Amount (₹)</Text>
                        <TextInput
                          style={styles.inputField}
                          placeholder="Enter amount to withdraw (Min 50)"
                          keyboardType="numeric"
                          value={amount}
                          onChangeText={setAmount}
                          placeholderTextColor="#999"
                        />

                        {/* UPI Form */}
                        {method.id === 'upi' && (
                          <>
                            <Text style={styles.inputLabel}>User UPI ID</Text>
                            <TextInput
                              style={styles.inputField}
                              placeholder="e.g. 9876543210@ybl"
                              value={upiDetails.upiId}
                              onChangeText={(text) => setUpiDetails({...upiDetails, upiId: text})}
                              placeholderTextColor="#999"
                            />
                            <Text style={styles.inputLabel}>Account Holder Name</Text>
                            <TextInput
                              style={styles.inputField}
                              placeholder="Enter name registered with UPI"
                              value={upiDetails.name}
                              onChangeText={(text) => setUpiDetails({...upiDetails, name: text})}
                              placeholderTextColor="#999"
                            />
                          </>
                        )}

                        {/* Bank Form */}
                        {method.id === 'bank' && (
                          <>
                            <Text style={styles.inputLabel}>Bank Account Number</Text>
                            <TextInput
                              style={styles.inputField}
                              placeholder="Enter Account Number"
                              keyboardType="numeric"
                              value={bankDetails.accNo}
                              onChangeText={(text) => setBankDetails({...bankDetails, accNo: text})}
                              placeholderTextColor="#999"
                            />
                            <Text style={styles.inputLabel}>Payee Name</Text>
                            <TextInput
                              style={styles.inputField}
                              placeholder="Enter Account Holder Name"
                              value={bankDetails.payeeName}
                              onChangeText={(text) => setBankDetails({...bankDetails, payeeName: text})}
                              placeholderTextColor="#999"
                            />
                            <Text style={styles.inputLabel}>IFSC Code</Text>
                            <TextInput
                              style={styles.inputField}
                              placeholder="e.g. SBIN0001234"
                              autoCapitalize="characters"
                              value={bankDetails.ifsc}
                              onChangeText={(text) => setBankDetails({...bankDetails, ifsc: text})}
                              placeholderTextColor="#999"
                            />
                            <Text style={styles.inputLabel}>Bank Name</Text>
                            <TextInput
                              style={styles.inputField}
                              placeholder="e.g. State Bank of India"
                              value={bankDetails.bankName}
                              onChangeText={(text) => setBankDetails({...bankDetails, bankName: text})}
                              placeholderTextColor="#999"
                            />
                          </>
                        )}

                        {/* Submit Button inside form */}
                        <Animated.View style={{ transform: [{ scale: pulseValue }], marginTop: 20 }}>
                          <TouchableOpacity 
                            style={[styles.submitBtn, !isFormValid() && styles.submitBtnDisabled]}
                            disabled={!isFormValid()}
                            onPress={handleSubmit}
                          >
                            <Text style={styles.submitBtnText}>Submit Request</Text>
                            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                          </TouchableOpacity>
                        </Animated.View>

                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.successModalContent, { transform: [{ scale: successScale }] }]}>
            
            <View style={styles.successIconBg}>
              <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
                 <Ionicons name="checkmark-circle" size={80} color="#27ae60" />
              </Animated.View>
            </View>
            
            <Text style={styles.successTitle}>Withdrawal Submitted!</Text>
            
            <View style={styles.successMsgBox}>
              <Text style={styles.successDesc}>
                You will receive the amount within <Text style={{fontWeight: 'bold', color: '#1A1A1A'}}>24-48 business hours.</Text>
              </Text>
              <Text style={styles.successDesc2}>
                It shows in your withdrawal history as <Text style={{fontWeight: 'bold', color: '#FF7A00'}}>Pending</Text> until processed successfully by the backend.
              </Text>
            </View>

            <TouchableOpacity style={styles.successCloseBtn} onPress={closeSuccess}>
              <Text style={styles.successCloseBtnText}>Done</Text>
            </TouchableOpacity>
            
          </Animated.View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5', 
  },
  fullScreenAnimatedContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 45,
    paddingBottom: 40, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE4E1',
    shadowColor: '#FF3E86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyText: {
    color: '#FF3E86',
    fontWeight: 'bold',
    fontSize: 12,
  },
  balanceCard: {
    backgroundColor: '#FF3E86', 
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#FF3E86',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingCircle1: {
    position: 'absolute', top: -30, left: -20, width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.2)', 
  },
  floatingCircle2: {
    position: 'absolute', bottom: -40, right: -20, width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  balanceLabel: {
    fontSize: 14, color: '#FFE4E1', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1,
  },
  balanceRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  roundCoinLarge: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFD700', 
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#FFA500', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4,
  },
  rupeeIconLarge: {
    fontSize: 22, fontWeight: '900', color: '#1A1A1A',
  },
  balanceValue: {
    fontSize: 48, fontWeight: '900', color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 16,
  },
  methodsContainer: {
    marginBottom: 20,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFE4E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  methodCardSelected: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFAEB', 
  },
  methodCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodName: {
    fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2,
  },
  methodSub: {
    fontSize: 12, color: '#666666',
  },
  radioCircle: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#CBD5E1',
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF',
  },
  radioDot: {
    width: 12, height: 12, borderRadius: 6,
  },
  formContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFE0B2',
    paddingTop: 16,
  },
  minBadgeWrapper: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  minBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  minBadgeText: {
    color: '#D84315',
    fontWeight: 'bold',
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8, marginLeft: 4,
  },
  inputField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFE4E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF3E86',
    paddingVertical: 16,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3E86',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0, elevation: 0,
  },
  submitBtnText: {
    color: '#FFFFFF', fontSize: 16, fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconBg: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  successTitle: {
    fontSize: 22, fontWeight: '900', color: '#1A1A1A', marginBottom: 16, textAlign: 'center'
  },
  successMsgBox: {
    backgroundColor: '#F8F9FA',
  
