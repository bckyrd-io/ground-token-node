import { COLORS } from '@/constants/theme';
// // import { initializeNotifications, showImmediateNotification } from '@/utils/notifications';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useStore } from '../store';
import Toast from '../toast';

interface Token {
    id: string;
    name: string;
    code: string;
    status: string;
    queuePosition?: string;
    qrImage: string;
    username?: string;
    createdAt?: string;
    expiresAt?: string;
}

interface Activity {
    id: string;
    name: string;
    currentOccupancy: number;
    capacity: number;
}

export default function CapacityControlScreen() {
    const { profile, staffActivity, fetchStaffActivity, fetchTokens } = useStore();
    const [isOpen, setIsOpen] = React.useState(true);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);
    const previousQueueLengthRef = useRef(0);

    // useEffect(() => {
    //     // initializeNotifications(); // Commented out
    // }, []);

    useEffect(() => {
        if (profile?.id) {
            fetchStaffActivity(profile.id);
        }
        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [profile?.id, fetchStaffActivity]);

    // Sync isOpen state from staffActivity when it loads
    useEffect(() => {
        if (staffActivity?.isCapacityControlOpen !== undefined) {
            // Convert to boolean (MySQL returns 0/1)
            setIsOpen(Boolean(staffActivity.isCapacityControlOpen));
        }
    }, [staffActivity?.isCapacityControlOpen]);

    const fetchData = async () => {
        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.175:5000';

            // Fetch tokens
            const tokensResponse = await fetch(`${serverIp}/api/tokens`);
            
            if (tokensResponse.ok) {
                const tokensData = await tokensResponse.json();
                
                // Check for queue changes and notify
                const activityTokens = staffActivity 
                    ? tokensData.filter((token: Token) => 
                        token.name?.toLowerCase().trim() === staffActivity.name?.toLowerCase().trim()
                      )
                    : [];
                const queueTokens = activityTokens.filter((token: Token) => token.status === 'queue');
                
                // If someone moved to first position in queue, notify staff
                // Note: Notifications disabled for Expo Go testing
                if (queueTokens.length > 0 && previousQueueLengthRef.current === 0) {
                    // Temporarily disabled for Expo Go testing
                    Toast.show({
                        type: 'info',
                        text1: 'Queue Update',
                        text2: `Token #${queueTokens[0].code} is now first in line for ${staffActivity?.name}`,
                        position: 'top',
                        visibilityTime: 3000,
                    });
                }
                
                previousQueueLengthRef.current = queueTokens.length;
                setTokens(tokensData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter tokens for the current staff's assigned activity
    console.log('Staff activity name:', staffActivity?.name);
    console.log('All tokens:', tokens.map(t => ({ name: t.name, status: t.status })));
    
    const activityTokens = staffActivity 
        ? tokens.filter(token => {
            const match = token.name?.toLowerCase().trim() === staffActivity.name?.toLowerCase().trim();
            if (!match) {
                console.log(`Token ${token.code}: "${token.name}" !== "${staffActivity.name}"`);
            }
            return match;
        })
        : [];
    
    console.log('Activity tokens:', activityTokens.length);

    // Get queue tokens (waiting) and active tokens (in use) for this activity
    const queueTokens = activityTokens.filter(token => token.status === 'queue');
    const activeTokens = activityTokens.filter(token => token.status === 'ready');
    
    console.log('Queue tokens:', queueTokens.length);
    console.log('Active tokens:', activeTokens.length);

    // Calculate occupancy for the assigned activity
    const totalOccupancy = staffActivity ? staffActivity.currentOccupancy : 0;
    const totalCapacity = staffActivity ? staffActivity.capacity : 0;
    const occupancyPercentage = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
    const remainingSpots = totalCapacity - totalOccupancy;

    // Calculate time remaining for each token
    const getSessionTimeRemaining = (token: Token) => {
        if (!token.createdAt) {
            // Fallback for demo if no timestamp
            const hash = token.code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const minutes = 30 + (hash % 90);
            return `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')} left`;
        }

        const now = new Date();
        const created = new Date(token.createdAt);
        const expires = token.expiresAt ? new Date(token.expiresAt) : new Date(created.getTime() + 30 * 1000); // 30 seconds default

        const diffMs = expires.getTime() - now.getTime();
        if (diffMs <= 0) return 'Expired';

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')} left`;
        } else {
            return `${minutes}:${(Math.floor((diffMs % (1000 * 60)) / 1000)).toString().padStart(2, '0')} left`;
        }
    };

    const getTimeColor = (timeRemaining: string) => {
        if (timeRemaining === 'Expired') return COLORS.red600;
        const parts = timeRemaining.split(':');
        const minutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        if (minutes < 15) return COLORS.red600;
        if (minutes < 30) return COLORS.orange600;
        return COLORS.primary;
    };

    // Combine queue and active tokens into a unified visitor list
    // Sort: queue first (by queue position), then active (by time remaining)
    const allVisitorTokens = [...queueTokens, ...activeTokens].sort((a, b) => {
        // Queue tokens come first
        if (a.status === 'queue' && b.status !== 'queue') return -1;
        if (a.status !== 'queue' && b.status === 'queue') return 1;
        
        // Within queue, sort by queue position
        if (a.status === 'queue' && b.status === 'queue') {
            const posA = parseInt(a.queuePosition || '0');
            const posB = parseInt(b.queuePosition || '0');
            return posA - posB;
        }
        
        return 0;
    });

    const handleCapacityControlToggle = async (newValue: boolean) => {
        if (!staffActivity) return;
        
        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.175:5000';
            const response = await fetch(`${serverIp}/api/activities/${staffActivity.id}/capacity-control`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isOpen: newValue }),
            });
            
            if (response.ok) {
                setIsOpen(newValue);
                console.log(`Capacity control ${newValue ? 'opened' : 'closed'}`);
            } else {
                console.error('Failed to update capacity control');
            }
        } catch (error) {
            console.error('Error updating capacity control:', error);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            
            {/* Zone Camera View */}
            <View style={styles.cameraView}>
                <Image
                    source={{ uri: staffActivity?.image || 'https://via.placeholder.com/400x192?text=No+Image' }}
                    style={styles.cameraImage}
                    contentFit="cover"
                />
                <View style={styles.cameraOverlay}>
                    <Text style={styles.cameraLabel}>Zone View: {staffActivity?.name || 'Loading...'}</Text>
                </View>
            </View>

            {/* Zone Title
            <View style={styles.zoneHeader}>
                <Text style={styles.zoneName}>{staffActivity?.name || 'No Activity Assigned'}</Text>
            </View> */}

            {/* Occupancy Card */}
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
                        trackColor={{ false: COLORS.slate200, true: COLORS.primary }}
                        thumbColor={COLORS.white}
                    />
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${occupancyPercentage}%` }]} />
                </View>
                <Text style={styles.spotsText}>{remainingSpots} spots remaining</Text>
            </View>

            {/* Visitor Queue - Unified List */}
            <Text style={styles.sessionsTitle}>Visitor Queue ({allVisitorTokens.length})</Text>
            <View style={styles.sessionsList}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : !staffActivity ? (
                    <Text style={styles.emptyText}>No activity assigned</Text>
                ) : allVisitorTokens.length === 0 ? (
                    <Text style={styles.emptyText}>No visitors in queue for {staffActivity.name}</Text>
                ) : (
                    allVisitorTokens.map((token) => {
                        const isQueue = token.status === 'queue';
                        const isFood = token.activityType === 'food';
                        const timeRemaining = !isQueue ? getSessionTimeRemaining(token) : null;

                        // Food uses orange colors, play uses green colors
                        const iconBgColor = isQueue
                            ? (isFood ? 'rgba(249,115,22,0.1)' : 'rgba(255,152,0,0.1)')
                            : (isFood ? 'rgba(249,115,22,0.1)' : 'rgba(46,125,50,0.1)');
                        const iconColor = isQueue
                            ? (isFood ? '#f97316' : COLORS.orange600)
                            : (isFood ? '#f97316' : COLORS.primary);
                        const badgeBgColor = isQueue
                            ? (isFood ? 'rgba(249,115,22,0.1)' : COLORS.orange100)
                            : (isFood ? 'rgba(249,115,22,0.1)' : COLORS.green100);
                        const badgeTextColor = isQueue
                            ? (isFood ? '#c2410c' : COLORS.orange700)
                            : (isFood ? '#c2410c' : COLORS.green700);

                        return (
                            <View key={token.id} style={styles.sessionCard}>
                                <View style={styles.sessionLeft}>
                                    <View style={[styles.sessionIcon, { backgroundColor: iconBgColor }]}>
                                        <MaterialIcons
                                            name={isFood ? "restaurant" : (isQueue ? "schedule" : "child-care")}
                                            size={20}
                                            color={iconColor}
                                        />
                                    </View>
                                    <View>
                                        <View style={styles.tokenRow}>
                                            <Text style={styles.sessionId}>#{token.code}</Text>
                                            {/* Status Badge */}
                                            <View style={[styles.statusBadge, { backgroundColor: badgeBgColor }]}>
                                                <Text style={[styles.statusBadgeText, { color: badgeTextColor }]}>
                                                    {isFood
                                                        ? (isQueue ? 'ORDERED' : 'SERVED')
                                                        : (isQueue ? 'WAITING' : 'ACTIVE')
                                                    }
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
                                    ) : (
                                        <>
                                            <Text style={[styles.sessionTime, { color: getTimeColor(timeRemaining || '') }]}>
                                                {isFood ? 'Served' : timeRemaining}
                                            </Text>
                                            <Text style={styles.sessionLabel}>{isFood ? 'Status' : 'Time Left'}</Text>
                                        </>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    scrollContent: { paddingBottom: 32 },
    zoneHeader: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16 },
    zoneName: { fontSize: 24, fontWeight: '700', color: COLORS.primary },
    zoneSubtitle: { fontSize: 14, color: COLORS.slate500, marginTop: 4 },
    statusCard: {
        marginHorizontal: 16, backgroundColor: COLORS.white, borderRadius: 12,
        padding: 20, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.slate100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: 16,
    },
    statusTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900 },
    statusValue: { fontSize: 14, fontWeight: '500', marginTop: 4 },
    occupancyCard: {
        marginHorizontal: 16, backgroundColor: COLORS.white, borderRadius: 12,
        padding: 20, borderWidth: 1, borderColor: COLORS.slate100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: 24,
    },
    occupancyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    occupancyLabel: { fontSize: 14, color: COLORS.slate500, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
    occupancyValue: { fontSize: 30, fontWeight: '700', color: COLORS.slate900, marginTop: 4 },
    occupancyMax: { fontSize: 18, fontWeight: '400', color: COLORS.slate400 },
    percentBadge: { backgroundColor: 'rgba(46,125,50,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
    percentText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
    progressBarBg: { width: '100%', height: 12, backgroundColor: COLORS.slate100, borderRadius: 9999, overflow: 'hidden', marginBottom: 8 },
    progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 9999 },
    spotsText: { fontSize: 12, color: COLORS.slate500, textAlign: 'right' },
    sessionsTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900, marginHorizontal: 16, marginBottom: 12, paddingLeft: 4 },
    sessionsList: { paddingHorizontal: 16, gap: 8, marginBottom: 32 },
    sessionCard: {
        backgroundColor: COLORS.white, borderRadius: 12, padding: 16,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.slate100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    sessionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sessionIcon: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(46,125,50,0.1)', alignItems: 'center', justifyContent: 'center',
    },
    sessionId: { fontSize: 14, fontWeight: '700', color: COLORS.slate900 },
    tokenRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    statusBadgeText: { fontSize: 10, fontWeight: '700' },
    sessionZone: { fontSize: 12, color: COLORS.slate500, marginTop: 2 },
    sessionUser: { fontSize: 11, color: COLORS.slate400, marginTop: 2 },
    sessionRight: { alignItems: 'flex-end' },
    sessionTime: { fontSize: 14, fontWeight: '700', marginTop: 2 },
    sessionLabel: { fontSize: 11, color: COLORS.slate500, marginTop: 2 },
    loadingText: { fontSize: 14, color: COLORS.slate500, textAlign: 'center', padding: 20 },
    emptyText: { fontSize: 14, color: COLORS.slate400, textAlign: 'center', padding: 20 },
    cameraView: { marginHorizontal: 16, height: 192, borderRadius: 12, overflow: 'hidden', marginTop: 20, marginBottom:20, position: 'relative', backgroundColor: COLORS.slate200 },
    cameraImage: { ...StyleSheet.absoluteFillObject, opacity: 0.8 },
    cameraOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end', padding: 16,
    },
    cameraLabel: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});
