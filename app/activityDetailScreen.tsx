import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    bgLight: '#f8f6f6',
    slate900: '#0f172a',
    slate700: '#334155',
    slate600: '#475569',
    slate500: '#64748b',
    slate400: '#94a3b8',
    slate200: '#e2e8f0',
    slate100: '#f1f5f9',
    slate800: '#1e293b',
};

const SAFETY_RULES = [
    'Grip socks must be worn at all times.',
    'One person per trampoline.',
    'No flips or somersaults into foam pits.',
    'Empty pockets before jumping.',
];

export default function ActivityDetailScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Activity Detail</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6eIehmaJu-d2Gd4D_d5XWqnPmkMlpEMvlmLUTuZ70B159hd0cQl4zKvpQ9pEm-Y0X-swTLjL85Zt9RIijJcG2bsOWBcGc0_4EN9_ivCvVjRPPdTSbeMyrXwkGs5qR8eD6QFrafpZAR6jcygaglRcx9B7MMEo0Gjr0nh-BFjhRxuI8HiVhjvjexwJtqhWiyTxHt3dhUYkebXHLMoUL9kMuMSwiNYL32F1VSSYntt2extDe47TVpNrqhEHFRZ8BIr0ZKVNIyuX9BMxP' }}
                        style={styles.heroImage}
                        contentFit="cover"
                    />
                </View>

                {/* Title & Rating */}
                <View style={styles.titleSection}>
                    <Text style={styles.activityTitle}>Trampoline Park</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingScore}>4.8</Text>
                        <MaterialIcons name="star" size={20} color={COLORS.primary} />
                        <Text style={styles.ratingCount}>(120 reviews)</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.descSection}>
                    <Text style={styles.description}>
                        A high-energy jumping zone featuring professional-grade trampolines, foam pits, and safety nets. Perfect for burning off energy and practicing cool jumps.
                    </Text>
                </View>

                {/* Safety Rules */}
                <View style={styles.safetyCard}>
                    <View style={styles.safetyHeader}>
                        <MaterialIcons name="gavel" size={20} color={COLORS.primary} />
                        <Text style={styles.safetyTitle}>Safety Rules</Text>
                    </View>
                    {SAFETY_RULES.map((rule, index) => (
                        <View key={index} style={styles.ruleRow}>
                            <MaterialIcons name="check-circle" size={18} color={COLORS.primary} />
                            <Text style={styles.ruleText}>{rule}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.slate200,
    },
    headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900, flex: 1, textAlign: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 32 },
    heroContainer: { width: '100%', height: 288, backgroundColor: COLORS.slate200 },
    heroImage: { width: '100%', height: '100%' },
    titleSection: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 },
    activityTitle: { fontSize: 30, fontWeight: '700', color: COLORS.slate900, letterSpacing: -0.5, marginBottom: 16 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    ratingScore: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
    ratingCount: { fontSize: 14, color: COLORS.slate500, fontWeight: '500' },
    descSection: { paddingHorizontal: 16, paddingVertical: 16 },
    description: { fontSize: 16, color: COLORS.slate600, lineHeight: 24 },
    safetyCard: {
        marginHorizontal: 16, backgroundColor: COLORS.white, borderRadius: 16,
        padding: 20, borderWidth: 1, borderColor: COLORS.slate100,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
        shadowRadius: 4, elevation: 2,
    },
    safetyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    safetyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900 },
    ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
    ruleText: { fontSize: 14, color: COLORS.slate700, fontWeight: '500', flex: 1, lineHeight: 20 },
});
