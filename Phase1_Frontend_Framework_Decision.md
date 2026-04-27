# NexHire — Frontend Framework Decision

**Project:** Internal ATS for Vendor Management  
**Prepared for:** Mekanism Technologies  
**Date:** April 2026 | **Version:** 1.0

---

## 1. Executive Summary

After evaluating the project requirements outlined in the SoW, the team selected **React 19** (bootstrapped with **Vite 8**) as the frontend framework for NexHire. This document records the evaluation criteria, alternatives considered, and the rationale behind our decision.

---

## 2. Evaluation Criteria

| # | Criterion | Weight | Description |
|---|-----------|--------|-------------|
| 1 | **Component Architecture** | High | Ability to build reusable, role-specific UI components |
| 2 | **Ecosystem & Libraries** | High | Availability of routing, state management, HTTP clients, icons |
| 3 | **Developer Velocity** | High | Fast development cycles with hot module replacement (HMR) |
| 4 | **Performance** | Medium | Bundle size, initial load time, runtime efficiency |
| 5 | **Team Familiarity** | High | Existing skill set and learning curve |
| 6 | **Community & Support** | Medium | Documentation quality, StackOverflow presence, active development |
| 7 | **Scalability** | Medium | Ability to grow from MVP to enterprise features in Phase 2 |

---

## 3. Frameworks Evaluated

### 3.1 React (Selected ✅)
| Aspect | Assessment |
|--------|------------|
| Architecture | Component-based, JSX, hooks for state/lifecycle |
| Routing | `react-router-dom` — mature, declarative, nested layouts |
| State Management | Context API (built-in), scalable to Redux/Zustand if needed |
| HTTP Client | Axios — interceptors, error handling, request cancellation |
| Dev Tooling | Vite — sub-second HMR, ESBuild-powered bundling |
| Learning Curve | Low for the team; all members have React experience |
| Community | Largest ecosystem of any frontend framework |

### 3.2 Angular (Evaluated, Not Selected)
| Aspect | Assessment |
|--------|------------|
| Architecture | Full-fledged MVC, TypeScript-first, dependency injection |
| Strengths | Built-in forms, HTTP, routing — all-in-one solution |
| Weaknesses | **Steeper learning curve** for team; heavier bundle; slower development cycles for an MVP-stage project |
| Verdict | Overkill for Phase 1 scope; better suited for very large enterprise apps |

### 3.3 Vue.js (Evaluated, Not Selected)
| Aspect | Assessment |
|--------|------------|
| Architecture | Composition API, SFC (Single File Components) |
| Strengths | Gentle learning curve, good reactivity model |
| Weaknesses | **Smaller ecosystem** than React; fewer third-party component libraries relevant to ATS (tables, kanban); less team experience |
| Verdict | Strong candidate, but React's ecosystem advantage and team familiarity tipped the scale |

### 3.4 Next.js (Evaluated, Deferred)
| Aspect | Assessment |
|--------|------------|
| Architecture | React-based SSR/SSG framework |
| Strengths | SEO benefits, file-based routing, API routes |
| Weaknesses | **SSR is unnecessary** for an internal tool behind auth; adds deployment complexity; overkill for a SPA-style dashboard app |
| Verdict | Could be adopted in Phase 2 if public-facing pages are needed |

---

## 4. Final Decision Matrix

| Criterion | React+Vite | Angular | Vue.js | Next.js |
|-----------|:----------:|:-------:|:------:|:-------:|
| Component Architecture | ★★★★★ | ★★★★★ | ★★★★ | ★★★★★ |
| Ecosystem & Libraries | ★★★★★ | ★★★★ | ★★★ | ★★★★★ |
| Developer Velocity | ★★★★★ | ★★★ | ★★★★ | ★★★★ |
| Performance | ★★★★★ | ★★★ | ★★★★ | ★★★★ |
| Team Familiarity | ★★★★★ | ★★ | ★★★ | ★★★★ |
| Community & Support | ★★★★★ | ★★★★ | ★★★★ | ★★★★★ |
| Scalability | ★★★★ | ★★★★★ | ★★★★ | ★★★★★ |
| **Total** | **34/35** | **26/35** | **26/35** | **32/35** |

**Winner: React 19 + Vite 8** — Best combination of velocity, ecosystem, and team readiness for an internal ATS.

---

## 5. Chosen Stack — Detailed Breakdown

### 5.1 Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.2.5 | UI component library |
| `react-dom` | 19.2.5 | DOM rendering |
| `react-router-dom` | 7.14.2 | Client-side routing with nested layouts |
| `axios` | 1.7.9 | HTTP client for REST API communication |
| `react-icons` | 5.6.0 | Icon library (Fi, Hi, Bs icon sets) |

### 5.2 Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | 8.0.10 | Build tool with HMR |
| `@vitejs/plugin-react` | 6.0.1 | React Fast Refresh for Vite |
| `eslint` | 10.2.1 | Code linting |
| `eslint-plugin-react-hooks` | 7.1.1 | React hooks rules enforcement |

