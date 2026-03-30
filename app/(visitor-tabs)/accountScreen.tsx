import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';

// Simple toast utility
const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    Alert.alert(
        type === 'success' ? 'Success' : 'Error',
        message,
        [{ text: 'OK', style: 'default' }]
    );
};

// Global logout utility
const handleGlobalLogout = (router: any) => {
    Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'Logout', 
                style: 'destructive',
                onPress: () => {
                    try {
                        // Clear any stored auth data and navigate to login
                        router.dismiss(); // Dismiss any modals
                        router.replace('/loginScreen');
                    } catch (error) {
                        console.error('Logout error:', error);
                        // Fallback navigation
                        router.replace('/loginScreen');
                    }
                }
            }
        ]
    );
};

export default function AccountScreen() {
    const router = useRouter();
    const { profile, fetchProfile } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    
    // Use actual user data from store
    const [userData, setUserData] = useState({
        id: 'user-001',
        username: 'visitor1',
        email: 'visitor1@gelatokids.com',
        phone: '+2651234572',
        role: 'visitor',
        createdAt: '2024-01-15'
    });

    // Fetch user profile on mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Update userData when profile changes
    useEffect(() => {
        if (profile) {
            setUserData({
                id: profile.id || 'user-001', // Use actual user ID from profile
                username: profile.username,
                email: profile.email,
                phone: profile.phone,
                role: profile.role,
                createdAt: profile.createdAt
            });
        }
    }, [profile]);

    const [formData, setFormData] = useState({
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        password: '',
    });

    // Sync formData with userData
    useEffect(() => {
        setFormData({
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            password: '',
        });
    }, [userData]);

    const handleUpdate = async () => {
        if (!formData.username || !formData.email) {
            showToast('Please fill in all required fields');
            return;
        }

        // Check if user has a valid ID
        if (!userData.id || userData.id === 'user-001' && !profile?.id) {
            showToast('Unable to update account. Please try logging out and back in.');
            return;
        }

        setIsLoading(true);

        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.175:5000';
            
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
                setUserData(prev => ({ ...prev, ...formData }));
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

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: () => {
                        // Clear stored user data and navigate to login
                        router.dismiss();
                        setTimeout(() => {
                            router.replace('/loginScreen' as any);
                        }, 100);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
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
                <Text style={styles.sectionTitle}>Account Details</Text>

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
                        <Text style={styles.updateButtonText}>Update Account</Text>
                    )}
                </TouchableOpacity>

                <View style={{ height: 24 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.white, 
        paddingTop: Platform.OS === 'android' ? 25 : 0 
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    scrollContent: {
        paddingBottom: 32,
        gap: 24,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 24,
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
        height: 56,
        paddingLeft: 44,
        paddingRight: 16,
        borderWidth: 1,
        borderColor: COLORS.slate300,
        borderRadius: 12,
        fontSize: 16,
        color: COLORS.slate900,
        backgroundColor: COLORS.slate50,
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
