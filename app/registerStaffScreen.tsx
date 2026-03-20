import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const COLORS = {
    primary: '#2E7D32',
    white: '#ffffff',
    slate900: '#0f172a',
    slate700: '#334155',
    slate500: '#64748b',
    slate400: '#94a3b8',
    slate200: '#e2e8f0',
    slate100: '#f1f5f9',
    slate800: '#1e293b',
};

export default function RegisterStaffScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Register New Staff</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Staff Information</Text>

                {/* Full Name */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput style={styles.input} placeholder="Enter staff's full name" placeholderTextColor={COLORS.slate400} />
                </View>

                {/* Email */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput style={styles.input} placeholder="email@example.com" placeholderTextColor={COLORS.slate400} keyboardType="email-address" />
                </View>

                {/* Phone */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput style={styles.input} placeholder="+1 (555) 000-0000" placeholderTextColor={COLORS.slate400} keyboardType="phone-pad" />
                </View>

                {/* Role Selection */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Role Selection</Text>
                    <View style={styles.selectWrapper}>
                        <Text style={styles.selectText}>Select a role</Text>
                        <MaterialIcons name="expand-more" size={24} color={COLORS.slate500} />
                    </View>
                </View>

                {/* Assign Zone */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Assign Primary Zone</Text>
                    <View style={styles.selectWrapper}>
                        <Text style={styles.selectText}>Choose a zone</Text>
                        <MaterialIcons name="expand-more" size={24} color={COLORS.slate500} />
                    </View>
                </View>

                {/* Password */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={[styles.input, { paddingRight: 48 }]}
                            placeholder="Create a secure password"
                            placeholderTextColor={COLORS.slate400}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity style={styles.visibilityBtn} onPress={() => setShowPassword(!showPassword)}>
                            <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={COLORS.slate500} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.submitButton} activeOpacity={0.9}>
                    <Text style={styles.submitText}>Register & Send Invite</Text>
                    <MaterialIcons name="send" size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.slate100,
    },
    headerBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900, textAlign: 'center', flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 80 },
    sectionTitle: { fontSize: 24, fontWeight: '700', color: COLORS.slate900, paddingTop: 24, paddingBottom: 24 },
    fieldGroup: { marginBottom: 20, gap: 8 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.slate700, marginLeft: 4 },
    input: {
        height: 56, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.slate200,
        borderRadius: 16, fontSize: 16, color: COLORS.slate900, backgroundColor: COLORS.white,
    },
    selectWrapper: {
        height: 56, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.slate200,
        borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    selectText: { fontSize: 16, color: COLORS.slate400 },
    passwordWrapper: { position: 'relative' },
    visibilityBtn: { position: 'absolute', right: 16, top: 18 },
    divider: { height: 1, backgroundColor: COLORS.slate100, marginVertical: 16 },
    footer: {
        padding: 16, borderTopWidth: 1, borderTopColor: COLORS.slate100,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    submitButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: 56, backgroundColor: COLORS.primary, borderRadius: 16,
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
