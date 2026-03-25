import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function AdminTabsLayout() {
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
                },
            }}
        >
            <Tabs.Screen
                name="adminDashboardScreen"
                options={{
                    title: 'Admin Dashboard',
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="dashboard" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="manageActivitiesScreen"
                options={{
                    title: 'Manage Activities',
                    tabBarLabel: 'Activities',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="directions-run" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="staffManagementScreen"
                options={{
                    title: 'Staff Management',
                    tabBarLabel: 'Staff',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="group" size={size} color={color} />
                    ),
                }}
            />
            
        </Tabs>
    );
}
