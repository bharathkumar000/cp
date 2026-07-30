<div align="center">

  <!-- Header Animated Banner -->
  <img src="https://capsule-render.vercel.app/api?type=waving&color=6366f1&height=220&section=header&text=Connect%20%26%20Prep&fontSize=52&animation=fadeIn&fontAlignY=36&desc=Next-Gen%20Academic%20Command%20Center&descAlignY=62&descAlign=50" width="100%" alt="Connect & Prep Header" />

  <!-- Animated Typing Subtitle -->
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&duration=3000&pause=1000&color=818CF8&center=true&vCenter=true&width=700&lines=The+Ultimate+AI-Powered+Academic+Command+Center;Student+%E2%80%A2+Teacher+%E2%80%A2+Parent+Unified+Portal;Next.js+16+%2B+React+19+%2B+Supabase+%2B+Gemini;Instant+AI+Doubt+Solver+%26+Smart+Paper+Generator" alt="Typing SVG" />
  </a>

  <br/><br/>

  <!-- Tech Stack Badges -->
  <p align="center">
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2%20(React%2019)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
    <a href="https://flutter.dev"><img src="https://img.shields.io/badge/Flutter-3.x%20(Dart)-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter" /></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://ai.google.dev"><img src="https://img.shields.io/badge/Google%20Gemini-AI%20API-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini" /></a>
  </p>

</div>

---

## ⚡ Overview

**Connect & Prep** is a state-of-the-art, high-performance academic portal designed to unite Students, Teachers, and Parents within a single seamless ecosystem. Featuring dynamic dark glassmorphism UI, real-time AI doubt solving, automated exam generation, security hardening, and role-based access control.

---

## 🏆 Awards & Recognition

> [!TIP]
> **2nd Place Winner** at the State Level Hackathon *Parivarthan* (Vidyavardhaka College of Engineering). Recognized for outstanding UI/UX design, modular architecture, and stability.

---

## 🔑 Quick Demo Credentials

Try out the application instantly using these quick-fill demo credentials:

| Role | Email / ID | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| 🧑‍🎓 **Student** | `1` | `1` | Full Student Portal & AI Assistant |
| 👨‍🏫 **Teacher** | `2` | `2` | Teacher Console, Attendance & Booking |
| 👨‍👩‍👧 **Parent** | `3` | `3` | Parent Monitoring & Child Performance |
| 🛡️ **Admin** | `admin` | `admin` | Institutional Management & Settings |

---

## ✨ Core Features

<details open>
<summary><b>🧠 1. AI Intelligence Core (Gemini 2.5 & Ollama)</b></summary>
<br/>

*   **Prepcare AI Assistant:** Multi-modal doubt solver with image scanning, LaTeX rendering, and API Key configuration ([AIChatBot.jsx](file:///Users/bharathkumara/Desktop/one-campus/src/components/features/AIChatBot.jsx)).
*   **Smart Question Paper Generator:** Create structured exam papers with cognitive difficulty sliders ([QuestionPaperGenerator.jsx](file:///Users/bharathkumara/Desktop/one-campus/src/components/features/QuestionPaperGenerator.jsx)).
*   **AI Quiz Builder:** Dynamically build customized practice quizzes ([QuizGenerator.jsx](file:///Users/bharathkumara/Desktop/one-campus/src/components/features/QuizGenerator.jsx)).
*   **Prepcare Study Planner:** Personalized study roadmaps based on CGPA targets ([AcademicHub.jsx](file:///Users/bharathkumara/Desktop/one-campus/src/components/features/AcademicHub.jsx)).
</details>

<details>
<summary><b>🛡️ 2. Cybersecurity & Privacy Protection</b></summary>
<br/>

*   **HMAC Anonymous Feedback:** Rotates HMAC-SHA256 tokens to submit feedback without logging IP/identity ([feedback/route.ts](file:///Users/bharathkumara/Desktop/one-campus/src/app/api/feedback/route.ts)).
*   **EXIF & Metadata Stripper:** Automatically scrubs GPS tags and author metadata from uploaded PDFs/Images ([upload/route.ts](file:///Users/bharathkumara/Desktop/one-campus/src/app/api/files/upload/route.ts)).
*   **Zero-Trust Session Guard:** Server-enforced cookie validation and authorization checks ([server.ts](file:///Users/bharathkumara/Desktop/one-campus/src/utils/supabase/server.ts)).
</details>

<details>
<summary><b>📚 3. Academic & Institutional Portals</b></summary>
<br/>

*   **Attendance Logging:** Class log registration and student tracker ([Attendance.jsx](file:///Users/bharathkumara/Desktop/one-campus/src/components/features/Attendance.jsx)).
*   **Classroom Scheduler:** Real-time hall booking for lectures ([ClassroomBooking.jsx](file:///Users/bharathkumara/Desktop/one-campus/src/components/features/ClassroomBooking.jsx)).
*   **Study Forums & Marathons:** Collaboration spaces and notice boards ([ChatForum.jsx](file:///Users/bharathkumara/Desktop/one-campus/src/components/features/ChatForum.jsx)).
*   **Parent Console:** View child attendance, grades, and teacher notes ([ParentDashboard.jsx](file:///Users/bharathkumara/Desktop/one-campus/src/components/features/ParentDashboard.jsx)).
</details>

---

## 🛠️ Step-by-Step Setup Guide

Follow these clear instructions to run Connect & Prep locally:

### Prerequisites
Make sure you have installed:
- **Node.js**: v18.0 or higher
- **npm** or **yarn**
- **Git**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/bharathkumar000/cp.git
cd cp
```

---

### Step 2: Install Project Dependencies
```bash
npm install
```

---

### Step 3: Configure Environment Variables
Create a `.env` file in the project root:

```env
# Supabase Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Local Mock Toggle (Set true for offline demo mode)
NEXT_PUBLIC_USE_MOCK_SUPABASE=true

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key
```

> [!NOTE]
> Setting `NEXT_PUBLIC_USE_MOCK_SUPABASE=true` allows full offline demo operation without requiring active database connections.

---

### Step 4: Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001`) in your browser to launch the app!

---

## 🗺️ System Architecture

For a complete specification of system workflows and client-server state handling, read the [newarch.md](file:///Users/bharathkumara/Desktop/one-campus/newarch.md) document.

---

<div align="center">

  <!-- Footer Banner -->
  <img src="https://capsule-render.vercel.app/api?type=waving&color=6366f1&height=120&section=footer" width="100%" alt="Footer Banner" />

  ### 👨‍💻 Built with precision by **Bharath Kumar A**
  *Full Stack Engineer | UI/UX Specialist*

  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/bharathkumar000)
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bharathkumar000)

</div>