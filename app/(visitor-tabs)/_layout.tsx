import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuModalProps {
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
}

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

    const handleLogout = () => {
        setShowMenu(false);
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: () => {
                        // Clear any stored auth data and navigate to index screen
                        try {
                            // Clear any secure storage or AsyncStorage if used
                            // For now, just navigate to index screen
                            router.dismiss(); // Dismiss any modals
                            router.replace('/'); // Navigate to index screen
                        } catch (error) {
                            console.error('Logout error:', error);
                            // Fallback navigation
                            router.replace('/'); // Navigate to index screen
                        }
                    }
                }
            ]
        );
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
                onLogout={handleLogout}
            />
        </>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 16,
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minWidth: 150,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#dc2626',
        fontWeight: '500',
    },
});
