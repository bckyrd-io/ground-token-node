import Toast from 'react-native-toast-message';

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

export default Toast;
