import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useStore } from '../store';
import { AddActivitySheet } from '@/components/screens/AddActivitySheet';
import { ActivityCapacitySheet } from '@/components/screens/ActivityCapacitySheet';
import { showToast } from '@/app/toast';

type SelectedActivity = {
    id: string;
    name: string;
    image: string;
};

export default function ManageActivitiesScreen() {
    const addActivityRef = useRef<BottomSheetModal>(null);
    const capacitySheetRef = useRef<BottomSheetModal>(null);
    const { adminActivities, fetchAdminActivities } = useStore();
    const [selectedActivity, setSelectedActivity] = useState<SelectedActivity | null>(null);

    useFocusEffect(
        useCallback(() => {
            fetchAdminActivities();
        }, [fetchAdminActivities])
    );

    const openCapacitySheet = (activity: SelectedActivity) => {
        setSelectedActivity(activity);
        setTimeout(() => {
            capacitySheetRef.current?.present();
        }, 0);
    };

    const handleDeleteActivity = (activityId: string, activityName: string) => {
        Alert.alert(
            'Delete Activity',
            `Delete ${activityName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.43.2:5000';
                            const response = await fetch(`${serverIp}/api/activities/${activityId}`, {
                                method: 'DELETE',
                            });
                            const data = await response.json();

                            if (!response.ok) {
                                showToast(data.error || 'Failed to delete activity');
                                return;
                            }

                            showToast('Activity deleted successfully', 'success');
                            fetchAdminActivities();
                        } catch (error) {
                            console.error('Delete activity error:', error);
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
 

            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={() => addActivityRef.current?.present()}>
                <MaterialIcons name="add" size={20} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add New Activity</Text>
            </TouchableOpacity>

            {/* Activity List */}
            <View style={styles.activityList}>
                {adminActivities.map((activity) => (
                    <TouchableOpacity
                        key={activity.id}
                        style={styles.activityCard}
                        activeOpacity={0.9}
                        onPress={() => openCapacitySheet({
                            id: activity.id,
                            name: activity.name,
                            image: activity.image,
                        })}
                    >
                        <Image source={{ uri: activity.image }} style={styles.activityImage} contentFit="cover" />
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityName}>{activity.name}</Text>
                            <View style={styles.capacityRow}>
                                <Text style={styles.capacityText}>Capacity: {activity.capacity}</Text>
                            </View>
                            
                        </View>
                        <View style={styles.activityActions}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={(event) => {
                                    event.stopPropagation();
                                    handleDeleteActivity(activity.id, activity.name);
                                }}
                            >
                                <MaterialIcons name="delete-outline" size={20} color={COLORS.red600} />
                            </TouchableOpacity>
                   
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
        <AddActivitySheet ref={addActivityRef} onSuccess={fetchAdminActivities} />
        <ActivityCapacitySheet
            ref={capacitySheetRef}
            selectedActivity={selectedActivity}
            onUpdated={fetchAdminActivities}
        />
        </>
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
    tapHint: { fontSize: 12, color: COLORS.slate500, marginTop: 10 },
    activityActions: { alignItems: 'center', justifyContent: 'space-between', minHeight: 80 },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239,68,68,0.08)',
    },
});
