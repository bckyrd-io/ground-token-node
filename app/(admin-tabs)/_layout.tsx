import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useStore } from '../store';
import { AccountSheet } from '@/components/screens/AccountSheet';
import { AboutSheet } from '@/components/screens/AboutSheet';

interface MenuModalProps {
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
    onAccount: () => void;
    onAbout: () => void;
}

// Confirm logout modal component
interface ConfirmLogoutModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ visible, onCancel, onConfirm }) => (
    <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onCancel}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.confirmContainer}>
                <Text style={styles.confirmTitle}>Logout</Text>
                <Text style={styles.confirmMessage}>Are you sure you want to logout?</Text>
                <View style={styles.confirmButtons}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutButton} onPress={onConfirm}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

// Simple menu component (now rendered as a bottom sheet modal)
const MenuComponent = React.forwardRef<BottomSheetModal, Omit<MenuModalProps, 'visible'>>(({ onClose, onLogout, onAccount, onAbout }, ref) => {
    const snapPoints = useMemo(() => ['90%'], []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
        ),
        []
    );

    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            onDismiss={onClose}
            style={styles.menuSheet}
            backgroundStyle={styles.menuSheetBackground}
            handleIndicatorStyle={styles.menuHandle}
        >
            <BottomSheetView style={styles.menuContainerBottomSheet}>
                <TouchableOpacity style={styles.menuItem} onPress={onAccount}>
                    <Text style={styles.menuItemText}>Profile</Text>
                    <MaterialIcons name="chevron-right" size={20} color={COLORS.slate600} />
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={onAbout}>
                    <Text style={styles.menuItemText}>About</Text>
                    <MaterialIcons name="chevron-right" size={20} color={COLORS.slate600} />
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
                    <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
                    <MaterialIcons name="chevron-right" size={20} color={COLORS.red600} />
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default function AdminTabsLayout() {
    const router = useRouter();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const accountSheetRef = useRef<BottomSheetModal>(null);
    const aboutSheetRef = useRef<BottomSheetModal>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const logout = useStore((state) => state.logout);

    const handleAccountPress = () => {
        bottomSheetModalRef.current?.dismiss();
        setTimeout(() => accountSheetRef.current?.present(), 300);
    };

    const handleAboutPress = () => {
        bottomSheetModalRef.current?.dismiss();
        setTimeout(() => aboutSheetRef.current?.present(), 300);
    };

    const handleLogoutPress = () => {
        bottomSheetModalRef.current?.dismiss();
        setShowConfirmModal(true);
    };

    const handleConfirmLogout = () => {
        setShowConfirmModal(false);
        logout();
        router.replace('/');
    };

    const handleCancelLogout = () => {
        setShowConfirmModal(false);
    };

    return (
        <>
            <Tabs
                screenOptions={{
                    headerStyle: { backgroundColor: '#00c951' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: '700', fontSize: 20 },
                    headerTitleAlign: 'left',
                    headerShadowVisible: false,
                    headerRight: () => (
                        <TouchableOpacity
                            style={{ padding: 8, marginRight: 8 }}
                            onPress={() => bottomSheetModalRef.current?.present()}
                        >
                            <MaterialIcons name='more-vert' size={24} color="white" />
                        </TouchableOpacity>
                    ),
                    tabBarActiveTintColor: '#00c951',
                    tabBarInactiveTintColor: '#94a3b8',
                    tabBarStyle: {
                        backgroundColor: '#ffffff',
                        borderTopWidth: 1,
                        borderTopColor: '#e2e8f0',
                        height: 64,
                        paddingBottom: 8,
                        paddingTop: 4,
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '600',
                    },
                }}
            >
                <Tabs.Screen
                    name="adminDashboardScreen"
                    options={{
                        title: 'Ground Token ',
                        tabBarLabel: 'Dashboard',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="dashboard" size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="capacityControlScreen"
                    options={{
                        title: 'Ground Token ',
                        tabBarLabel: 'Capacity',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="analytics" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="staffScannerScreen"
                    options={{
                        title: 'Ground Token ',
                        tabBarLabel: 'Scanner',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="camera" size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="manageActivitiesScreen"
                    options={{
                        title: 'Ground Token ',
                        tabBarLabel: 'Activities',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="event" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="staffManagementScreen"
                    options={{
                        title: 'Ground Token ',
                        tabBarLabel: 'Staff',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="checklist" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
            <MenuComponent
                ref={bottomSheetModalRef}
                onClose={() => { }}
                onLogout={handleLogoutPress}
                onAccount={handleAccountPress}
                onAbout={handleAboutPress}
            />
            <AccountSheet ref={accountSheetRef} />
            <AboutSheet ref={aboutSheetRef} />
            <ConfirmLogoutModal
                visible={showConfirmModal}
                onCancel={handleCancelLogout}
                onConfirm={handleConfirmLogout}
            />
        </>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainerBottomSheet: {
        paddingBottom: 24,
    },
    menuSheet: {
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    menuSheetBackground: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },
    menuHandle: {
        backgroundColor: COLORS.slate300,
        width: 44,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
        paddingHorizontal: 24,
        paddingTop: 4,
        paddingBottom: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 18,
        gap: 12,
    },
    menuDivider: {
        height: 1,
        backgroundColor: COLORS.slate200,
        marginHorizontal: 24,
    },
    menuItemText: {
        fontSize: 16,
        color: COLORS.slate800,
        fontWeight: '600',
    },
    logoutText: {
        color: COLORS.red600,
    },
    confirmContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: 300,
        alignItems: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    },
    confirmTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 12,
    },
    confirmMessage: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    confirmButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4b5563',
    },
    logoutButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#dc2626',
        alignItems: 'center',
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});
