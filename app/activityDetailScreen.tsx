import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from './store';

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

export default function ActivityDetailScreen() {
    const router = useRouter();
    const { activityDetails, fetchActivityDetail } = useStore();
    const activity = activityDetails['1']; // Assuming id '1' for now

    useEffect(() => {
        if (!activity) {
            fetchActivityDetail('1');
        }
    }, [activity, fetchActivityDetail]);

    if (!activity) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

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
                        source={{ uri: activity.image }}
                        style={styles.heroImage}
                        contentFit="cover"
                    />
                </View>

                {/* Title & Rating */}
                <View style={styles.titleSection}>
                    <Text style={styles.activityTitle}>{activity.name}</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingScore}>{activity.rating}</Text>
                        <MaterialIcons name="star" size={20} color={COLORS.primary} />
                        <Text style={styles.ratingCount}>({activity.reviewCount} reviews)</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.descSection}>
                    <Text style={styles.description}>
                        {activity.description}
                    </Text>
                </View>

                {/* Safety Rules */}
                <View style={styles.safetyCard}>
                    <View style={styles.safetyHeader}>
                        <MaterialIcons name="gavel" size={20} color={COLORS.primary} />
                        <Text style={styles.safetyTitle}>Safety Rules</Text>
                    </View>
                    {activity.safetyRules.map((rule, index) => (
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
