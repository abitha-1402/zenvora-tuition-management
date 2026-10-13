# ZENVORA — Smart Tuition Management System
> **Smarter Classes. Simpler Management.**  
> *A Modern E-Business Web Application & PWA for College Demonstration & Real-World Tuition Coaching Centres.*

---

## 🌟 Executive Summary

**Zenvora** is a comprehensive, production-grade Tuition Management System built with **React 19, TypeScript, Vite, and Tailwind CSS**. Designed for coaching institutions, tuition centres, and academies, Zenvora replaces manual registers with hardware camera QR code attendance scanning, automated fee receipts, batch capacity tracking, and teacher dashboards.

For this college E-Business project demonstration, all data is persisted in browser `localStorage` to ensure zero database hosting costs while maintaining full CRUD capabilities and real data operations across sessions.

---

## 🎓 Key Features

1. **Brand & Modern UX**:
   - Palette: Primary Purple (`#7047D7`), Dark Purple (`#45258D`), Lavender (`#F3EEFF`), Canvas (`#FAF9FF`).
   - Custom graduation cap + geometric zen crest insignia.
   - Desktop collapsible sidebar and mobile-friendly thumb navigation.
   - Tabular numerals (`tabular-nums`) to prevent layout jitter on metrics.

2. **Dual-Role Access Control**:
   - **Admin (Principal Anita Sharma)**: Full master control over students, teachers, courses, batches, fees, announcements, and analytical reports.
   - **Teacher (Prof. Rajesh Verma)**: Streamlined view for assigned cohorts, live camera QR scanning, and attendance roll call.
   - One-click role switching in the navigation bar for seamless viva and faculty demonstrations.

3. **Student Directory & Identity Badges**:
   - Unique auto-increment ID format (`ZNV-2026-001`, `ZNV-2026-002`, ...).
   - Generates unique QR codes encoding **only** the student ID with zero raw PII in payload.
   - **Downloadable PNG QR codes** & **Printable Student ID Badge Cards** with center crest and emergency contacts.
   - Full student profile drawer with attendance rate, fee balances, and parent contact details.

4. **Real Hardware Camera QR Scanner**:
   - Built with `html5-qrcode` accessing real device rear cameras (`facingMode: "environment"`).
   - **Attendance Mode**: Scans student card, displays identity, checks for duplicate attendance today, and confirms check-in with audio chime.
   - **Fee Lookup Mode**: Scans student card, retrieves monthly fee, total paid, and pending dues with a link to collect fee.
   - **Instant Backup Search**: Manual student ID autocomplete simulation for testing in environments without camera hardware or non-HTTPS origins.

5. **Automated Attendance Roll Call**:
   - Batch selector & calendar date picker.
   - Turnout stats: Total enrolled, present, late, absent, and attendance rate %.
   - Mark individual or bulk "Mark All Unrecorded as Present".
   - Export session attendance to downloadable CSV.
   - Printable official batch attendance sheet (`@media print` formatted).

6. **Tuition Fee Management**:
   - Real-time calculation of all-time collections and outstanding student balances in Indian Rupees (₹).
   - Record payments via `Cash`, `UPI` (GPay/PhonePe), `Bank Transfer`, or `Demo Payment`.
   - **Printable Official Fee Payment Receipts** with authorized signature and college simulation watermark.
   - Export full financial ledger to CSV.

7. **Courses, Batches & Faculty**:
   - Manage curricula (e.g. CBSE 10th Math/Science, JEE Physics, NEET Chemistry, Python Coding).
   - Batch capacity tracking with dynamic occupancy progress meters.
   - Teacher directory with assigned batches and subject tags.

8. **Weekly Timetable with Conflict Detection**:
   - Interactive weekly matrix with daily class slots.
   - Automated conflict detection algorithm warns when a teacher or classroom is double-booked.
   - Live "Today" highlight for immediate morning oversight.

9. **Parent Announcements & WhatsApp Communication**:
   - Create notices with priority tags (`Urgent`, `Important`, `Bulletin`).
   - One-click copy text to clipboard.
   - **WhatsApp Share**: Generates prefilled `wa.me` links to send updates to parents instantly.

