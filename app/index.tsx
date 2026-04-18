import { COLORS } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        image: require('../assets/images/gelato1.jpg'),
        title: 'Token Access Control',
        description: 'System for Gelato play area and food.',
    },
    {
        id: '2',
        image: require('../assets/images/gelato2.jpg'),
        title: 'Fun Play Zones',
        description: 'Safe and exciting play areas designed for kids of all ages.',
    },
    {
        id: '3',
        image: require('../assets/images/gelato3.jpg'),
        title: 'Sweet Treats',
        description: 'A variety of flavors and toppings to satisfy every craving.',
    },
    {
        id: '4',
        image: require('../assets/images/gelato4.jpg'),
        title: 'Family Friendly',
        description: 'The perfect destination for family fun and memorable moments.',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Auto-slide every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % SLIDES.length;
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const renderItem = ({ item }: { item: typeof SLIDES[0] }) => (
        <View style={styles.slideContainer}>
            <View style={styles.imageCard}>
                <Image
                    source={item.image}
                    style={styles.heroImage}
                    contentFit="cover"
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header Branding */}
                <View style={styles.header}>
                    <Text style={styles.brandName}>Gelato Carnival</Text>
                    <Text style={styles.brandTagline}>Safe & Fun Play Access</Text>
                </View>

                {/* Carousel Section */}
                <View style={styles.carouselSection}>
                    <FlatList
                        ref={flatListRef}
                        data={SLIDES}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                        snapToAlignment="center"
                        decelerationRate="fast"
                        snapToInterval={width - 48 + 16}
                        contentContainerStyle={styles.flatListContent}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        getItemLayout={(_, index) => ({
                            length: width - 48 + 16,
                            offset: (width - 48 + 16) * index,
                            index,
                        })}
                        onScrollToIndexFailed={(info) => {
                            console.warn('Scroll to index failed:', info);
                        }}
                    />

                    <Animated.Text style={[styles.slideTitle, { opacity: fadeAnim }]}>
                        {SLIDES[activeIndex].title}
                    </Animated.Text>
                    <Animated.Text style={[styles.slideDescription, { opacity: fadeAnim }]}>
                        {SLIDES[activeIndex].description}
                    </Animated.Text>

                    {/* Carousel Indicators */}
                    <View style={styles.indicators}>
                        {SLIDES.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    flatListRef.current?.scrollToIndex({
                                        index,
                                        animated: true,
                                    });
                                }}
                            >
                                <View
                                    style={[
                                        styles.dot,
                                        index === activeIndex && styles.dotActive,
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.9}
                        onPress={() => router.push('/(visitor-tabs)/activityCatalogScreen')}
                    >
                        <Text style={styles.primaryButtonText}>Get 
                            started
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/loginScreen')}
                    >
                        <Text style={styles.secondaryLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: 32,
    },
    brandName: {
        fontSize: 30,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    brandTagline: {
        fontSize: 14,
        color: COLORS.slate500,
        fontWeight: '500',
        marginTop: 8,
        marginBottom: 16,
    },
    carouselSection: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatListContent: {
        paddingHorizontal: 0,
    },
    separator: {
        width: 16,
    },
    slideContainer: {
        width: width - 48,
    },
    imageCard: {
        width: '100%',
        aspectRatio: 4 / 3,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#f1f5f9',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    slideTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.slate900,
        marginTop: 6,
    },
    slideDescription: {
        fontSize: 14,
        color: COLORS.slate500,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    indicators: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.slate300,
    },
    dotActive: {
        width: 24,
        backgroundColor: COLORS.primary,
    },
    actions: {
        width: '100%',
        paddingBottom: Platform.OS === 'ios' ? 48 : 32,
        alignItems: 'center',
    },
    primaryButton: {
        width: '100%',
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 16,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryLink: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
        paddingVertical: 16,
    },
});
