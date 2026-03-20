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
    slate500: '#64748b',
    slate400: '#94a3b8',
    slate200: '#e2e8f0',
    slate100: '#f1f5f9',
    slate700: '#334155',
};

const STAFF = [
    {
        id: '1', name: 'Alice Henderson', zone: 'Trampoline Park', status: 'Active',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC29lEbjgXczTBNVT9obxDQ4lyTWXoy8l8s2MVSi5T8q-PbNHwm8v4tnsFBBbovO24YvqtOJRXVI8Y4Ma-XbfTE4b_Z5tvUrm0S-vePxDUSg2y2zs9ImY2fytVir9jTj9yQEwDWtuP1yh4CgeNqZXforin5bqyWG_uhxMGFj5mPY03EHRbM7hPmEXrfn50uSUhPTNgRA2KL3RtSuVZM4sQUTwUSFtmFpWpQh4Htubsdu3KI7xB6FXxu9lVDJ2WLoW6xk-YDkvC9q6pR',
    },
    {
        id: '2', name: 'Marcus Thompson', zone: 'Ball Pit', status: 'Active',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-FfnnJw8mL4hbkUGdwrhpD6R3GyuGxEW1gEMm5oaVT-wf4XJbdQuHEE1iT1QpO01bsysGqhUYtC8q8HjICXJlXj2m77Q84ftGsoOs2_XAA-oz_wY817StBvL8oBSLs___MS8qb2BksixRPaJDrO7OSlH3kI7YrJltFVfuod1gqGXiAlGB8djCabsyRc3TI9TevUxlXdMtq3SfrTQ193xs0LjqtXemdAybh2A5J2_JfLKrEmR6qNwkA3rPXi1H0PIKpQUfbeg9jrd3',
    },
    {
        id: '3', name: 'Sarah Jenkins', zone: 'Slide Zone', status: 'Off-Duty',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr8lcKsgUV5wV-VcEpvQq6MIlyshS9PH3QxEm2xG5koGSzd7WOb38-Rx7vd0UG0LXcCwf5sfdHeq4JfN0LSKK2zDMinAWayssfy_1eF9JpCodqD1RAdT5kdxUD6F_wTmtxw727ulCyBkGhN47wxTjPR1w8CCV605IRsOaFZZfjcMoBcUtimY9T3AVfizQuWVtlbcWv2iJ_1bmlgcuKOTYgT8tmb9euQBN8Elp_i1ik4nuoaVcp_G1kKRHYLWkvo4rLnRwDN6lbkSU4',
    },
    {
        id: '4', name: 'David Chen', zone: 'Trampoline Park', status: 'Active',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrG9a386F8T4F0SfzvHVulBezLthnuZFKxlTCA3i0SS50x4yhU9kdtnPY4KMhs_y7uD6vcrmllx7ukISSCz762mVrQQaESVkN7rswvQh7P7zdiX07xFxYSuMfv-kkLpSDo3Zh68kC4CexjhubgvbUoxjcp4wn1TmbiWmfj36tK6HTcX_GAEnrEcEwq3PKSuk0hnSul38nWrm2PAKVK4YhC2fPkt_D1Q3hGuhVSkNIP04wXn-k58ZoStmSUZ0mrhPsvB4oy9BROtitZ',
    },
];

export default function StaffManagementScreen() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* On Duty Card */}
            <View style={styles.dutyCard}>
                <Text style={styles.dutyLabel}>On Duty</Text>
                <Text style={styles.dutyValue}>5</Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
                style={styles.registerButton}
                activeOpacity={0.7}
                onPress={() => router.push('/registerStaffScreen' as any)}
            >
                <MaterialIcons name="add" size={20} color={COLORS.primary} />
                <Text style={styles.registerButtonText}>Register New Staff</Text>
            </TouchableOpacity>

            {/* Staff Section */}
            <Text style={styles.sectionTitle}>Staff Members</Text>

            <View style={styles.staffList}>
                {STAFF.map((member) => {
                    const isOffDuty = member.status === 'Off-Duty';
                    return (
                        <View key={member.id} style={[styles.staffCard, isOffDuty && { opacity: 0.75 }]}>
                            <Image
                                source={{ uri: member.image }}
                                style={[styles.avatar, isOffDuty && { opacity: 0.5 }]}
                                contentFit="cover"
                            />
                            <View style={styles.staffInfo}>
                                <Text style={styles.staffName}>{member.name}</Text>
                                <Text style={styles.staffZone}>{member.zone}</Text>
                            </View>
                            <View style={[styles.statusBadge, isOffDuty ? styles.offDutyBadge : styles.activeBadge]}>
                                <Text style={[styles.statusText, isOffDuty ? styles.offDutyText : styles.activeText]}>
                                    {member.status}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    scrollContent: { padding: 16, paddingBottom: 32 },
    dutyCard: {
        padding: 20, backgroundColor: 'rgba(46,125,50,0.1)', borderRadius: 16,
        borderWidth: 1, borderColor: 'rgba(46,125,50,0.2)', marginBottom: 16,
    },
    dutyLabel: { fontSize: 14, fontWeight: '600', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
    dutyValue: { fontSize: 30, fontWeight: '700', color: COLORS.slate900, marginTop: 4 },
    registerButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: COLORS.primary, borderRadius: 16,
        height: 56, backgroundColor: 'transparent', marginBottom: 24,
    },
    registerButtonText: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginLeft: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900, marginBottom: 12, paddingLeft: 4 },
    staffList: { gap: 12 },
    staffCard: {
        flexDirection: 'row', alignItems: 'center', gap: 16,
        padding: 16, backgroundColor: COLORS.white, borderRadius: 16,
        borderWidth: 1, borderColor: COLORS.slate200,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
        shadowRadius: 4, elevation: 2,
    },
    avatar: { width: 56, height: 56, borderRadius: 28 },
    staffInfo: { flex: 1 },
    staffName: { fontSize: 16, fontWeight: '700', color: COLORS.slate900 },
    staffZone: { fontSize: 14, color: COLORS.slate500, marginTop: 2 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
    activeBadge: { backgroundColor: 'rgba(46,125,50,0.1)' },
    offDutyBadge: { backgroundColor: COLORS.slate100 },
    statusText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    activeText: { color: COLORS.primary },
    offDutyText: { color: COLORS.slate500 },
});
