import cors from 'cors';
import express from 'express';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Hardcoded data (to be moved to database later)

// Activities for catalog (visitor)
const activities = [
    {
        id: '1',
        name: 'Trampoline Park',
        description: 'High-energy jumping zone with foam pits and safety nets.',
        price: '$12.00',
        waitTime: '15 min wait',
        waitColor: '#fbbf24', // amber
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApQ1G0cnfzrvTgBfuZPm_XLdFdWhsiiQW5mAJGTiwvqW53aygfmyirVGw8-tDljGD9kF-nQUX5OSrIESvN0BbFxkQMja3RW2C7cy7AeuM2oFN652BdGkQtexEYJKQUEcqj5-59FE3ml5uYrThwRxrIK058cR6Qb2U-tPPRYXLOfhY-b3ihFxrKIGA2DlzQ9_sD2Dberk9yN99XjtgAv8PZ3rs6NLJci25LDEhSTrNdI_Pk8LbJv9txOtOLEcTxj3C4KGcN8xDsNotS',
    },
    {
        id: '2',
        name: 'Ocean Ball Pit',
        description: 'A sea of 50,000 colorful balls for endless sensory fun.',
        price: '$8.00',
        waitTime: 'No wait',
        waitColor: '#22c55e', // green
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi22TPhmvuW6Y0uA_ZYfZ-xwrmY0fHR8qrVZkISGZckcIvwqryAtoIRoMGFFJ1PJ04WuLNYIHoAbVvbiB9e5epol_zhWFhE4vds6Jt4d-LqWGaGWFilyBo4zCShDEKXXQI3GqszHEy-9PG0YWeMO2K7lqTAvO8Ht4dwt_vPPpgfHWbxk_9T-T_JU5acRbLWoNBzZGQEK2VSodLnPLg4ioAfxPqDNxNUHq5t7F1kKDHMogRrAxsWAe86bDbUtGHmOW9P3UgGR8O__15',
    },
    {
        id: '3',
        name: 'Rainbow Giant Slide',
        description: 'Experience the thrill of our 3-story wavy rainbow slide.',
        price: '$10.00',
        waitTime: '30 min wait',
        waitColor: '#ef4444', // red
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZlj2BweUn0dTyiIxiLo-X6W4et11JsdTOY7c6n3MZjwnostj9awanK0UlRLaLTQ6h4_XSi5n8AtxF-QAvDJ9yBedxXdIIXzxh-k5upWu1wz7LWXQgP0Ha4cTa6NJ8ErXylSz3B4JTPMO43-gfWu-llEV5AUnNaMGvN5G_-uT6yo4yLExY_NRYIm71HlS2Ep5WNiYpyE7fKu-FFAiAe2you_Q4_uaPiM0c_IOaA_7xLdbKENZiACkJMThzVR-7sEBho3ExoZXcCvHl',
    },
];

// Activities for management (admin)
const adminActivities = [
    {
        id: '1',
        name: 'Trampoline Park',
        capacity: '25/40',
        percent: 62.5,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBM6BoXpFRfq4L3idPdVAezYQtejMLs92T1H76rWrc4B-dJacAutWZfqPSQN88EDeFMxAzpDB8rNpNbX6-Aw7j-yn7YOu1ABpujBjVyOIMCtRoeWVZfQlfoHLYYiWigpGUkVQPCXpGgSA65986Jg_AOB9ZtGxalHY270JllEpeaXe9HqeDjHiAwplmu-Ev8QCKFfFYM8KYJeEn9coITM0-JqP1lZ0HTd-vKopLrDMHrdaLYk4meJaO_A1DdBeCxAvqOgoKksEPsCNr',
    },
    {
        id: '2',
        name: 'Ball Pit',
        capacity: '15/20',
        percent: 75,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsRGhdJ6IWpQxzbYQV2ciFrYIswv6IS-b4GjOx1Pg8fwERnZ5_WK2LEL-JSWVvccLJWAnFXDo62m_cefjXLuPYOzp_n2M_e406S7d17fViX3olZd1pNh6BJx2Tytk5KP_Gr5HEmjETr3FzCAzWiIdOlgoc25flt2WYyrlf_ibwbM_xepChgUbjWhGEp8kLXEyP80EiyLUK-7sVn4YvjOhVwMA7UBAa8KeepyTXcfnASwf-9-jpDdHXrDUmwVBnLIEarb1btrbNdf2f',
    },
    {
        id: '3',
        name: 'Slide Zone',
        capacity: '10/30',
        percent: 33.3,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg4SCdDJgInsbOE_brJ5yxQd4inXsjytpjBENpKxnric0fh7l2JB9XCDIpmitlcfx_rbJwKDgI1dyhDaSpKssETveVJ-ElMgAn9EU4VLPtvargPk4R9p4VVxEZFO0AjqB7iaixPbMimp2wrESdtT480HMO5VWVvTWgqeTwTj88p2ICdw45ZCD5EV1BZU8pAVW_pHtslw8FGioRa34ATPe8CYNi8hGPbPjj6PoCl9yWxQsuTLbrUYXuXNtNZHODaWJ7XZ_7t_23Yzgp',
    },
];

