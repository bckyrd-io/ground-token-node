import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function VisitorTabsLayout() {
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
        </Tabs>
    );
}
