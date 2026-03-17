import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.7;

const COLORS = {
  primary: '#2E7D32',
  backgroundLight: '#f8f6f6',
  white: '#ffffff',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  black: '#000000',
};

export default function StaffScanner() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Token</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scanner Viewport Area */}
        <View style={styles.scannerViewport}>
          {/* Mock Camera Background */}
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR5WHZBJjBcVrgNb49wkK2dyAHu_bivKxzN069Iz22XVm7zAtyuHP8GKN0XHTmSX5M0ECNkeRf-WXDbJUrysUn3nXQ0cw_5OjpCbsjjqWiq_fppHmR4RRp9nxkHWt4-FsUHfzMxps236dZJBeyM_0zgZVz8Sm2V-VPgFPXgN2RWnQ0L2Chlzg6lVSF-AfWTTwzxbsNXF3DjMcrtbOC3bjoiMTpjES4eaitHdP2MKPxvL3HYHepMHtjRClBUJ3PFUix_SLTXaGWxb-Y' }}
            style={styles.cameraBackground}
            contentFit="cover"
          />
          
          {/* Dark Overlay with "Hole" approach (using massive borders) */}
          <View style={styles.overlayContainer}>
             <View style={styles.scannerHole}>
                {/* Corner Accents */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                
                {/* Scanning Line */}
                <View style={styles.scanningLine} />
             </View>
             
             <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>Align QR code within the frame</Text>
             </View>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.footer}>
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <MaterialIcons name="qr-code-scanner" size={24} color={COLORS.primary} />
              <Text style={[styles.navText, styles.navTextActive]}>Scanner</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navItem}>
              <MaterialIcons name="history" size={24} color={COLORS.slate400} />
              <Text style={styles.navText}>History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navItem}>
              <MaterialIcons name="group" size={24} color={COLORS.slate400} />
              <Text style={styles.navText}>Guests</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navItem}>
              <MaterialIcons name="settings" size={24} color={COLORS.slate400} />
              <Text style={styles.navText}>Settings</Text>
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
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.slate900,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scannerViewport: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cameraBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent overlay
  },
  scannerHole: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
    // Using a shadow setup could also create the hole, but nesting in overlay is safer in React Native
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: COLORS.primary,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  scanningLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 4,
    backgroundColor: 'rgba(46,125,50,0.5)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  instructionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 9999,
  },
  instructionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate400,
    marginTop: 4,
  },
  navTextActive: {
    color: COLORS.primary,
  },
});
