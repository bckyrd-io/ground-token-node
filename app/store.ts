import { create } from 'zustand';

// Define the profile type
type Profile = {
    username: string;
    avatar: string;
};

// Define Zustand store state
type StoreState = {
    profile: Profile | null; // Profile can be null initially
    serverIp: string; // Server IP address for API requests
    fetchProfile: () => Promise<void>; // Function to fetch profile data
};

// Zustand store
export const useStore = create<StoreState>((set) => ({
    // Initial state
    profile: {
        username: 'JohnDoe',
        avatar: 'https://picsum.photos/200', // Default placeholder image
    },
    serverIp: 'http://192.168.1.175:5000', // Replace with your server IP or base URL

    // Fetch profile data
    fetchProfile: async () => {
        try {
            const response = await fetch('http://localhost:5000/api/profile'); // Replace with dynamic serverIp if needed
            const data = await response.json();
            console.log('Fetched profile data:', data);

            // Use default image if avatar is missing
            const profileData = {
                username: data.username,
                avatar: data.avatar || 'https://picsum.photos/200',
            };

            set({ profile: profileData }); // Update profile state with fetched data
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    },
}));
