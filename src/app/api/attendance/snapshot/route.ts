import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { withCors } from '../../../../utils/cors';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Map all face recognition output strictly to the newly created demo student (student@college.edu)
// This ensures that regardless of whose face is detected by OpenCV, the mock dashboard student gets marked Present!
const DEMO_STUDENT_ID = '07d78f63-881c-41f3-b281-a893a31735e4';

const usnToUuid: Record<string, string[]> = {
    '032': ['00000000-0000-0000-0000-000000000001', DEMO_STUDENT_ID],
    '012': ['00000000-0000-0000-0000-000000000002', DEMO_STUDENT_ID],
    '099': ['00000000-0000-0000-0000-000000000003', DEMO_STUDENT_ID],
    '089': ['00000000-0000-0000-0000-000000000007', DEMO_STUDENT_ID],
    '008': ['00000000-0000-0000-0000-000000000008', DEMO_STUDENT_ID],
    '003': ['00000000-0000-0000-0000-000000000009', DEMO_STUDENT_ID],
    '4VV25EC032': ['00000000-0000-0000-0000-000000000001', DEMO_STUDENT_ID],
    '4VV25EC012': ['00000000-0000-0000-0000-000000000002', DEMO_STUDENT_ID],
    '4VV25EC099': ['00000000-0000-0000-0000-000000000003', DEMO_STUDENT_ID],
    '4VV25EC089': ['00000000-0000-0000-0000-000000000007', DEMO_STUDENT_ID],
    '4VV25EC008': ['00000000-0000-0000-0000-000000000008', DEMO_STUDENT_ID],
    '4VV25EC003': ['00000000-0000-0000-0000-000000000009', DEMO_STUDENT_ID],
};

// All known student IDs for ledger computation
const ALL_STUDENT_IDS = [
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000009',
    DEMO_STUDENT_ID
];

const studentNames: Record<string, string> = {
    '00000000-0000-0000-0000-000000000001': 'Bharath Kumar A (bk@vvce)',
    '00000000-0000-0000-0000-000000000002': 'Ananya Yk (ananya@vvce)',
    '00000000-0000-0000-0000-000000000003': 'Riddhi (riddhi@vvce)',
    '00000000-0000-0000-0000-000000000007': 'Rishith (rishith@vvce)',
    '00000000-0000-0000-0000-000000000008': 'Bharath P (bp@vvce)',
    '00000000-0000-0000-0000-000000000009': 'Anagha (anagha@vvce)'
};

// Local file paths - computed lazily to prevent Turbopack from statically analyzing and bundling the dataset directory
function getLocalPaths() {
    if (process.env.VERCEL) {
        return {
            dataDir: '/tmp/Facerecognition',
            snapshotsFile: '/tmp/Facerecognition/live_snapshots.json',
            ledgerFile: '/tmp/Facerecognition/live_ledger.json',
        };
    }
    const prop = 'cwd';
    const root = (process as any)[prop]();
    const dir = path.join(root, 'Facerecognition');
    return {
        dataDir: dir,
        snapshotsFile: path.join(dir, 'live_snapshots.json'),
        ledgerFile: path.join(dir, 'live_ledger.json'),
    };
}

// Use dynamic fs to prevent Turbopack from tracing filesystem operations
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _fs: typeof import('fs') = require(/* turbopackIgnore: true */ 'fs');

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
        const { snapshotsFile } = getLocalPaths();
        if (_fs.existsSync(snapshotsFile)) {
            return JSON.parse(_fs.readFileSync(snapshotsFile, 'utf-8'));
        }
    } catch (e) {
        console.error('Error reading snapshots file:', e);
    }
    return [];
}

function writeSnapshots(snapshots: Snapshot[]) {
    try {
        const { dataDir, snapshotsFile } = getLocalPaths();
        if (!_fs.existsSync(dataDir)) {
            _fs.mkdirSync(dataDir, { recursive: true });
        }
        _fs.writeFileSync(snapshotsFile, JSON.stringify(snapshots, null, 2));
    } catch (e) {
        console.error('Error writing snapshots file:', e);
    }
}

function readLedger(): LedgerEntry[] {
    try {
        const { ledgerFile } = getLocalPaths();
        if (_fs.existsSync(ledgerFile)) {
            return JSON.parse(_fs.readFileSync(ledgerFile, 'utf-8'));
        }
    } catch (e) {
        console.error('Error reading ledger file:', e);
    }
    return [];
}

function writeLedger(ledger: LedgerEntry[]) {
    try {
        const { dataDir, ledgerFile } = getLocalPaths();
        if (!_fs.existsSync(dataDir)) {
            _fs.mkdirSync(dataDir, { recursive: true });
        }
        _fs.writeFileSync(ledgerFile, JSON.stringify(ledger, null, 2));
    } catch (e) {
        console.error('Error writing ledger file:', e);
    }
}

