import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="loginScreen" />
                <Stack.Screen name="(visitor-tabs)" />
                <Stack.Screen name="(staff-tabs)" />
                <Stack.Screen name="(admin-tabs)" />
                <Stack.Screen name="activityDetailScreen" />
                <Stack.Screen name="confirmPaymentScreen" />
                <Stack.Screen name="playTimerScreen" />
                <Stack.Screen name="validationResultScreen" />
                <Stack.Screen name="ratingFeedbackScreen" />
                <Stack.Screen name="registerStaffScreen" />
                <Stack.Screen name="myTokensScreen" />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
