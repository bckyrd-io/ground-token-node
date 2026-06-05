import { COLORS, FORM_INPUT_TOKENS } from '@/constants/theme';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, forwardRef } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/app/store';
import { showToast } from '@/app/toast';
import ScreenBottomSheet from '@/components/ScreenBottomSheet';

export const ConfirmPaymentSheet = forwardRef<any, { activityId?: string }>((props, ref) => {
    const closeSheet = () => {
        if (ref && 'current' in ref && ref.current) ref.current.dismiss();
    };
    const router = useRouter();
    const activityId = props.activityId || '1';
    const { activityDetails, fetchActivityDetail, profile, setProfile } = useStore();
    const activity = activityDetails[activityId];
    const [selectedProvider, setSelectedProvider] = useState('airtel');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(null);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    // Fetch activity detail on component mount
    useEffect(() => {
        if (!activity) {
            fetchActivityDetail(activityId);
        }
    }, [activityId, activity, fetchActivityDetail]);

    // Show loading state while activity detail is being fetched
    if (!activity) {
        return (
            <ScreenBottomSheet ref={ref}>
                <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading activity details...</Text>
                    </View>
                </SafeAreaView>
            </ScreenBottomSheet>
        );
    }

    // Poll for payment status
    const pollPaymentStatus = (chargeId: string, guestUser: any) => {
        const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.175:5000';
        let attempts = 0;
        const maxAttempts = 60; // Poll for up to 5 minutes (60 * 5 seconds)

        const interval = setInterval(async () => {
            attempts++;

            try {
                const response = await fetch(`${serverIp}/api/payment/status/${chargeId}`);
                const data = await response.json();

                if (response.ok) {
                    console.log(`[Payment Polling] Status: ${data.status}, Attempt: ${attempts}`);

                    if (data.status === 'completed') {
                        // Payment successful
                        clearInterval(interval);
                        setPollingInterval(null);
                        setIsLoading(false);

                        showToast('Payment successful! Token generated.', 'success');

                        // If guest checkout created a user, update the store
                        if (guestUser && !profile?.id) {
                            setProfile({
                                id: guestUser.id,
                                username: guestUser.username,
                                email: guestUser.email,
                                phone: guestUser.phone,
                                role: guestUser.role,
                                avatar: 'https://picsum.photos/200',
                                createdAt: new Date().toISOString()
                            });
                        }

                        // Navigate to tokens screen
                        setTimeout(() => {
                            try {
                                closeSheet();
                                router.push('/(visitor-tabs)/myTokensScreen');
                            } catch (error) {
                                console.error('Navigation error:', error);
                                closeSheet();
                            }
                        }, 1500);
                    } else if (data.status === 'failed' || data.status === 'cancelled') {
                        // Payment failed
                        clearInterval(interval);
                        setPollingInterval(null);
                        setIsLoading(false);
                        showToast('Payment failed. Please try again.');
                    } else if (attempts >= maxAttempts) {
                        // Timeout
                        clearInterval(interval);
                        setPollingInterval(null);
                        setIsLoading(false);
                        showToast('Payment verification timed out. Please check your tokens later.');
                    }
                }
            } catch (error) {
                console.error('[Payment Polling] Error:', error);
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setPollingInterval(null);
                    setIsLoading(false);
                    showToast('Payment verification timed out. Please check your tokens later.');
                }
            }
        }, 5000); // Poll every 5 seconds

        setPollingInterval(interval);
    };

    const handlePayment = async () => {
        if (!phoneNumber) {
            showToast('Please enter phone number');
            return;
        }

        setIsLoading(true);

        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL;
            const response = await fetch(`${serverIp}/api/payment/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    amount: activity.price,
                    provider: selectedProvider,
                    activityId,
                    userId: profile?.id
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                if (data.pending && data.chargeId) {
                    // PayChangu payment initiated - start polling
                    showToast(data.message || 'Payment initiated. Please check your phone to authorize.', 'success');
                    pollPaymentStatus(data.chargeId, data.user);
                } else {
                    // Immediate success (fallback)
                    showToast('Payment successful! Token generated.', 'success');

                    // If guest checkout created a user, update the store
                    if (data.user && !profile?.id) {
                        setProfile({
                            id: data.user.id,
                            username: data.user.username,
                            email: data.user.email,
                            phone: data.user.phone,
                            role: data.user.role,
                            avatar: 'https://picsum.photos/200',
                            createdAt: new Date().toISOString()
                        });
                    }

                    // Navigate to tokens screen
                    setTimeout(() => {
                        try {
                            closeSheet();
                            router.push('/(visitor-tabs)/myTokensScreen');
                        } catch (error) {
                            console.error('Navigation error:', error);
                            closeSheet();
                        }
                    }, 2000);
                }
            } else {
                showToast(data.message || 'Payment failed');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Payment error:', error);
            showToast('Network error. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>

                <BottomSheetScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Merchant Info */}
                    <View style={styles.merchantRow}>
                        <View>
                            <Text style={styles.merchantName}>{activity.name}</Text>
                            <Text style={styles.merchantRef}>Ref: GK-{activity.id}</Text>
                        </View>
                    </View>

                    {/* Amount */}
                    <View style={styles.amountCard}>
                        <Text style={styles.amountLabel}>Amount to pay</Text>
                        <Text style={styles.amountValue}>MK {activity.price}</Text>
                    </View>

                    <Text style={styles.instructions}>
                        Enter your Airtel Money or TNM registered phone number to authorize the transaction.
                    </Text>

                    {/* Phone Input */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="phone-iphone" size={20} color={COLORS.slate400} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="088XXXXXXX"
                                placeholderTextColor={COLORS.slate400}
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>
                    </View>

                    {/* Provider Toggle */}
                    <View style={styles.providerSection}>
                        <Text style={styles.providerLabel}>Network Provider</Text>
                        <View style={styles.providerGrid}>
                            <TouchableOpacity
                                style={[styles.providerBtn, selectedProvider === 'airtel' && styles.providerActive]}
                                onPress={() => setSelectedProvider('airtel')}
                            >
                                <View style={[styles.providerDot, { backgroundColor: selectedProvider === 'airtel' ? COLORS.primary : COLORS.slate300 }]} />
                                <Text style={[styles.providerText, selectedProvider === 'airtel' && { color: COLORS.slate900 }]}>Airtel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.providerBtn, selectedProvider === 'tnm' && styles.providerActive]}
                                onPress={() => setSelectedProvider('tnm')}
                            >
                                <View style={[styles.providerDot, { backgroundColor: selectedProvider === 'tnm' ? COLORS.primary : COLORS.slate300 }]} />
                                <Text style={[styles.providerText, selectedProvider === 'tnm' && { color: COLORS.slate900 }]}>TNM</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        activeOpacity={0.9}
                        onPress={handlePayment}
                        disabled={isLoading}
                    >
                        <MaterialIcons name="lock" size={20} color={COLORS.white} />
                        <Text style={styles.confirmText}>
                            {isLoading ? 'Processing...' : 'Confirm Payment'}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.securedRow}>
                        <MaterialIcons name="verified-user" size={14} color={COLORS.slate400} />
                        <Text style={styles.securedText}>Secured by Paychangu</Text>
                    </View>
                </View>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    loadingText: { fontSize: 16, color: COLORS.slate600, textAlign: 'center' },
    errorText: { fontSize: 18, color: COLORS.slate700, textAlign: 'center', marginTop: 16, marginBottom: 24 },
    backButton: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    backButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.slate200,
    },
    headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900, textAlign: 'center', flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingVertical: 32 },
    merchantRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 32 },
    merchantIcon: {
        width: 64, height: 64, borderRadius: 12,
        backgroundColor: 'rgba(46,125,50,0.1)', alignItems: 'center', justifyContent: 'center',
    },
    merchantName: { fontSize: 24, fontWeight: '700', color: COLORS.slate900 },
    merchantRef: { fontSize: 14, color: COLORS.slate500, marginTop: 4 },
    amountCard: {
        padding: 16, borderRadius: 12, backgroundColor: COLORS.slate100,
        borderWidth: 1, borderColor: COLORS.slate200, flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center', marginBottom: 32,
    },
    amountLabel: { fontSize: 14, color: COLORS.slate500 },
    amountValue: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
    instructions: { fontSize: 16, color: COLORS.slate600, lineHeight: 24, marginBottom: 24 },
    fieldGroup: { gap: 8, marginBottom: 32 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.slate700, marginLeft: 4 },
    inputWrapper: { position: 'relative', justifyContent: 'center' },
    inputIcon: { position: 'absolute', left: 16, zIndex: 1 },
    input: {
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
    providerSection: { marginBottom: 24 },
    providerLabel: { fontSize: 12, fontWeight: '700', color: COLORS.slate500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingLeft: 4 },
    providerGrid: { flexDirection: 'row', gap: 12 },
    providerBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: 12, borderRadius: 12, borderWidth: 2, borderColor: COLORS.slate200,
    },
    providerActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(46,125,50,0.05)' },
    providerDot: { width: 8, height: 8, borderRadius: 4 },
    providerText: { fontSize: 16, fontWeight: '500', color: COLORS.slate500 },
    footer: {
        padding: 24, borderTopWidth: 1, borderTopColor: COLORS.slate200,
    },
    confirmButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
        height: 56, backgroundColor: COLORS.primary, borderRadius: 12,
    },
    confirmText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
    securedRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, marginTop: 24, opacity: 0.6,
    },
    securedText: { fontSize: 12, fontWeight: '500', color: COLORS.slate500, textTransform: 'uppercase', letterSpacing: -0.3 },
});
