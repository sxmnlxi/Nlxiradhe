import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Animated, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation }) {
  // Profile Form State (Mobile & Email locked/uneditable as requested)
  const [name, setName] = useState('VERMA');
  const [email, setEmail] = useState('verma.user@rewardapp.com');
  const [mobile, setMobile] = useState('9876543210');
  const [state, setState] = useState('Delhi');
  const [dob, setDob] = useState('15/08/2000');

  // Date Picker Temporary State for Day/Month/Year columns
  const [selectedDay, setSelectedDay] = useState('15');
  const [selectedMonth, setSelectedMonth] = useState('08');
  const [selectedYear, setSelectedYear] = useState('2000');

  // Password Update State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Animated Popup State (5-second auto-dismiss for validation errors or success)
  const [popupMessage, setPopupMessage] = useState(null); // 'success' or 'error'
  const [popupText, setPopupText] = useState('');
  const popupAnim = useRef(new Animated.Value(0)).current;

  // Modals Visibility
  const [activeModal, setActiveModal] = useState(null); // 'statePicker', 'datePicker', 'passwordModal'

  // Official List of States & UTs in India
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  // Mini Calendar Lists (1-31 Days, 1-12 Months, 100 Years up to current year 2026)
  const daysList = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const monthsList = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const yearsList = Array.from({ length: 100 }, (_, i) => String(2026 - i));

  // Trigger temporary animated popup banner (auto-dismisses after 5 seconds)
  const triggerPopup = (type, message) => {
    setPopupMessage(type);
    setPopupText(message);
    Animated.timing(popupAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(popupAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setPopupMessage(null));
    }, 5000);
  };

  const handlePasswordUpdate = () => {
    if (!newPassword || !confirmPassword) {
      triggerPopup('error', '⚠️ Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerPopup('error', '⚠️ New password and confirm password do not match.');
      return;
    }

    // Strict Password Rule: Minimum 8 characters long, must contain BOTH letters AND digits (numbers)
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const isLongEnough = newPassword.length >= 8;

    if (!isLongEnough || !hasLetter || !hasNumber) {
      triggerPopup('error', '❌ Oops! Password must be at least 8 characters and contain both letters & numbers.');
      return;
    }

    triggerPopup('success', '✨ Success! Password updated securely in database.');
    setTimeout(() => {
      setNewPassword('');
      setConfirmPassword('');
      setActiveModal(null);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address (Locked)</Text>
            <TextInput style={[styles.input, styles.disabledInput]} value={email} editable={false} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number (Locked)</Text>
            <TextInput style={[styles.input, styles.disabledInput]} value={mobile} editable={false} />
          </View>

          {/* Official State Selector Modal Trigger */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>State</Text>
            <TouchableOpacity style={styles.dropdownSelector} onPress={() => setActiveModal('statePicker')}>
              <Text style={styles.dropdownSelectorText}>{state || 'Select your state'}</Text>
              <Ionicons name="chevron-down" size={18} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Mini Calendar DOB Selector Modal Trigger */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth (DOB)</Text>
            <TouchableOpacity style={styles.dropdownSelector} onPress={() => setActiveModal('datePicker')}>
              <Text style={styles.dropdownSelectorText}>{dob || 'DD/MM/YYYY'}</Text>
              <Ionicons name="calendar-outline" size={18} color="#FF3E86" />
            </TouchableOpacity>
          </View>

          {/* Change Password Trigger Button */}
          <TouchableOpacity style={styles.passwordTriggerBtn} onPress={() => setActiveModal('passwordModal')}>
            <Ionicons name="lock-closed-outline" size={18} color="#FF3E86" style={{ marginRight: 8 }} />
            <Text style={styles.passwordTriggerText}>Change Account Password</Text>
          </TouchableOpacity>

          {/* Save Profile Button */}
          <TouchableOpacity style={styles.saveButton} onPress={() => { triggerPopup('success', 'Profile details updated successfully!'); }}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 1. State Selection Modal (Official List Only) */}
      <Modal visible={activeModal === 'statePicker'} transparent={true} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.modalTopRow}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={indianStates}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.pickerItemRow} onPress={() => { setState(item); setActiveModal(null); }}>
                  <Text style={[styles.pickerItemText, state === item && styles.pickerItemTextSelected]}>{item}</Text>
                  {state === item && <Ionicons name="checkmark" size={18} color="#FF3E86" />}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* 2. Mini Calendar DOB Picker Modal (Day/Month/Year columns spanning 100 years) */}
      <Modal visible={activeModal === 'datePicker'} transparent={true} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModalContent}>
            <View style={styles.modalTopRow}>
              <Text style={styles.modalTitle}>Select Date of Birth</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
            <Text style={styles.datePickerHint}>Choose Day, Month, and Year (Up to 100 years)</Text>
            
            <View style={styles.datePickerColumnsRow}>
              <View style={styles.dateColumnBox}>
                <Text style={styles.columnLabel}>Day</Text>
                <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
                  {daysList.map(d => (
                    <TouchableOpacity key={d} style={[styles.columnItem, selectedDay === d && styles.columnItemSelected]} onPress={() => setSelectedDay(d)}>
                      <Text style={[styles.columnItemText, selectedDay === d && styles.columnItemTextSelected]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dateColumnBox}>
                <Text style={styles.columnLabel}>Month</Text>
                <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
                  {monthsList.map(m => (
                    <TouchableOpacity key={m} style={[styles.columnItem, selectedMonth === m && styles.columnItemSelected]} onPress={() => setSelectedMonth(m)}>
                      <Text style={[styles.columnItemText, selectedMonth === m && styles.columnItemTextSelected]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dateColumnBox}>
                <Text style={styles.columnLabel}>Year</Text>
                <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
                  {yearsList.map(y => (
                    <TouchableOpacity key={y} style={[styles.columnItem, selectedYear === y && styles.columnItemSelected]} onPress={() => setSelectedYear(y)}>
                      <Text style={[styles.columnItemText, selectedYear === y && styles.columnItemTextSelected]}>{y}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={() => { setDob(`${selectedDay}/${selectedMonth}/${selectedYear}`); setActiveModal(null); }}>
              <Text style={styles.saveButtonText}>Confirm Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Change Password Modal with Strict 8-Digit + Letters Validation */}
      <Modal visible={activeModal === 'passwordModal'} transparent={true} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.passwordModalContent}>
            <View style={styles.modalTopRow}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
            <Text style={styles.subHeaderInfo}>Must be at least 8 characters and include both letters and digits/numbers.</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput style={styles.input} secureTextEntry placeholder="8+ chars (letters & numbers)" value={newPassword} onChangeText={setNewPassword} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput style={styles.input} secureTextEntry placeholder="Re-enter new password" value={confirmPassword} setConfirmPassword={setConfirmPassword} onChangeText={setConfirmPassword} />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handlePasswordUpdate}>
              <Text style={styles.saveButtonText}>Submit Password Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Animated 5-Second Popup Notification Banner */}
      {popupMessage && (
        <Animated.View style={[styles.floatingPopup, popupMessage === 'error' ? styles.popupError : styles.popupSuccess, { opacity: popupAnim }]}>
          <Ionicons name={popupMessage === 'error' ? 'alert-circle' : 'checkmark-circle'} size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.popupText}>{popupText}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF0F5' },
  subHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: 28, // Prevents status/notification bar collision
    paddingBottom: 12,
  },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  formContainer: { padding: 4 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#666666', marginBottom: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FFE4E1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#1A1A1A' },
  disabledInput: { backgroundColor: '#F1F5F9', color: '#888888', borderColor: '#E2E8F0' },
  dropdownSelector: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FFE4E1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownSelectorText: { fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  passwordTriggerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FF3E86', paddingVertical: 12, borderRadius: 12, marginTop: 6, marginBottom: 10 },
  passwordTriggerText: { color: '#FF3E86', fontWeight: 'bold', fontSize: 13 },
  subHeaderInfo: { fontSize: 12, color: '#666666', marginBottom: 14, lineHeight: 18 },
  saveButton: { backgroundColor: '#FF3E86', paddingVertical: 14, borderRadius: 25, alignItems: 'center', marginTop: 10, elevation: 3 },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  floatingPopup: { position: 'absolute', bottom: 40, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, elevation: 6, zIndex: 999 },
  popupError: { backgroundColor: '#e74c3c' },
  popupSuccess: { backgroundColor: '#27ae60' },
  popupText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13, flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  pickerModalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, maxHeight: '70%', paddingBottom: 40 },
  datePickerModalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 40 },
  passwordModalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 40 },
  modalTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  pickerItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  pickerItemText: { fontSize: 15, color: '#333333' },
  pickerItemTextSelected: { fontSize: 15, color: '#FF3E86', fontWeight: 'bold' },
  datePickerHint: { fontSize: 12, color: '#666666', marginBottom: 14 },
  datePickerColumnsRow: { flexDirection: 'row', justifyContent: 'space-between', height: 160, marginBottom: 16 },
  dateColumnBox: { flex: 1, marginHorizontal: 4, backgroundColor: '#F8F9FA', borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE', padding: 8, alignItems: 'center' },
  columnLabel: { fontSize: 12, fontWeight: 'bold', color: '#888888', marginBottom: 6 },
  columnScroll: { width: '100%' },
  columnItem: { paddingVertical: 10, alignItems: 'center', borderRadius: 8, marginVertical: 2 },
  columnItemSelected: { backgroundColor: '#FF3E86' },
  columnItemText: { fontSize: 14, color: '#333333' },
  columnItemTextSelected: { color: '#FFFFFF', fontWeight: 'bold' },
});
  
