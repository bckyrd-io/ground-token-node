import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  softGray: '#F5F5F5',
  white: '#FFFFFF',
  slate900: '#111827',
  slate800: '#1f2937',
  slate500: '#6b7280',
  slate400: '#9ca3af',
  slate200: '#e5e7eb',
  slate100: '#f3f4f6',
  orange600: '#ea580c',
  green50: '#f0fdf4',
  green500: '#22c55e',
};

export default function StaffDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Main Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Staff Dashboard</Text>
            <Text style={styles.headerSubtitle}>Gelato Kids Play Access</Text>
          </View>
          <View>
            <View style={styles.zoneIndicator}>
              <Text style={styles.zoneText}>ZONE: JUNGLE SAFARI</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent}>
          {/* Quick Stats Section */}
          <View style={styles.quickStatsContainer}>
            {/* Current Kids Tile */}
            <View style={styles.statTile}>
              <Text style={styles.statLabel}>CURRENT KIDS</Text>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statSubText}>Capacity: 40</Text>
            </View>
            
            {/* Queue Count Tile */}
            <View style={styles.statTile}>
              <Text style={[styles.statLabel, { color: COLORS.orange600 }]}>QUEUE COUNT</Text>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statSubText}>Est: 15 mins</Text>
            </View>
          </View>

          {/* Zone Controls */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>ZONE MANAGEMENT</Text>
            <View style={styles.managementCard}>
              <View style={styles.managementCardHeader}>
                <View>
                  <Text style={styles.cardTitle}>Jungle Safari Zone</Text>
                  <Text style={styles.cardSubtitle}>Supervising: Sarah M. & John D.</Text>
                </View>
                {/* Pulse indicator simulation */}
                <View style={styles.pulseIndicator} />
              </View>
              
              <View style={styles.managementCardBody}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Check-In New</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>View Guest List</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.activityList}>
              {/* Activity Item 1 */}
              <View style={styles.activityItem}>
                <View style={styles.activityInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>LB</Text>
                  </View>
                  <View>
                    <Text style={styles.activityName}>Leo B. <Text style={styles.activityId}>#4920</Text></Text>
                    <Text style={styles.activityTime}>Checked out • 2 mins ago</Text>
                  </View>
                </View>
                <Text style={styles.statusEnded}>SESSION ENDED</Text>
              </View>
              
              {/* Activity Item 2 */}
              <View style={styles.activityItem}>
                <View style={styles.activityInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>AP</Text>
                  </View>
                  <View>
                    <Text style={styles.activityName}>Ava P. <Text style={styles.activityId}>#4925</Text></Text>
                    <Text style={styles.activityTime}>Checked in • 12 mins ago</Text>
                  </View>
                </View>
                <Text style={styles.statusActive}>ACTIVE</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="grid-view" size={24} color={COLORS.primary} />
             <Text style={[styles.navText, styles.navTextActive]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="people-outline" size={24} color={COLORS.slate400} />
             <Text style={styles.navText}>Queue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="settings" size={24} color={COLORS.slate400} />
             <Text style={styles.navText}>Settings</Text>
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
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  zoneIndicator: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  zoneText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statTile: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.slate800,
  },
  statSubText: {
    fontSize: 10,
    color: COLORS.slate400,
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  managementCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  managementCardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.slate800,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.slate500,
    marginTop: 2,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green500,
  },
  managementCardBody: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 6,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 6,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  activityList: {
    gap: 8,
  },
  activityItem: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.softGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate800,
  },
  activityId: {
    fontSize: 10,
    fontWeight: '400',
    color: COLORS.slate400,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.slate500,
    marginTop: 2,
  },
  statusEnded: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate400,
  },
  statusActive: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
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
  },
  navItem: {
    alignItems: 'center',
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
