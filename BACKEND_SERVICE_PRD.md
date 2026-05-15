Master Backend PRD: AgriCollect Service
Project: AgriCollect Backend Core Runtime Target: Node.js 24+ (Latest) Framework: NestJS (Express Adapter) Language: TypeScript (Strict ESM) Architecture: Strict Clean Architecture (Domain-Centric) Database: PostgreSQL (Prisma v7 ORM) Performance Goal: High-Throughput (Optimized for read/write intensity - 2B Tx/5hrs capability)
1. Executive Technical Summary
This PRD defines the requirements for a monolith backend service built to handle high-frequency transactions. The system serves as the central source of truth for the Farmer, Agent, and Admin frontend applications.
It must leverage Node.js 24+ native capabilities (native .env support, native test runner, native file watching) to minimize external dependencies. The architecture must adhere rigidly to Clean Architecture principles, relying heavily on Dependency Injection (IoC), Interface Adapters, and the Repository Pattern to ensure modularity and ease of testing.
Crucial Capability: Beyond transaction processing, this backend must serve as a high-fidelity reporting engine, capable of generating "Google-Standard" PDF documents and powering complex analytical dashboards with pre-aggregated data.
2. Core Infrastructure & Configuration
2.1 Runtime Environment
Engine: Node.js 24+.
Execution: Do not use ts-node. Do not use tsc for a build step in development. Leverage Node.js native TypeScript support to run .ts files directly.
Dev Command: node --env-file=.env --watch src/main.ts
Config: Do not use dotenv package. Load variables using Node's native --env-file flag.
Module System: Pure ESM ("type": "module" in package.json).
2.2 Environment Variables Strategy (Strict)
The Rule: The agent must NEVER generate a .env file.
The Requirement: The agent MUST generate a comprehensive .env.example file containing all necessary keys with dummy values. This serves as the documentation for the DevOps/Deployment team.
2.3 Project Structure (Clean Architecture)
The folder structure must physically enforce the Dependency Rule.
src/



