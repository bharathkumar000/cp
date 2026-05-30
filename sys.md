# Attendance Feature Flowchart

This flowchart specifies the technical execution path, scripts, endpoints, database tables, and logic of the face-recognition attendance feature.

```mermaid
flowchart TD
    %% Roles & Interfaces
    Teacher([👨‍🏫 Teacher Console: Attendance.jsx])
    Parent([👪 Parent Device])

    %% API Gateway & Backend
    API_Trigger{POST /api/attendance/trigger-randomizer}
    API_Snapshot{POST /api/attendance/snapshot}
    API_Finalise{POST /api/attendance/finalise}

    %% Processing
    PythonScript[🐍 python attendance_randomizer.py]
    OpenCV[📷 Capture OpenCV frame & match via trainer/encodings.pickle]
    USNMap[🔍 Map recognized names to USNs]

    %% Storage & Database
    SupabaseDB[(⚡ Supabase: attendance_snapshots & attendance_session_ledger)]
    LocalJSON[(💾 Fallback JSON: live_snapshots.json & live_ledger.json)]
    ScoreLogic{Score out of 5 checks?}
    Twilio[💬 Twilio WhatsApp API]

    %% Flow Connections
    Teacher -->|1. Click Start Validation| API_Trigger
    API_Trigger -->|2. Spawn detached child| PythonScript
    
    %% Loop
    subgraph Checkpoint Loop [Run 5 times at random intervals]
        PythonScript -->|3. Activate Camera| OpenCV
        OpenCV -->|4. Resolve Matches| USNMap
        USNMap -->|5. Telemetry data| API_Snapshot
    end

    %% Sync & Fallback
    API_Snapshot -->|6a. Attempt DB Insert| SupabaseDB
    API_Snapshot -->|6b. DB Down Fallback| LocalJSON
    
    %% Score Calculations
    SupabaseDB & LocalJSON --> ScoreLogic
    ScoreLogic -->|>= 4/5| Present[Status: PRESENT]
    ScoreLogic -->|1 - 3/5| Late[Status: LATE]
    ScoreLogic -->|0/5| Absent[Status: ABSENT]

    %% Finalization Flow
    Teacher -->|7. Click Lock & Finalise| API_Finalise
    API_Finalise -->|8a. Set is_finalised = true & insert legacy records| SupabaseDB
    API_Finalise -->|8b. Alert if ABSENT| Twilio
    Twilio -->|9. Dispatch WhatsApp message| Parent

---

## 2. Dr. Bhavana's Work Schedule Flow

```mermaid
flowchart TD
    Schedule([📅 Dr. Bhavana's Work Schedule Flow])
    
    %% Days of the week
    Schedule --> Mon[Monday]
    Schedule --> Tue[Tuesday]
    Schedule --> Wed[Wednesday]
    Schedule --> Thu[Thursday]
    Schedule --> Fri[Friday]

    %% Monday Flow
    Mon --> Mon1[Slot 1: CSE]
    Mon1 --> Mon2[Slot 2: ECE]
    Mon2 --> MonBreak{B-R-E-A-K}
    MonBreak --> Mon5[Slot 5-6: AIML]

    %% Tuesday Flow
    Tue --> TueBreak1{B-R-E-A-K}
    TueBreak1 --> Tue3[Slot 3: EEE]
    Tue3 --> Tue4[Slot 4: ME]
    Tue4 --> TueLunch{LUNCH}

    %% Wednesday Flow
    Wed --> Wed1[Slot 1: CV]
    Wed1 --> Wed2[Slot 2: CSE]
    Wed2 --> WedBreak{B-R-E-A-K}
    WedBreak --> Wed3[Slot 3-4: ECE]

    %% Thursday Flow
    Thu --> ThuBreak1{B-R-E-A-K}
    ThuBreak1 --> Thu3[Slot 3: AIML]
    Thu3 --> Thu4[Slot 4: EEE]
    Thu4 --> ThuLunch{LUNCH}
    ThuLunch --> Thu5[Slot 5-6: ME]

    %% Friday Flow
    Fri --> Fri1[Slot 1: CV]
    Fri1 --> Fri2[Slot 2: CSE]
    Fri2 --> FriBreak{B-R-E-A-K}
    FriBreak --> Fri5[Slot 5-6: ECE]

    %% Color Coding Styles matching classes
    classDef cse fill:#2563eb,color:#fff,stroke:#000,stroke-width:1px;
    classDef ece fill:#16a34a,color:#fff,stroke:#000,stroke-width:1px;
    classDef aiml fill:#7c3aed,color:#fff,stroke:#000,stroke-width:1px;
    classDef eee fill:#ea580c,color:#fff,stroke:#000,stroke-width:1px;
    classDef me fill:#dc2626,color:#fff,stroke:#000,stroke-width:1px;
    classDef cv fill:#0d9488,color:#fff,stroke:#000,stroke-width:1px;
    classDef break fill:#1f2937,color:#fff,stroke:#111827,stroke-width:1px;

    class Mon1,Wed2,Fri2 cse;
    class Mon2,Wed3,Fri5 ece;
    class Mon5,Thu3 aiml;
    class Tue3,Thu4 eee;
    class Tue4,Thu5 me;
    class Wed1,Fri1 cv;
    class MonBreak,TueBreak1,WedBreak,ThuBreak1,FriBreak,TueLunch,ThuLunch break;
```
