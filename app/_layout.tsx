import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react'; // Added
import { Alert } from 'react-native'; // Added
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from './toast';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        // 1. Check the variable
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;

        if (!apiUrl) {
            Alert.alert("Debug: Variable Missing", "EXPO_PUBLIC_API_URL is undefined in this build.");
            return;
        }

        // 2. Automated Connection Test
        const checkServer = async () => {
            try {
                // We use a short timeout so the app doesn't hang if the IP is wrong
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), 4000);

                const response = await fetch(`${apiUrl}/ping`, { signal: controller.signal });
                const data = await response.text();
                
                // If this shows up, your Gelato Access app is officially talking to your PC!
                Alert.alert("Debug: Success", `Connected to: ${apiUrl}\nServer says: ${data}`);
                clearTimeout(id);
            } catch (err: any) {
                Alert.alert(
                    "Debug: Connection Failed",
                    `Target: ${apiUrl}\nError: ${err.message}\n\nCheck:\n1. PC IP is still .175\n2. Firewall is OFF\n3. PC Wi-Fi is set to PRIVATE`
                );
            }
        };

        checkServer();
    }, []);

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
                            <Stack.Screen name="(staff-tabs)" />
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