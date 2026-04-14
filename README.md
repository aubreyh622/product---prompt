# CGS Delivery Copilot

An AI-powered internal copilot for CGS Advisors management consultants that accelerates engagement startup through a structured four-step workflow: Brief Intake, Knowledge Activation, Starter Pack generation, and Wear-Test Review.

## Project Structure

```
.
├── backend/
│   ├── config/           # App configuration
│   ├── db/               # Database schema and migrations
│   ├── middleware/       # Error handling middleware
│   ├── routes/           # API routes
│   ├── services/         # AI and email services
│   └── server.ts         # Express server entry point
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/           # shadcn/ui components (DO NOT MODIFY)
│       │   └── custom/       # App-specific components
│       │       ├── BriefIntake.tsx         # Step 1: Brief form + archetype classification + dual knowledge panels
│       │       ├── KnowledgeActivation.tsx # Step 2: Retrieved asset cards with fit scores, snippets, toggles
│       │       ├── StarterPackView.tsx     # Step 3: 6-tab viewer with source citations + hallucination flags
│       │       ├── WearTestReview.tsx      # Step 4: Flag review, feedback memory, revised sections, export
│       │       ├── GoogleDrivePanel.tsx    # Integration: Google Drive OAuth, folder designation, sync log
│       │       ├── ChatGPTPanel.tsx        # Integration: OpenAI API key, model config, usage logs
│       │       ├── LoginScreen.tsx         # Auth: login with demo users
│       │       ├── ProfileSetup.tsx        # Auth: one-time profile setup
│       │       ├── KnowledgeManagerView.tsx # Role: ingestion pipeline, asset library, archetype bundles
│       │       ├── SeniorReviewerView.tsx  # Role: review queue with approve/return actions
│       │       └── AdminView.tsx           # Role: user management + immutable audit log + role access panel
│       ├── lib/
│       │   └── mockData.ts   # 5 engagement archetypes with full knowledge data, citations, hallucination flags
│       ├── pages/
│       │   └── Index.tsx     # Main orchestrator: auth, step navigation, role-based views, integrations view
│       └── index.css     # CGS Bright Orange theme (oklch tokens)
├── shared/
│   └── types/
│       └── api.ts        # All shared types including AuditLogEntry, RoleAccessPolicy, AuditActionType, etc.
└── README.md
```

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS V4, shadcn/ui
- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Routing**: React Router DOM (HashRouter)
- **Notifications**: Sonner toast
- **Icons**: Lucide React

## Design System

**CGS Bright Orange** theme (updated from Executive Dark):
- Background: `#F8F9FB` (light gray)
- Surface: `#FFFFFF` (crisp white)
- Accent: `#EA6C1A` (bold orange)
- Success: `#059669` (emerald)
- Error: `#DC2626` (red)
- Text: `#111827` (near-black)
- Text Muted: `#6B7280`
- Border: `#E5E7EB`
- Navy: `#1E3A5F` (headings)
- Heading font: Georgia, serif
- Body font: system-ui

## Key Features

### Epic 1: Brief Intake
- 5 pre-loaded demo engagement scenarios
- Structured brief form: client name, industry, objective, core challenge, timeline
- Urgency level selector (Standard, High, Critical)
- Archetype auto-classification with confidence score
- Dual knowledge source panels: Firm Library + Current Client Folder
- Google Drive connection status

### Epic 2: Knowledge Activation
- Framework cards with fit scores, asset tags, usage counts
- Source attribution banners (Firm Library vs. Client Folder)
- Prior engagement matching with similarity scores
- AI working hypotheses with confidence levels
- Suggested templates (DOCX/PPTX/XLSX)

### Epic 3: Starter Pack (6 tabs)
- Problem Statement, Issue Tree, Workstreams, Roadmap, Executive Summary, Deck Outline
- Source citations panel per section ([FL] Firm Library, [CC] Client Folder)
- Hallucination/overclaim flags per section
- AI Quality Review banner

