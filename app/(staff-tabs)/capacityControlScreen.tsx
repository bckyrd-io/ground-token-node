import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

const SESSIONS = [
    { id: 'GT-4829', zone: 'Ball Pit Area', time: '12:45 left', timeColor: COLORS.orange600 },
    { id: 'GT-9214', zone: 'Slide Tower', time: '45:20 left', timeColor: COLORS.primary },
    { id: 'GT-1105', zone: 'Obstacle Course', time: '28:15 left', timeColor: COLORS.primary },
    { id: 'GT-8832', zone: 'General Play', time: '02:10 left', timeColor: COLORS.red600 },
];

export default function CapacityControlScreen() {
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* Zone Title */}
            <View style={styles.zoneHeader}>
                <Text style={styles.zoneName}>Jungle Safari Zone</Text>
                <Text style={styles.zoneSubtitle}>Managed by Gelato Kids Staff</Text>
            </View>

            {/* Status Toggle */}
            <View style={styles.statusCard}>
                <View>
                    <Text style={styles.statusTitle}>Play Area Status</Text>
                    <Text style={[styles.statusValue, { color: isOpen ? COLORS.primary : COLORS.red600 }]}>
                        {isOpen ? 'Currently Available' : 'Closed'}
                    </Text>
                </View>
                <Switch
                    value={isOpen}
                    onValueChange={setIsOpen}
                    trackColor={{ false: COLORS.slate200, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                />
            </View>

            {/* Occupancy Card */}
            <View style={styles.occupancyCard}>
                <View style={styles.occupancyHeader}>
                    <View>
                        <Text style={styles.occupancyLabel}>Current Occupancy</Text>
                        <Text style={styles.occupancyValue}>
                            42 <Text style={styles.occupancyMax}>/ 50 kids</Text>
                        </Text>
                    </View>
                    <View style={styles.percentBadge}>
                        <Text style={styles.percentText}>84% Full</Text>
                    </View>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '84%' }]} />
                </View>
                <Text style={styles.spotsText}>8 spots remaining</Text>
            </View>

            {/* Active Sessions */}
            <Text style={styles.sessionsTitle}>Active Sessions</Text>
            <View style={styles.sessionsList}>
                {SESSIONS.map((session) => (
                    <View key={session.id} style={styles.sessionCard}>
                        <View style={styles.sessionLeft}>
                            <View style={styles.sessionIcon}>
                                <MaterialIcons name="child-care" size={20} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={styles.sessionId}>#{session.id}</Text>
                                <Text style={styles.sessionZone}>{session.zone}</Text>
                            </View>
                        </View>
                        <View style={styles.sessionRight}>
                            <Text style={[styles.sessionTime, { color: session.timeColor }]}>{session.time}</Text>
                            <Text style={styles.sessionLabel}>Time Remaining</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Zone Camera View */}
            <View style={styles.cameraView}>
                <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBno8XAFBPNUOUPQUm313QJGOhfThx8y-96N0xFS7OskkYujrlDS0LMyaz2tYo5raa64jAr3uZz-zYK449OSzwqvH3K1-TTMStH45eWwYIn2hm6Ar2gGYu_X2h7JRI8lf5N29DImn519bg-gMPat27lU4JwQm0uQtq3Qiphpcrk1d8N4j5KRlcwmj5jJm-7HaNg5ZXO-7u9Y8SJdUvM6RC7bg9lpCxrAeLA8Bw3HV_kNHdjrYCedoVAqR80saLqsgMt5PtTUDZN99s5' }}
                    style={styles.cameraImage}
                    contentFit="cover"
                />
                <View style={styles.cameraOverlay}>
                    <Text style={styles.cameraLabel}>Zone View: Camera 04</Text>
                </View>
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
    sessionRight: { alignItems: 'flex-end' },
    sessionTime: { fontSize: 14, fontWeight: '700' },
    sessionLabel: { fontSize: 10, color: COLORS.slate400, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
    cameraView: { marginHorizontal: 16, height: 192, borderRadius: 12, overflow: 'hidden', position: 'relative', backgroundColor: COLORS.slate200 },
    cameraImage: { ...StyleSheet.absoluteFillObject, opacity: 0.8 },
    cameraOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end', padding: 16,

    },
    cameraLabel: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});
