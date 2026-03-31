import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showToast } from '../toast';

// Platform-specific imports
let FileSystem: any = null;
let Sharing: any = null;

if (Platform.OS !== 'web') {
    FileSystem = require('expo-file-system');
    Sharing = require('expo-sharing');
}

interface DashboardData {
    totalRevenue: number;
    totalTokens: number;
    completedTokens: number;
    totalCapacity: number;
    totalOccupancy: number;
    activeStaff: number;
    weeklyData: Array<{ date: string; visitors: number }>;
}

export default function AdminDashboardScreen() {
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.175:5000';
            const response = await fetch(`${serverIp}/api/admin/dashboard`);
            
            if (response.ok) {
                const data = await response.json();
                setDashboardData({
                    totalRevenue: Number(data.totalRevenue),
                    totalTokens: Number(data.totalTokens),
                    completedTokens: Number(data.completedTokens),
                    totalCapacity: Number(data.totalCapacity),
                    totalOccupancy: Number(data.totalOccupancy),
                    activeStaff: Number(data.activeStaff),
                    weeklyData: Array.isArray(data.weeklyData)
                        ? data.weeklyData.map((w: { date: string; visitors: unknown }) => ({
                              date: w.date,
                              visitors: Number(w.visitors),
                          }))
                        : [],
                });
            } else {
                showToast('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            showToast('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportReport = async () => {
        showToast('PDF export temporarily unavailable');
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading dashboard...</Text>
            </View>
        );
    }

    if (!dashboardData) {
        return (
            <View style={styles.errorContainer}>
                <Text>Failed to load dashboard data</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchDashboardData}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

const weekdayShortLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};
    const maxVisitors = Math.max(...dashboardData.weeklyData.map((d) => d.visitors), 1);
    const chartData = dashboardData.weeklyData.map((entry) => {
        const visitorCount = entry.visitors;
        return {
            date: entry.date,
            day: weekdayShortLabel(entry.date),
            visitors: visitorCount,
            height: maxVisitors > 0 ? Math.max(5, (visitorCount / maxVisitors) * 100) : 5,
        };
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* Revenue Card */}
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Total Revenue</Text>
                <View style={styles.revenueRow}>
                    <Text style={styles.currencyPrefix}>MWK</Text>
                    <Text style={styles.revenueValue}>{dashboardData.totalRevenue.toLocaleString()}</Text>
                </View>
                <View style={styles.trendRow}>
                    <MaterialIcons name="trending-up" size={18} color={COLORS.primary} />
                    <Text style={styles.trendText}>
                        {dashboardData.completedTokens} of {dashboardData.totalTokens} completed
                    </Text>
                </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Capacity</Text>
                    <Text style={styles.statValue}>{dashboardData.totalOccupancy}/{dashboardData.totalCapacity}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Active Staff</Text>
                    <Text style={styles.statValue}>{dashboardData.activeStaff}</Text>
                </View>
            </View>

            {/* Export Button */}
            <TouchableOpacity style={styles.exportButton} activeOpacity={0.8} onPress={handleExportReport}>
                <MaterialIcons name="file-download" size={20} color={COLORS.white} />
                <Text style={styles.exportText}>Export Report</Text>
            </TouchableOpacity>

            {/* Visitor Volume Chart */}
            <View style={styles.card}>
                <View style={styles.chartHeader}>
                    <View>
                        <Text style={styles.chartTitle}>Visitor Volume</Text>
                        <Text style={styles.chartSubtitle}>Weekly Attendance Distribution</Text>
                    </View>
                    <View style={styles.chartNav}>
                        <TouchableOpacity style={styles.chartNavBtn}>
                            <MaterialIcons name="chevron-left" size={16} color={COLORS.slate400} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chartNavBtn}>
                            <MaterialIcons name="chevron-right" size={16} color={COLORS.slate400} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bar Chart */}
                <View style={styles.chartContainer}>
                    {chartData.map((item, index) => {
                        const isPeak = item.visitors > 0 && item.visitors >= maxVisitors * 0.6; // Peak if 60% or more of max
                        return (
                            <View key={item.date} style={styles.barColumn}>
                                <View style={styles.barWrapper}>
                                    <View style={[
                                        styles.bar,
                                        {
                                            height: `${item.height}%`,
                                            backgroundColor: isPeak ? COLORS.primary : 'rgba(46,125,50,0.2)',
                                        },
                                    ]} />
                                </View>
                                <Text style={[styles.barLabel, isPeak && styles.barLabelActive]}>{item.day}</Text>
                            </View>
                        );
                    })}
                </View>
                <Text style={styles.chartFooter}>
                    Peak visitation identified on{' '}
                    <Text style={styles.chartHighlight}>
                        {chartData.filter(d => d.visitors > 0 && d.visitors >= maxVisitors * 0.6).map(d => d.day).join(', ') || 'No peak days'}
                    </Text>
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    scrollContent: { padding: 16, gap: 16, paddingBottom: 32 },
    card: {
        backgroundColor: COLORS.white, borderRadius: 12, padding: 24,
        borderWidth: 1, borderColor: COLORS.slate100,
    },
    cardLabel: { fontSize: 12, color: COLORS.slate500, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
    revenueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 8 },
    currencyPrefix: { fontSize: 14, fontWeight: '600', color: COLORS.slate400 },
    revenueValue: { fontSize: 30, fontWeight: '700', color: COLORS.slate900 },
    trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
    trendText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
    exportButton: {
        backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    exportText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    chartTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900 },
    chartSubtitle: { fontSize: 14, color: COLORS.slate500, marginTop: 4 },
    chartNav: { flexDirection: 'row', gap: 8 },
    chartNavBtn: {
        width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: COLORS.slate200,
        alignItems: 'center', justifyContent: 'center',
    },
    chartContainer: {
        flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
        height: 192, paddingTop: 16, paddingHorizontal: 8, gap: 12,
    },
    barColumn: { flex: 1, alignItems: 'center', gap: 8, height: '100%' },
    barWrapper: { flex: 1, width: '100%', justifyContent: 'flex-end' },
    bar: { width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 },
    barLabel: { fontSize: 10, fontWeight: '500', color: COLORS.slate400 },
    barLabelActive: { fontWeight: '700', color: COLORS.primary },
    chartFooter: { fontSize: 12, color: COLORS.slate500, textAlign: 'center', marginTop: 24 },
    chartHighlight: { fontWeight: '700', color: COLORS.primary, fontSize: 14 },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: COLORS.bgLight 
    },
    errorContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: COLORS.bgLight,
        paddingHorizontal: 32 
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8
    },
    retryText: {
        color: COLORS.white,
        fontWeight: '600'
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.slate100,
        alignItems: 'center'
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.slate500,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.slate900,
        marginTop: 4
    },
});