// Activity details
const activityDetails: Record<string, {
    name: string;
    rating: number;
    reviewCount: number;
    description: string;
    image: string;
    safetyRules: string[];
}> = {
    '1': {
        name: 'Trampoline Park',
        rating: 4.8,
        reviewCount: 120,
        description: 'A high-energy jumping zone featuring professional-grade trampolines, foam pits, and safety nets. Perfect for burning off energy and practicing cool jumps.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6eIehmaJu-d2Gd4D_d5XWqnPmkMlpEMvlmLUTuZ70B159hd0cQl4zKvpQ9pEm-Y0X-swTLjL85Zt9RIijJcG2bsOWBcGc0_4EN9_ivCvVjRPPdTSbeMyrXwkGs5qR8eD6QFrafpZAR6jcygaglRcx9B7MMEo0Gjr0nh-BFjhRxuI8HiVhjvjexwJtqhWiyTxHt3dhUYkebXHLMoUL9kMuMSwiNYL32F1VSSYntt2extDe47TVpNrqhEHFRZ8BIr0ZKVNIyuX9BMxP',
        safetyRules: [
            'Grip socks must be worn at all times.',
            'One person per trampoline.',
            'No flips or somersaults into foam pits.',
            'Empty pockets before jumping.',
        ],
    },
    // Add for others if needed
};

// Tokens
const tokens = [
    {
        id: '1',
        name: 'Trampoline Park',
        code: '#GT-4829',
        status: 'queue',
        queuePosition: '#3',
        qrImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGnmpGUSgqZxJqH3uM-2JUWTzeIZ7b3YFbrxFCuEWi2WNqYw_6fxOXHddOogKhg37iYW4lbncCSan3PsCooKDUCPMxV_YyJ8o_mEpinHRKH4PE3jZDCXWFKUoYd9onS6_o2JnCcmETMmOMMBoVjkhLAzs9vQSSB6q50Y1g0MlV-DQeTDcB6Jc5IiSKZizlk0o_0jyPewSyJ3_EuPM2IbswbgiV-8IMGdl47Zae4Ju4wFufZ8J4RxDdCKnuvYD-rcAERWlTqNZ_3noH',
    },
    {
        id: '2',
        name: 'Ocean Ball Pit',
        code: '#GT-9214',
        status: 'ready',
        queuePosition: null,
        qrImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGnmpGUSgqZxJqH3uM-2JUWTzeIZ7b3YFbrxFCuEWi2WNqYw_6fxOXHddOogKhg37iYW4lbncCSan3PsCooKDUCPMxV_YyJ8o_mEpinHRKH4PE3jZDCXWFKUoYd9onS6_o2JnCcmETMmOMMBoVjkhLAzs9vQSSB6q50Y1g0MlV-DQeTDcB6Jc5IiSKZizlk0o_0jyPewSyJ3_EuPM2IbswbgiV-8IMGdl47Zae4Ju4wFufZ8J4RxDdCKnuvYD-rcAERWlTqNZ_3noH',
    },
    {
        id: '3',
        name: 'Rainbow Giant Slide',
        code: '#GT-1105',
        status: 'queue',
        queuePosition: '#12',
        qrImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGnmpGUSgqZxJqH3uM-2JUWTzeIZ7b3YFbrxFCuEWi2WNqYw_6fxOXHddOogKhg37iYW4lbncCSan3PsCooKDUCPMxV_YyJ8o_mEpinHRKH4PE3jZDCXWFKUoYd9onS6_o2JnCcmETMmOMMBoVjkhLAzs9vQSSB6q50Y1g0MlV-DQeTDcB6Jc5IiSKZizlk0o_0jyPewSyJ3_EuPM2IbswbgiV-8IMGdl47Zae4Ju4wFufZ8J4RxDdCKnuvYD-rcAERWlTqNZ_3noH',
    },
];

