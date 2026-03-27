import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store';

export default function StaffManagementScreen() {
    const router = useRouter();
    const { staff, fetchStaff } = useStore();

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    // Calculate active staff count
    const activeStaffCount = staff.filter(member => member.status === 'Active').length;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* On Duty Card */}
            <View style={styles.dutyCard}>
                <Text style={styles.dutyLabel}>On Duty</Text>
                <Text style={styles.dutyValue}>{activeStaffCount}</Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
                style={styles.registerButton}
                activeOpacity={0.7}
                onPress={() => router.push('/registerStaffScreen')}
            >
                <MaterialIcons name="add" size={20} color={COLORS.primary} />
                <Text style={styles.registerButtonText}>Register New Staff</Text>
            </TouchableOpacity>

            {/* Staff Section */}
            <Text style={styles.sectionTitle}>Staff Members</Text>

            <View style={styles.staffList}>
                {staff.map((member) => {
                    const isOffDuty = member.status === 'Off-Duty';
                    return (
                        <View key={member.id} style={[styles.staffCard, isOffDuty && { opacity: 0.75 }]}>
                            <Image
                                source={{ uri: member.image }}
                                style={[styles.avatar, isOffDuty && { opacity: 0.5 }]}
                                contentFit="cover"
                            />
                            <View style={styles.staffInfo}>
                                <Text style={styles.staffName}>{member.username}</Text>
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
