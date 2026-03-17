import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2E7D32',
  backgroundLight: '#f3f4f6', // gray-100
  white: '#ffffff',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
};

export default function TokenQueue() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Navigation Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Gelato Kids Play</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon}>
            <MaterialIcons name="person" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Token Card */}
          <View style={styles.tokenCard}>
            {/* Card Heading */}
            <Text style={styles.cardHeading}>Entry Token</Text>
            
            {/* QR Code Area */}
            <View style={styles.qrCodeContainer}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGnmpGUSgqZxJqH3uM-2JUWTzeIZ7b3YFbrxFCuEWi2WNqYw_6fxOXHddOogKhg37iYW4lbncCSan3PsCooKDUCPMxV_YyJ8o_mEpinHRKH4PE3jZDCXWFKUoYd9onS6_o2JnCcmETMmOMMBoVjkhLAzs9vQSSB6q50Y1g0MlV-DQeTDcB6Jc5IiSKZizlk0o_0jyPewSyJ3_EuPM2IbswbgiV-8IMGdl47Zae4Ju4wFufZ8J4RxDdCKnuvYD-rcAERWlTqNZ_3noH' }}
                style={styles.qrImage}
                contentFit="contain"
              />
              
              {/* QR Scanner corner accents */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerDots} />
              <View style={styles.cutoutLeft} />
              <View style={styles.cutoutRight} />
            </View>

            {/* Queue Status Indicator */}
            <View style={styles.queueStatusContainer}>
              <Text style={styles.queueStatusLabel}>LIVE STATUS</Text>
              <View style={styles.queueStatusBox}>
                <Text style={styles.queueStatusText}>Queue Position: #3</Text>
              </View>
              <Text style={styles.queueWaitText}>Approx. wait: 10 mins</Text>
            </View>
          </View>

          {/* Footer Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionText}>
              Please show this QR code to the attendant at the entrance when your number is called.
            </Text>
            
            <TouchableOpacity style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>Refresh Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary, // Header color extends to top safe area on iOS
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 12,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  tokenCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.slate100,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 24,
  },
  qrCodeContainer: {
    width: 240,
    height: 240,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 16,
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: COLORS.primary,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 4, // Minor rounding for aesthetics mapping the html
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 4,
  },
  dividerContainer: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 32,
  },
  dividerDots: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: COLORS.slate300,
    borderStyle: 'dashed',
  },
  cutoutLeft: {
    position: 'absolute',
    left: -12, // Half the width to overlap edge
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundLight, // Match background to look like a cutout
  },
  cutoutRight: {
    position: 'absolute',
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundLight,
  },
  queueStatusContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  queueStatusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate500,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  queueStatusBox: {
    width: '100%',
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  queueStatusText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  queueWaitText: {
    fontSize: 14,
    color: COLORS.slate400,
    marginTop: 16,
  },
  instructionsContainer: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 400,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.slate600,
    lineHeight: 22,
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 32,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    width: '100%', // Match max-width or set width
    maxWidth: 250,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
