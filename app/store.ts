import { create } from 'zustand';

// Define types
export type Profile = {
    id: string | null;
    username: string;
    avatar: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
};

type Activity = {
    id: string;
    name: string;
    description: string;
    price: string;
    currentOccupancy: number;
    capacity: number;
    waitTime: string;
    waitColor: string;
    image: string;
    type: 'play' | 'food';
    latitude?: number | null;
    longitude?: number | null;
};

type AdminActivity = {
    id: string;
    name: string;
    capacity: string;
    percent: number;
    image: string;
    latitude?: number | null;
    longitude?: number | null;
};

type ActivityDetail = {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    description: string;
    price: string;
    capacity: number;
    currentOccupancy: number;
    image: string;
    safetyRules: string[];
    type: 'play' | 'food';
    latitude?: number | null;
    longitude?: number | null;
};

type Token = {
    id: string;
    name: string;
    code: string;
    status: 'queue' | 'ready' | 'in_use' | 'completed' | 'expired';
    queuePosition: string | null;
    qrImage: string;
    activityId?: string | number;
    activityType?: 'play' | 'food';
    expiresAt?: string;
    createdAt?: string;
};

type StaffMember = {
    id: string;
    username?: string;
    name: string;
    zone: string;
    status: 'Active' | 'Off-Duty' | 'Unassigned';
    image: string;
};

type StaffActivity = {
    id: string;
    name: string;
    description: string;
    price: string;
    capacity: number;
    currentOccupancy: number;
    image: string;
    safetyRules: string[];
    isCapacityControlOpen?: boolean | number;
    latitude?: number | null;
    longitude?: number | null;
};

type FeedbackOptions = {
    quickTags: string[];
    ratingLabels: string[];
};

// Define Zustand store state
type StoreState = {
    profile: Profile | null;
    serverIp: string;
    activities: Activity[];
    adminActivities: AdminActivity[];
    activityDetails: { [key: string]: ActivityDetail };
    tokens: Token[];
    staff: StaffMember[];
    staffActivity: StaffActivity | null;
    feedbackOptions: FeedbackOptions | null;
    fetchProfile: () => Promise<void>;
    fetchActivities: () => Promise<void>;
    fetchAdminActivities: () => Promise<void>;
    fetchActivityDetail: (id: string) => Promise<void>;
    fetchTokens: (userId: string) => Promise<void>;
    updateToken: (tokenId: string, updates: Partial<Token>) => void;
    fetchStaff: () => Promise<void>;
    fetchStaffActivity: (staffId: string) => Promise<void>;
    fetchFeedbackOptions: () => Promise<void>;
    setProfile: (profile: Profile) => void;
    logout: () => void;
};

// Helper function to prepend server URL to image paths
const getImageUrl = (imagePath: string | null, serverIp: string): string | null => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath; // Already a full URL
    return `${serverIp}${imagePath}`;
};

