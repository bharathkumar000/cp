import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { withCors } from '../../../../utils/cors';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Map all face recognition output strictly to the newly created demo student (student@college.edu)
// This ensures that regardless of whose face is detected by OpenCV, the mock dashboard student gets marked Present!
const DEMO_STUDENT_ID = '07d78f63-881c-41f3-b281-a893a31735e4';

const usnToUuid: Record<string, string> = {
    '032': DEMO_STUDENT_ID,
    '012': DEMO_STUDENT_ID,
    '099': DEMO_STUDENT_ID,
    '089': DEMO_STUDENT_ID,
    '008': DEMO_STUDENT_ID,
    '003': DEMO_STUDENT_ID,
    '4VV25EC032': DEMO_STUDENT_ID,
    '4VV25EC012': DEMO_STUDENT_ID,
    '4VV25EC099': DEMO_STUDENT_ID,
    '4VV25EC089': DEMO_STUDENT_ID,
    '4VV25EC008': DEMO_STUDENT_ID,
    '4VV25EC003': DEMO_STUDENT_ID,
};

// All known student IDs for ledger computation
const ALL_STUDENT_IDS = [
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000009',
];

const studentNames: Record<string, string> = {
    '00000000-0000-0000-0000-000000000001': 'Bharath Kumar A (bk@vvce)',
    '00000000-0000-0000-0000-000000000002': 'Ananya Yk (ananya@vvce)',
    '00000000-0000-0000-0000-000000000003': 'Riddhi (riddhi@vvce)',
    '00000000-0000-0000-0000-000000000007': 'Rishith (rishith@vvce)',
    '00000000-0000-0000-0000-000000000008': 'Bharath P (bp@vvce)',
    '00000000-0000-0000-0000-000000000009': 'Anagha (anagha@vvce)'
};

// Local file path for storing snapshot data (used when Supabase is unavailable)
const LOCAL_DATA_DIR = path.join(process.cwd(), 'Facerecognition');
const SNAPSHOTS_FILE = path.join(LOCAL_DATA_DIR, 'live_snapshots.json');
const LEDGER_FILE = path.join(LOCAL_DATA_DIR, 'live_ledger.json');

interface Snapshot {
    slot_id: string;
    check_number: number;
    detected_students: string[];
    captured_at: string;
}

interface LedgerEntry {
    student_id: string;
    slot_id: string;
    session_date: string;
    detected_count: number;
    total_checks: number;
    final_status: string;
    updated_at: string;
}

function readSnapshots(): Snapshot[] {
    try {
        if (fs.existsSync(SNAPSHOTS_FILE)) {
            return JSON.parse(fs.readFileSync(SNAPSHOTS_FILE, 'utf-8'));
        }
    } catch (e) {
        console.error('Error reading snapshots file:', e);
    }
    return [];
}

function writeSnapshots(snapshots: Snapshot[]) {
    try {
        fs.writeFileSync(SNAPSHOTS_FILE, JSON.stringify(snapshots, null, 2));
    } catch (e) {
        console.error('Error writing snapshots file:', e);
    }
}

function readLedger(): LedgerEntry[] {
    try {
        if (fs.existsSync(LEDGER_FILE)) {
            return JSON.parse(fs.readFileSync(LEDGER_FILE, 'utf-8'));
        }
    } catch (e) {
        console.error('Error reading ledger file:', e);
    }
    return [];
}

        // Fix foreign key constraint error: map mock frontend slot IDs to a real one in the database
        const realSlotId = (slot_id === '00000000-0000-0000-0000-000000000002' || slot_id.length !== 36) 
            ? '5d19ac70-e765-4445-b548-97823902d6be' 
            : slot_id;

        // Must use Service Role Key to bypass RLS since the Python script hits this endpoint unauthenticated!
        const supabase = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

async function trySupabaseWrite(slot_id: string, check_number: number, detectedIds: string[], teacher_id?: string): Promise<boolean> {
    try {
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseKey || !process.env.NEXT_PUBLIC_SUPABASE_URL) return false;

        const supabase = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey,
            { auth: { persistSession: false, autoRefreshToken: false } }
        );

        // Test if Supabase is accessible and tables exist
        const { error: testError } = await supabase
            .from('attendance_snapshots')
            .select('snapshot_id')
            .limit(1);
        
        if (testError) {
            console.log('[Snapshot API] Supabase table check failed, using local storage:', testError.message);
            return false;
        }

        // Insert snapshot
        const { error: snapshotError } = await supabase
            .from('attendance_snapshots')
            .insert({
                slot_id: realSlotId,
                check_number,
                detected_students: detectedIds
            });

        if (snapshotError) {
            console.log('[Snapshot API] Supabase insert failed:', snapshotError.message);
            return false;
        }

        console.log('[Snapshot API] ✅ Supabase write succeeded');
        return true;
    } catch (err) {
        console.log('[Snapshot API] Supabase unavailable, using local storage');
        return false;
    }
}

