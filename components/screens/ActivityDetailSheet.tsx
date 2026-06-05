import { COLORS } from '@/constants/theme';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, forwardRef } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/app/store';
import ScreenBottomSheet from '@/components/ScreenBottomSheet';

export const ActivityDetailSheet = forwardRef<any, { activityId?: string }>((props, ref) => {
    const closeSheet = () => {
        if (ref && 'current' in ref && ref.current) ref.current.dismiss();
    };
    const activityId = props.activityId || '1'; // Fallback to '1' if not provided
    const { activityDetails, fetchActivityDetail } = useStore();
    const activity = activityDetails[activityId];

    useEffect(() => {
        if (!activity) {
            fetchActivityDetail(activityId);
        }
    }, [activityId, activity, fetchActivityDetail]);

    // Parse safetyRules from database (might be JSON string)
    const safetyRules = activity?.safetyRules
        ? (typeof activity.safetyRules === 'string'
            ? JSON.parse(activity.safetyRules)
            : activity.safetyRules)
        : [];

    if (!activity) {
        return (
            <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
                <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
                    <Text>Loading...</Text>
                </SafeAreaView>
            </ScreenBottomSheet>
        );
    }

    return (
        <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
                <BottomSheetScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
                            <Text style={styles.safetyTitle}>Safety Rules</Text>
                        </View>
                        {safetyRules.map((rule: string, index: number) => (
                            <View key={index} style={styles.ruleRow}>
                                <MaterialIcons name="check-circle" size={18} color={COLORS.primary} />
                                <Text style={styles.ruleText}>{rule}</Text>
                            </View>
                        ))}
                    </View>
                </BottomSheetScrollView>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

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
        padding: 20, borderWidth: 1, borderColor: COLORS.slate300,
    },
    safetyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    safetyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900 },
    ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
    ruleText: { fontSize: 14, color: COLORS.slate700, fontWeight: '500', flex: 1, lineHeight: 20 },
});