// Zustand store
export const useStore = create<StoreState>((set, get) => ({
    // Initial state
    profile: {
        id: null,
        username: 'JohnDoe',
        avatar: 'https://picsum.photos/200',
        email: 'john.doe@example.com',
        phone: '+265123456789',
        role: 'visitor',
        createdAt: new Date().toISOString()
    },
    serverIp: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.43.2:5000',
    activities: [],
    adminActivities: [],
    activityDetails: {},
    tokens: [],
    staff: [],
    staffActivity: null,
    feedbackOptions: null,
    setProfile: (profile) => set({ profile }),
    logout: () => set({
        profile: null,
        tokens: [],
        staffActivity: null,
    }),

    // Fetch profile data
    fetchProfile: async () => {
        try {
            const { serverIp } = get();
            const response = await fetch(`${serverIp}/api/profile`);
            const data = await response.json();
            console.log('Fetched profile data:', data);

            // Use complete profile data with defaults
            const profileData = {
                id: data.id || null,
                username: data.username || 'Guest',
                avatar: data.avatar || 'https://picsum.photos/200',
                email: data.email || 'visitor@gelatokids.com',
                phone: data.phone || '+2651234572',
                role: data.role || 'visitor',
                createdAt: data.createdAt || new Date().toISOString()
            };

            set({ profile: profileData });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    },

    // Fetch activities for catalog
    fetchActivities: async () => {
        try {
            const { serverIp } = get();
            const response = await fetch(`${serverIp}/api/activities`);
            const data = await response.json();

            // Compute wait time and color on frontend
            const processedActivities = data.map((activity: any) => {
                const occupancyRate = activity.currentOccupancy / activity.capacity;
                let waitTime: string;
                let waitColor: string;

                if (occupancyRate < 0.5) {
                    waitTime = 'No wait';
                    waitColor = '#22c55e';
                } else if (occupancyRate < 0.8) {
                    waitTime = '15 min wait';
                    waitColor = '#fbbf24';
                } else {
                    waitTime = '30 min wait';
                    waitColor = '#ef4444';
                }

                return {
                    ...activity,
                    image: getImageUrl(activity.image, serverIp),
                    waitTime,
                    waitColor,
                };
            });

            set({ activities: processedActivities });
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        }
    },

    // Fetch admin activities
    fetchAdminActivities: async () => {
        try {
            const { serverIp } = get();
            const response = await fetch(`${serverIp}/api/admin/activities`);
            const data = await response.json();
            
            // Process image URLs for admin activities
            const processedAdminActivities = data.map((activity: any) => ({
                ...activity,
                image: getImageUrl(activity.image, serverIp),
            }));
            
            set({ adminActivities: processedAdminActivities });
        } catch (error) {
            console.error('Failed to fetch admin activities:', error);
        }
    },

    // Fetch activity detail
    fetchActivityDetail: async (id: string) => {
        try {
            const { serverIp } = get();
            const response = await fetch(`${serverIp}/api/activities/${id}`);
            const data = await response.json();
            
            // Process image URL for activity detail
            const processedData = {
                ...data,
                image: getImageUrl(data.image, serverIp),
            };
            
            set((state) => ({
                activityDetails: { ...state.activityDetails, [id]: processedData },
            }));
        } catch (error) {
            console.error('Failed to fetch activity detail:', error);
        }
    },

    // Fetch tokens for a specific user
    fetchTokens: async (userId: string) => {
        try {
            const { serverIp } = get();
            const response = await fetch(`${serverIp}/api/tokens?userId=${userId}`);
            const data = await response.json();
            set({ tokens: data });
        } catch (error) {
            console.error('Failed to fetch tokens:', error);
        }
    },

    // Update a specific token's data (e.g., after starting a session)
    updateToken: (tokenId: string, updates: Partial<Token>) => {
        set((state) => ({
            tokens: state.tokens.map((t) =>
                t.id === tokenId ? { ...t, ...updates } : t
            ),
        }));
    },

    // Fetch staff
    fetchStaff: async () => {
        try {
            const { serverIp } = get();
            const response = await fetch(`${serverIp}/api/staff`);
            const data = await response.json();
            set({ staff: data });
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        }
    },

    // Fetch staff member's assigned activity
    fetchStaffActivity: async (staffId: string) => {
        try {
            const { serverIp } = get();
            const response = await fetch(`${serverIp}/api/staff/${staffId}/activity`);
            if (response.ok) {
                const data = await response.json();
                
                // Process image URL for staff activity
                const processedData = {
                    ...data,
                    image: getImageUrl(data.image, serverIp),
                };
                
                set({ staffActivity: processedData });
            } else {
                console.error('Staff activity not found');
                set({ staffActivity: null });
            }
        } catch (error) {
            console.error('Failed to fetch staff activity:', error);
            set({ staffActivity: null });
        }
    },

    // Fetch feedback options
    fetchFeedbackOptions: async () => {
        try {
            const { serverIp } = get();
            const response = await fetch(`${serverIp}/api/feedback/options`);
            const data = await response.json();
            set({ feedbackOptions: data });
        } catch (error) {
            console.error('Failed to fetch feedback options:', error);
        }
    },
}));

// Export default for router compatibility
export default useStore;
