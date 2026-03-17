import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Constants for theme colors
const COLORS = {
  primary: '#2E7D32',
  backgroundLight: '#ffffff',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber600: '#d97706',
  amber700: '#b45309',
  amber800: '#92400e',
};

export default function PlayTimer() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="close" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Play Timer</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="help-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Timer Section */}
          <View style={styles.timerSection}>
            <View style={styles.timerContainer}>
              <View style={styles.timerContent}>
                <Text style={styles.timerText}>24:59</Text>
                <Text style={styles.timerLabel}>REMAINING</Text>
              </View>
            </View>
          </View>

          {/* Active Details Card */}
          <View style={styles.activeDetailsCard}>
            <View style={styles.detailsHeader}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="child-care" size={32} color="#fff" />
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsSubtitle}>CURRENTLY PLAYING</Text>
                <Text style={styles.detailsTitle}>Token: #GT-4829</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.zoneContainer}>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsSubtitle}>ACTIVE ZONE</Text>
                <Text style={styles.zoneTitle}>Jungle Safari Zone</Text>
              </View>
              <View style={styles.zoneImageContainer}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsaoPUFbzfH8r-O2UdSe5u8L6Q3oWWk9qwwtDzIyw-8xOP4G8A1zhCpblDiBbxYI8wEXaF6TuFkcYtms9NID3UcL16uiusKcqFCY7s1X0Wf2wQGdWF3KXOKqPjK2YrmYYux8bVMLzlPNH3qQLpDF5M8qyL42yetZYg_boGZw9tSRgQZXTqMloiujdHzETStDeQsavn3x1QTcmZill3S1dPJuW1AAef-CkX1QmF6LUEZnxrCiBot1BQD-YlNbNdvooQXEaxBOwvh1zp' }}
                  style={styles.zoneImage}
                  contentFit="cover"
                />
              </View>
            </View>
          </View>

          {/* Reminder/Tip Card */}
          <View style={styles.reminderCard}>
            <MaterialIcons name="warning" size={24} color={COLORS.amber600} style={styles.reminderIcon} />
            <View style={styles.reminderTextContainer}>
              <Text style={styles.reminderTitle}>Safety Reminder</Text>
              <Text style={styles.reminderText}>
                Please ensure the Token holder stays within the Jungle Safari Zone boundaries. Staff are available at the entrance for assistance.
              </Text>
            </View>
          </View>
        </ScrollView>
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
    paddingTop: 24,
    paddingBottom: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  timerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  timerContainer: {
    width: 256,
    height: 256,
    borderRadius: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  timerText: {
    fontSize: 60,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(46, 125, 50, 0.7)', // primary / 70
    letterSpacing: 1.5,
    marginTop: 4,
  },
  activeDetailsCard: {
    backgroundColor: 'rgba(46, 125, 50, 0.05)', // primary/5
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.1)',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailsTextContainer: {
    flex: 1,
  },
  detailsSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(46, 125, 50, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    width: '100%',
    marginBottom: 16,
  },
  zoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  zoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  zoneImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.slate200,
  },
  zoneImage: {
    width: '100%',
    height: '100%',
  },
  reminderCard: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.amber50,
    borderWidth: 1,
    borderColor: COLORS.amber100,
  },
  reminderIcon: {
    marginRight: 12,
  },
  reminderTextContainer: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.amber800,
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 14,
    color: COLORS.amber700,
    lineHeight: 20,
  },
});
