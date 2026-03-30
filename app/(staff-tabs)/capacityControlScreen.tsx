import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useStore } from '../store';

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

    useEffect(() => {
        if (profile?.id) {
            fetchStaffActivity(profile.id);
        }
        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [profile?.id, fetchStaffActivity]);

    const fetchData = async () => {
        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.175:5000';

            // Fetch tokens
            const tokensResponse = await fetch(`${serverIp}/api/tokens`);
            
            if (tokensResponse.ok) {
                const tokensData = await tokensResponse.json();
                setTokens(tokensData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter tokens for the current staff's assigned activity
    const activityTokens = staffActivity 
        ? tokens.filter(token => token.name === staffActivity.name)
        : [];
    
    // Calculate occupancy for the assigned activity
    const totalOccupancy = staffActivity ? staffActivity.currentOccupancy : 0;
    const totalCapacity = staffActivity ? staffActivity.capacity : 0;
    const occupancyPercentage = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
    const remainingSpots = totalCapacity - totalOccupancy;

    // Get active tokens (sessions) for this activity
    const activeTokens = activityTokens.filter(token => token.status === 'ready');

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
        const expires = token.expiresAt ? new Date(token.expiresAt) : new Date(created.getTime() + 2 * 60 * 60 * 1000); // 2 hours default

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

            {/* Zone Title */}
            <View style={styles.zoneHeader}>
                <Text style={styles.zoneName}>{staffActivity?.name || 'No Activity Assigned'}</Text>
            </View>

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

            {/* Active Sessions */}
            <Text style={styles.sessionsTitle}>Queue ({activeTokens.length})</Text>
            <View style={styles.sessionsList}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading sessions...</Text>
                ) : !staffActivity ? (
                    <Text style={styles.emptyText}>No activity assigned to this staff member</Text>
                ) : activeTokens.length === 0 ? (
                    <Text style={styles.emptyText}>No active sessions for {staffActivity.name}</Text>
                ) : (
                    activeTokens.map((token) => {
                        const timeRemaining = getSessionTimeRemaining(token);
                        return (
                            <View key={token.id} style={styles.sessionCard}>
                                <View style={styles.sessionLeft}>
                                    <View style={styles.sessionIcon}>
                                        <MaterialIcons name="child-care" size={20} color={COLORS.primary} />
                                    </View>
                                    <View>
                                        <Text style={styles.sessionId}>#{token.code}</Text>
                                        <Text style={styles.sessionZone}>{token.name}</Text>
                                        <Text style={styles.sessionUser}>{token.username || 'Guest'}</Text>
                                    </View>
                                </View>
                                <View style={styles.sessionRight}>
                                    <Text style={[styles.sessionTime, { color: getTimeColor(timeRemaining) }]}>
                                        {timeRemaining}
                                    </Text>
                                    <Text style={styles.sessionLabel}>Time Remaining</Text>
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
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
        shadowRadius: 4, elevation: 2, marginBottom: 16,
    },
    statusTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900 },
    statusValue: { fontSize: 14, fontWeight: '500', marginTop: 4 },
    occupancyCard: {
        marginHorizontal: 16, backgroundColor: COLORS.white, borderRadius: 12,
        padding: 20, borderWidth: 1, borderColor: COLORS.slate100,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
        shadowRadius: 4, elevation: 2, marginBottom: 24,
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
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
        shadowRadius: 4, elevation: 2,
    },
    sessionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sessionIcon: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(46,125,50,0.1)', alignItems: 'center', justifyContent: 'center',
    },
    sessionId: { fontSize: 14, fontWeight: '700', color: COLORS.slate900 },
    sessionZone: { fontSize: 12, color: COLORS.slate500, marginTop: 2 },
    sessionUser: { fontSize: 11, color: COLORS.slate400, marginTop: 2 },
    sessionRight: { alignItems: 'flex-end' },
    sessionTime: { fontSize: 14, fontWeight: '700', marginTop: 2 },
    sessionLabel: { fontSize: 11, color: COLORS.slate500, marginTop: 2 },
    loadingText: { fontSize: 14, color: COLORS.slate500, textAlign: 'center', padding: 20 },
    emptyText: { fontSize: 14, color: COLORS.slate400, textAlign: 'center', padding: 20 },
    cameraView: { marginHorizontal: 16, height: 192, borderRadius: 12, overflow: 'hidden', marginTop: 20, position: 'relative', backgroundColor: COLORS.slate200 },
    cameraImage: { ...StyleSheet.absoluteFillObject, opacity: 0.8 },
    cameraOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end', padding: 16,
    },
    cameraLabel: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});
