import { COLORS } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store';

export default function OrderFoodScreen() {
    const router = useRouter();
    const { activities, fetchActivities } = useStore();

    // Filter only food items
    const foodItems = activities.filter(activity => activity.type === 'food');

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Text style={styles.headerSubtitle}>Browse and order delicious meals</Text>
            </View>

            {foodItems.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No food items available</Text>
                </View>
            ) : (
                foodItems.map((food) => (
                    <TouchableOpacity
                        key={food.id}
                        style={styles.card}
                        onPress={() => router.push({ pathname: '/activityDetailScreen', params: { id: food.id } })}
                        activeOpacity={0.7}
                    >
                        {/* Image */}
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: food.image }} style={styles.image} contentFit="cover" />
                            {/* Availability Badge */}
                            <View style={styles.availabilityBadge}>
                                <Text style={styles.availabilityText}>
                                    {food.currentOccupancy < food.capacity ? 'Available' : 'Sold Out'}
                                </Text>
                            </View>
                        </View>

                        {/* Content */}
                        <View style={styles.cardContent}>
                            <View style={styles.titleRow}>
                                <Text style={styles.cardTitle}>{food.name}</Text>
                                <View style={styles.priceChip}>
                                    <Text style={styles.priceText}>{food.price}</Text>
                                </View>
                            </View>
                            <Text style={styles.cardDescription}>{food.description}</Text>
                            <TouchableOpacity
                                style={styles.orderButton}
                                onPress={() => router.push({ pathname: '/confirmPaymentScreen', params: { id: food.id } })}
                            >
                                <Text style={styles.orderButtonText}>Order Food</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))
            )}
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
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.slate500,
        marginTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.slate400,
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
    availabilityBadge: {
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
    availabilityText: {
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
        backgroundColor: '#f97316', // Orange for food
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
    orderButton: {
        width: '100%',
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: '#f97316', // Orange for food
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    orderButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#f97316',
    },
});
