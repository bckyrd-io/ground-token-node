import { COLORS } from '@/constants/theme';
import { showImmediateNotification } from '@/utils/notifications';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useStore } from '../store';
import { PlayTimerSheet } from '@/components/screens/PlayTimerSheet';
import { RatingFeedbackSheet } from '@/components/screens/RatingFeedbackSheet';

export default function MyTokensScreen() {
    const { tokens, fetchTokens, updateToken, profile, serverIp } = useStore();
    const playTimerRef = useRef<BottomSheetModal>(null);
    const ratingFeedbackRef = useRef<BottomSheetModal>(null);
    const [selectedTokenId, setSelectedTokenId] = useState<string>('');
    const [selectedActivityId, setSelectedActivityId] = useState<string>('');
    const previousTokensRef = useRef(tokens);
    const notifiedTokenIdsRef = useRef<Set<string>>(new Set());
    const navigatedTokenIdsRef = useRef<Set<string>>(new Set());

    // Check for token status changes and notify when promoted to ready
    useEffect(() => {
        const previousTokens = previousTokensRef.current;

        tokens.forEach(token => {
            const previousToken = previousTokens.find(t => t.id === token.id);
            if (previousToken && previousToken.status === 'queue' && token.status === 'ready') {
                // Token was promoted from queue to ready - notify visitor only once
                if (!notifiedTokenIdsRef.current.has(token.id)) {
                    showImmediateNotification(
                        'It\u2019s Your Turn!',
                        `Token #${token.code} for ${token.name} is now ready. Show your QR code to the staff!`,
                        { tokenId: token.id, type: 'token_ready' },
                        'queue-alerts'
                    );
                    notifiedTokenIdsRef.current.add(token.id);
                }
            }

            // Auto-present PlayTimerSheet when token becomes 'in_use'
            if (previousToken && previousToken.status === 'ready' && token.status === 'in_use') {
                if (token.activityType !== 'food' && !navigatedTokenIdsRef.current.has(token.id)) {
                    setSelectedTokenId(String(token.id));
                    setTimeout(() => playTimerRef.current?.present(), 300);
                    navigatedTokenIdsRef.current.add(token.id);
                }
            }
        });

        previousTokensRef.current = tokens;
    }, [tokens]);

    useFocusEffect(
        useCallback(() => {
            if (profile?.id) {
                const profileId = profile.id;
                fetchTokens(profileId);
                
                // Poll every 5 seconds to detect status changes (e.g., staff scanned token)
                const interval = setInterval(() => {
                    fetchTokens(profileId);
                }, 5000);
                
                return () => clearInterval(interval);
            }
        }, [fetchTokens, profile?.id])
    );

    return (
        <>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {tokens.map((token) => (
                <TouchableOpacity
                    key={token.id}
                    style={[styles.card]}
                    activeOpacity={token.status === 'ready' || token.status === 'in_use' ? 0.7 : 1}
                    onPress={async () => {
                        if (token.status === 'ready') {
                            if (token.activityType === 'food') {
                                setSelectedActivityId(String(token.activityId));
                                setTimeout(() => ratingFeedbackRef.current?.present(), 100);
                            } else {
                                // Start session by calling backend endpoint
                                try {
                                    const response = await fetch(`${serverIp}/api/tokens/${token.id}/start`, {
                                        method: 'POST',
                                    });
                                    const result = await response.json();

                                    if (result.success) {
                                        // Update token with expiresAt from response so timer has correct data
                                        if (result.token?.expiresAt) {
                                            updateToken(token.id, {
                                                status: 'in_use',
                                                expiresAt: result.token.expiresAt
                                            });
                                        }
                                        // Session started successfully, open PlayTimerSheet
                                        setSelectedTokenId(String(token.id));
                                        setTimeout(() => playTimerRef.current?.present(), 100);
                                    } else {
                                        console.error('Failed to start session:', result.message);
                                    }
                                } catch (error) {
                                    console.error('Error starting session:', error);
                                }
                            }
                        } else if (token.status === 'in_use') {
                            // Session already started, show PlayTimerSheet directly
                            if (token.activityType !== 'food') {
                                setSelectedTokenId(String(token.id));
                                setTimeout(() => playTimerRef.current?.present(), 100);
                            }
                        }
                    }}
                >
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.activityName}>{token.name}</Text>
                            <Text style={styles.tokenCode}>{token.code}</Text>
                        </View>
                        {token.status === 'ready' || token.status === 'in_use' ? (
                            <View style={[styles.readyBadge, token.activityType === 'food' && styles.foodReadyBadge]}>
                                <Text style={styles.readyBadgeText}>
                                    {token.activityType === 'food' ? 'Ready to Serve' : 'Ready to Play'}
                                </Text>
                            </View>
                        ) : (
                            <View style={[styles.queueBadge, token.activityType === 'food' && styles.foodQueueBadge]}>
                                <Text style={styles.queueBadgeText}>
                                    {token.activityType === 'food' ? 'Order #' : 'Queue Position: '}{token.queuePosition}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* QR Code */}
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={token.code}
                            size={192}
                            color="#000000"
                            backgroundColor={COLORS.white}
                        />
                        {/* Corner Accents */}
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                </TouchableOpacity>
            ))}

            {/* Instructions */}
            <Text style={styles.instructions}>
                Show the QR code to the attendant when your number is called, your order is ready, or your status is Ready.
            </Text>
        </ScrollView>
        <PlayTimerSheet
            ref={playTimerRef}
            tokenId={selectedTokenId}
            onFinish={(activityId) => {
                setSelectedActivityId(String(activityId));
                setTimeout(() => ratingFeedbackRef.current?.present(), 400);
            }}
        />
        <RatingFeedbackSheet ref={ratingFeedbackRef} activityId={selectedActivityId} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    scrollContent: {
        padding: 16,
        gap: 24,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.slate100,
    },
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    activityName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    tokenCode: {
        fontSize: 12,
        color: COLORS.slate500,
        fontWeight: '500',
        marginTop: 2,
    },
    readyBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 9999,
    },
    readyBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.white,
    },
    queueBadge: {
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: 'rgba(46, 125, 50, 0.2)',
    },
    queueBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
    },
    foodReadyBadge: {
        backgroundColor: '#f97316', // Orange for food
    },
    foodQueueBadge: {
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderColor: 'rgba(249, 115, 22, 0.2)',
    },
    qrContainer: {
        width: '100%',
        padding: 12,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    qrImage: {
        width: 192,
        height: 192,
    },
    corner: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderColor: COLORS.primary,
    },
    topLeft: {
        top: -1, left: -1,
        borderTopWidth: 2, borderLeftWidth: 2,
        borderTopLeftRadius: 2,
    },
    topRight: {
        top: -1, right: -1,
        borderTopWidth: 2, borderRightWidth: 2,
        borderTopRightRadius: 2,
    },
    bottomLeft: {
        bottom: -1, left: -1,
        borderBottomWidth: 2, borderLeftWidth: 2,
        borderBottomLeftRadius: 2,
    },
    bottomRight: {
        bottom: -1, right: -1,
        borderBottomWidth: 2, borderRightWidth: 2,
        borderBottomRightRadius: 2,
    },
    instructions: {
        fontSize: 12,
        color: COLORS.slate500,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 16,
    },
});
