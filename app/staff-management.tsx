import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
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

// Mock Data
const STAFF = [
  {
    id: 1,
    name: 'Alice Henderson',
    activity: 'Trampoline Park',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC29lEbjgXczTBNVT9obxDQ4lyTWXoy8l8s2MVSi5T8q-PbNHwm8v4tnsFBBbovO24YvqtOJRXVI8Y4Ma-XbfTE4b_Z5tvUrm0S-vePxDUSg2y2zs9ImY2fytVir9jTj9yQEwDWtuP1yh4CgeNqZXforin5bqyWG_uhxMGFj5mPY03EHRbM7hPmEXrfn50uSUhPTNgRA2KL3RtSuVZM4sQUTwUSFtmFpWpQh4Htubsdu3KI7xB6FXxu9lVDJ2WLoW6xk-YDkvC9q6pR'
  },
  {
    id: 2,
    name: 'Marcus Thompson',
    activity: 'Ball Pit',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-FfnnJw8mL4hbkUGdwrhpD6R3GyuGxEW1gEMm5oaVT-wf4XJbdQuHEE1iT1QpO01bsysGqhUYtC8q8HjICXJlXj2m77Q84ftGsoOs2_XAA-oz_wY817StBvL8oBSLs___MS8qb2BksixRPaJDrO7OSlH3kI7YrJltFVfuod1gqGXiAlGB8djCabsyRc3TI9TevUxlXdMtq3SfrTQ193xs0LjqtXemdAybh2A5J2_JfLKrEmR6qNwkA3rPXi1H0PIKpQUfbeg9jrd3'
  },
  {
    id: 3,
    name: 'Sarah Jenkins',
    activity: 'Slide Zone',
    status: 'Off-Duty',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr8lcKsgUV5wV-VcEpvQq6MIlyshS9PH3QxEm2xG5koGSzd7WOb38-Rx7vd0UG0LXcCwf5sfdHeq4JfN0LSKK2zDMinAWayssfy_1eF9JpCodqD1RAdT5kdxUD6F_wTmtxw727ulCyBkGhN47wxTjPR1w8CCV605IRsOaFZZfjcMoBcUtimY9T3AVfizQuWVtlbcWv2iJ_1bmlgcuKOTYgT8tmb9euQBN8Elp_i1ik4nuoaVcp_G1kKRHYLWkvo4rLnRwDN6lbkSU4'
  },
  {
    id: 4,
    name: 'David Chen',
    activity: 'Trampoline Park',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrG9a386F8T4F0SfzvHVulBezLthnuZFKxlTCA3i0SS50x4yhU9kdtnPY4KMhs_y7uD6vcrmllx7ukISSCz762mVrQQaESVkN7rswvQh7P7zdiX07xFxYSuMfv-kkLpSDo3Zh68kC4CexjhubgvbUoxjcp4wn1TmbiWmfj36tK6HTcX_GAEnrEcEwq3PKSuk0hnSul38nWrm2PAKVK4YhC2fPkt_D1Q3hGuhVSkNIP04wXn-k58ZoStmSUZ0mrhPsvB4oy9BROtitZ'
  }
];

export default function StaffManagement() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Staff Management</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="more-vert" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Summary Card */}
          <View style={styles.summaryContainer}>
            <View style={styles.dutyCard}>
              <Text style={styles.dutyLabel}>ON DUTY</Text>
              <Text style={styles.dutyValue}>5</Text>
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.registerButton}>
              <MaterialIcons name="add" size={24} color={COLORS.primary} style={styles.addIcon} />
              <Text style={styles.registerButtonText}>Register New Staff</Text>
            </TouchableOpacity>
          </View>

          {/* Staff List Section */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Staff Members</Text>
          </View>

          <View style={styles.staffList}>
            {STAFF.map((staff) => (
              <View 
                key={staff.id} 
                style={[
                  styles.staffCard,
                  staff.status === 'Off-Duty' ? styles.staffCardInactive : {}
                ]}
              >
                <Image
                  source={{ uri: staff.image }}
                  style={[
                    styles.staffImage,
                    staff.status === 'Off-Duty' ? styles.imageGrayscale : {}
                  ]}
                  contentFit="cover"
                />
                
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{staff.name}</Text>
                  <Text style={styles.staffActivity}>{staff.activity}</Text>
                </View>

                <View style={[
                  styles.statusBadge,
                  staff.status === 'Off-Duty' ? styles.statusBadgeInactive : styles.statusBadgeActive
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    staff.status === 'Off-Duty' ? styles.statusBadgeTextInactive : styles.statusBadgeTextActive
                  ]}>
                    {staff.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="grid-view" size={24} color={COLORS.slate400} />
             <Text style={styles.navText}>Activities</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="group" size={24} color={COLORS.primary} />
             <Text style={[styles.navText, styles.navTextActive]}>Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="bar-chart" size={24} color={COLORS.slate400} />
             <Text style={styles.navText}>Reports</Text>
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
    backgroundColor: COLORS.primary,
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
    height: 64,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  summaryContainer: {
    padding: 16,
  },
  dutyCard: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.2)',
  },
  dutyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dutyValue: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.slate900,
    marginTop: 4,
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
  },
  addIcon: {
    marginRight: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  staffList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12, // Appreciate gap fallback
  },
  staffCardInactive: {
    opacity: 0.75,
  },
  staffImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  imageGrayscale: {
    opacity: 0.8,
    // Add grayscale filter logic here if expo-image supports it,
    // or typically use a tintColor on simple images. Not standard supported by React Native Image without Native modules for full CSS grayscale.
  },
  staffInfo: {
    flex: 1,
    marginLeft: 16,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  staffActivity: {
    fontSize: 14,
    color: COLORS.slate500,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  statusBadgeInactive: {
    backgroundColor: COLORS.slate100,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadgeTextActive: {
    color: COLORS.primary,
  },
  statusBadgeTextInactive: {
    color: COLORS.slate500,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.slate500,
    marginTop: 4,
  },
  navTextActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
