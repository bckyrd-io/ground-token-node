import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    slate900: '#0f172a',
    slate700: '#334155',
    slate400: '#94a3b8',
    slate200: '#e2e8f0',
    neutralGray: '#757575',
};

export default function StaffLoginScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Logo */}
                <View style={styles.logoSection}>
                    <View style={styles.logoCircle}>
                        <MaterialIcons name="ice-skating" size={48} color={COLORS.primary} />
                    </View>
                    <Text style={styles.brandTitle}>Gelato Kids</Text>
                    <Text style={styles.brandSubtitle}>Staff Play Access</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Username</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="person" size={20} color={COLORS.neutralGray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your username"
                                placeholderTextColor={COLORS.slate400}
                            />
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="lock" size={20} color={COLORS.neutralGray} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { paddingRight: 48 }]}
                                placeholder="Enter your password"
                                placeholderTextColor={COLORS.slate400}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity style={styles.visibilityBtn} onPress={() => setShowPassword(!showPassword)}>
                                <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={COLORS.neutralGray} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.signInButton}
                        activeOpacity={0.9}
                        onPress={() => router.push('/(staff-tabs)/staffScannerScreen' as any)}
                    >
                        <Text style={styles.signInText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotLink}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                {/* Decorative dots */}
                <View style={styles.dots}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    logoSection: { alignItems: 'center', marginBottom: 48 },
    logoCircle: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: 'rgba(46,125,50,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    },
    brandTitle: { fontSize: 24, fontWeight: '700', color: COLORS.slate900, letterSpacing: -0.5 },
    brandSubtitle: { fontSize: 14, color: COLORS.neutralGray, fontWeight: '500', marginTop: 4 },
    form: { width: '100%', gap: 24 },
    fieldGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.slate700, marginLeft: 4 },
    inputWrapper: { position: 'relative', justifyContent: 'center' },
    inputIcon: { position: 'absolute', left: 16, zIndex: 1 },
    input: {
        height: 56, paddingLeft: 48, paddingRight: 16,
        borderWidth: 2, borderColor: COLORS.slate200, borderRadius: 12,
        fontSize: 16, color: COLORS.slate900,
    },
    visibilityBtn: { position: 'absolute', right: 16 },
    signInButton: {
        width: '100%', height: 56, backgroundColor: COLORS.primary, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center', marginTop: 8,
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    signInText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
    forgotLink: { alignItems: 'center', paddingVertical: 8 },
    forgotText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
    dots: { flexDirection: 'row', gap: 16, marginTop: 64, opacity: 0.2 },
    dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
});
