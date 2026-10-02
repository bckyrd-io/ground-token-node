import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from './toast';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <SafeAreaProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen
                                name="loginScreen"
                                options={{
                                    presentation: 'transparentModal',
                                    animation: 'fade',
                                    contentStyle: { backgroundColor: 'transparent' },
                                }}
                            />
                            <Stack.Screen name="(visitor-tabs)" />
                            <Stack.Screen name="(admin-tabs)" />
                            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                        </Stack>
                        <StatusBar style="auto" />
                    </ThemeProvider>
                </SafeAreaProvider>
            </BottomSheetModalProvider>
            <Toast />
        </GestureHandlerRootView>
    );
}