import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
    const colorScheme = useColorScheme();


    // Define a primary green color, or adapt it from Colors
    const activeTintColor = Colors[colorScheme ?? 'light'].tint || '#34D399'; // Green color (adjust to your theme)




    return (
        <Tabs
            // screenOptions={{
            //   tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            //   headerShown: false,
            //   tabBarButton: HapticTab,
            // }}>
            screenOptions={{
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute', // Use a transparent background on iOS to show the blur effect
                    },
                    default: {},
                }),
                tabBarActiveTintColor: activeTintColor, // Set active tint color for icons
            }}>



            {/* <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            /> */}

            {/* Home Tab (Always visible) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={28} color={color} />
                    ),
                }}
            />



            {/* Login Tab (Only show when not logged in) */}
            <Tabs.Screen
                name="LoginScreen"
                options={{
                    title: 'Login',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="log-in" size={28} color={color} />
                    ),
                }}
            />

            {/* Register Tab (Only show when not logged in) */}
            <Tabs.Screen
                name="RegisterScreen"
                options={{
                    title: 'Register',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-add" size={28} color={color} />
                    ),
                }}
            />

            {/* Password Recovery Tab (Always visible) */}
            {/* <Tabs.Screen
                name="RecoveryScreen"
                options={{
                title: 'Password Recovery',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="key" size={28} color={color} />
                ),
                }}
            /> */}

            {/* Dashboard Tab (Always visible)
            <Tabs.Screen
                name="DashboardScreen"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={28} color={color} />
                    ),
                }}
            />


            {/* Map Tab (Always visible) */}
            {/* <Tabs.Screen
                name="MapScreen"
                options={{
                    title: 'Locate',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="location" size={28} color={color} />
                    ),
                }}
            /> */}

            {/* Playground Tab (Always visible) */}
            {/* <Tabs.Screen
                name="PlaygroundScreen"
                options={{
                    title: 'Playground',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="basketball" size={28} color={color} />
                    ),
                }}
            /> */}

            {/* Payment Tab (Always visible) */}
            {/* <Tabs.Screen
                name="PaymentScreen"
                options={{
                    title: 'Payment',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="card" size={28} color={color} />
                    ),
                }}
            /> */}

            {/* Admin Tabs (Always visible) */}
            {/* <Tabs.Screen
                name="adminScreen"
                options={{
                    title: 'Admin',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="stats-chart" size={28} color={color} />
                    ),
                }}
            /> */}

            {/* <Tabs.Screen
                name="AdminUsersScreen"
                options={{
                    title: 'Admin Users',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person" size={28} color={color} />
                    ),
                }}
            /> */}

            {/* <Tabs.Screen
                name="adminPlaygroundScreen"
                options={{
                    title: 'Admin Playground',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="game-controller" size={28} color={color} />
                    ),
                }}
            />  */}

        </Tabs>
    );
}