10. **Reports & Analytics**:
    - Interactive visual charts powered by **Recharts**.
    - Course enrolment distribution pie chart.
    - Batch attendance rate comparison bar chart.
    - Pending fee defaulters ledger with guardian phone numbers.

11. **Progressive Web App (PWA)**:
    - Installable on Android, Windows, macOS, and iOS Safari.
    - Configured with `vite-plugin-pwa`, `manifest.webmanifest`, service worker caching, and custom app icons.
    - Offline connectivity detection banner.

---

## 🛠️ Tech Stack

- **Framework**: React 19, TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4, Plus Jakarta Sans typography
- **Routing**: React Router v7 (`react-router-dom`)
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **QR Code Engine**: `qrcode.react` (SVG / PNG generation)
- **Camera QR Scanner**: `html5-qrcode`
- **PWA**: `vite-plugin-pwa`, Workbox
- **Persistence**: HTML5 Web Storage (`localStorage`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or bun

### Installation & Local Run
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
```

This compiles optimized production static assets into the `dist/` directory.

---

## 📱 Testing the Real Camera Scanner

1. Navigate to **QR Camera Scanner** (`/scanner`) in the navigation bar.
2. Click **Start Live Camera**.
3. When prompted by your browser, grant camera access permission.
4. Hold any student ID card with a QR code in front of the lens.
   - *Tip:* You can open a student card on a second phone or tab from **Students → View QR Pass**.
5. Once recognized:
   - A success chime will play.
   - In **Attendance Mode**, click **Present** to record attendance.
   - Scanning the same student again will trigger duplicate prevention with a warning note.
6. **No camera or testing in iframe?** Use the **Manual ID Entry / Quick 1-Click Passes** panel on the left to simulate a scan instantly.

---

## ☁️ Deployment Guide (Vercel & Netlify)

### Deploy to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your GitHub repository.
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Click **Deploy**. Vercel automatically assigns an HTTPS URL (required for camera access!).

### Deploy to Netlify
1. Create a `_redirects` file in `public/` containing:
   ```
   /*    /index.html   200
   ```
2. Connect your repository on [Netlify](https://netlify.com) and deploy.

---

## 📲 How to Install as Mobile App / APK

### Install as PWA (Recommended for Demo)
1. Open your deployed HTTPS website in Google Chrome on Android or Safari on iOS.
2. On Android/Chrome: Tap the **Install App** button in the top bar, or tap the three dots `⋮` → **Install app**.
3. On iOS Safari: Tap the **Share** button → **Add to Home Screen**.

### Package as Android APK using Bubblewrap
To generate a standalone `.apk` for college project submission:
```bash
# Install Bubblewrap CLI
npm install -g @bubblewrap/cli

# Initialize project using your deployed PWA manifest
bubblewrap init --manifest=https://your-deployed-domain.app/manifest.webmanifest

# Build signed Android APK
bubblewrap build
```

---

## 🧪 College Viva / Demonstration Checklist

- [x] **Login Page**: Fast 1-click Admin and Teacher demonstration access.
- [x] **Dashboard**: Live calculated counters for 14 students, attendance %, and collections.
- [x] **Student Management**: Full CRUD, search, filter, and QR ID card modal.
- [x] **Printable Passes**: Print student badges and download PNG QR codes.
- [x] **Hardware Camera Scanner**: Real HTML5 camera scanner with rear camera preference and audio chime.
- [x] **Duplicate Prevention**: Re-scanning the same student prevents duplicate attendance.
- [x] **Fee Management**: Collect fees, calculate balance, print official receipts.
- [x] **Timetable Conflict Detection**: Alerts when teacher or classroom is double-booked.
- [x] **Announcements**: WhatsApp share shortcut for parents.
- [x] **Analytics**: Enrolment pie chart, attendance bar chart, and fee defaulters table.
- [x] **Data Persistence**: Refresh the tab and verify all additions remain intact.
- [x] **Reset Demo Data**: Easily restore standard dataset from Settings anytime.

---

## Live Demo

[Open app here](https://zenvora-63.ai.studio)


## 📄 License
Academic and College Project License. Built for E-Business Management demonstration.
