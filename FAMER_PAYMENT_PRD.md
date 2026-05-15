Specialized PRD: Farmer Payment & Financial Support Module
Module Title: AgriCollect Farmer Financials (BFF + Client)
Status: Implementation Blueprint
Target Persona: The Farmer (End-User), Agent (Facilitator), Admin (Validator)
Priority: High (Core Trust Component)
1. Vision & Core Philosophy
The Farmer Payment Module is designed to act as a Supportive Financial Assistant. The goal is to eliminate "payment anxiety" through total transparency, predictive insights, and effortless documentation. Every UI element must prioritize Affordance (clarity of action) and Support (guidance on next steps).
2. Functional Specification (Farmer Experience)
2.1 The "Supportive Assistant" Dashboard
The landing screen for the Farmer must lead with financial health, not just data lists.
Wallet Summary Cards:
Total Earnings: Cumulative successful payouts for the current season.
Awaiting Payment: Sum of "Invoiced" and "Verified" collections yet to be paid.
Last Payment Date: Date and amount of the most recent receipt.
Projected Income Widget:
Logic: Dynamically calculate (Estimated Quantity in Harvest Notices) * (Daily Market Rate).
UX: A supportive "Potential Payout" card that encourages the farmer to complete their harvest.
Historical Price Trends (30-Day Sparkline):
A small line chart on the dashboard showing price fluctuations to help farmers time their "Harvest Notices."
2.2 The Collection & Invoice Lifecycle
Every delivery triggers an entry that the farmer tracks via a Vertical Stepper inside a Bottom Drawer.
Stage 1: Recorded (Agent): Shows weight, produce type, and a link to the "Visual Weight Verification" photo.
Stage 2: Verified (Admin): Confirmation of quality grade (A/B/C) and final amount.
Stage 3: Payment Processing: Next.js BFF polling status for bank/mobile money gateway.
Stage 4: Paid: Final state with transaction reference and "Download Receipt" shortcut.
2.3 Dispute & Clarification System
Instant Dispute Button: Positioned at the bottom of the Invoice Drawer.
Options: "Weight Discrepancy," "Grade Issue," or "Price Mismatch."
Impact: Tapping this freezes the "Payment Request" for the Admin and logs a high-priority audit event.
2.4 Document Management (One-Tap Access)
Digital Invoices: Auto-generated PDF upon agent collection.
Payment Receipts: High-fidelity PDF with QR code for verification.
Financial Statement Generator: A tool allowing farmers to select a date range (e.g., "Last 3 Months") to generate a branded PDF for bank loan applications.
3. Tech Stack & Implementation Roadmap
3.1 Data Loading Architecture (RSC Pattern)
The implementation must strictly adhere to the React Server Components (RSC) pattern to minimize client-side overhead:
Server-Side Fetching: Data fetching for all dashboards and lists MUST be performed in async Server Components (page.tsx). These components interact directly with the remote backend API.
Prop Drilling to Client: Fetched data is parsed and passed as read-only props to Client Components ("use client").
State Minimization: By passing data as props, the usage of useEffect for initial data fetching and useState for holding external data is strictly discouraged. Client state should only be used for UI interactions (e.g., opening a drawer) or optimistic updates.
Streaming: Utilize Next.js loading.tsx to provide Skeleton Loaders while the Server Component resolves the remote API response.
3.2 Next.js BFF (Backend For Frontend) Requirements
/api/payments/projected: Aggregates harvest notices against current market rates.
/api/documents/generate: Server-side PDF generation for invoices/receipts.
/api/notifications/history: Aggregates multi-channel logs for the "Communication Center."
3.3 Frontend UI (React 19.2 + MUI 7)
Interactions: All financial details MUST open in a Drawer.
Confirmation: Deletions or high-stakes actions trigger a "Hold to Confirm" high-contrast Drawer.
PWA Sync: IndexedDB persistence for viewing cached invoices/receipts offline.
4. Security & Trust Features (The "Extra Mile")
4.1 Visual Weight Verification
Agents capture produce photos on the scale. These photos are served directly to the Farmer's Invoice Drawer via RSC-fetched URLs to prevent scale-tampering disputes.
4.2 QR Identity Integration
Farmer QR ID: Present in the profile. Scanning by the Agent links the collection to the correct verified National ID instantly.
4.3 Payment Preparedness Checklist
A persistent UI widget showing if the farmer is "Ready to be Paid" (e.g., Bank details verified, National ID uploaded).
5. Implementation Notes for the Agent
Strict Typing: Define interface FinancialTransaction and interface PaymentReceipt. No any.
RSC Strategy: In page.tsx, fetch data: const transactions = await getTransactions(). Then render: <TransactionList initialData={transactions} />.
Accessibility (A11y): Alerts must be readable by screen readers. Success notifications should use the Success green theme.
Responsive Design: Use a "Mobile-First" grid. Charts must be responsive and touch-friendly.
Mocking: Use the src/mocks folder to simulate various payment states (Success, Delayed, Failed).
6. Notification Logic
Recorded: SMS + In-App notification with weight details.
Verified: Email with estimated payout.
Paid: SMS + In-App alert: "Funds have been disbursed. View receipt."
