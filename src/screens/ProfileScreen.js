import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, 
  Animated, TextInput, Dimensions, Easing, Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  // Editable state (Gmail is locked / read-only)
  const [name, setName] = useState('VERMA');
  const [email, setEmail] = useState('verma.user@gmail.com'); // Locked
  const [password, setPassword] = useState('••••••••');
  
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- Animation Values ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const floatValue = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Fade in screen
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    // 2. Continuous avatar bouncing
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();

    // 3. Pulsing save button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, { toValue: 1.03, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseValue, { toValue: 1, duration: 600, useNativeDriver: true })
      ])
    ).start();

    // 4. Floating circles background animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, { toValue: 8, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatValue, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccessModal(true);
    Animated.spring(modalScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalScale, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setShowSuccessModal(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.fullScreenContainer, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Top Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity 
              style={styles.editToggleBtn}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons name={isEditing ? "close" : "create-outline"} size={18} color="#FF3E86" />
              <Text style={styles.editToggleText}>{isEditing ? "Cancel" : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          {/* Animated Profile Avatar Card */}
          <View style={styles.profileCard}>
            <Animated.View style={[styles.floatingCircle1, { transform: [{ translateY: floatValue }] }]} />
            <Animated.View style={[styles.floatingCircle2, { transform: [{ translateY: Animated.multiply(floatValue, -1) }] }]} />

            <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
              <View style={styles.avatarCircle}>
                <Ionicons name="paw" size={40} color="#FF3E86" />
              </View>
            </Animated.View>

            <Text style={styles.profileNameText}>{name}</Text>
            <Text style={styles.profileEmailText}>{email}</Text>
            
            <View style={styles.levelBadge}>
              <Ionicons name="star" size={14} color="#FFD700" style={{ marginRight: 4 }} />
              <Text style={styles.levelBadgeText}>VIP Rewards Member</Text>
            </View>
          </View>

          {/* Edit Form Section */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Account Settings</Text>

            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputWrapper, isEditing && styles.inputWrapperActive]}>
                <Ionicons name="person-outline" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  editable={isEditing}
                  placeholder="Enter name"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            {/* Email Field (Locked / Read-only) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <Text style={styles.lockedText}><Ionicons name="lock-closed" size={10} /> Cannot be changed</Text>
              </View>
              <View style={[styles.inputWrapper, styles.inputLocked]}>
                <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: '#888' }]}
                  value={email}
                  editable={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, isEditing && styles.inputWrapperActive]}>
                <Ionicons name="lock-closed-outline" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  editable={isEditing}
                  secureTextEntry={!isEditing}
                  placeholder="Enter new password"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            {/* Save Button (Visible only when editing) */}
            {isEditing && (
              <Animated.View style={{ transform: [{ scale: pulseValue }], marginTop: 10 }}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* Quick Menu Links (Withdrawal History / Offer Status) */}
          <View style={styles.menuSection}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('My Offers')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <Ionicons name="time-outline" size={20} color="#FF3E86" />
              </View>
              <Text style={styles.menuText}>Offer Status & Withdrawal History</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('Withdraw')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="wallet-outline" size={20} color="#0052FF" />
              </View>
              <Text style={styles.menuText}>Withdraw Earnings (UPI / Bank)</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </Animated.View>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: modalScale }] }]}>
            <View style={styles.successIconBg}>
              <Ionicons name="checkmark-circle" size={70} color="#27ae60" />
            </View>
            <Text style={styles.modalTitle}>Profile Updated!</Text>
            <Text style={styles.modalDesc}>Your profile info has been successfully updated.</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
              <Text style={styles.modalCloseText}>Awesome</Text>
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
    backgroundColor: '#FFF0F5', // White-Pink Theme
  },
  fullScreenContainer: {
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
  backButton: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFE4E1',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
  },
  headerTitle: {
    fontSize: 22, fontWeight: '900', color: '#1A1A1A',
  },
  editToggleBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    borderWidth: 1, borderColor: '#FFE4E1',
  },
  editToggleText: {
    color: '#FF3E86', fontWeight: 'bold', fontSize: 12, marginLeft: 4,
  },
  profileCard: {
    backgroundColor: '#FF3E86', borderRadius: 24, padding: 24, alignItems: 'center',
    marginBottom: 24, overflow: 'hidden', shadowColor: '#FF3E86',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  floatingCircle1: {
    position: 'absolute', top: -30, left: -20, width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  floatingCircle2: {
    position: 'absolute', bottom: -40, right: -20, width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  avatarCircle: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4,
  },
  profileNameText: {
    fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginBottom: 2,
  },
  profileEmailText: {
    fontSize: 13, color: '#FFE4E1', marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12,
  },
  levelBadgeText: {
    color: '#FFD700', fontWeight: 'bold', fontSize: 11,
  },
  formContainer: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#FFE4E1', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12, fontWeight: 'bold', color: '#666666', marginLeft: 4,
  },
  lockedText: {
    fontSize: 10, color: '#999999', fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA',
    borderRadius: 14, borderWidth: 1, borderColor: '#EEEEEE', paddingHorizontal: 14,
  },
  inputWrapperActive: {
    borderColor: '#FF3E86', backgroundColor: '#FFFFFF',
  },
  inputLocked: {
    backgroundColor: '#F1F5F9', borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1, paddingVertical: 12, fontSize: 14, color: '#1A1A1A',
  },
  saveButton: {
    flexDirection: 'row', backgroundColor: '#FF3E86', paddingVertical: 14,
    borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#FF3E86', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF', fontSize: 15, fontWeight: 'bold',
  },
  menuSection: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 16, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#FFE4E1',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  menuIconBox: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFE4E1',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  menuText: {
    flex: 1, fontSize: 14, fontWeight: 'bold', color: '#1A1A1A',
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF', borderRadius: 26, padding: 28, width: '100%', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8,
  },
  successIconBg: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginBottom: 8, textAlign: 'center',
  },
  modalDesc: {
    fontSize: 13, color: '#666666', textAlign: 'center', marginBottom: 20, lineHeight: 18,
  },
  modalCloseBtn: {
    backgroundColor: '#FF3E86', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20, width: '100%', alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF', fontSize: 15, fontWeight: 'bold',
  },
});
  
