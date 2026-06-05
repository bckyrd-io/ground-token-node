import { showToast } from '@/app/toast';
import { ScreenBottomSheet } from '@/components/ScreenBottomSheet';
import { COLORS, FORM_INPUT_TOKENS } from '@/constants/theme';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type StaffMember = {
    id: string;
    name: string;
    zone: string;
    status: string;
};

type ActivityOption = {
    id: string;
    name: string;
    type: 'play' | 'food';
    currentOccupancy: number;
    capacity: number;
};

type AssignedActivity = {
    id: string;
    name: string;
};

type StaffActivitySheetProps = {
    selectedStaff: StaffMember | null;
    onAssigned?: () => void;
};

export const StaffActivitySheet = forwardRef<any, StaffActivitySheetProps>(({ selectedStaff, onAssigned }, ref) => {
    const serverIp = useMemo(
        () => process.env.EXPO_PUBLIC_API_URL || 'http://192.168.43.2:5000',
        []
    );
    const [activities, setActivities] = useState<ActivityOption[]>([]);
    const [assignedActivity, setAssignedActivity] = useState<AssignedActivity | null>(null);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!selectedStaff?.id) {
            setActivities([]);
            setAssignedActivity(null);
            setSelectedActivityId(null);
            return;
        }

        const loadData = async () => {
            setIsLoading(true);

            try {
                const [activitiesResponse, assignmentResponse] = await Promise.all([
                    fetch(`${serverIp}/api/activities`),
                    fetch(`${serverIp}/api/staff/${selectedStaff.id}/activity`),
                ]);

                if (activitiesResponse.ok) {
                    const activitiesData = await activitiesResponse.json();
                    setActivities(activitiesData);
                } else {
                    setActivities([]);
                }

                if (assignmentResponse.ok) {
                    const assignmentData = await assignmentResponse.json();
                    setAssignedActivity({
                        id: String(assignmentData.id),
                        name: assignmentData.name,
                    });
                    setSelectedActivityId(String(assignmentData.id));
                } else {
                    setAssignedActivity(null);
                    setSelectedActivityId(null);
                }
            } catch (error) {
                console.error('Failed to load staff activity data:', error);
                showToast('Failed to load activities');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [selectedStaff?.id, serverIp]);

    const handleAssign = async () => {
        if (!selectedStaff?.id) {
            showToast('Select a staff member first');
            return;
        }

        if (!selectedActivityId) {
            showToast('Select an activity');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${serverIp}/api/staff/${selectedStaff.id}/activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ activityId: selectedActivityId }),
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.error || 'Failed to assign staff');
                return;
            }

            showToast('Staff assigned successfully', 'success');
            onAssigned?.();
            if (ref && 'current' in ref && ref.current) {
                ref.current.dismiss();
            }
        } catch (error) {
            console.error('Failed to assign staff:', error);
            showToast('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScreenBottomSheet ref={ref} snapPoints={['85%']} scrollable={true}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Staff Activity</Text>
                        <Text style={styles.subtitle}>
                            {selectedStaff ? `Assign ${selectedStaff.name}` : 'Select a staff member'}
                        </Text>
                    </View>
                </View>

                <BottomSheetScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    {selectedStaff && (
                        <View style={styles.staffCard}>
                            <View style={styles.staffAvatar}>
                                <MaterialIcons name="person" size={24} color={COLORS.slate500} />
                            </View>
                            <View style={styles.staffInfo}>
                                <Text style={styles.staffName}>{selectedStaff.name}</Text>
                                <Text style={styles.staffMeta}>{selectedStaff.status} • {selectedStaff.zone}</Text>
                            </View>
                        </View>
                    )}

                    {assignedActivity && (
                        <View style={styles.currentAssignmentCard}>
                            <Text style={styles.currentAssignmentLabel}>Current activity</Text>
                            <Text style={styles.currentAssignmentValue}>{assignedActivity.name}</Text>
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>Choose Activity</Text>

                    {isLoading ? (
                        <View style={styles.emptyState}>
                            <ActivityIndicator color={COLORS.primary} />
                            <Text style={styles.emptyText}>Loading activities...</Text>
                        </View>
                    ) : activities.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No activities available</Text>
                        </View>
                    ) : (
                        <View style={styles.activityList}>
                            {activities.map((activity) => {
                                const isSelected = selectedActivityId === String(activity.id);
                                const statusColor = activity.type === 'food' ? '#f97316' : COLORS.primary;

                                return (
                                    <TouchableOpacity
                                        key={activity.id}
                                        style={[styles.activityCard, isSelected && styles.activityCardSelected]}
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedActivityId(String(activity.id))}
                                    >
                                        <View style={[styles.activityIcon, { backgroundColor: `${statusColor}18` }]}>
                                            <MaterialIcons
                                                name={activity.type === 'food' ? 'restaurant' : 'sports-esports'}
                                                size={20}
                                                color={statusColor}
                                            />
                                        </View>
                                        <View style={styles.activityInfo}>
                                            <Text style={styles.activityName}>{activity.name}</Text>
                                            <Text style={styles.activityMeta}>
                                                {activity.currentOccupancy}/{activity.capacity} occupied
                                            </Text>
                                        </View>
                                        <View style={[styles.radio, isSelected && styles.radioSelected]}>
                                            {isSelected && <View style={styles.radioDot} />}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </BottomSheetScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                        activeOpacity={0.9}
                        onPress={handleAssign}
                        disabled={isSubmitting || isLoading}
                    >
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Saving...' : 'Assign Activity'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

StaffActivitySheet.displayName = 'StaffActivitySheet';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate100,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.slate500,
        marginTop: 4,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 96,
        gap: 16,
    },
    staffCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 16,
        backgroundColor: COLORS.bgLight,
        borderWidth: 1,
        borderColor: COLORS.slate100,
    },
    staffAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.slate100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    staffInfo: {
        flex: 1,
    },
    staffName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    staffMeta: {
        fontSize: 13,
        color: COLORS.slate500,
        marginTop: 2,
    },
    currentAssignmentCard: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(46,125,50,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(46,125,50,0.14)',
    },
    currentAssignmentLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        textTransform: 'uppercase',
    },
    currentAssignmentValue: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.slate900,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    activityList: {
        gap: 12,
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.slate200,
    },
    activityCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(46,125,50,0.04)',
    },
    activityIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityInfo: {
        flex: 1,
    },
    activityName: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    activityMeta: {
        fontSize: 13,
        color: COLORS.slate500,
        marginTop: 2,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: COLORS.slate300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: COLORS.primary,
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.slate500,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.slate100,
        backgroundColor: 'rgba(255,255,255,0.96)',
    },
    submitButton: {
        height: 56,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: FORM_INPUT_TOKENS.horizontalPadding,
    },
    submitButtonDisabled: {
        backgroundColor: COLORS.slate300,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
});
