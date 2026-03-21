import { create } from 'zustand';

// Define types
type Profile = {
    username: string;
    avatar: string;
};

type Activity = {
    id: string;
    name: string;
    description: string;
    price: string;
    waitTime: string;
    waitColor: string;
    image: string;
};

type AdminActivity = {
    id: string;
    name: string;
    capacity: string;
    percent: number;
    image: string;
};

type ActivityDetail = {
    name: string;
    rating: number;
    reviewCount: number;
    description: string;
    image: string;
    safetyRules: string[];
};

type Token = {
    id: string;
    name: string;
    code: string;
    status: 'queue' | 'ready';
    queuePosition: string | null;
    qrImage: string;
};

type StaffMember = {
    id: string;
    name: string;
    zone: string;
    status: 'Active' | 'Off-Duty';
    image: string;
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
    feedbackOptions: FeedbackOptions | null;
    fetchProfile: () => Promise<void>;
    fetchActivities: () => Promise<void>;
    fetchAdminActivities: () => Promise<void>;
    fetchActivityDetail: (id: string) => Promise<void>;
    fetchTokens: () => Promise<void>;
    fetchStaff: () => Promise<void>;
    fetchFeedbackOptions: () => Promise<void>;
};

// Zustand store
export const useStore = create<StoreState>((set, get) => ({
    // Initial state
    profile: {
        username: 'JohnDoe',
        avatar: 'https://picsum.photos/200',
    },
    serverIp: 'http://192.168.1.175:5000', // Replace with your server IP or base URL
    activities: [],
    adminActivities: [],
    activityDetails: {},
    tokens: [],
    staff: [],
    feedbackOptions: null,

    // Fetch profile data
    fetchProfile: async () => {
        try {
            const { serverIp } = get();
            const response = await fetch(`${serverIp}/api/profile`);
            const data = await response.json();
            console.log('Fetched profile data:', data);

            // Use default image if avatar is missing
            const profileData = {
                username: data.username,
                avatar: data.avatar || 'https://picsum.photos/200',
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
            set({ activities: data });
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
            set({ adminActivities: data });
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
            set((state) => ({
                activityDetails: { ...state.activityDetails, [id]: data },
            }));
        } catch (error) {
            console.error('Failed to fetch activity detail:', error);
        }
    },

    // Fetch tokens
    fetchTokens: async () => {
        try {
            const { serverIp } = get();
            const response = await fetch(`${serverIp}/api/tokens`);
            const data = await response.json();
            set({ tokens: data });
        } catch (error) {
            console.error('Failed to fetch tokens:', error);
        }
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
