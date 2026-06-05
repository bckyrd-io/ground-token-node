import React from 'react';
import { BaseToast, ErrorToast, ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import Toast from 'react-native-toast-message';

const createToastStyle = (bottomColor: string) => ({
    borderLeftWidth: 0,
    borderBottomWidth: 4,
    borderBottomColor: bottomColor,
    minHeight: 62,
    borderRadius: 6,
    paddingVertical: 6,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 9999,
    zIndex: 9999,
});

const createText1Style = () => ({
    fontSize: 15,
    fontWeight: '700' as const,
});

const createText2Style = () => ({
    fontSize: 13,
    lineHeight: 18,
});

const toastConfig: ToastConfig = {
    success: (props: ToastConfigParams<any>) => (
        <BaseToast
            {...props}
            style={createToastStyle('#00c951')}
            contentContainerStyle={{ paddingHorizontal: 14 }}
            text1Style={createText1Style()}
            text2Style={createText2Style()}
        />
    ),
    error: (props: ToastConfigParams<any>) => (
        <ErrorToast
            {...props}
            style={createToastStyle('#dc2626')}
            contentContainerStyle={{ paddingHorizontal: 14 }}
            text1Style={createText1Style()}
            text2Style={createText2Style()}
        />
    ),
    info: (props: ToastConfigParams<any>) => (
        <BaseToast
            {...props}
            style={createToastStyle('#2563eb')}
            contentContainerStyle={{ paddingHorizontal: 14 }}
            text1Style={createText1Style()}
            text2Style={createText2Style()}
        />
    ),
};

export const showToast = (
    message: string, 
    type: 'success' | 'error' | 'info' = 'error',
    onHide?: () => void
) => {
    Toast.show({
        type: type,
        text1: type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info',
        text2: message,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
        onHide,
    });
};

export default function AppToast() {
    return <Toast config={toastConfig} />;
}
