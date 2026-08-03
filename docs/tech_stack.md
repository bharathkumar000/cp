# High-Fidelity Technology Stack

This document outlines the software configuration, framework specifications, package dependencies, and build runtimes supporting the **Connect & Prep** platform.

---

## 1. Unified Tech Stack Matrix

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Web UI** | Next.js (App Router) | `v14.x` / `React 19` | Core frontend framework & route management |
| **Web CSS** | Vanilla CSS | Modern Specs | Responsive flexbox layouts & glassmorphic aesthetics |
| **Mobile Client** | Flutter SDK | `v3.x` / `Dart 3.x` | Multiplatform iOS and Android application |
| **Database** | Supabase Postgres | PostgreSQL `v15` | Relational storage, triggers, and migrations |
| **Auth Gateway** | Supabase Auth | JWT-based | Role-based token access & signup validation |
| **Storage Engine** | Supabase Storage CDN | Global CDN | Secure host for Notes PDFs and files |
| **AI Processing** | Google Gemini API | `gemini-1.5-flash` | Prepcare study paths & question paper generator |
| **Build Compiler** | OpenJDK | `17.0.19` (macOS) | Gradle build tool executor for android APK |

---

## 2. Component Specifications

### 2.1 Next.js Web Stack
*   **Routing**: Structured Next.js App Router (located under `src/app/`) driving dynamic serverless endpoints.
*   **Authentication Hooks**: Managed in `src/context/AuthContext.jsx` implementing token checks and cookies sync.
*   **Icons**: `lucide-react` library providing clean vector graphics.

### 2.2 Flutter Mobile Stack
*   **State Management**: Structured using the `provider` state container (`lib/screens/app_shell.dart` and `lib/main.dart`).
*   **Data Models**: Structured serializers (`lib/models/`) mapping Postgres rows to Dart instances.
*   **Typography**: Outfitted with premium styles using `google_fonts` (Google Font: Outfit).
*   **Visual Charts**: Rendered using the `fl_chart` library.

### 2.3 Supabase Database Stack
*   **Migrations**: Managed under `supabase/migrations/` to run automatic incremental schemas.
*   **Edge Functions / API**: Connects tables to real-time client subscriptions via the PostgreSQL `supabase_realtime` publication slot.
