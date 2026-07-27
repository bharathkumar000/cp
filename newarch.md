# 🏛️ Connect & Prep: System Architecture

Connect & Prep is designed as a **Demo-First Hybrid Architecture**. Most features run on simulated data for smooth presentations, while key security and AI actions route to live servers.

---

## 🗺️ System Topology

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

## 🧩 How the Layers Work

### 1. Simulated Demo Features (Mock System)
To ensure the app is fast and works offline during demos, these features use a simulated backend file ([mockBackend.js](file:///Users/bharathkumara/Desktop/PROJECTS/one-campus/src/services/mockBackend.js)):
*   **Classroom & Library Booking:** Simulates booking study rooms and checking out library books.
*   **Grades & CGPA Calculator:** Displays visual charts of GPA trends using dummy data.
*   **Discussion Forums:** Interactive doubt solving boards where users can post mock answers.
*   **Student Projects & Wallets:** Simulates linking GitHub repositories and using fake digital money to purchase canteen food.

### 2. Live Cloud Features (Real Backend)
These critical features connect directly to real servers and cloud databases:
*   **User Login Sync:** Synchronizes and verifies user accounts against the real Supabase Auth server.
*   **Anonymous Feedback Loop:** Scrambles student IDs into code using a hash key (HMAC-SHA256) so students can post reviews anonymously without saving their names or IPs.
*   **Metadata Stripping Upload Gate:** Erases hidden details (like GPS location tags from photos and author names from PDFs) using code libraries before saving them to cloud storage.
*   **AI Mentorship:** Sends inputs to Google's Gemini AI to generate custom study plans and schedules.