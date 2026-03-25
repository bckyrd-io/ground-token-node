import { COLORS } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header Branding */}
                <View style={styles.header}>
                    <Text style={styles.brandName}>Gelato Kids</Text>
                    <Text style={styles.brandTagline}>Safe & Fun Play Access</Text>
                </View>

                {/* Carousel Section */}
                <View style={styles.carouselSection}>
                    <View style={styles.imageCard}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-EQTv8gx-hbSbKHSpQsW6rzQ3ZR-jTiO0E12I4FnshOYqFDfM9RGXoD32soKCpA7o2wMt0-KPwHTKfUaCtErPWWXu_dE3WdAsuRpbVjy_5uvgCOhuHjep0FExKS_l7HRC3mMqi9QWVwB9k8qt5Wzjw_XfUSMBGukXuhUIyJO3JOsEOqT-nYKXVGtnqkXLaUbZLmxTnuM3cdbKH-E5V7h72643HcU9rK5lft-2Y97pJzAEHkh54wxwUqZmi3ylqri7kgsIFrBXf41A' }}
                            style={styles.heroImage}
                            contentFit="cover"
                        />
                    </View>
                    <Text style={styles.slideTitle}>Bouncy Adventures</Text>
                    <Text style={styles.slideDescription}>
                        Jump into excitement with our high-safety trampoline zones.
                    </Text>

                    {/* Carousel Indicators */}
                    <View style={styles.indicators}>
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.9}
                        onPress={() => router.push('/(visitor-tabs)/activityCatalogScreen')}
                    >
                        <Text style={styles.primaryButtonText}>Browse Play Zones</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/staffLoginScreen')}
                    >
                        <Text style={styles.secondaryLink}>Staff Login</Text>
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
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: 32,
    },
    brandName: {
        fontSize: 30,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    brandTagline: {
        fontSize: 14,
        color: COLORS.slate500,
        fontWeight: '500',
        marginTop: 8,
    },
    carouselSection: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageCard: {
        width: width - 48,
        aspectRatio: 4 / 3,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    slideTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.slate900,
        marginTop: 16,
    },
    slideDescription: {
        fontSize: 14,
        color: COLORS.slate500,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    indicators: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.slate300,
    },
    dotActive: {
        width: 24,
        backgroundColor: COLORS.primary,
    },
    actions: {
        width: '100%',
        paddingBottom: Platform.OS === 'ios' ? 48 : 32,
        alignItems: 'center',
    },
    primaryButton: {
        width: '100%',
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryLink: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
        paddingVertical: 16,
    },
});
