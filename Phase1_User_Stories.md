# NexHire — User Stories

**Project:** Internal ATS for Vendor Management  
**Prepared for:** Mekanism Technologies  
**Date:** April 2026 | **Version:** 1.0

---

## User Roles (Actors)

| Role | Description |
|------|-------------|
| **Admin** | Full system access — manages vendors, jobs, users, and reports |
| **HR Recruiter** | Manages hiring pipeline, schedules interviews, screens candidates |
| **Vendor** | External staffing partner — submits candidates against assigned requisitions |
| **Hiring Manager** | Reviews shortlisted candidates, provides feedback, makes hiring decisions |

---

## Vendor Management

### VM-01 · Vendor Registration & Onboarding — P0
> **As an** Admin, **I want to** register new vendors with company details, contacts, and agreements, **so that** they are onboarded into the ATS.

**Acceptance Criteria:** Add Vendor form with required fields (company name, contact person, email). Duplicate email check. Created with "Active" status.

### VM-02 · Vendor Profile Management — P0
> **As an** Admin, **I want to** view and edit vendor profiles including agreement documents, **so that** records stay current.

**Acceptance Criteria:** Full profile view/edit. Agreement file upload/replace. All fields editable.

### VM-03 · Vendor Performance Tracking — P0
> **As an** Admin, **I want to** track each vendor's submission quality, turnaround time, and closure rate, **so that** I can evaluate effectiveness.

**Acceptance Criteria:** Metrics auto-calculated: submission quality score, avg turnaround (days), closure score (hires/submissions).

### VM-04 · Vendor Rating System — P1
> **As an** Admin, **I want to** assign a numerical rating (1–5) to each vendor, **so that** we can rank quality over time.

**Acceptance Criteria:** Star/numeric rating on vendor card. Admin can update. Historical ratings preserved.

### VM-05 · Vendor Self-Service Profile — P1
> **As a** Vendor, **I want to** view/edit my own profile and see my performance stats, **so that** I can track my standing.

**Acceptance Criteria:** Vendor sees only own profile. Editable: company name, contact, phone, address. Performance stats read-only.

---

## Job Requisition Management

### JR-01 · Create Job Requisition — P0
> **As an** Admin/HR, **I want to** create job requisitions with title, department, skills, budget, deadline, and description, **so that** vendors know what to source.

**Acceptance Criteria:** Create Job form with all fields. Default status "Open". Validation on required fields.

### JR-02 · Manage Job Requisitions — P0
> **As an** Admin/HR, **I want to** view, search, filter, edit, and close jobs, **so that** I manage the full lifecycle.

**Acceptance Criteria:** Jobs list with search/filter. Inline or modal editing. Status transitions: Open → On Hold → Closed.

### JR-03 · Assign Vendors to Requisitions — P0
> **As an** Admin, **I want to** assign vendors to specific jobs, **so that** they can begin sourcing.

**Acceptance Criteria:** Multi-select vendor picker. Creates `job_vendors` record. Assigned vendors see the job.

### JR-04 · Job Approval Workflow — P1
> **As a** Hiring Manager, **I want to** approve/reject job requisitions, **so that** only sanctioned positions proceed.

**Acceptance Criteria:** "Pending Approval" status. Manager sees pending jobs. Approve/Reject with comments.

### JR-05 · Vendor Views Assigned Jobs — P0
> **As a** Vendor, **I want to** view jobs assigned to me, **so that** I can submit relevant candidates.

**Acceptance Criteria:** Dashboard filtered by vendor's `job_vendors` assignments. Shows title, skills, deadline, openings.

---

## Candidate Management

### CM-01 · Vendor Candidate Submission — P0
> **As a** Vendor, **I want to** submit a candidate against an assigned job with details and resume, **so that** they enter the pipeline.

**Acceptance Criteria:** Multi-step form: job select, candidate info, resume upload. Status "Submitted". Linked to vendor and job.

### CM-02 · Duplicate Candidate Detection — P0
> **As the** System, **I want to** detect duplicate submissions by email/phone and flag them, **so that** HR avoids processing duplicates.

**Acceptance Criteria:** Check on submit. `is_duplicate` flag set. Warning badge in UI. Admin/HR can view details.

### CM-03 · Candidate Status Tracking — P0
> **As an** HR Recruiter, **I want to** track candidates through stages (Submitted → Screened → Interview → Hired/Rejected), **so that** I have full funnel visibility.

**Acceptance Criteria:** Status field with defined values. Changes logged in `candidate_status` with timestamp/user. All roles see status; HR/Admin change it.

### CM-04 · Resume Upload & Storage — P0
> **As a** Vendor/HR, **I want to** upload and store resumes securely, **so that** managers can review anytime.

**Acceptance Criteria:** Accepts PDF/DOCX. Stored URL in `candidates.resume_url`. Download/preview from detail view.

### CM-05 · Vendor Views Own Candidates — P0
> **As a** Vendor, **I want to** see only my submitted candidates with real-time status, **so that** I track outcomes.

**Acceptance Criteria:** Filtered by `vendor_id`. Shows name, job, status, date. Reflects pipeline changes in real-time.

---

## Workflow & Pipeline Tracking

### WF-01 · Kanban Pipeline Board — P0
> **As an** HR Recruiter, **I want** a Kanban board grouping candidates by stage, **so that** I can visually manage the pipeline.

**Acceptance Criteria:** Columns: Submitted, Screened, Interview, Offered, Hired, Rejected. Drag-and-drop moves cards. Updates DB and logs status change.

