import { COLORS } from '@/constants/theme';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// eslint-disable-next-line import/no-named-as-default
import ScreenBottomSheet from '@/components/ScreenBottomSheet';

export const AboutSheet = forwardRef<any, any>((props, ref) => {

    return (
        <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
                <BottomSheetScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                    {/* App Logo/Header */}
                    <View style={styles.logoHeader}>
                        <View style={styles.logoContainer}>
                            <MaterialIcons name="sports-basketball" size={60} color={COLORS.primary} />
                        </View>
                        <Text style={styles.appName}>Ground Token</Text>
                        <Text style={styles.version}>Version 1.0.0</Text>
                    </View>

                    {/* Features Section */}
                    <View style={styles.section}>
                        {/* <Text style={styles.sectionTitle}>Features</Text> */}
                        <View style={styles.featureItem}>
                            <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
                            <Text style={styles.featureText}>Activity catalog and booking</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
                            <Text style={styles.featureText}>Food ordering system</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
                            <Text style={styles.featureText}>Location services</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
                            <Text style={styles.featureText}>Token management</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
                            <Text style={styles.featureText}>Staff dashboard and controls</Text>
                        </View>
                    </View>



                    {/* Copyright */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>support@extend.energy/electronics</Text>
                    </View>
                </BottomSheetScrollView>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

AboutSheet.displayName = 'AboutSheet';
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
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
    logoHeader: {
        alignItems: 'center',
        paddingBottom: 24,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.slate100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.slate900,
        marginBottom: 8,
    },
    version: {
        fontSize: 14,
        color: COLORS.slate500,
    },
    section: {
        backgroundColor: COLORS.slate50,
        borderRadius: 12,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
        marginBottom: 12,
    },
    sectionText: {
        fontSize: 14,
        color: COLORS.slate600,
        lineHeight: 22,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    featureText: {
        fontSize: 14,
        color: COLORS.slate700,
        flex: 1,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    contactText: {
        fontSize: 14,
        color: COLORS.slate700,
    },
    footer: {
        alignItems: 'center',
        paddingTop: 16,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.slate400,
    },
});
