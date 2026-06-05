import { showToast } from '@/app/toast';
import { ScreenBottomSheet } from '@/components/ScreenBottomSheet';
import { COLORS } from '@/constants/theme';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ActivitySummary = {
    id: string;
    name: string;
    image: string;
};

type ActivityDetail = {
    id: string;
    name: string;
    image: string;
    capacity: number;
    currentOccupancy: number;
    isCapacityControlOpen?: boolean | number;
};

type Token = {
    id: string;
    name: string;
    code: string;
    status: 'queue' | 'ready' | 'in_use' | 'completed' | 'expired';
    queuePosition?: string | null;
    qrImage: string;
    username?: string;
    createdAt?: string;
    expiresAt?: string;
    activityId?: string | number;
    activityType?: 'play' | 'food';
};

type ActivityCapacitySheetProps = {
    selectedActivity: ActivitySummary | null;
    onUpdated?: () => void;
};

export const ActivityCapacitySheet = forwardRef<any, ActivityCapacitySheetProps>(({ selectedActivity, onUpdated }, ref) => {
    const serverIp = useMemo(
        () => process.env.EXPO_PUBLIC_API_URL || 'http://192.168.43.2:5000',
        []
    );
    const [activityDetail, setActivityDetail] = useState<ActivityDetail | null>(null);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdatingToggle, setIsUpdatingToggle] = useState(false);

    useEffect(() => {
        if (!selectedActivity?.id) {
            setActivityDetail(null);
            setTokens([]);
            return;
        }

        let isMounted = true;

        const loadData = async () => {
            if (isMounted) {
                setIsLoading(true);
            }

            try {
                const [activityResponse, tokensResponse] = await Promise.all([
                    fetch(`${serverIp}/api/activities/${selectedActivity.id}`),
                    fetch(`${serverIp}/api/tokens`),
                ]);

                if (!isMounted) {
                    return;
                }

                if (activityResponse.ok) {
                    const activityData = await activityResponse.json();
                    setActivityDetail({
                        id: String(activityData.id),
                        name: activityData.name,
                        image: activityData.image,
                        capacity: Number(activityData.capacity) || 0,
                        currentOccupancy: Number(activityData.currentOccupancy) || 0,
                        isCapacityControlOpen: activityData.isCapacityControlOpen,
                    });
                } else {
                    setActivityDetail(null);
                }

                if (tokensResponse.ok) {
                    const tokenData = await tokensResponse.json();
                    setTokens(tokenData);
                } else {
                    setTokens([]);
                }
            } catch (error) {
                console.error('Failed to load capacity data:', error);
                if (isMounted) {
                    showToast('Failed to load activity details');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadData();
        const intervalId = setInterval(loadData, 5000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [selectedActivity?.id, serverIp]);

    const activityTokens = activityDetail
        ? tokens.filter((token) => String(token.activityId) === String(activityDetail.id))
        : [];

    const queueTokens = activityTokens.filter((token) => token.status === 'queue');
    const activeTokens = activityTokens.filter((token) => token.status === 'ready' || token.status === 'in_use');
    const completedTokens = activityTokens.filter((token) => token.status === 'completed');
    const expiredTokens = activityTokens.filter((token) => token.status === 'expired');
    const allVisitorTokens = [...queueTokens, ...activeTokens, ...completedTokens, ...expiredTokens];

    const totalCapacity = activityDetail?.capacity || 0;
    const totalOccupancy = activeTokens.length;
    const occupancyPercentage = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
    const remainingSpots = Math.max(totalCapacity - totalOccupancy, 0);
    const isOpen = Boolean(activityDetail?.isCapacityControlOpen);

    const getSessionTimeRemaining = (token: Token) => {
        if (token.status === 'ready') return 'Ready';
        if (token.status === 'completed') return 'Completed';
        if (token.status === 'expired') return 'Expired';
        if (token.status === 'queue') return null;
        if (!token.expiresAt) return 'Active';

        const now = new Date();
        const expires = new Date(token.expiresAt);
        const diffMs = expires.getTime() - now.getTime();

        if (diffMs <= 0) return 'Expired';

        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')} left`;
    };

    const getTimeColor = (timeRemaining: string | null) => {
        if (!timeRemaining || timeRemaining === 'Ready') return COLORS.primary;
        if (timeRemaining === 'Expired') return COLORS.red600;
        if (timeRemaining === 'Completed') return COLORS.slate400;
        const minutes = parseInt(timeRemaining.split(':')[0], 10);
        if (minutes < 15) return COLORS.red600;
        if (minutes < 30) return COLORS.orange600;
        return COLORS.primary;
    };

    const handleCapacityControlToggle = async (newValue: boolean) => {
        if (!activityDetail?.id || isUpdatingToggle) {
            return;
        }

        setIsUpdatingToggle(true);

        try {
            const response = await fetch(`${serverIp}/api/activities/${activityDetail.id}/capacity-control`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isOpen: newValue }),
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.error || 'Failed to update capacity control');
                return;
            }

            setActivityDetail((current) => current ? {
                ...current,
                isCapacityControlOpen: newValue,
            } : current);
            showToast(`Capacity control ${newValue ? 'opened' : 'closed'}`, 'success');
            onUpdated?.();
        } catch (error) {
            console.error('Failed to update capacity control:', error);
            showToast('Network error. Please try again.');
        } finally {
            setIsUpdatingToggle(false);
        }
    };

    return (
        <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.title}>Capacity Control</Text>
                    <Text style={styles.subtitle}>
                        {selectedActivity?.name || 'Selected activity'}
                    </Text>
                </View>

                <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
                    {isLoading ? (
                        <View style={styles.loadingState}>
                            <ActivityIndicator color={COLORS.primary} />
                            <Text style={styles.loadingText}>Loading activity details...</Text>
                        </View>
                    ) : !activityDetail ? (
                        <View style={styles.loadingState}>
                            <Text style={styles.loadingText}>Activity details unavailable</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.heroCard}>
                                <Image
                                    source={{ uri: activityDetail.image || 'https://via.placeholder.com/400x225?text=No+Image' }}
                                    style={styles.heroImage}
                                    contentFit="cover"
                                />
                                <View style={styles.heroOverlay}>
                                    <Text style={styles.heroTitle}>{activityDetail.name}</Text>
                                </View>
                            </View>

                            <View style={styles.occupancyCard}>
                                <View style={styles.occupancyHeader}>
                                    <View>
                                        <Text style={styles.occupancyLabel}>Current Occupancy</Text>
                                        <Text style={styles.occupancyValue}>
                                            {totalOccupancy} <Text style={styles.occupancyMax}>/ {totalCapacity} kids</Text>
                                        </Text>
                                    </View>
                                    <Switch
                                        value={isOpen}
                                        onValueChange={handleCapacityControlToggle}
                                        disabled={isUpdatingToggle}
                                        trackColor={{ false: COLORS.slate200, true: COLORS.primary }}
                                        thumbColor={COLORS.white}
                                    />
                                </View>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${occupancyPercentage}%` }]} />
                                </View>
                                <Text style={styles.spotsText}>{remainingSpots} spots remaining</Text>
                            </View>

                            <Text style={styles.sessionsTitle}>Visitor Queue ({allVisitorTokens.length})</Text>

                            <View style={styles.sessionsList}>
                                {allVisitorTokens.length === 0 ? (
                                    <Text style={styles.emptyText}>No visitors in queue for this activity</Text>
                                ) : (
                                    allVisitorTokens.map((token) => {
                                        const isQueue = token.status === 'queue';
                                        const isReady = token.status === 'ready';
                                        const isInUse = token.status === 'in_use';
                                        const isCompleted = token.status === 'completed';
                                        const isExpired = token.status === 'expired';
                                        const isFood = token.activityType === 'food';
                                        const timeRemaining = !isQueue ? getSessionTimeRemaining(token) : null;

                                        let iconBgColor = 'rgba(46,125,50,0.1)';
                                        let iconColor = COLORS.primary;
                                        let badgeBgColor = COLORS.green100;
                                        let badgeTextColor = COLORS.green700;

                                        if (isCompleted) {
                                            iconBgColor = 'rgba(156,163,175,0.12)';
                                            iconColor = COLORS.slate400;
                                            badgeBgColor = 'rgba(156,163,175,0.12)';
                                            badgeTextColor = COLORS.slate500;
                                        } else if (isExpired) {
                                            iconBgColor = 'rgba(239,68,68,0.1)';
                                            iconColor = COLORS.red600;
                                            badgeBgColor = 'rgba(239,68,68,0.1)';
                                            badgeTextColor = '#dc2626';
                                        } else if (isQueue) {
                                            iconBgColor = isFood ? 'rgba(249,115,22,0.1)' : 'rgba(255,152,0,0.1)';
                                            iconColor = isFood ? '#f97316' : COLORS.orange600;
                                            badgeBgColor = isFood ? 'rgba(249,115,22,0.1)' : COLORS.orange100;
                                            badgeTextColor = isFood ? '#c2410c' : COLORS.orange700;
                                        } else if (isFood) {
                                            iconBgColor = 'rgba(249,115,22,0.1)';
                                            iconColor = '#f97316';
                                            badgeBgColor = 'rgba(249,115,22,0.1)';
                                            badgeTextColor = '#c2410c';
                                        }

                                        return (
                                            <View key={token.id} style={styles.sessionCard}>
                                                <View style={styles.sessionLeft}>
                                                    <View style={[styles.sessionIcon, { backgroundColor: iconBgColor }]}>
                                                        <MaterialIcons
                                                            name={isCompleted ? 'check-circle' : isExpired ? 'cancel' : isFood ? 'restaurant' : isQueue ? 'schedule' : 'child-care'}
                                                            size={20}
                                                            color={iconColor}
                                                        />
                                                    </View>
                                                    <View style={styles.sessionDetails}>
                                                        <View style={styles.tokenRow}>
                                                            <Text style={styles.sessionId}>#{token.code}</Text>
                                                            <View style={[styles.statusBadge, { backgroundColor: badgeBgColor }]}>
                                                                <Text style={[styles.statusBadgeText, { color: badgeTextColor }]}>
                                                                    {isCompleted
                                                                        ? 'COMPLETED'
                                                                        : isExpired
                                                                        ? 'EXPIRED'
                                                                        : isFood
                                                                        ? isQueue ? 'ORDERED' : 'SERVED'
                                                                        : isQueue ? 'WAITING' : 'ACTIVE'}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <Text style={styles.sessionZone}>{token.name}</Text>
                                                        <Text style={styles.sessionUser}>{token.username || 'Guest'}</Text>
                                                    </View>
                                                </View>

                                                <View style={styles.sessionRight}>
                                                    {isQueue ? (
                                                        <>
                                                            <Text style={[styles.sessionTime, { color: isFood ? '#f97316' : COLORS.orange600 }]}>
                                                                {token.queuePosition || '-'}
                                                            </Text>
                                                            <Text style={styles.sessionLabel}>{isFood ? 'Order #' : 'Queue #'}</Text>
                                                        </>
                                                    ) : (isReady || isInUse) ? (
                                                        <>
                                                            <Text style={[styles.sessionTime, { color: getTimeColor(timeRemaining) }]}>
                                                                {timeRemaining}
                                                            </Text>
                                                            <Text style={styles.sessionLabel}>{isReady ? 'Status' : 'Time Left'}</Text>
                                                        </>
                                                    ) : null}
                                                </View>
                                            </View>
                                        );
                                    })
                                )}
                            </View>
                        </>
                    )}
                </BottomSheetScrollView>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

ActivityCapacitySheet.displayName = 'ActivityCapacitySheet';

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
        paddingBottom: 32,
    },
    loadingState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: COLORS.slate500,
    },
    heroCard: {
        marginHorizontal: 16,
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: COLORS.slate200,
    },
    heroImage: {
        ...StyleSheet.absoluteFillObject,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 16,
        backgroundColor: 'rgba(15,23,42,0.22)',
    },
    heroTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
    },
    occupancyCard: {
        marginHorizontal: 16,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.slate100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: 24,
    },
    occupancyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 16,
    },
    occupancyLabel: {
        fontSize: 14,
        color: COLORS.slate500,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    occupancyValue: {
        fontSize: 30,
        fontWeight: '700',
        color: COLORS.slate900,
        marginTop: 4,
    },
    occupancyMax: {
        fontSize: 18,
        fontWeight: '400',
        color: COLORS.slate400,
    },
    progressBarBg: {
        width: '100%',
        height: 12,
        backgroundColor: COLORS.slate100,
        borderRadius: 9999,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 9999,
    },
    spotsText: {
        fontSize: 12,
        color: COLORS.slate500,
        textAlign: 'right',
    },
    sessionsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
        marginHorizontal: 16,
        marginBottom: 12,
        paddingLeft: 4,
    },
    sessionsList: {
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 32,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.slate400,
        textAlign: 'center',
        padding: 20,
    },
    sessionCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.slate100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        gap: 12,
    },
    sessionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    sessionDetails: {
        flex: 1,
    },
    sessionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tokenRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    sessionId: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    sessionZone: {
        fontSize: 12,
        color: COLORS.slate500,
        marginTop: 2,
    },
    sessionUser: {
        fontSize: 11,
        color: COLORS.slate400,
        marginTop: 2,
    },
    sessionRight: {
        alignItems: 'flex-end',
        minWidth: 72,
    },
    sessionTime: {
        fontSize: 14,
        fontWeight: '700',
        marginTop: 2,
    },
    sessionLabel: {
        fontSize: 11,
        color: COLORS.slate500,
        marginTop: 2,
    },
});
