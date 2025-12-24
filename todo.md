# COAI Dashboard - Project TODO

## Completed Features

- [x] Project initialization with React + TypeScript + Vite + TailwindCSS
- [x] Open WebUI-inspired design system (light theme default)
- [x] COAI branding throughout the application
- [x] Dashboard layout with collapsible sidebar
- [x] Theme toggle (light/dark mode)
- [x] Home page with welcome screen and suggestion cards
- [x] Dashboard page with metrics and compliance overview
- [x] AI Systems page (placeholder)
- [x] Compliance page with multi-framework tracking
- [x] 33-Agent Council page with voting visualization
- [x] The Watchdog page for incident reports
- [x] Reports page (placeholder)
- [x] Settings page (placeholder)
- [x] Full-stack upgrade with database and backend
- [x] Database schema (14 tables)
- [x] tRPC backend routers
- [x] Watchdog report submission API
- [x] Watchdog Analyst signup page (LOI collection)
- [x] Applications API for LOI collection
- [x] Council voting API with LLM integration
- [x] Compliance frameworks API
- [x] AI Systems CRUD API
- [x] Dashboard stats API
- [x] Unit tests for backend routers (14 tests passing)
- [x] LOI counter on Dashboard and Signup pages

## In Progress

- [ ] Connect frontend pages to real API data
- [ ] Implement chat functionality with LLM
- [ ] AI system registration wizard

## Planned Features

- [ ] Real-time 33-agent voting with actual LLM calls
- [ ] Watchdog report detail view with council voting
- [ ] Compliance assessment wizard
- [ ] PDCA cycle management
- [ ] Report generation
- [ ] Email notifications for LOI signups
- [ ] Admin panel for managing applications
- [ ] Public Watchdog leaderboard
- [ ] API documentation

## Bug Fixes Needed

- [ ] None currently identified

## Notes

- Using Open WebUI design patterns
- Light theme is default, dark mode available via toggle
- Backend uses tRPC for type-safe API calls
- Database is MySQL/TiDB via Drizzle ORM
- LLM integration via built-in Forge API

## New Features - Watchdog Analyst Workflow System

- [x] Research TC260 auditor qualification system
- [x] Research PDCA operational workflows for human reviewers
- [x] Design Watchdog Analyst journey (signup → training → certification → work)
- [x] Build certification test system with questions and scoring
- [x] Create certificate generation for qualified analysts
- [x] Build Analyst Workbench UI for reviewing AI safety cases
- [x] Create case assignment system for analysts
- [x] Build voting/decision interface for analysts
- [x] Add analyst performance tracking and leaderboard
- [ ] Connect full workflow end-to-end (in progress)

## Database Tables Added (23 total)

- training_modules - Course content
- user_training_progress - Track completion
- certification_tests - Test definitions
- test_questions - Multiple choice questions
- user_test_attempts - Test history
- user_certificates - Issued certificates
- case_assignments - Analyst workload
- analyst_decisions - Review outcomes
- analyst_performance - Stats and rankings

## Open Source Release & LOI System

- [x] Seed database with 5 training modules content
- [x] Seed database with 51 certification test questions
- [x] Add email notifications for LOI signups
- [x] Add email notifications for certification completions
- [x] Push to GitHub as open source project
- [x] Create README with project vision and setup instructions
- [x] Add LICENSE file (MIT)
- [x] Create CONTRIBUTING.md for community guidelines
- [ ] Set up LOI tracking dashboard for valuation metrics

## Production Ready - Western TC260 Equivalent

### Public Transparency (Watchdog)
- [x] Make Watchdog reports PUBLIC by default (not internal)
- [x] Add public report browsing without login
- [ ] Show real-time report feed on landing page
- [ ] Add report sharing/embedding functionality

### SOAI-PDCA Loop Integration
- [x] Add PDCA cycle visualization to dashboard
- [x] Connect PDCA phases to real compliance data
- [x] Show Plan→Do→Check→Act progress for each AI system
- [x] Integrate Watchdog reports as "Check" phase input

### Frontend-Backend Integration
- [x] Connect Dashboard to real API stats
- [ ] Connect AI Systems page to real CRUD operations
- [ ] Connect Compliance page to real assessment data
- [x] Connect 33-Agent Council to real voting sessions
- [x] Connect Watchdog page to real public reports
- [ ] Connect Training page to real module progress
- [ ] Connect Workbench to real case assignments

### Chat/LLM Integration
- [x] Make "Send a Message" input functional
- [x] Connect to LLM backend for AI compliance responses
- [x] Display responses with markdown rendering
- [x] Add conversation history in session

### Public Landing Page
- [x] Create marketing landing page at /landing
- [x] Add Watchdog job signup CTA
- [x] Show live LOI counter
- [x] Add features and frameworks sections
- [x] Add "Are you worried about AI safety?" CTA

### Admin Features
- [x] Admin dashboard for LOI management
- [x] Approve/reject analyst applications
- [x] View certification completions
- [x] Manage council sessions


## Master Website Build - TC260/PDCA Inspired

### Research Phase
- [x] Analyze TC260.org.cn website structure and features
- [x] Analyze PDCA software websites for best practices
- [x] Document key features to replicate/improve

