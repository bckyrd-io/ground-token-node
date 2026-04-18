import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
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
        try {
            showToast('Generating report...', 'success');
            
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.175:5000';
            const response = await fetch(`${serverIp}/api/admin/export-report`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch report data');
            }
            
            const reportData = await response.json();
            
            // Generate HTML content for the PDF
            const htmlContent = generateReportHTML(reportData);
            
            // Create PDF from HTML
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                base64: false
            });
            
            // Share the PDF file
            if (Sharing && await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Export Report',
                    UTI: 'com.adobe.pdf'
                });
                showToast('Report exported successfully', 'success');
            } else {
                showToast('PDF saved to: ' + uri, 'success');
            }
        } catch (error) {
            console.error('Export report error:', error);
            showToast('Failed to export report. Please try again.', 'error');
        }
    };

    const generateReportHTML = (data: any) => {
        const today = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const summary = data.summary || {};
        const activities = data.activities || [];
        const staff = data.staff || [];
        const recentTokens = data.recentTokens || [];
        
        const activityRows = activities.map((a: any) => `
            <tr>
                <td>${a.name || 'Unknown'}</td>
                <td>${a.capacity || '0/0'}</td>
                <td>${Math.round(a.percent || 0)}%</td>
            </tr>
        `).join('');
        
        const staffRows = staff.map((s: any) => `
            <tr>
                <td>${s.name || 'Unknown'}</td>
                <td>${s.zone || 'Unassigned'}</td>
                <td>${s.status || 'Unknown'}</td>
            </tr>
        `).join('');
        
        const tokenRows = recentTokens.slice(0, 10).map((t: any) => `
            <tr>
                <td>${t.code || 'N/A'}</td>
                <td>${t.activity || 'Unknown'}</td>
                <td>${t.status || 'Unknown'}</td>
                <td>${t.amount ? 'MWK ' + t.amount : 'N/A'}</td>
            </tr>
        `).join('');
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                    h1 { color: #2E7D32; border-bottom: 3px solid #2E7D32; padding-bottom: 10px; }
                    h2 { color: #555; margin-top: 30px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .date { color: #777; font-size: 14px; }
                    .summary-box { 
                        background: #f5f5f5; 
                        border-left: 4px solid #2E7D32; 
                        padding: 20px; 
                        margin: 20px 0;
                        border-radius: 4px;
                    }
                    .summary-item { 
                        display: inline-block; 
                        margin-right: 40px; 
                        margin-bottom: 10px;
                    }
                    .summary-label { 
                        font-size: 12px; 
                        color: #777; 
                        text-transform: uppercase;
                    }
                    .summary-value { 
                        font-size: 24px; 
                        font-weight: bold; 
                        color: #2E7D32;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 15px;
                    }
                    th { 
                        background: #2E7D32; 
                        color: white; 
                        padding: 12px; 
                        text-align: left;
                        font-size: 12px;
                        text-transform: uppercase;
                    }
                    td { 
                        padding: 12px; 
                        border-bottom: 1px solid #ddd;
                        font-size: 14px;
                    }
                    tr:nth-child(even) { background: #f9f9f9; }
                    .footer { 
                        margin-top: 40px; 
                        text-align: center; 
                        font-size: 12px; 
                        color: #999;
                        border-top: 1px solid #ddd;
                        padding-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Gelato Kids - Admin Report</h1>
                    <p class="date">Generated on ${today}</p>
                </div>
                
                <div class="summary-box">
                    <h2>Summary</h2>
                    <div class="summary-item">
                        <div class="summary-label">Total Tokens</div>
                        <div class="summary-value">${summary.totalTokens || 0}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Completed</div>
                        <div class="summary-value">${summary.completedTokens || 0}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Revenue</div>
                        <div class="summary-value">MWK ${(summary.totalRevenue || 0).toLocaleString()}</div>
                    </div>
                </div>
                
                <h2>Activities Status</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Activity Name</th>
                            <th>Capacity</th>
                            <th>Occupancy %</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${activityRows || '<tr><td colspan="3">No activities found</td></tr>'}
                    </tbody>
                </table>
                
                <h2>Staff Overview</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Zone</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${staffRows || '<tr><td colspan="3">No staff found</td></tr>'}
                    </tbody>
                </table>
                
                <h2>Recent Transactions</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Token Code</th>
                            <th>Activity</th>
                            <th>Status</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tokenRows || '<tr><td colspan="4">No recent transactions</td></tr>'}
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>Gelato Kids Activity Center - Administrative Report</p>
                    <p>This report was generated automatically from the management system.</p>
                </div>
            </body>
            </html>
        `;
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
