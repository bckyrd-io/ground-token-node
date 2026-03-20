import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function StaffTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: '#2E7D32' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: '700', fontSize: 20 },
                headerTitleAlign: 'left',
                headerShadowVisible: false,
                headerRight: () => (
                    <TouchableOpacity style={{ padding: 8, marginRight: 8 }}>
                        <MaterialIcons name="more-vert" size={24} color="white" />
                    </TouchableOpacity>
                ),
                tabBarActiveTintColor: '#2E7D32',
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
                    textTransform: 'uppercase',
                },
            }}
        >
            <Tabs.Screen
                name="capacityControlScreen"
                options={{
                    title: 'Capacity Control',
                    tabBarLabel: 'Capacity',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="analytics" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="staffScannerScreen"
                options={{
                    title: 'Scan QR Token',
                    tabBarLabel: 'Scanner',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="qr-code-scanner" size={size} color={color} />
                    ),
                }}
            />



        </Tabs>
    );
}
