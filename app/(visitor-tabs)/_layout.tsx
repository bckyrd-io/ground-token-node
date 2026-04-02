import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store';

interface MenuModalProps {
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
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

// Simple menu component
const MenuModal: React.FC<MenuModalProps> = ({ visible, onClose, onLogout }) => (
    <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
    >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
                    <MaterialIcons name="logout" size={20} color="#dc2626" />
                    <Text style={styles.menuItemText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    </Modal>
);

export default function VisitorTabsLayout() {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const logout = useStore((state) => state.logout);

    const handleLogoutPress = () => {
        setShowMenu(false);
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
                    headerStyle: { backgroundColor: '#2E7D32' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: '700', fontSize: 20 },
                    headerTitleAlign: 'left',
                    headerShadowVisible: false,
                    headerRight: () => (
                        <TouchableOpacity 
                            style={{ padding: 8, marginRight: 8 }} 
                            onPress={() => setShowMenu(true)}
                        >
                            <MaterialIcons name="more-vert" size={24} color="white" />
                        </TouchableOpacity>
                    ),
                    tabBarActiveTintColor: '#2E7D32',
                    tabBarInactiveTintColor: '#94a3b8',
                    tabBarStyle: {
                        backgroundColor: '#ffffff',
                        borderTopWidth: 1,
                        borderTopColor: '#f1f5f9',
                        height: 64,
                        paddingBottom: 8,
                        paddingTop: 4,
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '700',
                    },
                }}
            >
                <Tabs.Screen
                    name="activityCatalogScreen"
                    options={{
                        title: 'Catalog',
                        tabBarLabel: 'Explore',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="myTokensScreen"
                    options={{
                        title: 'My Tokens',
                        tabBarLabel: 'Tokens',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="bookmark-border" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="accountScreen"
                    options={{
                        title: 'My Account',
                        tabBarLabel: 'Account',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="person" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
            <MenuModal 
                visible={showMenu} 
                onClose={() => setShowMenu(false)} 
                onLogout={handleLogoutPress}
            />
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
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
        minWidth: 180,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#dc2626',
        fontWeight: '500',
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
