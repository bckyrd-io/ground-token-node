import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    bgLight: '#F8FAF8',
    slate700: '#334155',
    slate500: '#64748b',
    slate400: '#94a3b8',
    slate100: '#f1f5f9',
    amber400: '#fbbf24',
    green500: '#22c55e',
    red500: '#ef4444',
};

const ACTIVITIES = [
    {
        id: '1',
        name: 'Trampoline Park',
        description: 'High-energy jumping zone with foam pits and safety nets.',
        price: '$12.00',
        waitTime: '15 min wait',
        waitColor: COLORS.amber400,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApQ1G0cnfzrvTgBfuZPm_XLdFdWhsiiQW5mAJGTiwvqW53aygfmyirVGw8-tDljGD9kF-nQUX5OSrIESvN0BbFxkQMja3RW2C7cy7AeuM2oFN652BdGkQtexEYJKQUEcqj5-59FE3ml5uYrThwRxrIK058cR6Qb2U-tPPRYXLOfhY-b3ihFxrKIGA2DlzQ9_sD2Dberk9yN99XjtgAv8PZ3rs6NLJci25LDEhSTrNdI_Pk8LbJv9txOtOLEcTxj3C4KGcN8xDsNotS',
    },
    {
        id: '2',
        name: 'Ocean Ball Pit',
        description: 'A sea of 50,000 colorful balls for endless sensory fun.',
        price: '$8.00',
        waitTime: 'No wait',
        waitColor: COLORS.green500,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi22TPhmvuW6Y0uA_ZYfZ-xwrmY0fHR8qrVZkISGZckcIvwqryAtoIRoMGFFJ1PJ04WuLNYIHoAbVvbiB9e5epol_zhWFhE4vds6Jt4d-LqWGaGWFilyBo4zCShDEKXXQI3GqszHEy-9PG0YWeMO2K7lqTAvO8Ht4dwt_vPPpgfHWbxk_9T-T_JU5acRbLWoNBzZGQEK2VSodLnPLg4ioAfxPqDNxNUHq5t7F1kKDHMogRrAxsWAe86bDbUtGHmOW9P3UgGR8O__15',
    },
    {
        id: '3',
        name: 'Rainbow Giant Slide',
        description: 'Experience the thrill of our 3-story wavy rainbow slide.',
        price: '$10.00',
        waitTime: '30 min wait',
        waitColor: COLORS.red500,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZlj2BweUn0dTyiIxiLo-X6W4et11JsdTOY7c6n3MZjwnostj9awanK0UlRLaLTQ6h4_XSi5n8AtxF-QAvDJ9yBedxXdIIXzxh-k5upWu1wz7LWXQgP0Ha4cTa6NJ8ErXylSz3B4JTPMO43-gfWu-llEV5AUnNaMGvN5G_-uT6yo4yLExY_NRYIm71HlS2Ep3WNiYpyE7fKu-FFAiAe2you_Q4_uaPiM0c_IOaA_7xLdbKENZiACkJMThzVR-7sEBho3ExoZXcCvHl',
    },
];

export default function ActivityCatalogScreen() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {ACTIVITIES.map((activity) => (
                <TouchableOpacity
                    key={activity.id}
                    style={styles.card}
                    activeOpacity={0.9}
                    onPress={() => router.push('/activityDetailScreen' as any)}
                >
                    {/* Image */}
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: activity.image }} style={styles.image} contentFit="cover" />
                        {/* Wait Time Badge */}
                        <View style={styles.waitBadge}>
                            <View style={[styles.waitDot, { backgroundColor: activity.waitColor }]} />
                            <Text style={styles.waitText}>{activity.waitTime}</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.cardContent}>
                        <View style={styles.titleRow}>
                            <Text style={styles.cardTitle}>{activity.name}</Text>
                            <View style={styles.priceChip}>
                                <Text style={styles.priceText}>{activity.price}</Text>
                            </View>
                        </View>
                        <Text style={styles.cardDescription}>{activity.description}</Text>
                        <TouchableOpacity
                            style={styles.bookButton}
                            onPress={() => router.push('/activityDetailScreen' as any)}
                        >
                            <Text style={styles.bookButtonText}>Book Access</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    scrollContent: {
        padding: 20,
        gap: 16,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    imageContainer: {
        position: 'relative',
        height: 192,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    waitBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    waitDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    waitText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.slate700,
    },
    cardContent: {
        padding: 16,
        gap: 12,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        flex: 1,
    },
    priceChip: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.white,
    },
    cardDescription: {
        fontSize: 14,
        color: COLORS.slate500,
        lineHeight: 20,
    },
    bookButton: {
        width: '100%',
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    bookButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
    },
});
