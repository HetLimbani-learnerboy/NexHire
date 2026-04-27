# NexHire - Internal ATS for Vendor Management

## 1. Project Objective
Design and develop an internal Applicant Tracking System (ATS) to streamline vendor onboarding, candidate submissions, evaluation, and vendor performance management. 

The system aims to:
- Centralize vendor and candidate data
- Improve hiring workflow visibility
- Enable performance tracking of vendors
- Reduce manual coordination and delays

## 2. Technology Stack
- **Frontend**: React (built with Vite), React Router DOM, Axios, React Icons
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (using `pg`) and MongoDB (supported via `mongoose`)
- **Authentication**: JWT (JSON Web Tokens), `bcryptjs` for secure password hashing

## 3. Project Structure
- `Frontend/`: Contains the React application code, cleanly separated by role-based pages (`admin`, `common`, `hr`, `manager`, `vendor`) and context providers.
- `Backend/`: Contains the Express server, modular API routes (`authRoutes`, `jobRoutes`, `candidateRoutes`, `vendorRoutes`, etc.), controllers, and middleware.
- `Documentations/`: Contains comprehensive project planning documents and detailed feature implementation plans.

## 4. Current Status: What is Done
Based on the Statement of Work (SoW), we have successfully completed **Phase 1** and made significant progress into **Phase 2**.

**Completed Deliverables:**
- ✅ User stories list and designer wireframes have been established.
- ✅ A robust foundation for the backend structure is fully created with Node.js/Express, incorporating role-specific routes (Admin, HR, Hiring Manager, Vendor).
- ✅ Front-end framework has been decided and implemented (React via Vite).
- ✅ Role-based authentication, secure login, and protected routing are set up.
- ✅ Core functional dashboards for Admin, HR, Manager, and Vendor roles have been created.
- ✅ Initial job requisition management and candidate pipeline endpoints have been established.

## 5. What We Will Do in Phase 2
Moving forward, our focus is entirely on finalizing Phase 2 deliverables to prepare for go-live:
- **Feature Completion:** Fully integrate and refine the vendor rating system, performance tracking (submission quality, turnaround time), and comprehensive pipeline analytics.
- **Reporting & Analytics:** Implement time-to-fill metrics, submission-to-hire ratios, and hiring funnel analytics.
- **Documentation:** Finalize detailed technical documentation and comprehensive user manuals.
- **Training:** Prepare materials and conduct training sessions for internal teams.
- **Deployment:** Setup the production deployment environment, prepare source code for handover, and perform User Acceptance Testing (UAT).
- **Security & Compliance:** Ensure all sensitive data is encrypted and data access protocols strictly comply with applicable data protection laws.

### Optional Enhancements (Future Scope)
- AI-based resume screening & structured parsing.
- Email & calendar integrations (e.g., Microsoft Outlook, Google Calendar).
- Vendor SLA tracking with automated alerts.
- Mobile-friendly interface optimization.
- API integrations with existing HRMS or payroll systems.

## 6. How to Run Locally

### Backend Setup
1. Open a terminal and navigate to the `Backend` directory && setup .env file as given in the .env.example:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your database and JWT secrets.
4. Start the development server:
   ```bash
   node app.js
   ```

### Frontend Setup
1. Open a new terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 7. Version Control (.gitignore)
To keep the repository clean, the following files and directories are ignored:
- Dependencies (`node_modules/`) and build outputs (`dist/`, `dist-ssr/`).
- Log files (`*.log`, `npm-debug.log*`, `yarn-error.log*`, etc.).
- Local environment variable files (`.env`, `*.local`).
- IDE and editor-specific configurations (`.vscode/`, `.idea/`, `*.suo`, etc.).
- OS-generated files (e.g., `.DS_Store`).