### Epic 4: Wear-Test Review
- Review flags by severity (High/Medium/Low)
- Approve/Feedback/Escalate actions
- Inline feedback input with Undo Feedback (full state recomputation)
- Storyline Skeleton, 2-4 Week Diagnostic Workplan, Risk/Review Checklist
- Feedback Memory: Recent Feedback, Reusable Preferences, Applied in Next Iteration
- Generate Revised Review Summary
- Google Workspace Export (Docs/Slides/Sheets) + Local Download (DOCX/PPTX/XLSX/PDF)

### Epic 5: Role-Based Views
- **Senior Reviewer**: Review queue with filter, approve/return actions, return notes
- **Knowledge Manager**: Ingestion pipeline, asset library, archetype bundles, index health
- **Admin**: User management + **Immutable Audit Log** + **Role Access Panel**

### Epic 6: Admin — Audit Log & Role Access (NEW)
- **Immutable Audit Log**: All entries write-once, cryptographically sealed
  - Severity levels: Info / Warning / Critical
  - Action types: 16 typed actions (GENERATE_STARTER_PACK, APPROVE_FLAG, UPDATE_USER_ROLE, etc.)
  - Per-entry: user, role, action, resource, timestamp, IP address, session ID
  - Expandable rows with full detail panel
  - Filter by severity and user role
  - Export CSV action
- **Role Access Panel**: Per-role permission matrix
  - Granted permissions list
  - Restricted actions list
  - Data scope description
  - Users assigned to each role
  - Security architecture summary (server-side enforcement, source separation, audit trail)

### Epic 7: Google Drive Integration
- OAuth 2.0 connection flow
- Folder designation (Firm Library / Client Folder / Undesignated)
- Sync Now with animated status
- Folder browser with expand/collapse
- Recent files list with ingestion status
- Sync job history log

### Epic 8: ChatGPT API Connection
- API key input with show/hide toggle
- Test Connection with live status
- Model selector: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- Advanced parameter sliders
- Pipeline stage breakdown
- Monthly usage stats and recent request log

## Authentication

Full JWT-based authentication is now integrated:
- **Login page**: `/login` — email/password form with backend validation
- **Signup page**: `/signup` — name/email/password/confirmPassword form
- **AuthContext**: `frontend/src/contexts/AuthContext.tsx` — manages JWT token in localStorage, verifies via `/api/auth/me`
- **Protected routes**: App.tsx wraps all routes with `AuthProvider`; unauthenticated users are redirected to `/login`
- **Backend auth routes**: `backend/routes/auth.ts` — `/api/auth/login`, `/api/auth/signup`, `/api/auth/me`
- **Auth middleware**: `backend/middleware/auth.ts` — `authenticateJWT` and `authenticateLocal` (Passport.js)
- **Login/Signup components**: `frontend/src/components/custom/Login.tsx` and `Signup.tsx`

After login, the app shows the full CGS Delivery Copilot workflow (Index.tsx) with role-based navigation.


- `screen`: login | profile | app
- `user`: authenticated User object
- `currentStep`: 1 | 2 | 3 | 4
- `completedSteps`: Set of completed step IDs
- `activeRoleView`: consultant | senior_reviewer | knowledge_manager | admin | integrations
- `brief`, `knowledgeData`, `starterPack`, `wearTestData`: workflow data

## Shared Types

`shared/types/api.ts` is the single source of truth:
- `AuditLogEntry`: id, userId, userName, userRole, action (AuditActionType), resource, timestamp, details, severity, ipAddress, sessionId, immutable
- `AuditActionType`: 16 typed action strings
- `AuditSeverity`: 'info' | 'warning' | 'critical'
- `RoleAccessPolicy`: role, permissions[], restrictedActions[], dataScope, description
- All other entity types: User, EngagementBrief, Framework, ReviewFlag, FeedbackItem, etc.

## Code Generation Guidelines

- All shared types in `shared/types/api.ts`, imported via `@shared/types/api`
- Custom components in `frontend/src/components/custom/`
- Never modify `frontend/src/components/ui/` (shadcn/ui)
- Never modify `frontend/src/index.css` structure, only update token values
- Use `toast.success()` / `toast.error()` from `sonner` for notifications
- All navigation via `currentStep` and `activeRoleView` state in `Index.tsx`
- Design palette constants defined in `Index.tsx` as `C` object for consistent theming
- Integrations view accessible from all roles via nav bar
