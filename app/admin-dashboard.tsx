import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2E7D32',
  backgroundLight: '#FFFFFF',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  white: '#ffffff',
  green700: '#15803d',
};

// Mock Data for Bar Chart
const CHART_DATA = [
  { day: 'MON', percentage: 45, type: 'light' },
  { day: 'TUE', percentage: 35, type: 'light' },
  { day: 'WED', percentage: 55, type: 'light' },
  { day: 'THU', percentage: 50, type: 'light' },
  { day: 'FRI', percentage: 95, type: 'solid' },
  { day: 'SAT', percentage: 100, type: 'solid' },
  { day: 'SUN', percentage: 75, type: 'medium' },
];

export default function AdminDashboard() {
  const router = useRouter();

  const getBarStyle = (type: string, percentage: number) => {
    let backgroundColor = 'rgba(46, 125, 50, 0.2)'; // light
    if (type === 'solid') backgroundColor = COLORS.primary;
    if (type === 'medium') backgroundColor = 'rgba(46, 125, 50, 0.6)';

    return {
      height: `${percentage}%` as any,
      backgroundColor,
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="more-vert" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Statistics Section */}
          <View style={styles.statsSection}>
            <View style={styles.revenueCard}>
              <Text style={styles.revenueLabel}>TOTAL REVENUE</Text>
              <View style={styles.revenueAmountContainer}>
                <Text style={styles.currency}>MWK</Text>
                <Text style={styles.amount}>1,250,000</Text>
              </View>
              <View style={styles.trendContainer}>
                <MaterialIcons name="trending-up" size={18} color={COLORS.primary} />
                <Text style={styles.trendText}>+12% vs last month</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.exportButton}>
              <MaterialIcons name="download" size={24} color={COLORS.white} />
              <Text style={styles.exportButtonText}>Export Report</Text>
            </TouchableOpacity>
          </View>

          {/* Visitor Volume Card */}
          <View style={styles.volumeCard}>
            <View style={styles.volumeHeader}>
              <View>
                <Text style={styles.volumeTitle}>Visitor Volume</Text>
                <Text style={styles.volumeSubtitle}>Weekly Attendance Distribution</Text>
              </View>
              <View style={styles.volumeControls}>
                <TouchableOpacity style={styles.navButton}>
                  <MaterialIcons name="chevron-left" size={20} color={COLORS.slate900} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                  <MaterialIcons name="chevron-right" size={20} color={COLORS.slate900} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Chart Area */}
            <View style={styles.chartArea}>
              {CHART_DATA.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={[styles.bar, getBarStyle(item.type, item.percentage)]}>
                    {item.type === 'solid' && (
                      <View style={styles.barShadow} />
                    )}
                  </View>
                  <Text style={[
                     styles.dayLabel, 
                     item.type === 'solid' ? styles.dayLabelActive : {}
                  ]}>
                    {item.day}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.insightText}>
              Peak visitation identified on <Text style={styles.insightHighlight}>Fridays</Text> and <Text style={styles.insightHighlight}>Saturdays</Text>
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="dashboard" size={24} color={COLORS.primary} />
             <Text style={[styles.navText, styles.navTextActive]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="directions-run" size={24} color={COLORS.slate400} /> {/* closest to sprint */}
             <Text style={styles.navText}>Activities</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="people" size={24} color={COLORS.slate400} />
             <Text style={styles.navText}>Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
             <MaterialIcons name="insert-chart-outlined" size={24} color={COLORS.slate400} />
             <Text style={styles.navText}>Reports</Text>
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
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statsSection: {
    marginBottom: 24,
  },
  revenueCard: {
    backgroundColor: COLORS.white,
    padding: 24,
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
  revenueLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  revenueAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  currency: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate400,
    marginRight: 8,
  },
  amount: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 4,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  exportButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  volumeCard: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  volumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  volumeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  volumeSubtitle: {
    fontSize: 14,
    color: COLORS.slate500,
    marginTop: 2,
  },
  volumeControls: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 8,
    marginLeft: 8, // Using margin since gap might not work on older RN
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 192,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    paddingHorizontal: 4,
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'relative',
  },
  barShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // Approximate shadow implementation
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.slate400,
    marginTop: 8,
  },
  dayLabelActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  insightText: {
    fontSize: 12,
    color: COLORS.slate500,
    textAlign: 'center',
    marginTop: 24,
  },
  insightHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
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
    height: Platform.OS === 'ios' ? 84 : 64, // accounting for safe area manually
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.slate400,
    marginTop: 4,
  },
  navTextActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
