import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('VERMA');
  const [email, setEmail] = useState('verma.user@rewardapp.com');
  const [mobile, setMobile] = useState('9876543210');

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput 
            style={styles.input} 
            value={mobile} 
            onChangeText={setMobile} 
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF0F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  formContainer: { padding: 20 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#666666', marginBottom: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FFE4E1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#1A1A1A' },
  saveButton: { backgroundColor: '#FF3E86', paddingVertical: 14, borderRadius: 25, alignItems: 'center', marginTop: 20, elevation: 4 },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
});
  
