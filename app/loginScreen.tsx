import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Simple toast utility
const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    Alert.alert(
        type === 'success' ? 'Success' : 'Error',
        message,
        [{ text: 'OK', style: 'default' }]
    );
};

export default function LoginScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            showToast('Please enter both username and password');
            return;
        }

        setIsLoading(true);

        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.175:5000';
            const response = await fetch(`${serverIp}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showToast('Login successful!', 'success');
                
                // Store user data (in production, use secure storage)
                const userData = {
                    id: data.user.id,
                    username: data.user.username,
                    role: data.user.role,
                    email: data.user.email,
                };
                
                // Navigate based on user role
                if (data.user.role === 'visitor') {
                    router.replace('/(visitor-tabs)/activityCatalogScreen');
                } else if (data.user.role === 'staff') {
                    router.replace('/(staff-tabs)/staffScannerScreen');
                } else if (data.user.role === 'admin') {
                    router.replace('/(admin-tabs)/adminDashboardScreen');
                } else {
                    showToast(data.error || 'Login failed');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Login Form */}
            <View style={styles.container}>
                <Text style={styles.formTitle}>Welcome Back</Text>
                <Text style={styles.formSubtitle}>Sign in to access your account</Text>

                <View style={styles.inputWrapper}>
                    <MaterialIcons 
                        name="person" 
                        size={20} 
                        color={COLORS.slate400} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your username"
                        placeholderTextColor={COLORS.slate400}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialIcons 
                        name="lock" 
                        size={20} 
                        color={COLORS.slate400} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your password"
                        placeholderTextColor={COLORS.slate400}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                        style={styles.eyeIcon} 
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <MaterialIcons 
                            name={showPassword ? "visibility" : "visibility-off"} 
                            size={20} 
                            color={COLORS.slate400} 
                        />
                    </TouchableOpacity>
                </View>

                    <TouchableOpacity 
                        style={styles.loginButton} 
                        activeOpacity={0.9}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Text style={styles.loginButtonText}>Signing in...</Text>
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Back Link */}
                    <View style={styles.registerSection}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.registerLink}>Back</Text>
                        </TouchableOpacity>
                    </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2024 Gelato Kids. All rights reserved.</Text>
            </View>
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
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.slate900,
        textAlign: 'center',
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 14,
        color: COLORS.slate500,
        textAlign: 'center',
        marginBottom: 32,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
        marginBottom: 20,
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
    eyeIcon: {
        position: 'absolute',
        right: 16,
        zIndex: 1,
    },
    loginButton: {
        height: 56,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    loginButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
    registerSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    registerLink: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        marginLeft: 4,
    },
    footer: {
        alignItems: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.slate400,
    },
});
