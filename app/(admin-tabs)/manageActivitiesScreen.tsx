import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store';

export default function ManageActivitiesScreen() {
    const router = useRouter();
    const { adminActivities, fetchAdminActivities } = useStore();

    useFocusEffect(
        useCallback(() => {
            fetchAdminActivities();
        }, [fetchAdminActivities])
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
 

            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={() => router.push('/addActivityScreen')}>
                <MaterialIcons name="add" size={20} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add New Activity</Text>
            </TouchableOpacity>

            {/* Activity List */}
            <View style={styles.activityList}>
                {adminActivities.map((activity) => (
                    <View key={activity.id} style={styles.activityCard}>
                        <Image source={{ uri: activity.image }} style={styles.activityImage} contentFit="cover" />
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityName}>{activity.name}</Text>
                            <View style={styles.capacityRow}>
                                <MaterialIcons name="group" size={14} color={COLORS.primary} />
                                <Text style={styles.capacityText}>Capacity: {activity.capacity}</Text>
                            </View>
                            <View style={styles.progressBg}>
                                <View style={[styles.progressFill, { width: `${activity.percent}%` }]} />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    scrollContent: { padding: 16, paddingBottom: 32, gap: 16 },
    summaryCard: {
        padding: 16, backgroundColor: 'rgba(46,125,50,0.1)', borderRadius: 16,
    },
    summaryLabel: { fontSize: 14, fontWeight: '500', color: COLORS.primary },
    summaryValue: { fontSize: 24, fontWeight: '700', color: COLORS.slate900, marginTop: 4 },
    addButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: COLORS.primary, borderRadius: 16,
        height: 56, backgroundColor: 'transparent',
    },
    addButtonText: { fontSize: 16, fontWeight: '600', color: COLORS.primary, marginLeft: 8 },
    activityList: { gap: 16 },
    activityCard: {
        flexDirection: 'row', alignItems: 'center', gap: 16,
        backgroundColor: COLORS.white, padding: 16, borderRadius: 16,
        borderWidth: 1, borderColor: COLORS.slate100,
    },
    activityImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: COLORS.slate200 },
    activityInfo: { flex: 1 },
    activityName: { fontSize: 18, fontWeight: '700', color: COLORS.slate900 },
    capacityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    capacityText: { fontSize: 14, color: COLORS.slate600, fontWeight: '500' },
    progressBg: { width: '100%', height: 6, backgroundColor: COLORS.slate100, borderRadius: 9999, marginTop: 8, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: COLORS.primary },
});
