import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

// Get window width for snap scrolling calculation
const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 48; // Account for container padding

const COLORS = {
  primary: '#2E7D32',
  gelatoSoftWhite: '#FAFAFA',
  white: '#ffffff',
  slate900: '#0f172a',
  slate600: '#475569',
  slate500: '#64748b',
  slate300: '#cbd5e1',
  slate100: '#f1f5f9',
};

const SLIDES = [
  {
    id: 1,
    title: 'Bouncy Adventures',
    description: 'Jump into excitement with our high-safety trampoline zones.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-EQTv8gx-hbSbKHSpQsW6rzQ3ZR-jTiO0E12I4FnshOYqFDfM9RGXoD32soKCpA7o2wMt0-KPwHTKfUaCtErPWWXu_dE3WdAsuRpbVjy_5uvgCOhuHjep0FExKS_l7HRC3mMqi9QWVwB9k8qt5Wzjw_XfUSMBGukXuhUIyJO3JOsEOqT-nYKXVGtnqkXLaUbZLmxTnuM3cdbKH-E5V7h72643HcU9rK5lft-2Y97pJzAEHkh54wxwUqZmi3ylqri7kgsIFrBXf41A'
  },
  {
    id: 2,
    title: 'Infinite Slopes',
    description: 'Dozens of slides designed for every age group.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZTIHTnHF_IUJrrWRInRBuCGhhFD9odU6z2tDgddmKm_tBLw08MKqWM_RFrr76Zz9C877BUJoLLd5MoPG8oFqe3Rvil3mfWj79umWZIaZuIPUP6Qx3SsgPmPsYLQfqkQT_P9xVePMlAYj6UjBbikycEoUkgKxVFq9ebUr810uLBDi6LPXxgt5vF-pvbLRsRfjUbDSrKHbaisiPKapUSSyGHuR-d77orbHeO0-eADmP0mERPgX8dWVF1lkREmsg_5597SnVvDxT96T5'
  },
  {
    id: 3,
    title: 'Safe Learning',
    description: 'A secure space for active learning and fun.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg4SCdDJgInsbOE_brJ5yxQd4inXsjytpjBENpKxnric0fh7l2JB9XCDIpmitlcfx_rbJwKDgI1dyhDaSpKssETveVJ-ElMgAn9EU4VLPtvargPk4R9p4VVxEZFO0AjqB7iaixPbMimp2wrESdtT480HMO5VWVvTWgqeTwTj88p2ICdw45ZCD5EV1BZU8pAVW_pHtslw8FGioRa34ATPe8CYNi8hGPbPjj6PoCl9yWxQsuTLbrUYXuXNtNZHODaWJ7XZ_7t_23Yzgp'
  }
];

export default function Onboarding() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveSlide(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Gelato Kids</Text>
          <Text style={styles.subtitle}>Safe & Fun Play Access</Text>
        </View>

        {/* Carousel Section */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
            snapToInterval={SLIDE_WIDTH + 16} // SLIDE_WIDTH + gap
            decelerationRate="fast"
          >
            {SLIDES.map((slide, index) => (
              <View 
                key={slide.id} 
                style={[
                  styles.slideWrapper, 
                  { width: SLIDE_WIDTH },
                  index !== SLIDES.length - 1 ? { marginRight: 16 } : {}
                ]}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: slide.image }}
                    style={styles.slideImage}
                    contentFit="cover"
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.slideTitle}>{slide.title}</Text>
                  <Text style={styles.slideDescription}>{slide.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Carousel Indicators */}
          <View style={styles.indicatorContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  index === activeSlide ? styles.indicatorActive : styles.indicatorInactive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Action Section */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.primaryButtonText}>Browse Play Zones</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/staff-login')}
          >
            <Text style={styles.secondaryButtonText}>Staff Login</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
    maxWidth: 448, // max-w-md equivalent
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.slate500,
    marginTop: 8,
  },
  carouselContainer: {
    width: '100%',
    marginVertical: 32,
  },
  scrollContent: {
    alignItems: 'center',
  },
  slideWrapper: {
    // align width defined dynamically
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3, // aspect-[4/3]
    borderRadius: 24, // rounded-3xl
    overflow: 'hidden',
    backgroundColor: COLORS.slate100,
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  slideDescription: {
    fontSize: 14,
    color: COLORS.slate600,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24, // Reduced from 32 so it doesn't push down
    gap: 8,
  },
  indicatorDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4, // Alternative to gap for older RN
  },
  indicatorActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  indicatorInactive: {
    width: 8,
    backgroundColor: COLORS.slate300,
  },
  footer: {
    width: '100%',
    marginBottom: 32,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
