Specialized PRD: Public Discovery & Agent Search Module
Module Title: AgriCollect Public Agent Directory
Status: Implementation Blueprint
Target Persona: Farmers (All literacy levels), General Public, New Agents
Priority: High (Transparency & Discovery)
1. Vision & Accessibility Philosophy
The Discovery module must be radically simple. It is designed for users who may be under stress, in low-light outdoor conditions, or have limited experience with complex digital interfaces. The goal is to answer one question instantly: "Where is the nearest trusted place to take my crops, or who is the nearest verified collector to pick them up?"
2. Functional Specification: The Search Experience
2.1 Dual-Agent Search Modes
Users can toggle between two views to find exactly what they need:
"Find a Store": Locates physical Store Agents where farmers can deliver produce.
"Find a Collector": Locates verified Collection Agents for logistical support or verification inquiries.
2.2 The "Supportive" Search & Filter
To minimize cognitive load, the interface prioritizes visual cues and multiple search vectors:
Multimodal Search Bar: A large, high-contrast input that accepts:
Name: Store name or Agent's full name.
ID Number: Searching by National ID/Passport for instant verification of the person standing in front of the farmer.
Keyword: Towns or Produce Types (e.g., "Maize").
One-Tap Proximity: A prominent "Find Near Me" button with a large GPS icon.
Visual Filters (Chips): Use large "Produce Chips" with icons. Tapping a chip immediately filters the list to agents authorized to handle that specific crop.
2.3 Interactive Map Discovery
Map Selection: Users can pan a simplified map and tap "Search this area" to find agents in a specific location.
Branded Pins: * Green Pin: Store Agent (Physical Intake).
Blue Pin: Collection Agent (Mobile/Logistics Partner).
Simplified Map View: A clean map with large, branded pins. Tapping a pin opens a Bottom Drawer (not a modal) with the agent's details.
3. The Agent "Trust Card" (Search Results)
Each result item is a card designed for high affordance:
The Trust Badge: A large, green "Verified" checkmark. If an agent's ID is searched and they are not verified, a clear "Not Verified" warning is displayed.
Proximity Label: Relatable distance terms: "Very Close (2km)," "Nearby (5km)," or "Further Away."
Produce Icons: Clear icons showing exactly what the agent/store accepts or verifies.
Call Action: A large, supportive "Call Agent" button for direct clarification.
4. Public Agent Profile (The Detail Drawer)
When an agent is selected, a full-height Drawer slides up:
Hero Information: Store photo (for Store Agents) or Profile Photo (for Collection Agents) and their verified name.
Verification Details: Visible National ID (partially masked) to confirm identity matches physical documents.
Accepted Produce & Rates: Current Daily Rates and quantity limits (Min/Max).
Location Details: Precise address and a "Take me there" button that opens the device's default navigation (Google Maps/Apple Maps).
5. Technical Architecture (RSC & Search Excellence)
5.1 Data Fetching Strategy (RSC)
Server Component (page.tsx): The initial list of verified agents is fetched on the server based on the user's estimated region (IP-based). This ensures the page is indexable and loads instantly.
BFF Logic: The Next.js BFF handles complex queries (Name vs ID vs Location) and filters the data before passing it to the Client Components.
5.2 Performance & Connectivity
Skeleton States: Use "Card Skeletons" during map/list loading.
Cached Results: Store the last 5 searched agents in IndexedDB for offline access during travel.
6. UI/UX Design Standards (Cognitive-Friendly)
Feature
Standard
Font Size
Minimum 16px for body, 20px for primary labels.
Touch Targets
Minimum 48x48px for all buttons/chips/map pins.
Search Priority
ID search must return a "Primary Match" highlight for security checks.
Language
Plain English/Swahili/Local Dialects; avoid technical jargon.

7. Implementation Notes for the Agent
ID Search Logic: If a user enters a 7-10 digit number, the system should automatically prioritize an ID-based search.
Dynamic Pins: Collection Agents should be displayed based on their "Home Base" or "Assigned Region" coordinates captured during registration.
No "No Results" Dead Ends: Provide clickable suggestions if a search fails.
Mocking: Create variations of agents in src/mocks including "Store Agent," "Collection Agent," and "Unverified Search Result."
