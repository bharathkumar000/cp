# 🏆 Connect & Prep
### *The Ultimate AI-Powered Academic Command Center & Campus Portal*

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2%20(React%2019)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://flutter.dev"><img src="https://img.shields.io/badge/Flutter-3.x%20(Dart)-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://ai.google.dev"><img src="https://img.shields.io/badge/Google%20Gemini-AI%20API-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini" /></a>
</p>

---

## 💎 The Vision

**Connect & Prep** is a premium, high-performance academic command center. It bridges the gap between fragmented study resources and peer-to-peer collaboration. Built with a sleek modern layout, it provides role-based portal views for Students, Teachers, and Parents to synchronize schedules, resolve academic doubts, and track performance.

---

## 🏆 Awards & Recognition

> [!TIP]
> **2nd Place Winner** at the State Level Hackathon *Parivarthan* (Vidyavardhaka College of Engineering). Recognized for outstanding UI/UX design, modular architecture, and stability.

---

## ⚡ Active Features

### 🧠 1. AI Intelligence Core (Google Gemini 1.5 Flash)
*   **Prepcare Study Planner:** Analyzes student target scores and CGPA to generate actionable study roadmaps ([AcademicHub.jsx](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/components/features/AcademicHub.jsx)).
*   **Smart Question Paper Generator:** Allows faculty to instantly generate structured exam papers using cognitive weights sliders ([QuestionPaperGenerator.jsx](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/components/features/QuestionPaperGenerator.jsx)).
*   **AI Quiz Builder:** Dynamically creates quizzes on standard topics for instant preparation testing ([QuizGenerator.jsx](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/components/features/QuizGenerator.jsx)).
*   **Doubt Tagging & Solutions:** Automatically tags student questions, connects relevant reference documents, and pre-drafts replies ([DoubtSolving.jsx](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/components/features/DoubtSolving.jsx)).

### 🛡️ 2. Cybersecurity & Privacy Hardening
*   **HMAC Anonymous Feedback:** Uses rotating daily keys (HMAC-SHA256) to allow student complaints without saving names or IP addresses ([feedback/route.ts](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/app/api/feedback/route.ts)).
*   **Upload Metadata Stripping:** Erases hidden GPS tags from images (via `sharp`) and publisher data from PDFs (via `pdf-lib`) before cloud uploads ([upload/route.ts](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/app/api/files/upload/route.ts)).
*   **Zero-Trust Session Verification:** Verifies access directly on the server database using secure cookies and token controls ([server.ts](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/utils/supabase/server.ts)).

### 📚 3. Academic & Classroom Portals
*   **Manual Attendance Tracker:** Allows teachers to log class logs and track attendance records directly ([Attendance.jsx](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/components/features/Attendance.jsx)).
*   **Classroom Booking:** Real-time scheduler for teachers to reserve lecture halls and classrooms ([ClassroomBooking.jsx](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/components/features/ClassroomBooking.jsx)).
*   **Interactive Forums & Chat:** Group study marathons, notice boards, and channel discussions ([ChatForum.jsx](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/components/features/ChatForum.jsx)).
*   **Parent Dashboard:** Simple view for parents to monitor attendance, grade cards, and teacher remarks ([ParentDashboard.jsx](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/components/features/ParentDashboard.jsx)).

---

## 🗺️ Architectural Topology

For a complete breakdown of what is simulated locally vs. what runs on live production cloud servers, view our detailed architecture log: [newarch.md](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/newarch.md)

---

## 🔑 Demo Access Credentials

To log into specific dashboards in offline simulation mode, use these credentials:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `1` | `1` | Default student dashboard view |
| **Teacher** | `2` | `2` | Teacher console & classroom manager |
| **Parent** | `3` | `3` | Parent dashboard with child statistics |
| **Admin** | `admin` | `admin` | Full system administrator panel |

---

## 🚀 Getting Started

### 1. Initialize Project Repository
```bash
git clone https://github.com/bharathkumar000/cp.git
cd cp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Your Environment (.env)
Create a `.env` file in the root directory and configure your keys:
```bash
# Supabase Database Settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anonymous_key

# Supabase Local Mock Toggle
NEXT_PUBLIC_USE_MOCK_SUPABASE=true

# Google Gemini API
GEMINI_API_KEY=your_gemini_key
```

> [!NOTE]
> Setting `NEXT_PUBLIC_USE_MOCK_SUPABASE=true` runs the UI in offline simulation mode. Change it to `false` to connect to your live Supabase databases.

### 4. Database Setup
To set up your Supabase project schema:
1. Copy all code inside [complete_setup_unified.sql](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/supabase/schema/complete_setup_unified.sql).
2. Open the **SQL Editor** inside your Supabase project dashboard.
3. Paste the contents and click **Run**.

### 5. Launch the Local Dev Server
```bash
npm run dev
```

---

<div align="center">

### 👨‍💻 Developed by **Bharath Kumar A**
*Full Stack Developer | UI/UX Architect*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/bharathkumar000)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bharathkumar000)

*Crafted with precision for the global student community.*

</div>