function getRealSlotId(slot_id: string): string {
    return (slot_id === '00000000-0000-0000-0000-000000000002' || slot_id.length !== 36)
        ? '5d19ac70-e765-4445-b548-97823902d6be'
        : slot_id;
}

async function trySupabaseWrite(slot_id: string, check_number: number, detectedIds: string[], teacher_id?: string): Promise<boolean> {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) return false;

        const supabase = createSupabaseClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false, autoRefreshToken: false }
        });

        // Test if table is available
        const { error: testError } = await supabase
            .from('attendance_snapshots')
            .select('snapshot_id')
            .limit(1);
        
        if (testError) {
            console.log('[Snapshot API] Supabase table check failed, using local storage:', testError.message);
            return false;
        }

        const realSlotId = getRealSlotId(slot_id);

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
    } catch (err: any) {
        console.log('[Snapshot API] Supabase unavailable, using local storage:', err.message);
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
        const detectedIdsSet = new Set<string>();
        for (const usn of present_usns) {
            const mapped = usnToUuid[usn];
            if (mapped) {
                mapped.forEach(id => detectedIdsSet.add(id));
            } else {
                detectedIdsSet.add(usn);
            }
        }
        const detectedIds = Array.from(detectedIdsSet);

        const realSlotId = getRealSlotId(slot_id);
        const sessionDate = new Date().toISOString().split('T')[0];

        // 2. Try Supabase first
        const supabaseOk = await trySupabaseWrite(slot_id, check_number, detectedIds, teacher_id);

        // 3. ALWAYS write to local file
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

        // Prepare Supabase client for writing ledger
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabase = (supabaseUrl && supabaseKey) ? createSupabaseClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false, autoRefreshToken: false }
        }) : null;

        const currentLocalLedger = readLedger();

        // Compute ledger for all students
        for (const studentId of ALL_STUDENT_IDS) {
            const detected = studentDetections[studentId];
            const detectedCount = detected.size;
            let finalStatus = 'ABSENT';
            if (detectedCount >= 4) {
                finalStatus = 'PRESENT';
            } else if (detectedCount >= 1) {
                finalStatus = 'LATE';
            }

            // Save to local ledger
            const entryIndex = currentLocalLedger.findIndex(
                entry => entry.student_id === studentId && entry.slot_id === slot_id && entry.session_date === sessionDate
            );

            const newEntry: LedgerEntry = {
                student_id: studentId,
                slot_id,
                session_date: sessionDate,
                detected_count: detectedCount,
                total_checks: 5,
                final_status: finalStatus,
                updated_at: new Date().toISOString()
            };

            if (entryIndex >= 0) {
                currentLocalLedger[entryIndex] = newEntry;
            } else {
                currentLocalLedger.push(newEntry);
            }

            // Sync with Supabase if online
            if (supabase) {
                try {
                    const { data: existingLedger } = await supabase
                        .from('attendance_session_ledger')
                        .select('*')
                        .eq('student_id', studentId)
                        .eq('slot_id', realSlotId)
                        .eq('session_date', sessionDate)
                        .maybeSingle();

                    if (existingLedger) {
                        await supabase
                            .from('attendance_session_ledger')
                            .update({
                                detected_count: detectedCount,
                                final_status: finalStatus,
                                updated_at: new Date().toISOString()
                            })
                            .eq('ledger_id', existingLedger.ledger_id);
                    } else {
                        await supabase
                            .from('attendance_session_ledger')
                            .insert({
                                student_id: studentId,
                                slot_id: realSlotId,
                                session_date: sessionDate,
                                detected_count: detectedCount,
                                total_checks: 5,
                                final_status: finalStatus
                            });
                    }
                } catch (dbErr: any) {
                    console.log(`[Snapshot API] Supabase ledger sync skipped/failed for ${studentId}:`, dbErr.message);
                }
            }
        }

        // Save local ledger array
        writeLedger(currentLocalLedger);

        // 5. Send detection alerts to notifications table
        if (supabase) {
            try {
                const teacherUidsToNotify = new Set<string>();
                if (teacher_id) {
                    teacherUidsToNotify.add(teacher_id);
                }
                
                const { data: teachers } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('role', 'teacher');
                if (teachers) {
                    for (const t of teachers) {
                        teacherUidsToNotify.add(t.id);
                    }
                }

                if (detectedIds.length > 0) {
                    const detectedNamesList = detectedIds.map(id => studentNames[id] || `Student (${id.substring(0, 8)})`);
                    const alertMessage = `Checkpoint #${check_number}: Student(s) present: ${detectedNamesList.join(', ')}.`;
                    
                    for (const tId of teacherUidsToNotify) {
                        try {
                            await supabase
                                .from('notifications')
                                .insert({
                                    user_id: tId,
                                    title: 'Face Detected 📸',
                                    message: alertMessage,
                                    type: 'attendance'
                                });
                        } catch (_) {}
                    }
                }
            } catch (notifyErr: any) {
                console.log('[Snapshot API] Skipping notifications sync:', notifyErr.message);
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
