Specialized PRD: Agent Collection & Verification Module
Module Title: AgriCollect Agent Intake & Logistics Hub
Status: Implementation Blueprint
Target Persona: Store Agent (Intake), Collection Agent (Auditor/Logistics)
Priority: Critical (Heart of System Integrity)
1. Vision & Integrity Philosophy
This module is the engine of the platform. It transforms physical produce into digital assets (Invoices). To guarantee integrity and genuinity, we implement a multi-layered verification system where every "handoff" requires a digital signature (OTP) and visual proof. The goal is a system where fraud is architecturally impossible.
2. Agent Taxonomy & Authorization
2.1 Store Agent (Intake)
Role: Primary contact for farmers; responsible for physical weighing and recording.
Verification: Must verify ID/Passport, Phone (OTP), and Email (OTP).
Rights: Can create Farmer accounts "on the fly," record collections, and view their specific store inventory.
Constraint: Self-registered Store Agents are "Pending" and limited in payout features until Admin vetting.
2.2 Collection Agent (The Auditor)
Role: Trusted logistics partner; verifies Store Agent intake and moves produce to regional warehouses.
Rights: Can view all collections across assigned Store Agents.
Power Feature: Has the authority to Verify (Approve for Payment) or Reject (Dispute) any collection entry.
3. Functional Specification: The Collection Workflow
3.1 Step 1: Physical Intake (Store Agent)
Farmer Discovery: Priority scan of Farmer QR ID or National ID search.
Data Capture: Produce Type, Weight, and Quality Grade (A/B/C).
Visual Proof: Mandatory photo capture of produce on the scale.
Outcome: Generation of a Pending Verification Invoice. Farmer receives an immediate SMS/Email notification.
3.2 Step 2: The Digital Handshake (Collection Agent)
Batch Verification: Collection Agents can select individual or multiple (bulk) collection entries from a specific store.
Verification Interface: A "Review & Sign" Drawer showing summaries of weights and produce grades.
The OTP Signature: To finalize verification/pickup, the Collection Agent must enter an OTP sent to their verified device.
Status Change: Upon OTP success:
Collections move to "Verified" or "In-Transit."
Invoices move to "Approved for Payment."
Farmer Notification: Immediate SMS/In-app update sent to the Farmer.
3.3 The Dispute Workflow (Rejection)
Action: Collection Agent selects "Reject for Correction."
Requirement: Must provide a reason (e.g., "Weight Mismatch," "Contaminated Batch").
Impact: Triggers a "Correction Notice" alert to the Store Agent, Farmer, and Admin simultaneously.
4. Sub-Modules
4.1 Comprehensive Inventory Module
A living ledger designed for supportive oversight:
Store Agent View: "In-Store (Awaiting Pickup)" vs. "Verified (Picked Up)."
Collection Agent View: "Assigned Pickups" vs. "Completed Logistics."
Aging Alerts: Visual indicators for produce sitting in store for >48 hours.
4.2 Agent Payout Module
Commission Tracking: Real-time earnings per kg/collection.
Payment Requests: Batching verified collections into payout requests for the Admin.
4.3 Agent Profile (Identity Heart)
Dual-Channel OTP: Separate verification for Email and Phone.
Public Discovery: Only "Verified" agents appear in the public search directory for farmers.
Credential Card: A digital certificate within the app showing store certification and agent tier.
5. Technical Implementation (RSC & BFF)
5.1 Data Strategy
RSC Fetching: page.tsx fetches the store's inventory and recent collections from the backend.
Client Handover: Data is passed to the CollectionForm or VerificationLedger client components.
PWA/Offline: The collection form must work offline. Data is saved to IndexedDB and auto-synced via the Next.js BFF once connectivity is restored.
5.2 Security Guardrails
BFF Signature: The Next.js BFF validates the Collection Agent's OTP before updating the status of any invoice in the main database.
Non-Editable Records: Once an invoice is generated, it cannot be edited by a Store Agent—only deleted (triggering an audit log) or verified by a Collection Agent.
6. Implementation Notes for the Agent
Strict Typing: Define AgentType = 'STORE' | 'COLLECTION'.
QR Integration: Use a high-performance library like html5-qrcode for the "Scan Farmer QR" feature.
UI Affordance: Use "Hold to Confirm" buttons for batch verification to prevent accidental signatures.
Mocking: Simulate the OTP verification delay and success/fail states in the src/mocks folder.
