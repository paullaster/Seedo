Product Requirement Document (PRD): AgriCollect MVP
Project Title: AgriCollect (High-End Frontend Client)
Version: 1.0.2 (Feature & Implementation Update)
Status: Ready for Implementation
Target Environment: Node.js 24+, React 19.2, Next.js 16
1. Executive Summary
AgriCollect is a farm produce collection system designed to bridge the gap between farmers, collection agents, and owners. This document specifies a high-performance, mobile-first, and offline-capable frontend application. The system uses a Next.js monolith architecture with a feature-based structure to serve three sub-applications: Farmer, Agent, and Admin.
2. Technical Stack & Architecture
2.1 Core Frameworks
Framework: Next.js 16 (App Router)
Library: React 19.2 (Latest Stable)
Language: TypeScript (Strict Mode)
UI Library: Material UI (MUI) 7
State Management: React Context API + useReducer (Client-side)
PWA: Service Workers, Manifest, and IndexedDB for offline persistence.
2.2 Data Fetching & Rendering Strategy
Server Component Prioritization: Data fetching MUST be performed in Async Server Components (page.tsx) at the highest level.
Client Rendering Pattern: Fetched data is passed as props to "Use Client" components to separate data resolution from MUI-based interactivity.
Streaming & Suspense: Utilize loading.tsx and React Suspense with Skeleton Loaders to maintain responsiveness during data resolution.
3. Global Design System (UI/UX)
3.1 Design Principles
Mobile-First Approach: Optimized for 360px width; majority of access is via mobile devices.
Affordance & Modernity: High-end, user-friendly UI using modern fonts and clear interactive cues (depth/shadows).
Interactions: Drawers are strictly preferred over Modals for mobile ergonomics.
Accessibility: * No Toasters: Errors and alerts must be displayed using accessible MUI Alert components positioned predictably within the layout flow.
High contrast and full responsiveness on all screens.
3.2 Material Theme Configuration
Token
Color (Hex)
Intent
Primary
#2E7D32
Growth/Agri Green
Secondary
#FFA000
Harvest Amber
Information
#0288D1
Deep Blue
Danger
#D32F2F
Alert Red
Warning
#ED6C02
Safety Orange
Background
#F8F9FA
Clean Grey/White

4. Functional Modules
4.1 Farmer Module
Proximity Discovery: Live distance to stores/agents calculated via device IP.
Store Details: View accepted produce, rates, and quantity limits.
Account Management: National ID, coordinates, and automated location lookup.
Dashboard: Tracking pending invoices, receipts, and collection history.
Farmer Notice: Feature to report "Almost Harvest Ready" produce with estimated quantities.
4.2 Agent Module (/agent)
Collection Workflow: Farmer lookup/quick-reg -> Produce entry -> Quantity -> Photo Capture -> Auto-timestamp.
Inventory Management: Categorized views (Paid, Partial, Pending) and earnings tracking.
Payment Requests: Group multiple invoices into a single batch request for Admin approval.
Local Discovery: View nearby farmers and harvest notices.
4.3 Owner/Admin Module (/admin)
Management: Full CRUD for agents and farmers with confirmation safeguards.
Bulk Financials: Single or bulk payment initiation for selected invoices.
Advanced Analytics: Spending trends, agent comparisons, and product-specific graphs.
Drill-down UI: Deep-dive into receipts to see associated farmers and original collection metadata.
5. Additional High-End "Power" Features
5.1 QR Identification System
Farmer ID: Unique QR code for every farmer; Agents scan to pull profiles instantly.
Invoice Tracking: QR codes on all digital invoices for quick lookup by Admin.
5.2 Market & Pricing Intelligence
Dynamic Pricing Engine (Admin): Admins set "Daily Market Rates"; updates reflect in real-time on farmer apps.
Market Price Feed: A live ticker for farmers showing current collection rates.
5.3 Operational Excellence
Produce Grade/Quality (Agent): Categorize items by Grade (A, B, C) to influence pricing accuracy.
Visual Weight Verification: Agents must take a photo of produce on the scale; metadata (GPS/Time) is captured to prevent fraud.
The Wastage Tracker (Admin): Analytics comparing "Invoiced Weight" vs. "Warehouse Weight."
5.4 Utility & Accessibility
Weather-Informed Harvesting: A dashboard widget helping farmers plan harvests based on local weather.
Low-Data Mode: A toggle to disable heavy assets/graphs for users on 2G/3G connections.
Multi-Language Support (L10n): Support for local agricultural dialects.
6. Implementation Notes for the AI Agent
6.1 Technical Guardrails
Strict Typing: Do not use any. All interfaces (Farmer, Agent, Collection, Invoice, etc.) must be explicitly defined and enforced.
API Mocking: Create a src/mocks folder containing JSON responses that mimic the backend schema. Implement a useFetch hook that can be toggled between mock data and real endpoints.
Responsiveness: Use MUI's sx prop or styled-components leveraging the theme's breakpoints (xs, sm, md, lg).
6.2 Interaction Patterns
Confirmation Dialogs: Every destructive action (e.g., Delete Agent/Farmer) or high-stakes action (e.g., Major Payment) must trigger a high-contrast, centered, and accessible confirmation Drawer or Dialog.
Server-Client Handover: 1. Fetch data in Server Components (async Page()).
2. Pass data to Client Components as initialData.
3. Handle all MUI interactivity and local state (useReducer) within the Client Component.
6.3 Offline & Sync
Queue Management: Manage an offlineQueue via useReducer.
Persistence: Use useEffect to sync the queue to IndexedDB.
Connectivity: Monitor navigator.onLine to trigger background synchronization.
7. Performance & Visibility
Lighthouse Score: Target 95+ for Accessibility and PWA.
Interactivity: Ensure all buttons and touch targets are optimized for mobile tapping (minimum 44x44px).
Loaders: Use high-end spinners for actions and Skeletons for page transitions.