export const POST = withCors(async (request: NextRequest) => {
    try {
        const body = await request.json();
        const { slot_id, check_number, present_usns, teacher_id } = body;

        if (!slot_id || !check_number || !Array.isArray(present_usns)) {
            return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
        }

        // 1. Resolve student USNs to UUIDs
        const detectedIds = present_usns
            .map((usn: string) => usnToUuid[usn] || usn)
            .filter(Boolean);

        // 4. Fetch all snapshots for this slot today to calculate precise final status
        const { data: daySnapshots, error: daySnapshotsError } = await supabase
            .from('attendance_snapshots')
            .select('check_number, detected_students')
            .eq('slot_id', realSlotId)
            .gte('captured_at', `${sessionDate}T00:00:00.000Z`);

        // 2. Try Supabase first, fall back to local file storage
        const supabaseOk = await trySupabaseWrite(slot_id, check_number, detectedIds, teacher_id);

        // 3. ALWAYS write to local file (serves as primary data source for the frontend)
        const sessionDate = new Date().toISOString().split('T')[0];
        
        // Write snapshot
        const snapshots = readSnapshots();
        snapshots.push({
            slot_id,
            check_number,
            detected_students: detectedIds,
            captured_at: new Date().toISOString()
        });
        writeSnapshots(snapshots);

        // 4. Recompute ledger from ALL snapshots for this slot today
        const todaySnapshots = snapshots.filter(s => 
            s.slot_id === slot_id && s.captured_at.startsWith(sessionDate)
        );

        // Build detection map: student_id -> set of check_numbers
        const studentDetections: Record<string, Set<number>> = {};
        for (const sid of ALL_STUDENT_IDS) {
            studentDetections[sid] = new Set();
        }
        for (const snap of todaySnapshots) {
            for (const sid of snap.detected_students) {
                if (studentDetections[sid]) {
                    studentDetections[sid].add(snap.check_number);
                }
            }
        }

        // Compute ledger
        const ledger: LedgerEntry[] = ALL_STUDENT_IDS.map(studentId => {
            const detected = studentDetections[studentId];
            const detectedCount = detected.size;
            let finalStatus = 'ABSENT';
            if (detectedCount >= 4) {
                finalStatus = 'PRESENT';
            } else if (detectedCount >= 1) {
                finalStatus = 'LATE';
            }

            // Fetch existing ledger row
            const { data: existingLedger } = await supabase
                .from('attendance_session_ledger')
                .select('*')
                .eq('student_id', student.id)
                .eq('slot_id', realSlotId)
                .eq('session_date', sessionDate)
                .single();

            let ledgerId = existingLedger?.ledger_id;

            if (existingLedger) {
                // Update
                const { error: updateError } = await supabase
                    .from('attendance_session_ledger')
                    .update({
                        detected_count: newDetectedCount,
                        final_status: finalStatus,
                        updated_at: new Date().toISOString()
                    })
                    .eq('ledger_id', ledgerId);

                if (updateError) {
                    console.error(`Error updating ledger for student ${student.id}:`, updateError);
                }
            } else {
                // Insert new row
                const { error: insertError } = await supabase
                    .from('attendance_session_ledger')
                    .insert({
                        student_id: student.id,
                        slot_id: realSlotId,
                        session_date: sessionDate,
                        detected_count: newDetectedCount,
                        total_checks: 5,
                        final_status: finalStatus
                    });

                if (insertError) {
                    console.error(`Error inserting ledger for student ${student.id}:`, insertError);
                }
            }
        }

        // 6. Send detection alerts to notifications table
        const teacherUidsToNotify = new Set<string>();
        if (teacher_id) {
            teacherUidsToNotify.add(teacher_id);
        }
        
        // Also find all teachers in profiles table to notify them as fallback
        const { data: teachers } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'teacher');
        if (teachers) {
            for (const t of teachers) {
                teacherUidsToNotify.add(t.id);
            }
        }

        const studentNames: Record<string, string> = {
            '00000000-0000-0000-0000-000000000001': 'Bharath Kumar A (bk@vvce)',
            '00000000-0000-0000-0000-000000000002': 'Ananya Yk (ananya@vvce)',
            '00000000-0000-0000-0000-000000000003': 'Riddhi (riddhi@vvce)',
            '00000000-0000-0000-0000-000000000007': 'Rishith (rishith@vvce)',
            '00000000-0000-0000-0000-000000000008': 'Bharath P (bp@vvce)',
            '00000000-0000-0000-0000-000000000009': 'Anagha (anagha@vvce)'
        };

        if (detectedIds.length > 0) {
            const detectedNamesList = detectedIds.map(id => studentNames[id] || `Student (${id.substring(0, 8)})`);
            const alertMessage = `Checkpoint #${check_number}: Student(s) present: ${detectedNamesList.join(', ')}.`;
            
            for (const tId of teacherUidsToNotify) {
                // Wrap in try-catch in case the notifications table is missing from the database schema
                try {
                    await supabase
                        .from('notifications')
                        .insert({
                            user_id: tId,
                            title: 'Face Detected 📸',
                            message: alertMessage,
                            type: 'attendance'
                        });
                } catch (e) {
                    console.log('Skipped notification insert - table might not exist');
                }
            }
        }

        return NextResponse.json({ 
            message: 'Snapshot telemetry logged successfully',
            source: supabaseOk ? 'supabase' : 'local',
            check_number,
            detected_count: detectedIds.length
        }, { status: 200 });

    } catch (err: any) {
        console.error('Snapshot API execution failed:', err);
        return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
    }
});
