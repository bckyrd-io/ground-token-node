import { COLORS } from '@/constants/theme';
import { initializeNotifications, showImmediateNotification } from '@/utils/notifications';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useStore } from '../store';

export default function MyTokensScreen() {
    const { tokens, fetchTokens, profile } = useStore();
    const router = useRouter();
    const previousTokensRef = useRef(tokens);

    // Initialize notifications on mount
    useEffect(() => {
        initializeNotifications();
    }, []);

    // Check for token status changes and notify when promoted to ready
    useEffect(() => {
        const previousTokens = previousTokensRef.current;
        
        tokens.forEach(token => {
            const previousToken = previousTokens.find(t => t.id === token.id);
            if (previousToken && previousToken.status === 'queue' && token.status === 'ready') {
                // Token was promoted from queue to ready - notify visitor
                showImmediateNotification(
                    "It's Your Turn!",
                    `Token #${token.code} for ${token.name} is now ready. Show your QR code to the staff!`,
                    { tokenId: token.id, type: 'token_ready' },
                    'queue-alerts'
                );
            }
        });
        
        previousTokensRef.current = tokens;
    }, [tokens]);

    useFocusEffect(
        useCallback(() => {
            if (profile?.id) {
                fetchTokens(profile.id);
            }
        }, [fetchTokens, profile?.id])
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {tokens.map((token) => (
                <TouchableOpacity 
                    key={token.id} 
                    style={[styles.card, token.status === 'ready' && { borderColor: COLORS.primary, borderWidth: 2 }]}
                    activeOpacity={token.status === 'ready' ? 0.7 : 1}
                    onPress={() => {
                        if (token.status === 'ready') {
                            router.push({ pathname: '/playTimerScreen', params: { tokenId: token.id } });
                        }
                    }}
                >
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.activityName}>{token.name}</Text>
                            <Text style={styles.tokenCode}>{token.code}</Text>
                        </View>
                        {token.status === 'ready' ? (
                            <View style={styles.readyBadge}>
                                <Text style={styles.readyBadgeText}>Ready to Play</Text>
                            </View>
                        ) : (
                            <View style={styles.queueBadge}>
                                <Text style={styles.queueBadgeText}>Queue Position: {token.queuePosition}</Text>
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
                Show the QR code for your activity to the attendant when your number is called or your status is 'Ready'.
            </Text>
        </ScrollView>
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
