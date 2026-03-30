import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlayTimerScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                    <MaterialIcons name="close" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Play Timer</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {/* Timer */}
                <View style={styles.timerSection}>
                    <View style={styles.timerCircle}>
                        <Text style={styles.timerValue}>24:59</Text>
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
                            <Text style={styles.detailsValue}>Token: #GT-4829</Text>
                        </View>
                    </View>

                    <View style={styles.detailsDivider} />

                    <View style={styles.zoneRow}>
                        <View>
                            <Text style={styles.detailsLabel}>Active Zone</Text>
                            <Text style={styles.zoneValue}>Jungle Safari Zone</Text>
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

                {/* Safety Reminder */}
                <View style={styles.reminderCard}>
                    <MaterialIcons name="warning" size={20} color={COLORS.amber600} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.reminderTitle}>Safety Reminder</Text>
                        <Text style={styles.reminderText}>
                            Please ensure the Token holder stays within the Jungle Safari Zone boundaries. Staff are available at the entrance for assistance.
                        </Text>
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
});
