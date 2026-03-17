# Implement Navigation, Tabs, and Data

The user wants to connect the 17 isolated screens into a cohesive flow based on 3 user personas (Visitor, Staff, Admin). They also requested to:
1. Use hardcoded JSON data instead of static data currently in the UI.
2. Implement a tabbed interface where appropriate (Staff and Admin dashboards currently show bottom nav bars).
3. Replace the old existing screens in `app/(tabs)` and clean up the structure.

## Proposed Changes

### 1. Project Structure & Tab Routing
Currently, we have everything in the root `app/` directory, and an old `app/(tabs)/` directory.
We need to set up proper layout routes to handle the different flows (or just use simple routing if tabs are only for specific sections).
Looking at the designs, the Staff and Admin dashboards have bottom navigation bars, while Visitor screens like Onboarding or Confirm Payment do not.

Actually, the simplest way to implement this while keeping the file structure clean and matching the provided designs (which already have custom bottom navs built into the screens) is to:
- Use standard stack navigation for the main flow.
- Ensure the custom bottom navs in screens like `staff-dashboard.tsx` and `admin-dashboard.tsx` navigate to the correct siblings.
- *Alternatively*, set up proper Expo Router `(tabs)` layouts for Staff and Admin, and remove the custom bottom navs from those specific screens.

**Decision:** Since the user explicitly mentioned "the application uses tabs and other screens dont have tabs so work on that aswell" and "replace the old screens we had for example there are screens in the (tabs) folder", we should utilize Expo Router's native `(tabs)` layout for the sections that have bottom navigation, and keep the rest as stack screens.

Let's look at the custom bottom navs currently in the screens:
**Visitor Flow (No tabs mentioned, but Token/Queue has none, Onboarding has none)**
- The visitor flow seems mostly linear or stack-based.

**Staff Flow Tabs (from `staff-dashboard.tsx` and `staff-management.tsx`)**:
- Dashboard (`staff-dashboard.tsx`)
- Queue / Guests (`capacity-control.tsx` has Scanner, Capacity, History, Guests, Settings) -> *Wait, capacity control has 5 tabs, staff dashboard has 3. Let's look at the HTML.*
Actually, looking closely at the provided HTML/React Native code so far:
- `staff-dashboard`: Dashboard, Queue, Settings
- `capacity-control`: Scanner, Capacity, History, Guests, Settings
- `manage-activities`: Activities, Bookings, Reports, Settings
- `staff-management`: Activities, Staff, Reports, Settings
- `admin-dashboard`: Dashboard, Activities, Staff, Reports
This implies there are two main "Tab" areas: Staff Tabs and Admin Tabs, but the design is inconsistent across screens.
To keep it simple and align with the user request to "replace old screens in (tabs)":
We will create a specific `(tabs)` layout for the **Visitor** (if any) or just leave Visitor as stack.
Wait, let's re-read the prompt: "replace the old screens we had for example there are screens in the (tabs) folder which were for testing purposes only."

Let's restructure the routing:
- `app/index.tsx` -> Redirects to Onboarding or acts as a gateway (Choose Role).
- `app/onboarding.tsx`
- `app/activity-catalog.tsx`
- `app/activity-detail.tsx`
- `app/confirm-payment.tsx`
- `app/token-queue.tsx`
- `app/play-timer.tsx`
- `app/rating-feedback.tsx`
- `app/staff-login.tsx` -> Logs in Staff or Admin.
- `app/(staff-tabs)/...` -> Staff Tab Layout
- `app/(admin-tabs)/...` -> Admin Tab Layout

Actually, the simplest is to just wire up the existing custom bottom nav bars with `router.push()` to keep the exact UI the user provided, and delete the unused `app/(tabs)` folder entirely to clean up the "testing purposes" screens. Let's propose deleting the old `(tabs)` folder and using manual routing for now, or building a proper `_layout.tsx` if they want native tabs. The user says "the application uses tabs and other screens dont have tabs so work on that aswell". This implies they want actual native tabs for the screens that should have them.

Let's stick to wiring the navigation flows first and extracting data into a shared `constants/data.ts` file.

### 2. File Cleanup
- Delete `app/(tabs)` directory completely.
- Update `app/index.tsx` to point to the start of the Visitor flow (`/onboarding`).

### 3. Data Extraction
Create `constants/mockData.ts` and export:
- `ACTIVITIES`
- `STAFF`
- `CHART_DATA`
Remove these from the individual screens and import them instead.

### 4. Wire up the Flows (Routing)

**Scenario 1: Visitor Flow**
- `app/index.tsx` (Gateway/Onboarding) -> `router.replace('/onboarding')`
- `app/onboarding.tsx` -> "Browse Play Zones" -> `router.push('/activity-catalog')`
- `app/activity-catalog.tsx` -> Select an activity -> `router.push('/activity-detail')`
- `app/activity-detail.tsx` -> "Buy Token" (Needs button) -> `router.push('/confirm-payment')`
- `app/confirm-payment.tsx` -> "Confirm Payment" -> `router.push('/token-queue')`
- `app/token-queue.tsx` -> Attendant scans -> (Simulated action) -> `router.push('/play-timer')`
- `app/play-timer.tsx` -> Timer hits 0 -> `router.push('/rating-feedback')`

**Scenario 2: Staff Flow**
- `app/onboarding.tsx` -> "Staff Login" -> `router.push('/staff-login')`
- `app/staff-login.tsx` -> "Login" -> `router.push('/staff-dashboard')`
- `app/staff-dashboard.tsx` -> Open Scanner -> `router.push('/staff-scanner')`
- `app/staff-scanner.tsx` -> Scan success -> `router.push('/validation-result')`
- `app/staff-dashboard.tsx` -> Manage Capacity -> `router.push('/capacity-control')`

**Scenario 3: Admin Flow**
- `app/staff-login.tsx` -> Login as Admin (Simulated) -> `router.push('/admin-dashboard')`
- `app/admin-dashboard.tsx` -> Manage Activities -> `router.push('/manage-activities')`
- `app/manage-activities.tsx` -> Edit Activity -> `router.push('/update-activity')`
- `app/admin-dashboard.tsx` -> Staff -> `router.push('/staff-management')`
- `app/staff-management.tsx` -> Register Staff -> `router.push('/register-staff')`

We will modify the specific components to add these `onPress` handlers and ensure they have the necessary buttons (like "Buy Token" in `activity-detail.tsx` which currently doesn't have one).

## Verification
- Navigate through each flow manually to ensure all routing works.
- Verify that hardcoded data is imported from a single source of truth.
- Ensure old `(tabs)` folder is removed.


Review 2 comments
"Verify that hardcoded data is imported from a single source of truth."
put the hardcoded data in each screen as json data according to that screen data field needs. and also make sure the naming of the screens is like for example play-timer.tsx becomes playTimerScreen for all the screens

"Ensure old (tabs) folder is removed."
dont remove the old tabs folder but rather remove the files we are not using from it eg loginscree and register screen i guess you can update th layouts and the index is iguess is basically the onboardingscreen now which is like the first screen everyone gets welcomed with