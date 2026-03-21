import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useStore } from '../store';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    bgLight: '#f3f4f6',
    slate900: '#0f172a',
    slate500: '#64748b',
    slate100: '#f1f5f9',
};

export default function MyTokensScreen() {
    const { tokens, fetchTokens } = useStore();

    useEffect(() => {
        fetchTokens();
    }, [fetchTokens]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {tokens.map((token) => (
                <View key={token.id} style={styles.card}>
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
                </View>
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
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.slate100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
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
