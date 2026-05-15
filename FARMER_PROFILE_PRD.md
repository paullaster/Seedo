Specialized PRD: Farmer Profile & Identity Module
Module Title: AgriCollect Farmer Identity & Trust Center
Status: Implementation Blueprint
Target Persona: The Farmer (End-User)
Priority: High (Identity & Security Anchor)
1. Vision & Emotional Objectives
The Profile is the "Digital Heart" of the farmer's experience. It must feel deliberately intentional and supportive. Beyond data entry, it serves as a "Trust Center" that validates the farmer's hard work and ensures their financial security. We aim to move from "filling forms" to "nurturing an identity."
2. Functional Specification
2.1 The "Growth Metaphor" Profile Completion
To make the onboarding process intuitive and engaging:
The Visual Metaphor: A digital illustration of a seed appears when the profile is 0% complete. As the farmer adds data (Photo -> ID -> Location -> Bank Info), the seed sprouts and eventually grows into a fully matured, vibrant plant at 100%.
Supportive Messaging: Use copy like "Planting your digital roots..." or "Your farm identity is blossoming!" instead of generic progress bars.
2.2 Security & Verification (The "Security Shield")
Changing critical information requires a high-trust verification flow:
Critical Fields: National ID, Phone Number, and Email.
OTP Flow: * Triggered immediately upon clicking "Edit" for critical fields.
Displayed in a Bottom Drawer (Mobile-First approach).
Includes a supportive countdown timer and a "Resend" button with a clear progress indicator.
Verified Badges: Once verified, fields receive a high-contrast green "Verified" badge to boost user confidence.
2.3 Identity & Farm Personalization
Digital Farm Name: A field for farmers to name their operation (e.g., "Maziwa Bora Farm").
Crop Specialties: A visual "tag" selector where farmers pick their primary crops. This data dynamically filters the "Market Price Feed" on the dashboard.
Profile Picture: A simple, high-affordance upload tool with an auto-crop feature to ensure the farmer's face is clear for identification at collection points.
2.4 Smart Location & Map Support
Farm Pinning: An interactive MUI-based map preview.
Auto-Geocoding: Pick up current GPS coordinates or allow manual address entry that the Next.js BFF geocodes to retrieve place_id and formatted addresses.
Proximity Link: A shortcut to "View Nearest Collection Store" directly from the profile location card.
3. Tech Stack & Implementation Roadmap
3.1 Data Architecture (RSC Pattern)
Server Components (page.tsx): Fetch the core profile data from the remote backend.
Client Components: Handle the "Edit Mode" state, OTP Drawer toggles, and the "Growth Metaphor" animation logic.
Minimal Effects: Only use useEffect for the PWA-specific camera integration (for profile photos) and map rendering.
3.2 Security Implementation
BFF Logic: The Next.js BFF acts as a proxy for OTP generation and verification, protecting the remote backend's direct endpoints.
Sensitive Data Masking: Phone numbers and emails should be partially masked (e.g., +254 **** 123) until the user initiates an authorized change.
4. UI/UX & Accessibility
4.1 Accessibility Aids
Supportive Alerts: Instead of toasters, use embedded MUI Alerts that explain why a verification failed (e.g., "The code entered has expired. Let's try sending a new one").
High Contrast: Ensure all status badges (Verified, Pending, Error) exceed WCAG 2.1 AA contrast ratios.
4.2 Skeleton Loading
Use specific skeleton shapes for the "Growth Metaphor" area and the profile header to ensure the layout remains stable while data resolves.
5. Implementation Notes for the Agent
Strict Typing: Define interface FarmerProfile including verificationStatus as a literal type ('verified' | 'pending' | 'unverified').
Animation: Use a lightweight library like framer-motion for the growth metaphor transitions to keep the "emotional" feel smooth.
Mobile-First Drawers: Ensure the OTP Drawer has a "focus trap" for accessibility and auto-focuses the first input field on open.
Mocking: Simulate "Failed OTP" and "Network Error" states in src/mocks to verify the supportive error-handling UI.
6. Notification Logic
Profile Updated: SMS confirmation for all critical information changes.
Incomplete Profile: A subtle, supportive in-app reminder if the "Growth Metaphor" hasn't reached 100% within 48 hours of registration.
