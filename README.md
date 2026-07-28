# 🏆 Connect & Prep
### *The Ultimate AI-Powered Academic Command Center & Campus Portal*

<p align="center">
  <img src="assets/banner.png" alt="Connect & Prep Banner" width="100%" style="border-radius: 8px;" />
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2%20(React%2019)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://flutter.dev"><img src="https://img.shields.io/badge/Flutter-3.x%20(Dart)-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://ai.google.dev"><img src="https://img.shields.io/badge/Google%20Gemini-AI%20API-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini" /></a>
</p>

---

## 💎 The Vision

**Connect & Prep** is a premium, high-performance academic hub and campus command center. It bridges the gap between fragmented study resources, team coordination, and student safety while maintaining strict privacy standards. Built with a sleek dark-mode aesthetic, it consolidates student portals, parents' views, teachers' diaries, and AI mentoring engines into a single responsive node.

---

## 🏆 Awards & Recognition

> [!TIP]
> **2nd Place Winner** at the State Level Hackathon *Parivarthan* (Vidyavardhaka College of Engineering). Recognized for outstanding UI/UX design, structural database integrity, and architectural stability.

---

## ⚡ Key Core Pillars

### 🧠 1. AI Intelligence Node (Google Gemini 1.5 Flash)
*   **Prepcare Study Advisor:** Analyzes student CGPA and strengths to generate interactive, custom roadmap checklists.
*   **Bloom's Taxonomy Exam Builder:** Allows faculty to generate tailored exam question sheets on-the-fly with adjustable cognitive sliders.
*   **Smart Doubt Tagging:** Automatically categorizes forum queries, runs semantic search over study notes, and drafts tutor replies.

### 🛡️ 2. Cybersecurity & Privacy Hardening
*   **DPDP Act-Compliant Feedback:** Uses daily rotating cryptographic HMAC-SHA256 tokens to decouple student IDs from reviews, allowing rate-limited feedback without identity tracking.
*   **Metadata Stripper Gate:** Wipes GPS location markers from uploaded images (using `sharp`) and scrubs author names from PDFs (using `pdf-lib`) before uploading to a secure CDN.
*   **Zero-Trust Session Gating:** Authentication is locked behind secure `HttpOnly` cookie stores and server-side `getUser()` checks to prevent script-hijacking.

### 📊 3. Consolidated Campus Dashboards
*   **Students:** Check-in calendars, assignment vaults, CGPA calculators, library directories, and study marathons.
*   **Teachers:** Classroom booking logs, syllabus timelines, manual attendance registration, and counseling logs.
*   **Parents:** Direct insight into child attendance percentages, CGPA trends, and real-time gate entry/exit alerts.

---

## 🗺️ Architectural Topology

For a complete breakdown of what is simulated locally vs. what runs on live production cloud servers, view our detailed architecture log: [newarch.md](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/newarch.md)

```mermaid
flowchart TD
    subgraph Clients ["Client Layer (UI)"]
        Web["Next.js Web App\n(React 19)"]
        Mobile["Flutter Mobile App\n(Dart)"]
    end

    subgraph MockData ["Simulation Layer (Demo)"]
        MockDB["mockBackend.js\n(Simulated Data:\nTimetable, Doubts, Projects,\nWallets, Assignments)"]
    end

    subgraph LiveAPI ["Live Production APIs"]
        FeedbackAPI["Feedback API\n(Encrypts Student IDs)"]
        UploadAPI["Upload API\n(Erases Image & PDF Metadata)"]
        AIAPI["AI API\n(Fetches Gemini Responses)"]
    end

    subgraph Cloud ["Live Cloud Databases"]
        SupaDB[("Supabase Postgres DB\n(Stores Feedback & Profiles)")]
        SupaStorage[("Supabase Storage CDN\n(Stores Uploaded Files)")]
    end

    %% Routing Flow
    Clients -->|Reads/Writes UI State| MockDB
    Clients -->|Anonymous Feedback POST| FeedbackAPI
    Clients -->|File Upload POST| UploadAPI
    Clients -->|AI Chat & Prep Advisor| AIAPI

    %% Cloud Storage Links
    FeedbackAPI --> SupaDB
    UploadAPI --> SupaStorage
    UploadAPI --> SupaDB
```

---

## 🔑 Demo Access Credentials

To test specific user portals and layouts in offline simulation mode, use these credentials on the login screen:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `1` | `1` | Default student dashboard view |
| **Teacher** | `2` | `2` | Teacher console & classroom manager |
| **Parent** | `3` | `3` | Parent dashboard with child statistics |
| **Admin** | `admin` | `admin` | Full system administrator panel |

For targeted VVCE database profiles:
*   **Bharath Kumar A (Student):** `bk@vvce` (Password: `bk`)
*   **Bhavana (Teacher):** `bhav@vvce` (Password: `bhav`)
*   **Abhi (Parent of Ananya):** `abhi@vvce` (Password: `abhi`)

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
> Setting `NEXT_PUBLIC_USE_MOCK_SUPABASE=true` allows you to run all front-end features in offline demo mode. Change it to `false` to redirect queries to your live cloud databases.

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