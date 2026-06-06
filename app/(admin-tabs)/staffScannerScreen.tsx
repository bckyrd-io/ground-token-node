import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useStore } from '../store';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    black: '#000000',
    red: '#ef4444',
    amber: '#f59e0b',
};

export default function StaffScannerScreen() {
    const isFocused = useIsFocused();
    const { serverIp } = useStore();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [validating, setValidating] = useState(false);

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
        if (scanned || validating) return;
        setScanned(true);
        setValidating(true);

        // Extract token code from data (remove prefixes if present)
        let tokenCode = data.trim();
        if (data.includes(':')) {
            tokenCode = data.split(':')[1].trim();
        }

        try {
            // Validate token against backend
            const response = await fetch(`${serverIp}/api/tokens/validate/${tokenCode}`);
            const result = await response.json();

            if (!response.ok) {
                Alert.alert('Validation Error', result.message || 'Failed to validate token', [
                    { text: 'OK', onPress: () => { setScanned(false); setValidating(false); } }
                ]);
                return;
            }

            if (result.valid) {
                // Token is valid and ready
                const token = result.token;
                const isFood = token.activityType === 'food';
                
                if (isFood) {
                    Alert.alert(
                        'Food Order Valid',
                        `Token: ${token.code}\nUser: ${token.username}\n\nThis food order is ready to serve.`,
                        [
                            {
                                text: 'OK',
                                onPress: () => { setScanned(false); setValidating(false); }
                            }
                        ]
                    );
                } else {
                    Alert.alert(
                        'Token Validated',
                        `Token: ${token.code}\nUser: ${token.username}\nActivity: ${token.activityName}\n\nSession is active. Visitor can start play session.`,
                        [
                            {
                                text: 'OK',
                                onPress: () => { setScanned(false); setValidating(false); }
                            }
                        ]
                    );
                }
            } else {
                // Token is invalid/expired/not ready
                Alert.alert(
                    'Token Invalid',
                    `Token: ${tokenCode}\n\n${result.message}`,
                    [
                        {
                            text: 'OK',
                            onPress: () => { setScanned(false); setValidating(false); }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error validating token:', error);
            Alert.alert('Network Error', 'Failed to connect to server. Please try again.', [
                { text: 'OK', onPress: () => { setScanned(false); setValidating(false); } }
            ]);
        }
    };

    if (!permission) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.statusText}>Loading camera...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.statusText}>Camera access denied. Please grant camera permission.</Text>
                <View style={{ marginTop: 20 }}>
                    <Button onPress={requestPermission} title="Grant Permission" color={COLORS.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isFocused ? (
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                    style={StyleSheet.absoluteFillObject}
                />
            ) : (
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: COLORS.black }]} />
            )}

            <View style={styles.overlay} />

            <View style={styles.scannerFrame}>
                <View style={[styles.scannerCorner, styles.scannerTopLeft]} />
                <View style={[styles.scannerCorner, styles.scannerTopRight]} />
                <View style={[styles.scannerCorner, styles.scannerBottomLeft]} />
                <View style={[styles.scannerCorner, styles.scannerBottomRight]} />
                <View style={styles.scanLine} />
            </View>

            <View style={styles.instructionBadge}>
                <Text style={styles.instructionText}>
                    {validating ? 'Validating token...' : 'Align QR code within the frame'}
                </Text>
            </View>

            {validating && (
                <View style={styles.validatingContainer}>
                    <ActivityIndicator size="small" color={COLORS.white} />
                    <Text style={styles.validatingText}>Validating...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.black,
        paddingHorizontal: 24,
    },
    statusText: {
        marginTop: 16,
        color: COLORS.white,
        fontSize: 16,
        textAlign: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    scannerFrame: {
        width: 260,
        height: 260,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    scannerCorner: {
        position: 'absolute',
        width: 32,
        height: 32,
    },
    scannerTopLeft: {
        top: -2,
        left: -2,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: COLORS.primary,
        borderTopLeftRadius: 12,
    },
    scannerTopRight: {
        top: -2,
        right: -2,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: COLORS.primary,
        borderTopRightRadius: 12,
    },
    scannerBottomLeft: {
        bottom: -2,
        left: -2,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: COLORS.primary,
        borderBottomLeftRadius: 12,
    },
    scannerBottomRight: {
        bottom: -2,
        right: -2,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: COLORS.primary,
        borderBottomRightRadius: 12,
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: 3,
        backgroundColor: 'rgba(46, 125, 50, 0.7)',
    },
    instructionBadge: {
        position: 'absolute',
        bottom: 64,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
        zIndex: 10,
    },
    instructionText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '500',
    },
    validatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    validatingText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '500',
    },
});
