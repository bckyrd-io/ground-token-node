import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    black: '#000000',
};

export default function StaffScannerScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;
        setScanned(true);

        // Parse QR code data - assuming it contains token code and type info
        // Format could be: "TOKEN:ABC123" or JSON with token details
        // For now, we'll simulate the validation by checking if data contains token info
        const isFoodToken = data.includes('FOOD') || data.includes('food');
        const isPlayToken = data.includes('PLAY') || data.includes('play') || !isFoodToken;

        // Extract token code from data (remove prefixes if present)
        let tokenCode = data;
        if (data.includes(':')) {
            tokenCode = data.split(':')[1];
        }

        if (isFoodToken) {
            Alert.alert('Food Order Confirmed', `Token: ${tokenCode}\n\nThis is a food order. The visitor can now leave a review.`, [
                {
                    text: 'Continue to Review',
                    onPress: () => {
                        // Navigate to rating screen for food tokens
                        router.push({ pathname: '/ratingFeedbackScreen', params: { tokenCode } } as any);
                    },
                },
            ]);
        } else {
            Alert.alert('Token Validated', `Token: ${tokenCode}\n\nReady for session.`, [
                {
                    text: 'Start Session',
                    onPress: () => {
                        // Navigate to validation result for play tokens
                        router.push('/capacityControlScreen' as any);
                    },
                },
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
                <Text style={styles.instructionText}>Align QR code within the frame</Text>
            </View>

            {scanned && (
                <Text style={styles.statusText}>Scanned! Please wait...</Text>
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
});
