import { LoginSheet } from '@/components/screens/LoginSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const loginSheetRef = useRef<BottomSheetModal>(null);
    const hasLoggedInRef = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            loginSheetRef.current?.present();
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <LoginSheet
                ref={loginSheetRef}
                onLoginSuccess={() => {
                    hasLoggedInRef.current = true;
                }}
                onDismiss={() => {
                    if (hasLoggedInRef.current) {
                        return;
                    }
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/');
                    }
                }}
            />
        </View>
    );
}
