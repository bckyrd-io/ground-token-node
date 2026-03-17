import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Platform, TextInput } from 'react-native';
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
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
};

// Mock Data
const CATALOG = [
  {
    id: 1,
    title: 'Trampoline Park',
    type: 'High Energy',
    ageRange: '4-12 yrs',
    status: 'Available',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6eIehmaJu-d2Gd4D_d5XWqnPmkMlpEMvlmLUTuZ70B159hd0cQl4zKvpQ9pEm-Y0X-swTLjL85Zt9RIijJcG2bsOWBcGc0_4EN9_ivCvVjRPPdTSbeMyrXwkGs5qR8eD6QFrafpZAR6jcygaglRcx9B7MMEo0Gjr0nh-BFjhRxuI8HiVhjvjexwJtqhWiyTxHt3dhUYkebXHLMoUL9kMuMSwiNYL32F1VSSYntt2extDe47TVpNrqhEHFRZ8BIr0ZKVNIyuX9BMxP',
  },
  {
    id: 2,
    title: 'Ball Pit Explorer',
    type: 'Interactive',
    ageRange: '2-6 yrs',
    status: 'Available',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFoJ0uQzR1H60pD1M1WzLgNmsO6x-1UvYq1-E-X0H5G5uXW2eH6S6Fv_mYgG4sS9mR3yI6e3e_5JqDbb4G_4O7l8-eT1YQGtvB3r5O2i_tNfF0Hk7oVx3lOYn_S0tA6j3lVb1m8kU0o1Gj1h3m7a_7E59bTqyY0-zH5Wz6xT0228hS2A4WqEa-N9T60BwI2W7JmO0tYfWv_dK7E4w1vNb4y67y3zGvQ6D3l8G0W6QY1-uBw4uH5n5ZqA9s1D0',
  },
  {
    id: 3,
    title: 'Ninja Warrior Course',
    type: 'Physical Challenge',
    ageRange: '6-14 yrs',
    status: 'Waitlist',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg4SCdDJgInsbOE_brJ5yxQd4inXsjytpjBENpKxnric0fh7l2JB9XCDIpmitlcfx_rbJwKDgI1dyhDaSpKssETveVJ-ElMgAn9EU4VLPtvargPk4R9p4VVxEZFO0AjqB7iaixPbMimp2wrESdtT480HMO5VWVvTWgqeTwTj88p2ICdw45ZCD5EV1BZU8pAVW_pHtslw8FGioRa34ATPe8CYNi8hGPbPjj6PoCl9yWxQsuTLbrUYXuXNtNZHODaWJ7XZ_7t_23Yzgp',
  }
];

export default function ActivityCatalog() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'High Energy', 'Interactive', 'Toddler'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity Catalog</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="filter-list" size={24} color={COLORS.slate900} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} stickyHeaderIndices={[0]}>
          {/* Search Bar - Sticky */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={24} color={COLORS.slate400} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search activities..."
                placeholderTextColor={COLORS.slate400}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
              <View style={styles.filtersContainer}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      activeFilter === filter ? styles.filterChipActive : {}
                    ]}
                    onPress={() => setActiveFilter(filter)}
                  >
                    <Text style={[
                      styles.filterText,
                      activeFilter === filter ? styles.filterTextActive : {}
                    ]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Catalog Grid */}
          <View style={styles.gridContainer}>
            {CATALOG.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                    contentFit="cover"
                  />
                  <View style={styles.badgeContainer}>
                    <View style={[
                      styles.statusBadge,
                      item.status === 'Waitlist' ? styles.statusWaitlist : styles.statusAvailable
                    ]}>
                      <Text style={[
                        styles.statusText,
                        item.status === 'Waitlist' ? styles.statusTextWaitlist : styles.statusTextAvailable
                      ]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardType}>{item.type}</Text>
                  
                  <View style={styles.cardFooter}>
                    <View style={styles.ageContainer}>
                      <MaterialIcons name="child-care" size={16} color={COLORS.slate500} />
                      <Text style={styles.ageText}>{item.ageRange}</Text>
                    </View>
                    <TouchableOpacity style={styles.viewButton}>
                       <MaterialIcons name="arrow-forward" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
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
    padding: 8,
    borderRadius: 9999,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  iconButton: {
    padding: 8,
    borderRadius: 9999,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  searchSection: {
    backgroundColor: COLORS.backgroundLight,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.slate900,
  },
  filtersScroll: {
    paddingHorizontal: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8, // fallback to marginRight on children if needed below
    paddingRight: 32, // to ensure last item is fully visible
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginRight: 8, // fallback for gap
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.slate600,
  },
  filterTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  gridContainer: {
    padding: 16,
    gap: 16, // fallback to marginBottom
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.slate200,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16, // fallback for gap
  },
  imageContainer: {
    width: '100%',
    height: 192,
    position: 'relative',
    backgroundColor: COLORS.slate200,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusAvailable: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  statusWaitlist: {
    backgroundColor: 'rgba(234, 88, 12, 0.95)', // orange-600
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusTextAvailable: {
    color: COLORS.primary,
  },
  statusTextWaitlist: {
    color: COLORS.white,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.slate900,
    marginBottom: 4,
  },
  cardType: {
    fontSize: 14,
    color: COLORS.slate500,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageText: {
    fontSize: 14,
    color: COLORS.slate600,
    marginLeft: 6,
    fontWeight: '500',
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
