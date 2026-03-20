import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    bgLight: '#f8f6f6',
    slate900: '#0f172a',
    slate600: '#475569',
    slate500: '#64748b',
    slate200: '#e2e8f0',
    slate100: '#f1f5f9',
    slate800: '#1e293b',
};

const ACTIVITIES = [
    {
        id: '1', name: 'Trampoline Park',
        capacity: '25/40', percent: 62.5,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBM6BoXpFRfq4L3idPdVAezYQtejMLs92T1H76rWrc4B-dJacAutWZfqPSQN88EDeFMxAzpDB8rNpNbX6-Aw7j-yn7YOu1ABpujBjVyOIMCtRoeWVZfQlfoHLYYiWigpGUkVQPCXpGgSA65986Jg_AOB9ZtGxalHY270JllEpeaXe9HqeDjHiAwplmu-Ev8QCKFfFYM8KYJeEn9coITM0-JqP1lZ0HTd-vKopLrDMHrdaLYk4meJaO_A1DdBeCxAvqOgoKksEPsCNr',
    },
    {
        id: '2', name: 'Ball Pit',
        capacity: '15/20', percent: 75,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsRGhdJ6IWpQxzbYQV2ciFrYIswv6IS-b4GjOx1Pg8fwERnZ5_WK2LEL-JSWVvccLJWAnFXDo62m_cefjXLuPYOzp_n2M_e406S7d17fViX3olZd1pNh6BJx2Tytk5KP_Gr5HEmjETr3FzCAzWiIdOlgoc25flt2WYyrlf_ibwbM_xepChgUbjWhGEp8kLXEyP80EiyLUK-7sVn4YvjOhVwMA7UBAa8KeepyTXcfnASwf-9-jpDdHXrDUmwVBnLIEarb1btrbNdf2f',
    },
    {
        id: '3', name: 'Slide Zone',
        capacity: '10/30', percent: 33.3,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg4SCdDJgInsbOE_brJ5yxQd4inXsjytpjBENpKxnric0fh7l2JB9XCDIpmitlcfx_rbJwKDgI1dyhDaSpKssETveVJ-ElMgAn9EU4VLPtvargPk4R9p4VVxEZFO0AjqB7iaixPbMimp2wrESdtT480HMO5VWVvTWgqeTwTj88p2ICdw45ZCD5EV1BZU8pAVW_pHtslw8FGioRa34ATPe8CYNi8hGPbPjj6PoCl9yWxQsuTLbrUYXuXNtNZHODaWJ7XZ_7t_23Yzgp',
    },
];

export default function ManageActivitiesScreen() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* Summary */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Capacity</Text>
                <Text style={styles.summaryValue}>50/90</Text>
            </View>

            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                <MaterialIcons name="add" size={20} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add New Activity</Text>
            </TouchableOpacity>

            {/* Activity List */}
            <View style={styles.activityList}>
                {ACTIVITIES.map((activity) => (
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
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => router.push('/updateActivityScreen' as any)}
                        >
                            <MaterialIcons name="edit" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
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
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
        shadowRadius: 4, elevation: 2,
    },
    activityImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: COLORS.slate200 },
    activityInfo: { flex: 1 },
    activityName: { fontSize: 18, fontWeight: '700', color: COLORS.slate900 },
    capacityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    capacityText: { fontSize: 14, color: COLORS.slate600, fontWeight: '500' },
    progressBg: { width: '100%', height: 6, backgroundColor: COLORS.slate100, borderRadius: 9999, marginTop: 8, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: COLORS.primary },
    editButton: {
        width: 40, height: 40, borderRadius: 12, borderWidth: 1,
        borderColor: 'rgba(46,125,50,0.3)', alignItems: 'center', justifyContent: 'center',
    },
});
