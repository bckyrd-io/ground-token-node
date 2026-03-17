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
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
};

// Mock Data
const ACTIVITIES = [
  {
    id: 1,
    title: 'Trampoline Park',
    capacity: '25/40',
    capacityPercent: 62.5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBM6BoXpFRfq4L3idPdVAezYQtejMLs92T1H76rWrc4B-dJacAutWZfqPSQN88EDeFMxAzpDB8rNpNbX6-Aw7j-yn7YOu1ABpujBjVyOIMCtRoeWVZfQlfoHLYYiWigpGUkVQPCXpGgSA65986Jg_AOB9ZtGxalHY270JllEpeaXe9HqeDjHiAwplmu-Ev8QCKFfFYM8KYJeEn9coITM0-JqP1lZ0HTd-vKopLrDMHrdaLYk4meJaO_A1DdBeCxAvqOgoKksEPsCNr'
  },
  {
    id: 2,
    title: 'Ball Pit',
    capacity: '15/20',
    capacityPercent: 75,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsRGhdJ6IWpQxzbYQV2ciFrYIswv6IS-b4GjOx1Pg8fwERnZ5_WK2LEL-JSWVvccLJWAnFXDo62m_cefjXLuPYOzp_n2M_e406S7d17fViX3olZd1pNh6BJx2Tytk5KP_Gr5HEmjETr3FzCAzWiIdOlgoc25flt2WYyrlf_ibwbM_xepChgUbjWhGEp8kLXEyP80EiyLUK-7sVn4YvjOhVwMA7UBAa8KeepyTXcfnASwf-9-jpDdHXrDUmwVBnLIEarb1btrbNdf2f'
  },
  {
    id: 3,
    title: 'Slide Zone',
    capacity: '10/30',
    capacityPercent: 33.3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg4SCdDJgInsbOE_brJ5yxQd4inXsjytpjBENpKxnric0fh7l2JB9XCDIpmitlcfx_rbJwKDgI1dyhDaSpKssETveVJ-ElMgAn9EU4VLPtvargPk4R9p4VVxEZFO0AjqB7iaixPbMimp2wrESdtT480HMO5VWVvTWgqeTwTj88p2ICdw45ZCD5EV1BZU8pAVW_pHtslw8FGioRa34ATPe8CYNi8hGPbPjj6PoCl9yWxQsuTLbrUYXuXNtNZHODaWJ7XZ_7t_23Yzgp'
  }
];

export default function ManageActivities() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top App Bar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Manage Activities</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="more-vert" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Summary Section with Integrated Add Button */}
          <View style={styles.summaryContainer}>
            <View style={styles.capacityCard}>
              <Text style={styles.capacityLabel}>Total Capacity</Text>
              <Text style={styles.capacityValue}>50/90</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <MaterialIcons name="add" size={24} color={COLORS.primary} style={styles.addIcon} />
              <Text style={styles.addButtonText}>Add New Activity</Text>
            </TouchableOpacity>
          </View>

          {/* Activity List */}
          <View style={styles.activityList}>
            {ACTIVITIES.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityImageContainer}>
                  <Image
                    source={{ uri: activity.image }}
                    style={styles.activityImage}
                    contentFit="cover"
                  />
                </View>
                
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle} numberOfLines={1}>{activity.title}</Text>
                  
                  <View style={styles.capacityContainer}>
                    <MaterialIcons name="group" size={16} color={COLORS.primary} />
                    <Text style={styles.capacityText}>Capacity: {activity.capacity}</Text>
                  </View>
                  
                  {/* Capacity Bar */}
                  <View style={styles.capacityBarTrack}>
                    <View style={[styles.capacityBarFill, { width: `${activity.capacityPercent}%` }]} />
                  </View>
                </View>
                
                <TouchableOpacity style={styles.editButton}>
                  <MaterialIcons name="edit" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="dashboard" size={24} color={COLORS.primary} />
             <Text style={[styles.navText, styles.navTextActive]}>Activities</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="calendar-today" size={24} color={COLORS.slate400} />
             <Text style={styles.navText}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="analytics" size={24} color={COLORS.slate400} />
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
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
    padding: 16,
    paddingBottom: 100,
  },
  summaryContainer: {
    marginBottom: 24,
  },
  capacityCard: {
    padding: 16,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    borderRadius: 16,
    marginBottom: 16,
  },
  capacityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  capacityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.slate900,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.slate200,
  },
  activityImage: {
    width: '100%',
    height: '100%',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  capacityText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.slate600,
    marginLeft: 8,
  },
  capacityBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.slate100,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.slate500,
    marginTop: 4,
  },
  navTextActive: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});
