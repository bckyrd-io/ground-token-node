import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2E7D32',
  backgroundLight: '#f8f6f6',
  white: '#ffffff',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
};

export default function RegisterStaff() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [zone, setZone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top App Bar */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register New Staff</Text>
          <View style={{ width: 48 }} /> {/* Spacer */}
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Section Header */}
            <Text style={styles.sectionTitle}>Staff Information</Text>

            <View style={styles.formContainer}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter staff's full name"
                  placeholderTextColor={COLORS.slate400}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              {/* Email Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@example.com"
                  placeholderTextColor={COLORS.slate400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor={COLORS.slate400}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* Role Selection (Mocking Dropdown with TextInput for now, could use a proper picker library) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Role Selection</Text>
                <View style={styles.selectContainer}>
                  <TextInput
                    style={styles.selectInput}
                    placeholder="Select a role"
                    placeholderTextColor={COLORS.slate400}
                    value={role}
                    onChangeText={setRole}
                    // Ideally, this opens a modal or uses @react-native-picker/picker
                  />
                  <MaterialIcons name="expand-more" size={24} color={COLORS.slate500} style={styles.selectIcon} />
                </View>
              </View>

              {/* Assign Primary Zone (Mocking Dropdown) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Assign Primary Zone</Text>
                <View style={styles.selectContainer}>
                  <TextInput
                    style={styles.selectInput}
                    placeholder="Choose a zone"
                    placeholderTextColor={COLORS.slate400}
                    value={zone}
                    onChangeText={setZone}
                    // Ideally, this opens a modal or uses @react-native-picker/picker
                  />
                  <MaterialIcons name="expand-more" size={24} color={COLORS.slate500} style={styles.selectIcon} />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Create a secure password"
                    placeholderTextColor={COLORS.slate400}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordIcon}>
                    <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={24} color={COLORS.slate500} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Bottom Action Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Register & Send Invite</Text>
            <MaterialIcons name="send" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate100,
    backgroundColor: COLORS.white,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.slate900,
    flex: 1,
    textAlign: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for sticky footer
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.slate900,
    paddingTop: 24,
    paddingBottom: 24,
  },
  formContainer: {
    gap: 20, // Requires RN 0.71+, use marginBottom on items if older
  },
  inputGroup: {
    marginBottom: 20, // Fallback for gap
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate700,
    marginLeft: 4,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12, // Using 12px for 2xl equivalent as requested in HTML config
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.slate900,
  },
  selectContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  selectInput: {
    height: 56,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingRight: 48,
    fontSize: 16,
    color: COLORS.slate900,
  },
  selectIcon: {
    position: 'absolute',
    right: 16,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    height: 56,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingRight: 48,
    fontSize: 16,
    color: COLORS.slate900,
  },
  passwordIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  dividerContainer: {
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.slate100,
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
