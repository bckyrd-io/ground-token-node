import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
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
 *
 * On Android the native channel provider is not always ready at cold start, which
 * surfaces as a NullPointerException from
 * ExpoNotificationChannelManager.setNotificationChannelAsync. This helper is
 * therefore best-effort: it skips channels that already exist (they persist
 * across launches), retries once, and never throws. Notifications still deliver
 * on Android's implicit default channel if creation fails.
 *
 * @returns true if the channel exists after this call
 */
export async function createNotificationChannel(
    channelId: string,
    channelName: string,
    importance: Notifications.AndroidImportance = Notifications.AndroidImportance.DEFAULT
): Promise<boolean> {
    if (Platform.OS !== 'android') {
        return true;
    }

    const buildChannel = async (): Promise<void> => {
        // Existing channels are already registered natively — no need to re-set.
        const existing = await Notifications.getNotificationChannelsAsync();
        if (existing.some((channel) => channel.id === channelId)) {
            return;
        }

        await Notifications.setNotificationChannelAsync(channelId, {
            name: channelName,
            importance,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#2E7D32',
        });
    };

    try {
        await buildChannel();
        return true;
    } catch {
        // The channel provider is frequently not yet initialised this early in
        // startup; give it a beat and try once more before giving up.
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await buildChannel();
            return true;
        } catch (error) {
            // Non-fatal: the app keeps working, just without a custom channel.
            console.warn(
                `[Notifications] Channel "${channelId}" could not be created; falling back to the default channel.`,
                error instanceof Error ? error.message : error
            );
            return false;
        }
    }
}

/**
 * Show an immediate local notification
 * @param title - Notification title
 * @param body - Notification body text
 * @param data - Additional data to attach to the notification
 * @param channelId - Android notification channel ID. Must be supplied in
 *   `content.channelId` for it to take effect — a `trigger` of null carries no
 *   channel, so without this the notification always lands on the default
 *   channel and the channel's importance is ignored.
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
            // In SDK 53+ the Android channel is selected through the *trigger*,
            // not through `content.channelId` (that field was removed). Passing
            // null delivers immediately but always on the default channel.
            trigger: Platform.OS === 'android' ? { channelId } : null,
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
                // `type` is required: without it the trigger fails validation as
                // a time interval and is reinterpreted as a bare channel trigger,
                // which would deliver the notification immediately.
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
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
 *
 * Guarded by a module-level promise: in development React remounts the tabs
 * layout, which would otherwise request permissions and create channels twice.
 */
let initializePromise: Promise<void> | null = null;

export function initializeNotifications(): Promise<void> {
    if (!initializePromise) {
        initializePromise = runInitializeNotifications().catch((error) => {
            // Allow a later retry if init blew up unexpectedly.
            initializePromise = null;
            console.error('Error initializing notifications:', error);
        });
    }
    return initializePromise;
}

async function runInitializeNotifications(): Promise<void> {
    const hasPermission = await requestNotificationPermissions();

    if (!hasPermission) {
        console.log('Notification permissions not granted');
        return;
    }

    // Best-effort; a failure here must not stop the app from starting.
    await Promise.all([
        createNotificationChannel('timer-alerts', 'Timer Alerts', Notifications.AndroidImportance.HIGH),
        createNotificationChannel('queue-alerts', 'Queue Alerts', Notifications.AndroidImportance.DEFAULT),
    ]);

    console.log('Notification system initialized');
}