2.4 Server Instantiation & Scalability
Clustering: The main.ts must use Node.js cluster or worker_threads to fork processes equal to the number of CPU cores.
Bootstrapping: The NestJS app creation must be wrapped in a function that handles the cluster logic.
Reference Pattern: Refer to server.ts logic in the provided aiqedge-smtp repo for robust server startup sequences.
1. Data Architecture & Persistence (Provider Agnostic)
3.1 Dependency Inversion Strategy (Crucial)
To ensure business logic never changes when the database changes:
Abstraction: The Domain Layer defines the IRepository interfaces (e.g., findUser(id: string): Promise<UserEntity>).
Implementation: The Infrastructure Layer implements these interfaces using Prisma (e.g., PrismaUserRepository).
Isolation: Use Cases MUST inject the Interface (Token), never the concrete class.
Mapping: The repository implementation must map the raw Database Object (Prisma type) to the clean Domain Entity before returning it. The Use Case should NEVER see a Prisma-generated type.
3.2 Database (PostgreSQL + Prisma v7)
Primary Keys: MUST use UUID v7 for all tables. UUID v7 is time-ordered, which ensures index locality and high-performance inserts (critical for the 2B transaction goal), preventing page fragmentation common with UUID v4.
Partitioning (The 2B Scale Strategy):
Tables expected to grow indefinitely (Collection, Invoice, AuditLog, WastageRecord) MUST be partitioned by created_at (Range Partitioning: Monthly or Yearly). This allows efficient archival and querying of recent data.
Optimization: Heavy indexing on foreign keys and frequently queried columns (status, place_id).
Connection Management: Implement robust connection pooling. Singleton Prisma Client.
Partial Updates (PUT): Support strictly defined replacement/merge logic.
3.3 Caching (Redis)
Greedy Caching: Use Redis heavily for application-level caching.
Public Discovery: Cache "Verified Agents" list by region key.
Market Rates: Cache daily rates with a 1-hour TTL.
Session: Store active user sessions/refresh tokens.
1. Real-Time Communication Architecture (WebSockets)
4.1 Technology Stack & Scalability
Framework: NestJS Gateways (built on top of Socket.io).
Clustering Support (Critical): Because the backend runs in a Node.js Cluster (multi-process), standard in-memory sockets will fail.
Requirement: Must use @socket.io/redis-adapter to broadcast events across all worker processes. A message emitted from Worker 1 must be receivable by a client connected to Worker 4.
Performance: Configure ws engine settings for high concurrency. Use volatile events for non-critical high-frequency data (like live market tickers) to prevent packet backlog.
4.2 Clean Architecture Integration
Domain Layer Abstraction:
Define interface IRealTimeService { emitToUser(userId: string, event: string, payload: any): void; broadcast(event: string, payload: any): void; }
Business logic (Use Cases) calls this interface, remaining unaware of Socket.io.
Infrastructure Implementation:
Implement SocketIoRealTimeAdapter that injects the WebSocketGateway server instance.
4.3 Security & Namespaces
Authentication: Implement a custom WsGuard that verifies JWT tokens during the handshake phase. Reject unauthorized connections immediately.
Namespaces: logically separate traffic:
/notifications (User alerts)
/dashboard (Live analytics for Admin)
/tracking (Live Agent location updates)
1. Domain Module Specifications
5.1 Authentication & Authorization
Identity Uniqueness: Strict unique constraints must be enforced on email, phone_number, and national_id. A collision here must throw a specific ConflictException.
Dual-Channel OTP: Implement logic to generate, hash, and store OTPs for Phone and Email separately.
Digital Signature: A distinct endpoint that accepts an OTP and transaction context to "Sign" a collection verification.
Super Admin Seeding: On startup, check process.env.SUPER_ADMIN_EMAIL. If not in DB, seed it.
5.2 Collection & Wastage Module (Transaction Critical)
Atomic Transactions: Collection Creation -> Invoice Generation -> Notification MUST be atomic.
Pricing Matrix Logic:
Market Rates are set per produce.
Logic: Final Price = Base Market Rate * Grade Multiplier.
Example: Base $10. Grade A (1.0) = $10. Grade B (0.85) = $8.50. Grade C (0.70) = $7.00.
Wastage Tracking (Ghost Inventory Prevention):
If produce is rejected at a checkpoint or spoils, it MUST NOT be deleted.
Action: Create a WastageRecord. This allows the "Wastage Tracker" dashboard to compare Intake vs Wastage vs Warehouse Delivery.
5.3 Financial & E-commerce Module (Closed Loop)
Loan Logic & Living Wage Rule:
Automated Recovery: Gross Payout - Loan Debt = Net Payout.
Living Wage Guardrail: The system must adhere to a LOAN_RECOVERY_CAP (e.g., 60%). Even if the farmer owes $500 and brings $100 worth of produce, the system should only recover $60, leaving $40 for the farmer's immediate survival.
Agent Commission Logic:
Commissions are calculated dynamically based on CommissionRule settings (e.g., "Flat Fee per Kg" or "% of Transaction Value").
This calculation happens at the moment of Collection Verification.
Adapter Pattern (Payment): IPaymentGateway interface implemented by MpesaAdapter / StripeAdapter.
5.4 Notification Intelligence
Cost Optimization:
Before sending an SMS, check UserPreferences.
If UserPreference.prefer_push_notification is true and device token exists, send Push (Cheaper) instead of SMS.
Fallback logic: Push Failed -> Email -> SMS (Most Expensive).
5.5 Document Generation (High-Fidelity) & Reporting
High-End PDF Engine: The backend must include a dedicated service for generating broadcast-quality PDFs.
Invoices: Beautifully designed, branded, including the QR code, Farmer details, Agent details, and breakdown.
Receipts: Must adhere to "Google Standard" design principles (clean typography, clear hierarchy, trusted branding).
Technology: Use a robust HTML-to-PDF engine (e.g., via a Worker Thread using puppeteer or specialized Node.js PDF libraries) that allows styling via CSS templates (Handlebars/EJS).
Reporting Engine:
Deep Retrieval: The generator must be able to hydrate the full dependency chain: Invoice -> Collection -> Farmer -> Agent to display every bit of data on the final document.
Storage Interface: interface IStorageService { upload(file: Buffer): Promise<string>; }.
1. Security, Sanitization & Middleware Strategy (Fortress Mode)
6.1 Strict Input Sanitization & Validation
Validation Pipes: Enable global ValidationPipe with whitelist: true and forbidNonWhitelisted: true.
DTOs: Every controller input MUST have a corresponding DTO using class-validator decorators (@IsString, @IsEmail, @IsUUID, @Min(0)).
Sanitization:
XSS Prevention: All text inputs must be sanitized to strip HTML tags (using libraries like sanitize-html or class-transformer sanitizers) before entering the Domain layer.
SQL Injection: Relied upon Prisma's built-in parameterization, but strict type checking in DTOs acts as the first line of defense.
6.2 Mandatory Middleware Pipeline
Helmet: Use helmet middleware for setting secure HTTP headers (Content-Security-Policy, X-Frame-Options, etc.).
Rate Limiting: Implement ThrottlerModule (or express-rate-limit) to prevent DDoS attacks.
Compression: Enable Gzip/Brotli compression for high-performance payload delivery.
CORS: Configure Strict CORS policies. Do not allow *. Only allow trusted frontend domains via ENV.
Custom Logger: Middleware to log every request Method | URL | Body (Sanitized) | UserID | IP for audit trails.
1. High-Performance & Optimization Strategy
7.1 Reporting & Analytics Architecture
Dashboard Aggregation: The backend must expose specialized endpoints (e.g., /api/v1/analytics/farmer-dashboard) that return pre-aggregated data.
Do not make the frontend calculate "Total Earnings". The backend should run the SUM() query and return the final figure.
Time-Series Optimization: For graphs (e.g., "Price Trends"), use efficient database grouping by date intervals (Day/Week) to return array data ready for charting libraries.
7.2 Optimization Tactics
Eager vs. Lazy Loading:
Eager: For "Get Invoice", include: { farmer: true, agent: true } (Single DB Query).
Background: For "Get Farmer Profile", do not load their entire history. Load the profile, then trigger a background job to pre-warm the cache for their history if analytics suggest they are likely to view it.
Payload Minimization: Use DTOs with class-transformer exclude to strip sensitive fields (hashes, internal metadata) before sending responses.
Async Operations:
PDF Generation: Offload Invoice/Receipt PDF generation to a BullMQ queue running in a separate worker thread.
Notifications: Do not await SMS/Email sending in the main HTTP request flow. Queue them.
1. Integration Specifications
8.1 Email Service (aiqedge-smtp Integration)
Reference: Based on the aiqedge-smtp repo patterns.
Implementation: Create a concrete AiqedgeSmtpAdapter implementing IEmailService.
Transport: This adapter should communicate with the SMTP service using the standard nodemailer transport or the specific protocol defined in that repo's documentation. Ensure TLS security and connection pooling.
8.2 External APIs (Market Rates)
Create a Cron Job (NestJS @Cron) that fetches daily rates from an external Market API at 06:00 AM and updates the MarketRates table.
1. Development Guidelines for the Agent
Response Formatting: Follow the Pisces repo pattern. All API responses must follow a strict envelope.
Config Helper: Do not use process.env.KEY in code. Create a ConfigService.
Strict Typing: No any. No ts-ignore.
Versioning: Use URI Versioning (e.g., /api/v1/collections).
1.  Migration & Seeding
Prisma Migrations: Use prisma migrate dev.
Seed Scripts: Robust seeders for Roles, ProduceTypes, PricingMatrices, CommissionRules, and SuperAdmin.
1.  Testing Strategy
Unit Tests: For all Use Cases and Entities (Mock Repositories).
E2E Tests: For Controllers (Spin up a test DB container).
1.  Database Schema & Entity Definitions
CRITICAL RULE: All Primary Keys (id) must be UUID v7 (Time-Ordered) to support high-performance indexing. All Identity fields (email, phone, national_id) must have UNIQUE constraints.
12.1 Core Identity Tables
User (Base Table)
id (UUIDv7, PK)
email (Unique, Indexed)
phone_number (Unique, Indexed)
national_id (Unique, Indexed, Nullable)
password_hash
role (Enum)
is_email_verified, is_phone_verified
verification_status (Enum)
profile_photo_url
created_at, updated_at
UserPreference (1:1)
user_id (FK), prefer_sms (Bool), prefer_email (Bool), prefer_push (Bool).
Farmer (Extends User - 1:1)
user_id, farm_name, location_place_id, location_lat, location_lng, crop_specialties, preferred_payment_method.
Agent (Extends User - 1:1)
user_id, type (STORE/COLLECTION), store_name, operating_region_polygon.
commission_schema_id (FK to CommissionRule).
OtpVerification
id, identifier, code_hash, type, expires_at.
12.2 Operations & Collection Tables
ProduceType
id (UUIDv7), name, description, image_url, default_price_per_kg.
MarketRate
id (UUIDv7), produce_type_id, date, base_rate_per_kg.
grade_multipliers (JSONB: { "A": 1.0, "B": 0.85, "C": 0.70 }).
Collection (Partitioned by Date)
id (UUIDv7), store_agent_id, farmer_id, produce_type_id.
weight_kg, quality_grade (A, B, C).
applied_rate (Decimal - Snapshot at time of collection).
calculated_payout_amount (Decimal).
status (PENDING, VERIFIED, DISPUTED, PAID).
WastageRecord (Partitioned by Date)
id (UUIDv7), collection_id (Nullable), agent_id, produce_type_id.
weight_kg, reason (Spoilage, Theft, Quality Rejection).
declared_at.
Invoice
id (UUIDv7), collection_id (FK, Unique).
amount, status, qr_code_url.
12.3 Financial Tables (The Ledger)
PaymentRequest
id (UUIDv7), agent_id, total_amount, status.
PayoutTransaction
id (UUIDv7), recipient_user_id.
gross_amount, loan_deduction_amount, net_amount.
provider, provider_ref_id, status.
CommissionRule
id (UUIDv7), name, type (FLAT_PER_KG, PERCENTAGE_OF_VALUE), value.
12.4 E-commerce & Loans
MarketProduct, ProductOrder.
LoanRecord
id (UUIDv7), farmer_id, product_order_id.
principal_amount, balance_remaining, status.
12.5 Audit & Logging
AuditLog (Partitioned by Date)
id (UUIDv7), actor_user_id, action, target_resource, target_id.
old_value, new_value, timestamp.

