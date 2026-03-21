import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    black: '#000000',
};

export default function StaffScannerScreen() {
    const router = useRouter();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;
        setScanned(true);

        Alert.alert('QR Code Scanned', `Type: ${type}\nData: ${data}`, [
            {
                text: 'OK',
                onPress: () => {
                    router.push('/validationResultScreen' as any);
                },
            },
        ]);
    };

    if (hasPermission === null) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.statusText}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.statusText}>Camera access denied. Please grant camera permission in settings.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

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
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
