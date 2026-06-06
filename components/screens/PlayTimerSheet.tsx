import { COLORS } from '@/constants/theme';
import { showImmediateNotification } from '@/utils/notifications';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/app/store';
// eslint-disable-next-line import/no-named-as-default
import ScreenBottomSheet from '@/components/ScreenBottomSheet';

export const PlayTimerSheet = forwardRef<any, { tokenId?: string, onFinish?: (activityId: any) => void }>((props, ref) => {
    const closeSheet = () => {
        if (ref && 'current' in ref && ref.current) ref.current.dismiss();
    };
    const tokenId = props.tokenId || '0';
    const { tokens, fetchTokens, profile } = useStore();
    const [timeLeft, setTimeLeft] = useState('00:08');
    const [isFinished, setIsFinished] = useState(false);
    const notificationSentRef = useRef(false);

    const token = tokens.find(t => t.id.toString() === tokenId);

    // Fallback session duration if backend expiresAt is not available
    // Uncomment to use frontend-based timer instead of backend sync
    // const SESSION_DURATION_MS = 60 * 1000; // 1 minute
    // Sample values:
    // - 30 * 1000 = 30 seconds (quick testing)
    // - 60 * 1000 = 1 minute (recommended testing)
    // - 5 * 60 * 1000 = 5 minutes (short sessions)
    // - 10 * 60 * 1000 = 10 minutes (standard)
    // - 15 * 60 * 1000 = 15 minutes (extended)

    /*
     * Timer uses actual session duration from backend (expiresAt)
     * Session duration is 1 minute from when token becomes 'in_use' (session started)
     * Refetch token data on mount to ensure we have the latest expiresAt
     */
    useEffect(() => {
        if (profile?.id) {
            fetchTokens(profile.id.toString());
        }
    }, [profile?.id, fetchTokens]);

    useEffect(() => {
        if (!token?.expiresAt) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const expires = new Date(token.expiresAt as string).getTime();
            const diff = expires - now;

            if (diff <= 0) {
                setTimeLeft('00:00');
                setIsFinished(true);
                // Show notification when timer ends (only once)
                if (!notificationSentRef.current) {
                    showImmediateNotification(
                        'Play Session Ended',
                        'Your play session has ended. Please leave feedback!',
                        { tokenId, type: 'timer_end' },
                        'timer-alerts'
                    );
                    notificationSentRef.current = true;
                }
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                if (hours > 0) {
                    setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                } else {
                    setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                }
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [token, tokenId]);

    const handleFinish = () => {
        if (token) {
            if (props.onFinish) {
                props.onFinish(token.activityId);
            }
            closeSheet();
        }
    };

    return (
        <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>

                <View style={styles.content}>
                    {/* Timer */}
                    <View style={styles.timerSection}>
                        <View style={styles.timerCircle}>
                            <Text style={styles.timerValue}>{timeLeft}</Text>
                            <Text style={styles.timerLabel}>Remaining</Text>
                        </View>
                    </View>

                    {/* Active Details Card */}
                    <View style={styles.detailsCard}>
                        <View style={styles.detailsRow}>
                            <View style={styles.detailsIcon}>
                                <MaterialIcons name="child-care" size={28} color={COLORS.white} />
                            </View>
                            <View>
                                <Text style={styles.detailsLabel}>Currently Playing</Text>
                                <Text style={styles.detailsValue}>#{token?.code || 'Loading'}</Text>
                            </View>
                        </View>

                        <View style={styles.detailsDivider} />

                        <View style={styles.zoneRow}>
                            <View>
                                <Text style={styles.detailsLabel}>Active Zone</Text>
                                <Text style={styles.zoneValue}>{token?.name || 'Loading Zone'}</Text>
                            </View>
                            <View style={styles.zoneImage}>
                                <Image
                                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsaoPUFbzfH8r-O2UdSe5u8L6Q3oWWk9qwwtDzIyw-8xOP4G8A1zhCpblDiBbxYI8wEXaF6TuFkcYtms9NID3UcL16uiusKcqFCY7s1X0Wf2wQGdWF3KXOKqPjK2YrmYYux8bVMLzlPNH3qQLpDF5M8qyL42yetZYg_boGZw9tSRgQZXTqMloiujdHzETStDeQsavn3x1QTcmZill3S1dPJuW1AAef-CkX1QmF6LUEZnxrCiBot1BQD-YlNbNdvooQXEaxBOwvh1zp' }}
                                    style={styles.zoneImg}
                                    contentFit="cover"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Safety Reminder / Finish Button */}
                    {isFinished ? (
                        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
                            <Text style={styles.finishBtnText}>Leave Feedback</Text>
                            <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.reminderCard}>
                            <MaterialIcons name="warning" size={20} color={COLORS.amber600} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.reminderTitle}>Safety Reminder</Text>
                                <Text style={styles.reminderText}>
                                    Please ensure the Token holder stays within the {token?.name || 'Zone'} boundaries. Staff are available at the entrance for assistance.
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

        PlayTimerSheet.displayName = 'PlayTimerSheet';

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bgLight, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8,
    },
    closeBtn: {
        width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900 },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
    timerSection: { alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
    timerCircle: {
        width: 256, height: 256, borderRadius: 128,
        alignItems: 'center', justifyContent: 'center',
    },
    timerValue: { fontSize: 64, fontWeight: '800', color: COLORS.primary, letterSpacing: -2 },
    timerLabel: {
        fontSize: 14, fontWeight: '600', color: 'rgba(46,125,50,0.7)',
        textTransform: 'uppercase', letterSpacing: 2, marginTop: 4,
    },
    detailsCard: {
        backgroundColor: 'rgba(46,125,50,0.05)', borderRadius: 16,
        padding: 20, borderWidth: 1, borderColor: 'rgba(46,125,50,0.1)', gap: 16,
    },
    detailsRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    detailsIcon: {
        width: 56, height: 56, borderRadius: 12,
        backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    },
    detailsLabel: {
        fontSize: 12, fontWeight: '500', color: 'rgba(46,125,50,0.7)',
        textTransform: 'uppercase', letterSpacing: 0.5,
    },
    detailsValue: { fontSize: 20, fontWeight: '700', color: COLORS.slate900, marginTop: 2 },
    detailsDivider: { height: 1, backgroundColor: 'rgba(46,125,50,0.1)' },
    zoneRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    zoneValue: { fontSize: 16, fontWeight: '700', color: COLORS.slate900, marginTop: 2 },
    zoneImage: { width: 64, height: 64, borderRadius: 12, overflow: 'hidden', backgroundColor: COLORS.slate200 },
    zoneImg: { width: '100%', height: '100%' },
    reminderCard: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 12,
        padding: 16, borderRadius: 16, marginTop: 24,
        backgroundColor: COLORS.amber50, borderWidth: 1, borderColor: COLORS.amber100,
    },
    reminderTitle: { fontSize: 14, fontWeight: '700', color: COLORS.amber800 },
    reminderText: { fontSize: 14, color: COLORS.amber700, lineHeight: 22, marginTop: 4 },
    finishBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: 56, backgroundColor: COLORS.primary, borderRadius: 16, marginTop: 24,
    },
    finishBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
