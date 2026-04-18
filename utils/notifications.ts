import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Request notification permissions from the user
 * Required for Android 13+ and iOS
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get notification permissions!');
            return false;
        }

        console.log('Notification permissions granted!');
        return true;
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return false;
    }
}

/**
 * Create a notification channel for Android
 * Required for Android 8.0+ (API level 26+)
 */
export async function createNotificationChannel(
    channelId: string,
    channelName: string,
    importance: Notifications.AndroidNotificationImportance = Notifications.AndroidImportance.DEFAULT
): Promise<void> {
    if (Platform.OS === 'android') {
        try {
            await Notifications.setNotificationChannelAsync(channelId, {
                name: channelName,
                importance: importance,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#2E7D32',
                sound: 'default',
            });
            console.log(`Notification channel ${channelId} created`);
        } catch (error) {
            console.error('Error creating notification channel:', error);
        }
    }
}

/**
 * Show an immediate local notification
 * @param title - Notification title
 * @param body - Notification body text
 * @param data - Additional data to attach to the notification
 * @param channelId - Android notification channel ID
 */
export async function showImmediateNotification(
    title: string,
    body: string,
    data: Record<string, any> = {},
    channelId: string = 'default'
): Promise<string | undefined> {
    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: null, // null means show immediately
        });
        console.log('Immediate notification scheduled:', notificationId);
        return notificationId;
    } catch (error) {
        console.error('Error showing immediate notification:', error);
        return undefined;
    }
}

/**
 * Schedule a notification to fire after a specified number of seconds
 * @param title - Notification title
 * @param body - Notification body text
 * @param seconds - Number of seconds from now to fire the notification
 * @param data - Additional data to attach to the notification
 * @param channelId - Android notification channel ID
 */
export async function scheduleNotification(
    title: string,
    body: string,
    seconds: number,
    data: Record<string, any> = {},
    channelId: string = 'default'
): Promise<string | undefined> {
    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                seconds,
                channelId,
            },
        });
        console.log('Notification scheduled:', notificationId);
        return notificationId;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return undefined;
    }
}

/**
 * Cancel a scheduled notification
 * @param notificationId - ID of the notification to cancel
 */
export async function cancelScheduledNotification(notificationId: string): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log('Notification cancelled:', notificationId);
    } catch (error) {
        console.error('Error cancelling notification:', error);
    }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('All scheduled notifications cancelled');
    } catch (error) {
        console.error('Error cancelling all notifications:', error);
    }
}

/**
 * Initialize notification system
 * Call this on app startup for visitors
 */
export async function initializeNotifications(): Promise<void> {
    try {
        // Request permissions
        const hasPermission = await requestNotificationPermissions();
        
        if (!hasPermission) {
            console.log('Notification permissions not granted');
            return;
        }

        // Create notification channels for Android
        await createNotificationChannel('timer-alerts', 'Timer Alerts', Notifications.AndroidImportance.HIGH);
        await createNotificationChannel('queue-alerts', 'Queue Alerts', Notifications.AndroidImportance.DEFAULT);

        console.log('Notification system initialized');
    } catch (error) {
        console.error('Error initializing notifications:', error);
    }
}
