import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    bgLight: '#ffffff',
    slate900: '#0f172a',
    slate500: '#64748b',
    slate400: '#94a3b8',
    slate200: '#e2e8f0',
    slate100: '#f1f5f9',
};

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const BAR_HEIGHTS = [45, 35, 55, 50, 95, 100, 75];

export default function AdminDashboardScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* Revenue Card */}
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Total Revenue</Text>
                <View style={styles.revenueRow}>
                    <Text style={styles.currencyPrefix}>MWK</Text>
                    <Text style={styles.revenueValue}>1,250,000</Text>
                </View>
                <View style={styles.trendRow}>
                    <MaterialIcons name="trending-up" size={18} color={COLORS.primary} />
                    <Text style={styles.trendText}>+12% vs last month</Text>
                </View>
            </View>

            {/* Export Button */}
            <TouchableOpacity style={styles.exportButton} activeOpacity={0.8}>
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
                    {DAYS.map((day, index) => {
                        const height = BAR_HEIGHTS[index];
                        const isPeak = height >= 90;
                        return (
                            <View key={day} style={styles.barColumn}>
                                <View style={styles.barWrapper}>
                                    <View style={[
                                        styles.bar,
                                        {
                                            height: `${height}%`,
                                            backgroundColor: isPeak ? COLORS.primary : 'rgba(46,125,50,0.2)',
                                        },
                                    ]} />
                                </View>
                                <Text style={[styles.barLabel, isPeak && styles.barLabelActive]}>{day}</Text>
                            </View>
                        );
                    })}
                </View>
                <Text style={styles.chartFooter}>
                    Peak visitation identified on{' '}
                    <Text style={styles.chartHighlight}>Fridays</Text> and{' '}
                    <Text style={styles.chartHighlight}>Saturdays</Text>
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
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
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
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
        shadowRadius: 4, elevation: 3,
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
});
