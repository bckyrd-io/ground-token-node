import { useStore } from '@/app/store';
import { showToast } from '@/app/toast';
// eslint-disable-next-line import/no-named-as-default
import ScreenBottomSheet from '@/components/ScreenBottomSheet';
import { COLORS, FORM_INPUT_TOKENS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { forwardRef, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoginSheetProps = {
    onDismiss?: () => void;
    onLoginSuccess?: () => void;
};

const USERNAME_MAX = 100;
const PASSWORD_MAX = 255;

export const LoginSheet = forwardRef<any, LoginSheetProps>((props, ref) => {
    const router = useRouter();
    const { setProfile } = useStore();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const atLimitRef = useRef<{ username: boolean; password: boolean }>({ username: false, password: false });

    const handleUsernameChange = (text: string) => {
        if (text.length > USERNAME_MAX) {
            if (!atLimitRef.current.username) {
                atLimitRef.current.username = true;
                showToast(`Username cannot exceed ${USERNAME_MAX} characters`, 'error');
            }
            setUsername(text.slice(0, USERNAME_MAX));
            return;
        }
        atLimitRef.current.username = false;
        setUsername(text);
    };

    const handlePasswordChange = (text: string) => {
        if (text.length > PASSWORD_MAX) {
            if (!atLimitRef.current.password) {
                atLimitRef.current.password = true;
                showToast(`Password cannot exceed ${PASSWORD_MAX} characters`, 'error');
            }
            setPassword(text.slice(0, PASSWORD_MAX));
            return;
        }
        atLimitRef.current.password = false;
        setPassword(text);
    };

    const closeSheet = () => {
        if (ref && 'current' in ref && ref.current) {
            ref.current.dismiss();
        }
    };

    const handleLogin = async () => {
        const trimmedUsername = username.trim();
        if (!trimmedUsername || !password) {
            showToast('Please enter both username and password');
            return;
        }

        setIsLoading(true);

        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL;
            const response = await fetch(`${serverIp}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: trimmedUsername, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showToast('Login successful!', 'success');

                const userData = {
                    id: data.user.id,
                    username: data.user.username,
                    role: data.user.role,
                    email: data.user.email,
                    phone: data.user.phone || '',
                    avatar: 'https://picsum.photos/200',
                    createdAt: new Date().toISOString(),
                };

                setProfile(userData);
                props.onLoginSuccess?.();
                closeSheet();

                if (data.user.role === 'visitor') {
                    router.replace('/(visitor-tabs)/activityCatalogScreen');
                } else {
                    router.replace('/(admin-tabs)/adminDashboardScreen');
                }
            } else {
                showToast(data.error || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenBottomSheet ref={ref} snapPoints={['90%']} onDismiss={props.onDismiss}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
                <View style={styles.container}>
                    {/* <Text style={styles.formTitle}>Welcome Back</Text>
                    <Text style={styles.formSubtitle}>Welcome Back</Text> */}

                    <View style={styles.field}>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="person" size={20} color={COLORS.slate400} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter your username"
                                placeholderTextColor={FORM_INPUT_TOKENS.placeholderColor}
                                value={username}
                                onChangeText={handleUsernameChange}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        <Text style={[styles.counter, username.length >= USERNAME_MAX && styles.counterAtLimit]}>
                            {`${username.length}/${USERNAME_MAX}`}
                        </Text>
                    </View>

                    <View style={styles.field}>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="lock" size={20} color={COLORS.slate400} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter your password"
                                placeholderTextColor={FORM_INPUT_TOKENS.placeholderColor}
                                value={password}
                                onChangeText={handlePasswordChange}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility' : 'visibility-off'}
                                    size={20}
                                    color={COLORS.slate400}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.counter, password.length >= PASSWORD_MAX && styles.counterAtLimit]}>
                            {`${password.length}/${PASSWORD_MAX}`}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        activeOpacity={0.9}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginButtonText}>{isLoading ? 'Signing in...' : 'Sign In'}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

LoginSheet.displayName = 'LoginSheet';

const styles = StyleSheet.create({
    safeArea: {
        flexGrow: 1,
        backgroundColor: COLORS.white,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    container: {
        flexGrow: 1,
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
    field: {
        marginBottom: 20,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    counter: {
        fontSize: 11,
        color: COLORS.slate400,
        textAlign: 'right',
        marginTop: 4,
    },
    counterAtLimit: {
        color: COLORS.red600,
        fontWeight: '600',
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
});
