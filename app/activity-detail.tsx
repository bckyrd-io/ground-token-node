import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Platform, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Get window width to ensure proper image scaling
const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2E7D32',
  backgroundLight: '#f8f6f6',
  white: '#ffffff',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
};

export default function ActivityDetail() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top App Bar */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity Detail</Text>
          <View style={{ width: 40 }} /> {/* Spacer */}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Hero Image Section */}
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6eIehmaJu-d2Gd4D_d5XWqnPmkMlpEMvlmLUTuZ70B159hd0cQl4zKvpQ9pEm-Y0X-swTLjL85Zt9RIijJcG2bsOWBcGc0_4EN9_ivCvVjRPPdTSbeMyrXwkGs5qR8eD6QFrafpZAR6jcygaglRcx9B7MMEo0Gjr0nh-BFjhRxuI8HiVhjvjexwJtqhWiyTxHt3dhUYkebXHLMoUL9kMuMSwiNYL32F1VSSYntt2extDe47TVpNrqhEHFRZ8BIr0ZKVNIyuX9BMxP' }}
              style={styles.heroImage}
              contentFit="cover"
            />
          </View>

          {/* Title and Chips */}
          <View style={styles.titleSection}>
            <Text style={styles.activityTitle}>Trampoline Park</Text>
            
            <View style={styles.chipsContainer}>
              {/* Price Chip */}
              <View style={styles.primaryChip}>
                <MaterialIcons name="payments" size={20} color={COLORS.white} />
                <Text style={styles.primaryChipText}>$12.00</Text>
              </View>
              
              {/* Wait Time Badge */}
              <View style={styles.secondaryChip}>
                <MaterialIcons name="schedule" size={20} color={COLORS.slate500} />
                <Text style={styles.secondaryChipText}>15 min wait</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              A high-energy jumping zone featuring professional-grade trampolines, foam pits, and safety nets. Perfect for burning off energy and practicing cool jumps.
            </Text>
          </View>

          {/* Safety Rules Section */}
          <View style={styles.rulesSection}>
            <View style={styles.rulesCard}>
              <View style={styles.rulesHeader}>
                <MaterialIcons name="gavel" size={24} color={COLORS.primary} />
                <Text style={styles.rulesTitle}>Safety Rules</Text>
              </View>
              
              <View style={styles.rulesList}>
                <View style={styles.ruleItem}>
                  <MaterialIcons name="check-circle" size={20} color={COLORS.primary} style={styles.ruleIcon} />
                  <Text style={styles.ruleText}>Grip socks must be worn at all times.</Text>
                </View>
                <View style={styles.ruleItem}>
                  <MaterialIcons name="check-circle" size={20} color={COLORS.primary} style={styles.ruleIcon} />
                  <Text style={styles.ruleText}>One person per trampoline.</Text>
                </View>
                <View style={styles.ruleItem}>
                  <MaterialIcons name="check-circle" size={20} color={COLORS.primary} style={styles.ruleIcon} />
                  <Text style={styles.ruleText}>No flips or somersaults into foam pits.</Text>
                </View>
                <View style={styles.ruleItem}>
                  <MaterialIcons name="check-circle" size={20} color={COLORS.primary} style={styles.ruleIcon} />
                  <Text style={styles.ruleText}>Empty pockets before jumping.</Text>
                </View>
              </View>
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
    paddingBottom: 48,
  },
  heroContainer: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.slate200,
    // Add margin and radius for tabletish responsive look based on container queries defined in html
    ...(width >= 480 && {
       paddingHorizontal: 16,
       paddingTop: 12,
    })
  },
  heroImage: {
    width: '100%',
    height: '100%',
    ...(width >= 480 && {
       borderRadius: 16,
    })
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  activityTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.slate900,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // For newer RN versions, else margin
  },
  primaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginRight: 12,
  },
  primaryChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 8,
  },
  secondaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: COLORS.slate100,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  secondaryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.slate700,
    marginLeft: 8,
  },
  descriptionSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.slate600,
  },
  rulesSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rulesCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.slate900,
    marginLeft: 8,
  },
  rulesList: {
    gap: 12, // Use if supported, else margin on items
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12, // Fallback if gap is not supported
  },
  ruleIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.slate700,
  },
});
