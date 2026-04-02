import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification handler to enable sound
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Initialize notification channels (Android only)
 */
export async function initializeNotifications() {
    if (Platform.OS === 'android') {
        // Create notification channel with high importance and sound
        await Notifications.setNotificationChannelAsync('queue-alerts', {
            name: 'Queue Alerts',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('timer-alerts', {
            name: 'Timer Alerts',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default',
        });
    }
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
        console.log('Notifications require a physical device');
        return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
}

/**
 * Schedule a local notification
 */
export async function scheduleNotification(
    title: string,
    body: string,
    seconds: number,
    data?: Record<string, any>,
    channelId: string = 'default'
): Promise<string | null> {
    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
            console.log('Notification permissions not granted');
            return null;
        }

        await initializeNotifications();

        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: 'default',
                data: data || {},
            },
            trigger: {
                seconds,
                channelId,
            } as Notifications.NotificationTriggerInput,
        });

        return identifier;
    } catch (error) {
        console.error('Failed to schedule notification:', error);
        return null;
    }
}

/**
 * Schedule immediate notification (for testing or instant alerts)
 */
export async function showImmediateNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
    channelId: string = 'default'
): Promise<string | null> {
    return scheduleNotification(title, body, 1, data, channelId);
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(identifier: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(identifier);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
}

// Listen for notification responses
export function addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
}

// Listen for incoming notifications
export function addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
}

// Remove notification listeners
export function removeNotificationListener(subscription: Notifications.Subscription): void {
    subscription.remove();
}
