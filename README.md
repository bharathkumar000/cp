<div align="center">

  <img src="public/logo.png" alt="Connect & Prep Logo" width="240" />

  # 🏆 Connect & Prep
  ### *The Ultimate AI-Powered Academic Command Center & Campus Portal*

  <p align="center">
    <b>Student • Teacher • Parent • Admin Unified Ecosystem</b><br/>
    <sub>Built with Next.js 16 (React 19) • Flutter • Supabase • Groq AI</sub>
  </p>

  <br/>

  <!-- Tech Stack Badges -->
  <p align="center">
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2%20(React%2019)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
    <a href="https://flutter.dev"><img src="https://img.shields.io/badge/Flutter-3.x%20(Dart)-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter" /></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://groq.com"><img src="https://img.shields.io/badge/Groq%20AI-Llama%203.1-f55036?style=for-the-badge&logo=groq&logoColor=white" alt="Groq AI" /></a>
  </p>

</div>

---

## ⚡ Overview

**Connect & Prep** is a state-of-the-art, high-performance academic portal designed to unite Students, Teachers, and Parents within a single seamless ecosystem. Featuring dynamic dark glassmorphism UI, real-time Groq AI doubt solving, automated exam generation, security hardening, and role-based access control.

---

## 🏆 Awards & Recognition

> [!TIP]
> **2nd Place Winner** at the State Level Hackathon *Parivarthan* (Vidyavardhaka College of Engineering). Recognized for outstanding UI/UX design, modular architecture, and stability.

---

## 🔑 Quick Demo Credentials

Try out the application instantly using these quick-fill demo credentials:

| Role | Email / ID | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| 🧑‍🎓 **Student** | `1` | `1` | Full Student Portal & Groq AI Assistant |
| 👨‍🏫 **Teacher** | `2` | `2` | Teacher Console, Attendance & Booking |
| 👨‍👩‍👧 **Parent** | `3` | `3` | Parent Monitoring & Child Performance |
| 🛡️ **Admin** | `admin` | `admin` | Institutional Management & Settings |

---

## ✨ Core Features

<details open>
<summary><b>🧠 1. Groq AI Intelligence Core (Llama 3.1 & Ollama)</b></summary>
<br/>

*   **Prepcare AI Assistant:** High-speed multi-modal doubt solver powered by Groq Llama 3.1 & Ollama with image scanning, LaTeX math rendering, and API Key configuration ([AIChatBot.jsx](file:///Users/bharathkumara/Desktop/one-campus/src/components/features/AIChatBot.jsx)).
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

## 🛠️ Web App Setup Guide

Follow these clear instructions to run the Connect & Prep Web Application locally:

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

# Groq AI API Key
GROQ_API_KEY=your_groq_api_key
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

## 📱 Mobile App (Android APK) Installation Guide

Connect & Prep includes a native **Flutter Mobile App** for Android devices (`mobile_app/`).

---

### Option A: Install Release APK Directly (Recommended)

1. **Locate the Generated Release APK**:
   The production-ready release APK is located at:
   ```path
   mobile_app/build/app/outputs/flutter-apk/app-release.apk
   ```

2. **Transfer to Your Android Phone**:
   - Send `app-release.apk` to your phone via USB cable, Google Drive, WhatsApp, or local download.

3. **Enable Installation & Install**:
   - On your Android device, go to **Settings** ➔ **Security** (or **Apps**).
   - Enable **Install from Unknown Sources** for your File Manager or Browser.
   - Tap `app-release.apk` to install and open **Connect & Prep** on your phone!

---

### Option B: Build & Run from Flutter Source

1. **Navigate to the Mobile App Directory**:
   ```bash
   cd mobile_app
   ```

2. **Fetch Dependencies**:
   ```bash
   flutter pub get
   ```

3. **Build Release APK**:
   ```bash
   flutter build apk --release
   ```
   *The generated APK will be output to `build/app/outputs/flutter-apk/app-release.apk`.*

4. **Install Directly via USB Debugging**:
   Connect your Android device with USB Debugging enabled, then run:
   ```bash
   flutter run --release
   ```

---

## 🗺️ System Architecture

For a complete specification of system workflows and client-server state handling, read the [newarch.md](file:///Users/bharathkumara/Desktop/one-campus/newarch.md) document.

---

<div align="center">

  ### 👨‍💻 Built with precision by **Bharath Kumar A**
  *Full Stack Engineer | UI/UX Specialist*

  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/bharathkumar000)
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bharathkumar000)

</div>