// Staff
const staff = [
    {
        id: '1',
        name: 'Alice Henderson',
        zone: 'Trampoline Park',
        status: 'Active',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC29lEbjgXczTBNVT9obxDQ4lyTWXoy8l8s2MVSi5T8q-PbNHwm8v4tnsFBBbovO24YvqtOJRXVI8Y4Ma-XbfTE4b_Z5tvUrm0S-vePxDUSg2y2zs9ImY2fytVir9jTj9yQEwDWtuP1yh4CgeNqZXforin5bqyWG_uhxMGFj5mPY03EHRbM7hPmEXrfn50uSUhPTNgRA2KL3RtSuVZM4sQUTwUSFtmFpWpQh4Htubsdu3KI7xB6FXxu9lVDJ2WLoW6xk-YDkvC9q6pR',
    },
    {
        id: '2',
        name: 'Marcus Thompson',
        zone: 'Ball Pit',
        status: 'Active',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-FfnnJw8mL4hbkUGdwrhpD6R3GyuGxEW1gEMm5oaVT-wf4XJbdQuHEE1iT1QpO01bsysGqhUYtC8q8HjICXJlXj2m77Q84ftGsoOs2_XAA-oz_wY817StBvL8oBSLs___MS8qb2BksixRPaJDrO7OSlH3kI7YrJltFVfuod1gqGXiAlGB8djCabsyRc3TI9TevUxlXdMtq3SfrTQ193xs0LjqtXemdAybh2A5J2_JfLKrEmR6qNwkA3rPXi1H0PIKpQUfbeg9jrd3',
    },
    {
        id: '3',
        name: 'Sarah Jenkins',
        zone: 'Slide Zone',
        status: 'Off-Duty',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr8lcKsgUV5wV-VcEpvQq6MIlyshS9PH3QxEm2xG5koGSzd7WOb38-Rx7vd0UG0LXcCwf5sfdHeq4JfN0LSKK2zDMinAWayssfy_1eF9JpCodqD1RAdT5kdxUD6F_wTmtxw727ulCyBkGhN47wxTjPR1w8CCV605IRsOaFZZfjcMoBcUtimY9T3AVfizQuWVtlbcWv2iJ_1bmlgcuKOTYgT8tmb9euQBN8Elp_i1ik4nuoaVcp_G1kKRHYLWkvo4rLnRwDN6lbkSU4',
    },
    {
        id: '4',
        name: 'David Chen',
        zone: 'Trampoline Park',
        status: 'Active',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrG9a386F8T4F0SfzvHVulBezLthnuZFKxlTCA3i0SS50x4yhU9kdtnPY4KMhs_y7uD6vcrmllx7ukISSCz762mVrQQaESVkN7rswvQh7P7zdiX07xFxYSuMfv-kkLpSDo3Zh68kC4CexjhubgvbUoxjcp4wn1TmbiWmfj36tK6HTcX_GAEnrEcEwq3PKSuk0hnSul38nWrm2PAKVK4YhC2fPkt_D1Q3hGuhVSkNIP04wXn-k58ZoStmSUZ0mrhPsvB4oy9BROtitZ',
    },
];

// Profile
const profile = {
    username: 'JohnDoe',
    avatar: 'https://picsum.photos/200',
};

// Quick tags and rating labels for feedback
const quickTags = ['Cleanliness', 'Friendly Staff', 'Safety', 'Equipment'];
const ratingLabels = ['', 'Terrible', 'Bad', 'Okay', 'Great', 'Amazing'];

// Routes

// Get activities for catalog
app.get('/api/activities', (req, res) => {
    res.json(activities);
});

// Get activity detail
app.get('/api/activities/:id', (req, res) => {
    const { id } = req.params;
    const detail = activityDetails[id];
    if (detail) {
        res.json(detail);
    } else {
        res.status(404).json({ error: 'Activity not found' });
    }
});

// Get admin activities
app.get('/api/admin/activities', (req, res) => {
    res.json(adminActivities);
});

// Get tokens
app.get('/api/tokens', (req, res) => {
    res.json(tokens);
});

// Get staff
app.get('/api/staff', (req, res) => {
    res.json(staff);
});

// Get profile
app.get('/api/profile', (req, res) => {
    res.json(profile);
});

// Get feedback options
app.get('/api/feedback/options', (req, res) => {
    res.json({ quickTags, ratingLabels });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
