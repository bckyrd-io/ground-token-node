import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2E7D32',
  error: '#d32f2f',
  errorBg: 'rgba(211, 47, 47, 0.05)',
  errorBorder: 'rgba(211, 47, 47, 0.2)',
  backgroundLight: '#f8f6f6',
  white: '#ffffff',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
};

export default function ValidationResult() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top App Bar */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="close" size={24} color={COLORS.slate900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Validation Result</Text>
          <View style={{ width: 48 }} /> {/* Spacer */}
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {/* Success State Section */}
          <View style={styles.successCard}>
            {/* Status Icon Circle */}
            <View style={styles.statusIconContainer}>
              <MaterialIcons name="check-circle" size={60} color={COLORS.primary} />
            </View>
            <Text style={styles.mainTitle}>Access Granted</Text>

            {/* User Info Card */}
            <View style={styles.userInfoCard}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSpt3vVat_D2gJTNpO8Elxwjcopou0C74dB-D5SjeU_35xuNKSzzno9EJvj9e-2uDyQDQzArRSlk_3GQN41OwrwMF3PzGPjipLd9sPm3PgCln72XKYsYiGZGJhN215wmdtwRyMSrTTSv7X4OuE6DKF8Rh_0CXkPV1Hcy3R4fLXwC44-J27waWw-ddV6ybAqRfbDMCAmGDpdGmr5IrnUWVPr29YlSsltBM_5yh72LkdzSTWNkuiVC2vSryhge0Rx1Aackm137cMtgUv' }}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              </View>
              <Text style={styles.userName}>Leo B.</Text>
              <View style={styles.zoneInfo}>
                <MaterialIcons name="local-florist" size={16} color={COLORS.primary} />
                <Text style={styles.zoneText}>Jungle Safari Zone</Text>
              </View>
            </View>

            {/* Pass Details */}
            <View style={styles.passDetailsContainer}>
              <View style={styles.passDetailBox}>
                <Text style={styles.passDetailLabel}>PASS TYPE</Text>
                <Text style={styles.passDetailValue}>Full Day Pass</Text>
              </View>
              <View style={styles.passDetailBox}>
                <Text style={styles.passDetailLabel}>EXPIRY</Text>
                <Text style={styles.passDetailValue}>6:00 PM Today</Text>
              </View>
            </View>
          </View>

          {/* Secondary/Error State Reference */}
          <View style={styles.errorReferenceCard}>
            <View style={styles.errorIconContainer}>
              <MaterialIcons name="error" size={24} color={COLORS.error} />
            </View>
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorTitle}>Invalid Token Issue?</Text>
              <Text style={styles.errorSubtitle}>If the pass shows red, it means the session is expired or invalid.</Text>
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
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  successCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.slate900,
    marginBottom: 8,
  },
  userInfoCard: {
    width: '100%',
    marginTop: 24,
    backgroundColor: COLORS.slate50,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate100,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.slate900,
    marginBottom: 4,
  },
  zoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  passDetailsContainer: {
    width: '100%',
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passDetailBox: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.slate50,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  passDetailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  passDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate900,
    marginTop: 4,
  },
  errorReferenceCard: {
    marginTop: 32,
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
  },
  errorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.error,
  },
  errorSubtitle: {
    fontSize: 12,
    color: COLORS.slate600,
    marginTop: 2,
  },
});
