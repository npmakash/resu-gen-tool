# ResuVerse 🚀

**ResuVerse** is a premium, full-stack resume management and ATS optimization system. It features a modern, responsive, and glassmorphic dark mode dashboard to build custom portfolios, check ATS score compatibility, and auto-compile standard, ready-to-compile LaTeX source code.

---

## Key Features

1. **Dashboard Center Hub**
   - Profile completeness tracker.
   - SVG radial progress indicator showing live ATS match score.
   - Sidebar selector to manage and toggle between **multiple resume versions** (including a dynamic portfolio counter).

2. **Tabbed Profile Builder**
   - Multi-tab forms separating contact credentials, education history, work experience, side projects, and skills.
   - Add, edit, and delete positions and bulleted descriptions dynamically.

3. **Tabular Projects Grid & Modals**
   - Quick overview of all projects in a clean tabular grid layout.
   - Click any project row to open a high-fidelity **Project Detail Editor Modal** to check or modify input details.

4. **ATS Scorer & Optimization Analyzer**
   - 5-pillar matching algorithm evaluating profile coverage, key skill density, and project link credentials.
   - Scans experience descriptions for industry-standard **active verbs** (e.g. *spearheaded*, *optimized*, *engineered*).
   - Provides live, actionable feedback cards with warning/success indicators.

5. **LaTeX Code Compiler**
   - Auto-generates clean, professional LaTeX markup from active form values.
   - Properly escapes special LaTeX characters (such as `&`, `_`, `%`) to ensure compile-readiness.
   - Features one-click copy to clipboard, file downloads, and a quick Overleaf compilation guide.

6. **Authentication & Password Recovery**
   - **Email-to-OTP login and signup**: Generates and sends a 6-digit passcode.
   - Includes a **Forgot Password** recovery flow using verification OTPs.
   - Includes a *Local Testing Companion* card in development to view simulated OTP codes instantly on-screen without requiring external SMTP configuration.
   - Modular Firebase Client SDK configuration wrapper with local MongoDB server fallback out-of-the-box.

---

## Tech Stack

* **Frontend**: React (Vite), Lucide Icons, Vanilla CSS (Glassmorphism layout).
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Mongoose models).
* **Auth Services**: Custom OTP Server + Firebase Auth client wrapper.

---

## Running the Application Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed and running locally on your computer.

### 1. Database Connection
Ensure your local MongoDB service is active. The backend is configured to connect to:
```
mongodb://localhost:27017/resume_optima
```

### 2. Backend Server Setup
Navigate into the server folder, install dependencies, and start the API dev server:
```bash
cd server
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Frontend App Setup
Open a new terminal window in the project root directory, install dependencies, and start the Vite dev server:
```bash
npm install
npm run dev
```
The application will run on `http://localhost:5173`. Open this URL in your web browser.

---

## Contributing and Deployment

To build the client bundles for production:
```bash
npm run build
```
This generates optimized static files inside the `dist` folder, ready for deployment on Vercel, Firebase Hosting, Netlify, or AWS.