### Backend Gaps to Complete
- [ ] Connect AI Systems page to real CRUD operations
- [ ] Connect Compliance page to real assessment data
- [ ] Connect Training page to real module progress
- [ ] Connect Workbench to real case assignments
- [ ] Admin dashboard for LOI management
- [ ] Approve/reject analyst applications
- [ ] View certification completions
- [ ] Manage council sessions
- [ ] Real-time 33-agent voting with actual LLM calls
- [ ] Watchdog report detail view with council voting
- [ ] Compliance assessment wizard
- [ ] PDCA cycle management
- [ ] Report generation
- [ ] API documentation

### Master Website Frontend
- [x] Professional public homepage at /public
- [x] About COAI section (hero)
- [x] How it works section (SOAI-PDCA loop)
- [x] Frameworks explained (EU AI Act, NIST, TC260)
- [ ] Pricing/tiers section
- [ ] Resources/documentation section
- [ ] Blog/news section placeholder
- [x] Contact/support section (footer)
- [x] Footer with all links
- [x] Mobile-responsive design
- [ ] SEO optimization


## AI Systems CRUD Implementation

- [x] Review backend aiSystems router for CRUD operations
- [x] Add update mutation to aiSystems router
- [x] Add delete mutation to aiSystems router
- [x] Build AI Systems list view with real API data
- [x] Create "Add AI System" modal with form
- [x] Create "Edit AI System" modal with form
- [x] Add delete confirmation dialog
- [x] Show system type and risk level badges
- [x] Write tests for CRUD operations (12 new tests added)
- [x] Verify end-to-end functionality (35 tests passing)

## MVP Completion - Mission & Enterprise Integration

### Transparent Mission Messaging
- [x] Add "Our Mission" section to public homepage
- [x] Explain LOI strategy as community participation
- [x] Add public LOI counter with progress visualization (goal: 1000 LOIs)
- [x] Create "Join the Movement" CTA section
- [x] Add "How We're Building This" transparency section

### Enterprise API/SDK Integration
- [x] Create API documentation page (/api-docs)
- [ ] Build REST API endpoints for enterprise access
- [ ] Add API key management for enterprises
- [x] Create SDK code examples (Python, JavaScript)
- [x] Add webhook configuration for real-time alerts
- [x] Build pricing/plans page with tier comparison

### Remaining Page Connections
- [x] Connect Compliance page to real assessment API
- [x] Connect Training page to real module progress API
- [x] Connect Workbench page to real case assignment API
- [x] Add compliance assessment wizard functionality

## Phase 2 - Sample Data, API Keys & SOAI Extension

### Sample Data Seeding
- [x] Create seed script for sample Watchdog reports
- [x] Create seed script for case assignments
- [x] Seed council sessions with sample votes
- [x] Verify Workbench shows real cases

#### API Key Management
- [x] Add api_keys table to database schema
- [x] Create API key generation endpoint
- [x] Build API keys management UI in Settings
- [x] Add key revocation functionalityality
- [ ] Add API key revocation

### SOAI Browser Extension
- [x] Create Chrome extension manifest
- [x] Build popup UI for incident reporting
- [x] Connect to COAI API for report submission
- [x] Add extension to project repository
- [x] Add context menu integration
- [x] Create content script for page interaction
- [x] Add README with installation instructions


## Phase 3 - Certification Exam System

### Question Bank & Exam Structure
- [x] Design question categories (EU AI Act, NIST RMF, TC260, Ethics, Incident Analysis)
- [x] Create 50+ multiple-choice questions with explanations
- [x] Seed questions into database with difficulty levels
- [x] Create certification test record in database

### Exam Taking Interface
- [x] Build exam start page with instructions
- [x] Create timed exam interface with countdown
- [x] Implement question navigation (next/previous/flag)
- [x] Add progress indicator and question status
- [x] Handle exam submission and timeout

### Grading System
- [x] Calculate score based on correct answers
- [x] Determine pass/fail status (70% threshold)
- [x] Store attempt results in database
- [x] Display detailed results with correct answers

### Certificate Generation
- [x] Generate unique certificate numbers
- [x] Create certificate display component
- [x] Store certificates in database
- [x] Add certificate to user profile


## Phase 4 - Post-Exam Review Mode

### Backend Endpoint
- [x] Create getAttemptReview endpoint to return attempt with answers and explanations
- [x] Include correct answers and explanations in response
- [x] Verify user owns the attempt before returning data

### Review Page UI
- [x] Build ExamReview page component
- [x] Display questions with user's answer vs correct answer
- [x] Show correct/incorrect indicators
- [x] Display detailed explanations for each question
- [x] Add filter options (all/correct/incorrect)
- [x] Add question navigation

### Integration
- [x] Link from results page to review page
- [x] Add review button to attempt history
- [x] Write tests for review functionality


## Phase 5 - PDCA Cycle Management

### Backend CRUD Operations
- [x] Review existing pdca_cycles table schema
- [x] Create PDCA router with full CRUD operations
- [x] Add getPDCACycles endpoint (list all for user/system)
- [x] Add createPDCACycle endpoint
- [x] Add updatePDCACycle endpoint (phase transitions)
- [x] Add deletePDCACycle endpoint
- [x] Add getPDCACycleDetails endpoint with phase data

### PDCA UI Components
- [x] Create PDCACycles page for cycle management
- [x] Build cycle creation wizard
- [x] Create phase detail cards (Plan, Do, Check, Act)
- [x] Add phase transition buttons
- [x] Show cycle progress visualization
- [x] Connect to AI systems dropdown

### Integration
- [x] Link PDCA cycles to AI systems
- [x] Show PDCA status on AI Systems page
- [x] Add PDCA widget to Dashboard
- [x] Write tests for PDCA endpoints

