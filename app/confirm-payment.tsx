import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2E7D32',
  accent: '#ec5b13',
  backgroundLight: '#f8f6f6',
  white: '#ffffff',
  slate900: '#0f172a',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
};

export default function ConfirmPayment() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('airtel');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* TopAppBar Component */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Airtel Money Payment</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="more-vert" size={24} color={COLORS.slate400} />
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent}>
          {/* Merchant Info */}
          <View style={styles.merchantContainer}>
            <View style={styles.merchantIconContainer}>
              <MaterialIcons name="child-care" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.merchantTextContainer}>
              <Text style={styles.merchantTitle}>Gelato Kids Play Access</Text>
              <Text style={styles.merchantSubtitle}>Ref: GK-774291</Text>
            </View>
          </View>

          {/* Amount Box */}
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Amount to pay</Text>
            <Text style={styles.amountValue}>MK 15,000.00</Text>
          </View>

          <Text style={styles.instructionText}>
            Enter your Airtel Money or TNM registered phone number to authorize the transaction.
          </Text>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="phone-iphone" size={24} color={COLORS.slate400} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="088XXXXXXX"
                placeholderTextColor={COLORS.slate400}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          {/* Payment Method Toggle */}
          <View style={styles.networkSection}>
            <Text style={styles.networkLabel}>NETWORK PROVIDER</Text>
            <View style={styles.networkButtons}>
              <TouchableOpacity 
                style={[
                  styles.networkButton, 
                  network === 'airtel' ? styles.networkButtonActive : {}
                ]}
                onPress={() => setNetwork('airtel')}
              >
                <View style={[
                  styles.networkDot, 
                  network === 'airtel' ? styles.networkDotActive : {}
                ]} />
                <Text style={[
                  styles.networkButtonText,
                  network === 'airtel' ? styles.networkTextActive : {}
                ]}>Airtel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.networkButton, 
                  network === 'tnm' ? styles.networkButtonActive : {}
                ]}
                onPress={() => setNetwork('tnm')}
              >
                <View style={[
                  styles.networkDot, 
                  network === 'tnm' ? styles.networkDotActive : {}
                ]} />
                <Text style={[
                  styles.networkButtonText,
                  network === 'tnm' ? styles.networkTextActive : {}
                ]}>TNM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer Action */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.confirmButton}>
            <MaterialIcons name="lock" size={24} color={COLORS.white} />
            <Text style={styles.confirmButtonText}>Confirm Payment</Text>
          </TouchableOpacity>

          <View style={styles.securityContainer}>
            <View style={styles.securityBadge}>
              <MaterialIcons name="verified-user" size={16} color={COLORS.slate500} />
              <Text style={styles.securityText}>SECURED BY PAYCHANGU</Text>
            </View>
            <View style={styles.paymentIcons}>
              <MaterialIcons name="payments" size={24} color={COLORS.slate400} />
              <MaterialIcons name="security" size={24} color={COLORS.slate400} style={styles.paymentIconSpacer} />
              <MaterialIcons name="shield" size={24} color={COLORS.slate400} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
    backgroundColor: COLORS.backgroundLight,
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
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  merchantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  merchantIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  merchantTextContainer: {
    flex: 1,
  },
  merchantTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.slate900,
    lineHeight: 28,
  },
  merchantSubtitle: {
    fontSize: 14,
    color: COLORS.slate500,
    marginTop: 4,
  },
  amountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.slate100,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 14,
    color: COLORS.slate500,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.slate600,
    lineHeight: 24,
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate700,
    marginLeft: 4,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate300,
    borderRadius: 12,
    height: 56,
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.slate900,
    paddingRight: 16,
  },
  networkSection: {
    marginTop: 32,
  },
  networkLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  networkButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  networkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.slate200,
    marginHorizontal: 4,
  },
  networkButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.slate300,
    marginRight: 8,
  },
  networkDotActive: {
    backgroundColor: COLORS.primary,
  },
  networkButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.slate500,
  },
  networkTextActive: {
    color: COLORS.slate900,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  confirmButton: {
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
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  securityContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.6,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.slate500,
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  paymentIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.5,
  },
  paymentIconSpacer: {
    marginHorizontal: 16,
  },
});
