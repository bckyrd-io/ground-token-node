import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    black: '#000000',
};

export default function StaffScannerScreen() {
    return (
        <View style={styles.container}>
            {/* Camera Background */}
            <View style={styles.cameraContainer}>
                <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR5WHZBJjBcVrgNb49wkK2dyAHu_bivKxzN069Iz22XVm7zAtyuHP8GKN0XHTmSX5M0ECNkeRf-WXDbJUrysUn3nXQ0cw_5OjpCbsjjqWiq_fppHmR4RRp9nxkHWt4-FsUHfzMxps236dZJBeyM_0zgZVz8Sm2V-VPgFPXgN2RWnQ0L2Chlzg6lVSF-AfWTTwzxbsNXF3DjMcrtbOC3bjoiMTpjES4eaitHdP2MKPxvL3HYHepMHtjRClBUJ3PFUix_SLTXaGWxb-Y' }}
                    style={styles.cameraImage}
                    contentFit="cover"
                />

                {/* Dark overlay */}
                <View style={styles.overlay} />

                {/* Scanner Frame */}
                <View style={styles.scannerFrame}>
                    {/* Corner Accents */}
                    <View style={[styles.scannerCorner, styles.scannerTopLeft]} />
                    <View style={[styles.scannerCorner, styles.scannerTopRight]} />
                    <View style={[styles.scannerCorner, styles.scannerBottomLeft]} />
                    <View style={[styles.scannerCorner, styles.scannerBottomRight]} />

                    {/* Scanning Line */}
                    <View style={styles.scanLine} />
                </View>

                {/* Instruction Text */}
                <View style={styles.instructionBadge}>
                    <Text style={styles.instructionText}>Align QR code within the frame</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    cameraContainer: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    scannerFrame: {
        width: 260,
        height: 260,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 12,
        position: 'relative',
        zIndex: 10,
    },
    scannerCorner: {
        position: 'absolute',
        width: 32,
        height: 32,
    },
    scannerTopLeft: {
        top: -2, left: -2,
        borderTopWidth: 4, borderLeftWidth: 4,
        borderColor: COLORS.primary,
        borderTopLeftRadius: 12,
    },
    scannerTopRight: {
        top: -2, right: -2,
        borderTopWidth: 4, borderRightWidth: 4,
        borderColor: COLORS.primary,
        borderTopRightRadius: 12,
    },
    scannerBottomLeft: {
        bottom: -2, left: -2,
        borderBottomWidth: 4, borderLeftWidth: 4,
        borderColor: COLORS.primary,
        borderBottomLeftRadius: 12,
    },
    scannerBottomRight: {
        bottom: -2, right: -2,
        borderBottomWidth: 4, borderRightWidth: 4,
        borderColor: COLORS.primary,
        borderBottomRightRadius: 12,
    },
    scanLine: {
        position: 'absolute',
        left: 0, right: 0,
        top: '50%',
        height: 3,
        backgroundColor: 'rgba(46, 125, 50, 0.5)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
    },
    instructionBadge: {
        marginTop: 32,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 9999,
        zIndex: 10,
    },
    instructionText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '500',
    },
});
