import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from './toast';

export default function RegisterStaffScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        username: '',
        password: '',
        role: 'staff'
    });

    const handleRegister = async () => {
        if (!formData.email || !formData.username || !formData.password) {
            showToast('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.175:5000';
            const response = await fetch(`${serverIp}/api/auth/register-staff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Staff registered successfully', 'success');
                // Navigate back to staff management screen after a short delay
                setTimeout(() => {
                    router.back();
                }, 1500);
            } else {
                showToast(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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
                {/* <Text style={styles.sectionTitle}>Staff Information</Text> */}

                {/* Username */}
                <View style={styles.fieldGroup}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Username" 
                        placeholderTextColor={COLORS.slate400}
                        value={formData.username}
                        onChangeText={(text) => setFormData({...formData, username: text})}
                    />
                </View>

                {/* Email */}
                <View style={styles.fieldGroup}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Email address" 
                        placeholderTextColor={COLORS.slate400} 
                        keyboardType="email-address"
                        value={formData.email}
                        onChangeText={(text) => setFormData({...formData, email: text})}
                    />
                </View>

                {/* Phone */}
                <View style={styles.fieldGroup}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Phone number" 
                        placeholderTextColor={COLORS.slate400} 
                        keyboardType="phone-pad"
                        value={formData.phone}
                        onChangeText={(text) => setFormData({...formData, phone: text})}
                    />
                </View>

                {/* Role Selection
                <View style={styles.fieldGroup}>
                    <View style={styles.selectWrapper}>
                        <Text style={styles.selectText}>Staff Role</Text>
                        <MaterialIcons name="expand-more" size={24} color={COLORS.slate500} />
                    </View>
                </View> */}

                {/* Password */}
                <View style={styles.fieldGroup}>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={[styles.input, { paddingRight: 48 }]}
                            placeholder="Create a secure password"
                            placeholderTextColor={COLORS.slate400}
                            secureTextEntry={!showPassword}
                            value={formData.password}
                            onChangeText={(text) => setFormData({...formData, password: text})}
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
                <TouchableOpacity 
                    style={styles.submitButton} 
                    activeOpacity={0.9}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    <Text style={styles.submitText}>
                        {isLoading ? 'Registering...' : 'Submit'}
                    </Text>
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
    },
    submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