### 5.3 Build Configuration

**Vite Config (`vite.config.js`):**
- React plugin enabled
- Path alias: `@` → `./src` (clean imports like `@/components/Sidebar`)
- Dev server: port 5173 with API proxy to backend port 5001

---

## 6. Frontend Architecture

### 6.1 Directory Structure
```
Frontend/src/
├── App.jsx              # Root component with Router & Routes
├── main.jsx             # Entry point, renders <App />
├── index.css            # Global styles, CSS variables, animations
├── App.css              # App-level overrides
│
├── context/
│   └── AuthContext.jsx   # Authentication state (user, token, login/logout)
│
├── components/           # Reusable UI components
│   ├── Navbar.jsx        # Top navigation bar
│   ├── Sidebar.jsx       # Role-based sidebar navigation
│   ├── DashboardCard.jsx # KPI metric card
│   ├── Table.jsx         # Generic data table with search & actions
│   ├── Loader.jsx        # Full-page loading spinner
│   └── Skeleton.jsx      # Content placeholder skeleton
│
├── pages/                # Role-organized page components
│   ├── common/           # Shared across all roles
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── Profile.jsx
│   │   └── Notifications.jsx
│   ├── admin/            # Admin-only pages
│   │   ├── Dashboard.jsx
│   │   ├── Vendors.jsx
│   │   ├── Jobs.jsx
│   │   ├── Candidates.jsx
│   │   ├── Reports.jsx
│   │   └── Users.jsx
│   ├── hr/               # HR Recruiter pages
│   │   ├── HRDashboard.jsx
│   │   ├── Pipeline.jsx
│   │   └── Interviews.jsx
│   ├── vendor/           # Vendor pages
│   │   ├── VendorDashboard.jsx
│   │   ├── SubmitCandidate.jsx
│   │   ├── MyCandidates.jsx
│   │   └── VendorProfile.jsx
│   └── manager/          # Hiring Manager pages
│       ├── ManagerDashboard.jsx
│       ├── ReviewCandidates.jsx
│       ├── Feedback.jsx
│       └── FinalSelection.jsx
│
├── styles/               # Page-specific CSS files
│   ├── dashboard.css, forms.css, landingpage.css
│   ├── login.css, navbar.css, pipeline.css
│   ├── reports.css, sidebar.css, skeleton.css
│   ├── table.css, userstyle.css, vendorstyle.css
│
└── utils/
    └── api.js            # Axios instance with baseURL & interceptors
```

### 6.2 Routing Architecture

All authenticated pages use `DashboardLayout` as a parent route, which renders the `Navbar` + `Sidebar` + `<Outlet />` pattern:

```
/                    → LandingPage (public)
/login               → Login (public)
/dashboard           → Admin Dashboard (nested in DashboardLayout)
/vendors             → Vendor Management
/jobs                → Job Requisitions
/candidates          → Candidate Overview
/reports             → Reports & Analytics
/users               → User Management
/hr-dashboard        → HR Dashboard
/pipeline            → Kanban Pipeline
/interviews          → Interview Scheduler
/vendor-dashboard    → Vendor Dashboard
/submit-candidate    → Submit Candidate Form
/my-candidates       → Vendor's Candidates
/vendor-profile      → Vendor Profile
/manager-dashboard   → Manager Dashboard
/review-candidates   → Review Candidates
/feedback            → Interview Feedback
/final-selection     → Final Selection
/profile             → User Profile (all roles)
/notifications       → Notifications (all roles)
```

### 6.3 State Management Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| **Auth State** | React Context (`AuthContext`) | Global — user session, token, role |
| **Server State** | Axios + `useState`/`useEffect` | Per-page — API data fetching |
| **UI State** | Local `useState` | Per-component — modals, forms, filters |

No external state library (Redux/Zustand) is needed at current scale. If Phase 2 introduces complex cross-page state, Zustand can be added incrementally.

### 6.4 Design System

| Property | Value |
|----------|-------|
| Font | Inter (Google Fonts) |
| Theme | Dark (navy-based) with emerald accents |
| Animations | CSS `fade-in` (0.5s), `slide-up` (0.4s) |
| Glass Effects | `backdrop-filter: blur(10px)` on cards/modals |
| Responsive | Flexbox/Grid, breakpoints at 768px and 1024px |

---

## 7. Why Not Other Approaches

| Approach | Why Rejected |
|----------|-------------|
| Plain HTML/CSS/JS | No component reusability; unmanageable at 22+ pages |
| jQuery | Legacy; no component model; poor developer experience |
| Server-Side Rendering | Internal tool behind auth doesn't need SEO |
| Mobile-First (React Native) | SoW specifies web; mobile is Phase 2 optional enhancement |

---

## 8. Conclusion

**React 19 + Vite 8** provides the optimal balance of developer velocity, ecosystem maturity, and team expertise for the NexHire ATS. The architecture is modular, role-organized, and built to scale cleanly into Phase 2 deliverables.

---

*Document End — NexHire Frontend Framework Decision v1.0*
