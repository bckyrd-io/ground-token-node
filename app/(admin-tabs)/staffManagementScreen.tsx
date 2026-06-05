import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useStore } from '../store';
import { RegisterStaffSheet } from '@/components/screens/RegisterStaffSheet';
import { StaffActivitySheet } from '@/components/screens/StaffActivitySheet';
import { showToast } from '@/app/toast';

type SelectedStaff = {
    id: string;
    name: string;
    zone: string;
    status: string;
};

export default function StaffManagementScreen() {
    const registerStaffRef = useRef<BottomSheetModal>(null);
    const staffActivityRef = useRef<BottomSheetModal>(null);
    const { staff, fetchStaff } = useStore();
    const [selectedStaff, setSelectedStaff] = useState<SelectedStaff | null>(null);

    useFocusEffect(
        useCallback(() => {
            fetchStaff();
        }, [fetchStaff])
    );

    // Calculate active staff count
    const activeStaffCount = staff.filter(member => member.status === 'Active').length;

    const openStaffActivitySheet = (member: SelectedStaff) => {
        setSelectedStaff(member);
        setTimeout(() => {
            staffActivityRef.current?.present();
        }, 0);
    };

    const handleDeleteStaff = (staffId: string, staffName: string) => {
        Alert.alert(
            'Delete Staff',
            `Delete ${staffName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.43.2:5000';
                            const response = await fetch(`${serverIp}/api/staff/${staffId}`, {
                                method: 'DELETE',
                            });
                            const data = await response.json();

                            if (!response.ok) {
                                showToast(data.error || 'Failed to delete staff');
                                return;
                            }

                            showToast('Staff deleted successfully', 'success');
                            fetchStaff();
                        } catch (error) {
                            console.error('Delete staff error:', error);
                            showToast('Network error. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <>
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
                    onPress={() => registerStaffRef.current?.present()}
                >
                    <MaterialIcons name="add" size={20} color={COLORS.primary} />
                    <Text style={styles.registerButtonText}>Register New Staff</Text>
                </TouchableOpacity>

                {/* Staff Section */}
                <Text style={styles.sectionTitle}>Staff Members</Text>

                <View style={styles.staffList}>
                    {staff.map((member) => {
                        const isOffDuty = member.status === 'Off-Duty';
                        const isUnassigned = member.status === 'Unassigned';

                        const badgeStyle = isUnassigned
                            ? styles.unassignedBadge
                            : (isOffDuty ? styles.offDutyBadge : styles.activeBadge);

                        const textStyle = isUnassigned
                            ? styles.unassignedText
                            : (isOffDuty ? styles.offDutyText : styles.activeText);

                        return (
                            <TouchableOpacity
                                key={member.id}
                                style={[styles.staffCard, isOffDuty && { opacity: 0.75 }]}
                                activeOpacity={0.9}
                                onPress={() => openStaffActivitySheet({
                                    id: member.id,
                                    name: member.name,
                                    zone: member.zone,
                                    status: member.status,
                                })}
                            >
                                <View style={[styles.avatar, isOffDuty && { opacity: 0.5 }]}>
                                    <MaterialIcons name="person" size={32} color={COLORS.slate400} />
                                </View>
                                <View style={styles.staffInfo}>
                                    <Text style={styles.staffName}>{member.name}</Text>
                                    <View style={[styles.statusBadge, badgeStyle]}>
                                        <Text style={[styles.statusText, textStyle]}>
                                            {member.status}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.staffActions}>

                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={(event) => {
                                            event.stopPropagation();
                                            handleDeleteStaff(member.id, member.name);
                                        }}
                                    >
                                        <MaterialIcons name="delete-outline" size={20} color={COLORS.red600} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
            <RegisterStaffSheet ref={registerStaffRef} onSuccess={fetchStaff} />
            <StaffActivitySheet
                ref={staffActivityRef}
                selectedStaff={selectedStaff}
                onAssigned={fetchStaff}
            />
        </>
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
        backgroundColor: COLORS.white, padding: 16, borderRadius: 16,
        borderWidth: 1, borderColor: COLORS.slate100,
    },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.slate100, alignItems: 'center', justifyContent: 'center' },
    staffInfo: { flex: 1 },
    staffName: { fontSize: 16, fontWeight: '700', color: COLORS.slate900 },
    staffZone: { fontSize: 14, color: COLORS.slate500, marginTop: 2 },
    assignHint: { fontSize: 12, color: COLORS.slate400, marginTop: 6 },
    staffActions: { alignItems: 'flex-end', gap: 10 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999, alignSelf: 'flex-start' },
    activeBadge: { backgroundColor: 'rgba(46,125,50,0.1)' },
    offDutyBadge: { backgroundColor: COLORS.slate100 },
    unassignedBadge: { backgroundColor: 'rgba(245,158,11,0.1)' },
    statusText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    activeText: { color: COLORS.primary },
    offDutyText: { color: COLORS.slate500 },
    unassignedText: { color: '#f59e0b' },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239,68,68,0.08)',
    },
});
