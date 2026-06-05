import { COLORS, FORM_INPUT_TOKENS } from '@/constants/theme';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, forwardRef } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from '@/app/toast';
import { ScreenBottomSheet } from '@/components/ScreenBottomSheet';

type RegisterStaffSheetProps = {
    onSuccess?: () => void;
};

export const RegisterStaffSheet = forwardRef<any, RegisterStaffSheetProps>((props, ref) => {
    const closeSheet = () => {
        if (ref && 'current' in ref && ref.current) ref.current.dismiss();
    };
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
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.43.2:5000';
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
                props?.onSuccess?.();
                // Navigate back to staff management screen after a short delay
                setTimeout(() => {
                    closeSheet();
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
        <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>

                <BottomSheetScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* <Text style={styles.sectionTitle}>Staff Information</Text> */}

                    {/* Username */}
                    <View style={styles.fieldGroup}>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="person" size={20} color={COLORS.slate400} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                            placeholder="Username"
                            placeholderTextColor={COLORS.slate400}
                            value={formData.username}
                            onChangeText={(text) => setFormData({ ...formData, username: text })}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.fieldGroup}>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="email" size={20} color={COLORS.slate400} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                            placeholder="Email address"
                            placeholderTextColor={COLORS.slate400}
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            />
                        </View>
                    </View>

                    {/* Phone */}
                    <View style={styles.fieldGroup}>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="phone" size={20} color={COLORS.slate400} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                            placeholder="Phone number"
                            placeholderTextColor={COLORS.slate400}
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            />
                        </View>
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
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="lock" size={20} color={COLORS.slate400} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.textInput, { paddingRight: 48 }]}
                                placeholder="Create a secure password"
                                placeholderTextColor={COLORS.slate400}
                                secureTextEntry={!showPassword}
                                value={formData.password}
                                onChangeText={(text) => setFormData({ ...formData, password: text })}
                            />
                            <TouchableOpacity style={styles.visibilityBtn} onPress={() => setShowPassword(!showPassword)}>
                                <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={COLORS.slate500} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </BottomSheetScrollView>

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
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

RegisterStaffSheet.displayName = 'RegisterStaffSheet';

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.slate100,
    },
    headerBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900, textAlign: 'center', flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 16 },
    sectionTitle: { fontSize: 24, fontWeight: '700', color: COLORS.slate900, paddingTop: 24, paddingBottom: 24 },
    fieldGroup: { marginBottom: 20, gap: 8 },
    inputWrapper: { position: 'relative', justifyContent: 'center' },
    inputIcon: { position: 'absolute', left: 16, zIndex: 1 },
    textInput: {
        height: FORM_INPUT_TOKENS.height,
        paddingLeft: FORM_INPUT_TOKENS.iconLeftPadding,
        paddingRight: FORM_INPUT_TOKENS.horizontalPadding,
        borderWidth: FORM_INPUT_TOKENS.borderWidth,
        borderColor: FORM_INPUT_TOKENS.borderColor,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        fontSize: FORM_INPUT_TOKENS.fontSize,
        color: FORM_INPUT_TOKENS.textColor,
        backgroundColor: FORM_INPUT_TOKENS.backgroundColor,
    },
    selectWrapper: {
        height: 56, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.slate200,
        borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    selectText: { fontSize: 16, color: COLORS.slate400 },
    visibilityBtn: { position: 'absolute', right: 16, top: 18 },
    divider: { height: 1, backgroundColor: COLORS.slate100, marginVertical: 16 },
    footer: {
        padding: 16, borderTopWidth: 1, borderTopColor: COLORS.slate100,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    submitButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        height: 56, backgroundColor: COLORS.primary, borderRadius: 16,
    },
    submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
