import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ValidationResultScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
                    <MaterialIcons name="close" size={24} color={COLORS.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Validation Result</Text>
                <View style={{ width: 48 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Success Card */}
                <View style={styles.successCard}>
                    <View style={styles.statusIcon}>
                        <MaterialIcons name="check-circle" size={56} color={COLORS.primary} />
                    </View>
                    <Text style={styles.statusTitle}>Access Granted</Text>

                    {/* User Info */}
                    <View style={styles.userCard}>
                        <View style={styles.avatarCircle}>
                            <MaterialIcons name="person" size={40} color={COLORS.primary} />
                        </View>
                        <Text style={styles.userName}>Leo B.</Text>
                        <View style={styles.zoneRow}>
                            <MaterialIcons name="local-florist" size={16} color={COLORS.primary} />
                            <Text style={styles.zoneName}>Jungle Safari Zone</Text>
                        </View>
                    </View>

                    {/* Pass Details */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Pass Type</Text>
                            <Text style={styles.detailValue}>Full Day Pass</Text>
                        </View>
                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Expiry</Text>
                            <Text style={styles.detailValue}>6:00 PM Today</Text>
                        </View>
                    </View>
                </View>

                {/* Error Reference */}
                <View style={styles.errorBanner}>
                    <View style={styles.errorIcon}>
                        <MaterialIcons name="error" size={20} color={COLORS.error} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.errorTitle}>Invalid Token Issue?</Text>
                        <Text style={styles.errorDesc}>If the pass shows red, it means the session is expired or invalid.</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bgLight, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.white,
        borderBottomWidth: 1, borderBottomColor: COLORS.slate200,
    },
    headerBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900, textAlign: 'center', flex: 1 },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },
    successCard: {
        width: '100%', backgroundColor: COLORS.white, borderRadius: 12,
        padding: 32, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
        shadowRadius: 4, elevation: 2,
    },
    statusIcon: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: 'rgba(46,125,50,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    },
    statusTitle: { fontSize: 30, fontWeight: '700', color: COLORS.slate900, letterSpacing: -0.5, marginBottom: 8 },
    userCard: {
        width: '100%', backgroundColor: COLORS.slate50, borderRadius: 12,
        padding: 24, alignItems: 'center', marginTop: 24,
        borderWidth: 1, borderColor: COLORS.slate100,
    },
    avatarCircle: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: 'rgba(46,125,50,0.1)', alignItems: 'center', justifyContent: 'center',
        borderWidth: 4, borderColor: COLORS.white, marginBottom: 16,
    },
    userName: { fontSize: 24, fontWeight: '700', color: COLORS.slate900, marginBottom: 4 },
    zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    zoneName: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
    detailsGrid: { flexDirection: 'row', gap: 16, width: '100%', marginTop: 24 },
    detailBox: {
        flex: 1, padding: 12, backgroundColor: COLORS.slate50, borderRadius: 8,
    },
    detailLabel: { fontSize: 12, color: COLORS.slate500, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    detailValue: { fontSize: 14, fontWeight: '600', color: COLORS.slate900, marginTop: 4 },
    errorBanner: {
        width: '100%', flexDirection: 'row', alignItems: 'center', gap: 16,
        marginTop: 32, padding: 16, borderRadius: 12,
        backgroundColor: 'rgba(211,47,47,0.05)', borderWidth: 1, borderColor: 'rgba(211,47,47,0.2)',
    },
    errorIcon: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(211,47,47,0.2)', alignItems: 'center', justifyContent: 'center',
    },
    errorTitle: { fontSize: 14, fontWeight: '700', color: COLORS.error },
    errorDesc: { fontSize: 12, color: COLORS.slate600, marginTop: 4 },
});