### WF-02 · Interview Scheduling — P0
> **As an** HR Recruiter, **I want to** schedule interviews with date, time, mode, and meeting link, **so that** the process is coordinated.

**Acceptance Criteria:** Schedule form with all fields. Interview created with "Scheduled" status. Visible in list/calendar.

### WF-03 · Interview Feedback Capture — P0
> **As a** Hiring Manager, **I want to** submit feedback (rating 1–5, strengths, concerns, recommendation), **so that** decisions are informed.

**Acceptance Criteria:** Feedback form on interview/candidate card. Stored and visible to HR/Admin.

### WF-04 · Candidate Review — P0
> **As a** Hiring Manager, **I want to** review candidate profiles with resume preview and approve/reject for shortlisting.

**Acceptance Criteria:** Detailed view with resume preview. "Approve" and "Reject" buttons. Status reflected in pipeline.

### WF-05 · Final Selection & Offer — P0
> **As a** Hiring Manager, **I want to** make final decisions on interview-cleared candidates (approve offer or reject with reason).

**Acceptance Criteria:** List of cleared candidates. Approve with salary/joining date. Reject with mandatory reason. Status updated.

---

## Reporting & Analytics

### RA-01 · Vendor Performance Reports — P0
> **As an** Admin, **I want** a report showing each vendor's metrics (submissions, hires, rejection rate, turnaround), **so that** I evaluate effectiveness.

**Acceptance Criteria:** Table: vendor name, submissions, hires, rejection rate, avg turnaround, submission-to-hire ratio. Sortable/filterable.

### RA-02 · Time-to-Fill Metrics — P1
> **As an** Admin/HR, **I want** average time-to-fill per job, **so that** I identify hiring bottlenecks.

**Acceptance Criteria:** Days from job creation to first hire. Per-job and overall average. Monthly trend chart.

### RA-03 · Submission-to-Hire Ratio — P1
> **As an** Admin, **I want** the submission-to-hire ratio per vendor and overall, **so that** I measure sourcing efficiency.

**Acceptance Criteria:** Ratio = hires / submissions as percentage. Per vendor in reports table. Overall as KPI card.

### RA-04 · Hiring Funnel Analytics — P1
> **As an** Admin/HR, **I want** a funnel chart showing candidate count at each stage, **so that** I see drop-off rates.

**Acceptance Criteria:** Funnel: Submitted → Screened → Interviewed → Offered → Hired. Absolute numbers + percentage drop-off.

### RA-05 · Export Reports — P2
> **As an** Admin, **I want to** export reports to CSV, **so that** I can share analytics offline.

**Acceptance Criteria:** "Export CSV" button. Downloads CSV with current filters applied.

---

## User & Access Management

### UA-01 · Role-Based User Creation — P0
> **As an** Admin, **I want to** create user accounts and assign roles, **so that** each user has appropriate access.

**Acceptance Criteria:** Create user form (name, email, password, role, phone). Roles enforced on frontend + backend. Users created "Active".

### UA-02 · User Account Management — P0
> **As an** Admin, **I want to** view, edit, and disable/enable user accounts, **so that** I manage system access.

**Acceptance Criteria:** User list with search/filter. Edit details modal. Toggle active/inactive. Inactive users cannot login.

### UA-03 · Secure Authentication — P0
> **As a** User, **I want to** log in securely with email/password and receive a JWT token, **so that** my session is authenticated.

**Acceptance Criteria:** Login validates against hashed passwords. Returns JWT. Token required for protected endpoints. bcrypt hashing.

### UA-04 · Audit Logs — P2
> **As an** Admin, **I want** audit logs of critical actions, **so that** I can monitor usage and ensure accountability.

**Acceptance Criteria:** Entries capture: action, user, timestamp, entity. Viewer in admin panel. Filterable by date/action type.

---

## Common / Shared Features

### CS-01 · Landing Page — P0
> **As a** Visitor, **I want** a professional landing page, **so that** I understand what NexHire offers.

**Acceptance Criteria:** Hero section with CTA. Feature highlights. Responsive design.

### CS-02 · User Profile — P1
> **As a** User, **I want to** view/update my profile, **so that** my information stays current.

**Acceptance Criteria:** Profile page with current details. Editable: name, phone, password. Email read-only.

### CS-03 · Notifications — P2
> **As a** User, **I want** in-app notifications for important events, **so that** I stay informed.

**Acceptance Criteria:** Bell icon with unread count. List page with mark-as-read. Triggered on key events.

### CS-04 · Role-Based Dashboard Routing — P0
> **As a** User, **I want** to be directed to my role-specific dashboard after login.

**Acceptance Criteria:** Admin→`/dashboard`, HR→`/hr-dashboard`, Vendor→`/vendor-dashboard`, Manager→`/manager-dashboard`. Sidebar shows role-appropriate links only.

---

## Story Map Summary

| Module | P0 | P1 | P2 | Total |
|--------|----|----|-----|-------|
| Vendor Management | 3 | 2 | 0 | **5** |
| Job Requisition Mgmt | 3 | 1 | 0 | **4** |
| Candidate Management | 5 | 0 | 0 | **5** |
| Workflow & Pipeline | 5 | 0 | 0 | **5** |
| Reporting & Analytics | 1 | 3 | 1 | **5** |
| User & Access Mgmt | 3 | 0 | 1 | **4** |
| Common / Shared | 2 | 1 | 1 | **4** |
| **Total** | **22** | **7** | **3** | **32** |

---

*Document End — NexHire User Stories v1.0*
