Specialized PRD: Admin & Owner Command Module
Module Title: AgriCollect Command & Business Intelligence Center
Status: Implementation Blueprint
Target Persona: Super Admin (System Sovereign), Owner Admin (Business Executive), Staff Admins
Priority: Critical (System Governance, Economic Engine & Financial Control)
1. The Sovereign Hierarchy & Security Architecture
1.1 The Super Admin (The Hidden Sovereign)
Genesis (Seeding): This user DOES NOT exist in the database creation flow. Credentials are securely injected via Environment Variables (SUPER_ADMIN_EMAIL, SUPER_ADMIN_SECRET) during deployment.
Invisibility: The Super Admin is hidden from all user lists, reports, and search results. Only the Super Admin knows they exist.
God Mode Capabilities:
Global Visibility: Can see every data point in the system.
User Impersonation: Can "Login As" any Farmer, Agent, or Admin to debug issues or verify fraud without knowing their passwords.
Owner Creation: The only entity authorized to create "Owner Admin" accounts.
Future-Proofing: Ready for multi-tenancy if the system scales to multiple distinct business owners in the future.
1.2 The Owner Admin (The Business Executive)
Role: The ultimate decision-maker for the specific business instance.
User Management Authority:
Can create Staff Admins (Role-based), Store Agents, Collection Agents, and Farmers.
Constraint: Cannot create Super Admins or other Owner Admins.
The "Invite-Verify" Protocol:
When an Owner creates a user, the system does not auto-verify them.
Action: The system sends an invite (SMS/Email).
Mandatory Verification: The new user MUST complete the Digital Signature process (OTP for Phone & Email, ID uniqueness check) to activate their account. This ensures data integrity even for admin-created users.
2. The Economic Engine: E-commerce & Loans
This module creates a closed-loop economy where farm inputs are sold and debts are automatically recovered from produce.
2.1 The Public Marketplace (E-commerce)
Visibility: Open data. Any user (guest/public) can view items (Fertilizers, Seeds, Tools) with rich descriptions and images.
Purchase Modes:
Cash/Mobile Money: Available to everyone.
On-Loan: Strictly restricted to registered, verified Farmers.
2.2 The Loan Logic & Recovery System
Loan Request Lifecycle:
Farmer requests item on loan -> Admin receives "Loan Request" -> Admin "Accepts" (based on farmer's collection history) -> Item Released.
Automated Recovery (Future-Proofing):
The system acts as a clearinghouse. When a farmer with an active loan delivers produce:
Logic: Collection Value - Pending Loan Balance = Payout Amount.
The Admin sees this split in the Payment Module (e.g., "$100 Total: $20 to Loan Repayment, $80 to Farmer").
2.3 Order & Transaction Management
Order Tracking: Pending -> Processed -> Ready for Pickup -> Delivered -> Cancelled.
Transaction Auditing: Admin must verify every payment against the order. For Loan orders, the "Payment" is the creation of a "Debt Record" in the Loan Module.
3. The Financial Command Center (Forensic Detail)
Designed for absolute transparency and data-backed decision-making.
3.1 Comprehensive Payment Module
Forensic Drill-Down: The Admin must be able to click a Payment Receipt and traverse the entire chain:
Receipt -> Invoice -> Collection Entry -> Store Agent ID -> Collection Agent Verifier -> Farmer ID -> Exact Timestamp/GPS.
Actionable Payouts:
Bulk Processing: Select 500 invoices -> System calculates Total -> "Hold to Confirm" -> Integrated Payment Gateway trigger.
Status Visualization: Clear separation of Pending Verification vs. Verified (Ready to Pay) vs. Paid.
3.2 Strategic Reporting & Analytics
Statistical Analysis: Dashboard widgets showing trends (e.g., "Sunflower collections up 20% vs last month").
Custom Reports:
User Reports: Filter Farmers by Region, Produce Type, or "Pending Verification" status.
Dispute Reports: View all active disputes, average resolution time, and "Agents with highest dispute rates" (Fraud detection).
Financial Reports: P&L statements, Loan Recovery Rates, and Outstanding Debt reports.
4. Operational Modules: Inventory, Wastage & Market
4.1 Wastage & Loss Prevention
Objective: Track the "Black Hole" between intake and warehouse.
Logic: Compare Sum(Store Agent Intake Weights) vs. Sum(Collection Agent Delivery Weights).
Visuals: Heatmaps showing which Store Agents have the highest percentage of "Shrinkage" (Wastage/Theft).
4.2 Comprehensive Inventory
Global View: Total tonnage per crop type across all stores.
Aging Analysis: Report on produce that has been sitting in a store for >48 hours (risk of spoilage).
4.3 Market Intelligence (The Pricing Brain)
Internal Rates: Admin sets the "Buying Price" for farmers.
External Integration: Connect to a Market Price API to fetch global/regional daily rates.
Trend Comparison: A graph overlaying "Our Rate" vs. "Market Rate." This helps the Owner decide: "Are we paying enough to attract farmers? Are we paying too much and losing margin?"
5. Technical Stack & Implementation Pattern
5.1 Next.js 16 RSC Strategy (Performance)
Server Components (/admin/page.tsx): Fetch complex, joined datasets (Financials + Loans + Collections) on the server to reduce client load.
Parallel Routing: Use @analytics, @operations, and @financials slots. This allows the "Financial" panel to load independently of the "Inventory" map.
5.2 UI/UX: Supportive & Affordance-Driven
Decision Support: Don't just show data; show insights. Use color codes (Green/Red) to indicate if a metric is healthy or alarming.
Secure Actions: High-stakes actions (Bulk Pay, User Delete, Loan Approval) must use a High-Contrast Confirmation Drawer with a summary of the action's consequences.
6. Implementation Notes for the Agent
Impersonation Security: When Super Admin impersonates a user, generate a temporary, short-lived session token. Log this event irreversibly.
Unique Identity Enforcement: The backend MUST enforce unique constraints on National ID, Email, and Phone across all user tables (Admins, Agents, Farmers).
Loan Ledger: Build the Loan module as a double-entry ledger system (Debit: Loan Taken, Credit: Collection Recovery).
Audit Trail: Every status change (Order Processed, Rate Changed, User Created) must be logged with Actor_ID, Timestamp, Old_Value, and New_Value.
