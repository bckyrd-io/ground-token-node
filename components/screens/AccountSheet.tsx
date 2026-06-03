import { COLORS, FORM_INPUT_TOKENS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState, forwardRef } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Profile } from '@/app/store';
import { useStore } from '@/app/store';
import { showToast } from '@/app/toast';
import ScreenBottomSheet from '@/components/ScreenBottomSheet';


export const AccountSheet = forwardRef<any, any>((props, ref) => {
    const closeSheet = () => {
        if (ref && 'current' in ref && ref.current) {
            ref.current.dismiss();
        }
    };
    const { profile, setProfile } = useStore();
    const [isLoading, setIsLoading] = useState(false);

    // Use profile from store directly (set during login)
    const userData = {
        id: profile?.id || '',
        username: profile?.username || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        role: profile?.role || 'visitor',
        createdAt: profile?.createdAt || new Date().toISOString()
    };

    const [formData, setFormData] = useState({
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        password: '',
    });

    // Sync formData when userData changes
    useEffect(() => {
        setFormData({
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            password: '',
        });
    }, [userData.username, userData.email, userData.phone]);

    const handleUpdate = async () => {
        if (!formData.username || !formData.email) {
            showToast('Please fill in all required fields');
            return;
        }

        // Check if user has a valid ID
        if (!userData.id) {
            showToast('Unable to update account. Please try logging out and back in.');
            return;
        }

        setIsLoading(true);

        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL;

            // Build update object - only include password if it's provided
            const updateData: any = {
                username: formData.username,
                email: formData.email,
                phone: formData.phone
            };

            // Only include password if it's not empty
            if (formData.password && formData.password.trim()) {
                updateData.password = formData.password;
            }

            const response = await fetch(`${serverIp}/api/users/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Account updated successfully!', 'success');
                // Update Zustand store with new profile data
                setProfile({
                    ...profile,
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone
                } as Profile);
                // Clear password field after successful update
                setFormData(prev => ({ ...prev, password: '' }));
            } else {
                showToast(data.error || 'Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            showToast('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
                <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                    {/* Profile Header */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <MaterialIcons name="person" size={40} color={COLORS.primary} />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.username}>{userData.username}</Text>
                            <Text style={styles.roleText}>{userData.role}</Text>
                        </View>
                    </View>

                    {/* Account Details Form */}

                    <View style={styles.fieldGroup}>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons
                                name="person"
                                size={20}
                                color={COLORS.slate400}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Username"
                                placeholderTextColor={COLORS.slate400}
                                value={formData.username}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons
                                name="email"
                                size={20}
                                color={COLORS.slate400}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Email address"
                                placeholderTextColor={COLORS.slate400}
                                keyboardType="email-address"
                                value={formData.email}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons
                                name="phone"
                                size={20}
                                color={COLORS.slate400}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Phone number"
                                placeholderTextColor={COLORS.slate400}
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                            />
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons
                                name="lock"
                                size={20}
                                color={COLORS.slate400}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="New password (optional)"
                                placeholderTextColor={COLORS.slate400}
                                secureTextEntry
                                value={formData.password}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.updateButton}
                        activeOpacity={0.9}
                        onPress={handleUpdate}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Text style={styles.updateButtonText}>Updating...</Text>
                        ) : (
                            <Text style={styles.updateButtonText}>Update Profile</Text>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 24 }} />
                </ScrollView>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate200,
    },
    headerBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    scrollContent: {
        paddingTop: 24,
        paddingBottom: 32,
        gap: 24,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.slate100,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    username: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    roleText: {
        fontSize: 14,
        color: COLORS.slate500,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.slate900,

    },
    fieldGroup: {
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
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
    updateButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
