import { COLORS } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store';

export default function ActivityCatalogScreen() {
    const router = useRouter();
    const { activities, fetchActivities } = useStore();

    // Filter only play activities for the catalog
    const playActivities = activities.filter(activity => activity.type === 'play');

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {playActivities.map((activity) => (
                <TouchableOpacity
                    key={activity.id}
                    style={styles.card}
                    onPress={() => router.push({ pathname: '/activityDetailScreen', params: { id: activity.id } })}
                    activeOpacity={0.7}
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
                            onPress={() => router.push({ pathname: '/confirmPaymentScreen', params: { id: activity.id } })}
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
        borderWidth: 1,
        borderColor: COLORS.slate200,
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
