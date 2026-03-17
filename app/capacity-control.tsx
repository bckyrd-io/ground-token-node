import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Platform, Switch, ImageBackground } from 'react-native';
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
  black: '#000000',
  green800: '#166534',
};

export default function CapacityControl() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.slate700} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Capacity Control</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.zoneTitle}>Jungle Safari Zone</Text>
          <Text style={styles.zoneSubtitle}>Managed by Gelato Kids Staff</Text>
        </View>

        {/* Status Toggle */}
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusTitle}>Play Area Status</Text>
            <Text style={styles.statusActiveText}>
              {isAvailable ? 'Currently Available' : 'Currently Unavailable'}
            </Text>
          </View>
          <Switch
            trackColor={{ false: COLORS.slate200, true: COLORS.primary }}
            thumbColor={COLORS.white}
            ios_backgroundColor={COLORS.slate200}
            onValueChange={() => setIsAvailable(!isAvailable)}
            value={isAvailable}
          />
        </View>

        {/* Capacity Detail Section */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.detailLabel}>CURRENT OCCUPANCY</Text>
              <Text style={styles.detailValue}>
                42 <Text style={styles.detailValueSub}>/ 50 kids</Text>
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>84% Full</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '84%' }]} />
          </View>
          <Text style={styles.progressHelper}>8 spots remaining</Text>
        </View>

        {/* Grid Stats */}
        <View style={styles.gridContainer}>
          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>WAIT LIST</Text>
            <View style={styles.gridValueContainer}>
              <MaterialIcons name="groups" size={24} color={COLORS.primary} />
              <Text style={styles.gridValue}>8 <Text style={styles.gridValueSub}>kids</Text></Text>
            </View>
          </View>
          
          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>EST. WAIT</Text>
            <View style={styles.gridValueContainer}>
              <MaterialIcons name="schedule" size={24} color={COLORS.primary} />
              <Text style={styles.gridValue}>15 <Text style={styles.gridValueSub}>min</Text></Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={24} color={COLORS.white} />
          <Text style={styles.refreshButtonText}>Refresh Data</Text>
        </TouchableOpacity>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <ImageBackground
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBno8XAFBPNUOUPQUm313QJGOhfThx8y-96N0xFS7OskkYujrlDS0LMyaz2tYo5raa64jAr3uZz-zYK449OSzwqvH3K1-TTMStH45eWwYIn2hm6Ar2gGYu_X2h7JRI8lf5N29DImn519bg-gMPat27lU4JwQm0uQtq3Qiphpcrk1d8N4j5KRlcwmj5jJm-7HaNg5ZXO-7u9Y8SJdUvM6RC7bg9lpCxrAeLA8Bw3HV_kNHdjrYCedoVAqR80saLqsgMt5PtTUDZN99s5' }}
            style={styles.cameraImage}
            imageStyle={{ opacity: 0.8 }}
          >
            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraText}>Zone View: Camera 04</Text>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="qr-code-scanner" size={24} color={COLORS.slate400} />
          <Text style={styles.navText}>SCANNER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="analytics" size={24} color={COLORS.primary} />
          <Text style={[styles.navText, styles.navTextActive]}>CAPACITY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="history" size={24} color={COLORS.slate400} />
          <Text style={styles.navText}>HISTORY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="child-care" size={24} color={COLORS.slate400} />
          <Text style={styles.navText}>GUESTS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="settings" size={24} color={COLORS.slate400} />
          <Text style={styles.navText}>SETTINGS</Text>
        </TouchableOpacity>
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
    borderRadius: 9999,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  titleSection: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  zoneTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  zoneSubtitle: {
    fontSize: 14,
    color: COLORS.slate500,
    marginTop: 4,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  statusActiveText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: 4,
  },
  detailCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.slate900,
    marginTop: 4,
  },
  detailValueSub: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.slate400,
  },
  badge: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarTrack: {
    width: '100%',
    height: 12,
    backgroundColor: COLORS.slate100,
    borderRadius: 6,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  progressHelper: {
    fontSize: 12,
    color: COLORS.slate500,
    textAlign: 'right',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 4,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  gridValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.slate900,
    marginLeft: 8,
  },
  gridValueSub: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.slate900,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
    marginBottom: 32,
  },
  refreshButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  cameraContainer: {
    height: 192,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.slate200,
  },
  cameraImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  cameraOverlay: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)', // Simulated gradient via semi-transparent background
  },
  cameraText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.slate400,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  navTextActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
