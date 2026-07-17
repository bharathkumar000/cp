import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '../../../../utils/cors';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const studentNameMap: Record<string, string> = {
    '00000000-0000-0000-0000-000000000001': 'Bharath Kumar A (bk@vvce)',
    '00000000-0000-0000-0000-000000000002': 'Ananya Yk (ananya@vvce)',
    '00000000-0000-0000-0000-000000000003': 'Riddhi (riddhi@vvce)',
    '00000000-0000-0000-0000-000000000007': 'Rishith (rishith@vvce)',
    '00000000-0000-0000-0000-000000000008': 'Bharath P (bp@vvce)',
    '00000000-0000-0000-0000-000000000009': 'Anagha (anagha@vvce)',
};

const ALL_STUDENT_IDS = Object.keys(studentNameMap);

// Mock cumulative percentages
const mockPercentages: Record<string, number> = {
    '00000000-0000-0000-0000-000000000001': 84,
    '00000000-0000-0000-0000-000000000002': 64,
    '00000000-0000-0000-0000-000000000003': 71,
    '00000000-0000-0000-0000-000000000007': 97,
    '00000000-0000-0000-0000-000000000008': 92,
    '00000000-0000-0000-0000-000000000009': 78,
};

// Local file paths - computed lazily to prevent Turbopack from statically analyzing and bundling the dataset directory
function getLocalPaths() {
    if (process.env.VERCEL) {
        return {
            dataDir: '/tmp/Facerecognition',
            ledgerFile: '/tmp/Facerecognition/live_ledger.json',
            snapshotsFile: '/tmp/Facerecognition/live_snapshots.json',
        };
    }
    const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'Facerecognition');
    return {
        dataDir: dir,
        ledgerFile: path.join(dir, 'live_ledger.json'),
        snapshotsFile: path.join(dir, 'live_snapshots.json'),
    };
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

function readLocalLedger(): LedgerEntry[] {
    try {
        const { ledgerFile } = getLocalPaths();
        if (fs.existsSync(ledgerFile)) {
            return JSON.parse(fs.readFileSync(ledgerFile, 'utf-8'));
        }
    } catch (e) {
        console.error('Error reading local ledger:', e);
    }
    return [];
}

function countLocalSnapshots(slot_id: string): number {
    try {
        const { snapshotsFile } = getLocalPaths();
        if (fs.existsSync(snapshotsFile)) {
            const snapshots = JSON.parse(fs.readFileSync(snapshotsFile, 'utf-8'));
            const sessionDate = new Date().toISOString().split('T')[0];
            return snapshots.filter((s: any) => 
                s.slot_id === slot_id && s.captured_at?.startsWith(sessionDate)
            ).length;
        }
    } catch (e) {
        console.error('Error reading local snapshots:', e);
    }
    return 0;
}

export const GET = withCors(async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const slot_id = searchParams.get('slot_id');

        if (!slot_id) {
            return NextResponse.json({ message: 'Missing slot_id' }, { status: 400 });
        }

        const sessionDate = new Date().toISOString().split('T')[0];

        // Try to read from local ledger first (always up-to-date from snapshot writes)
        const localLedger = readLocalLedger();
        const todayLedger = localLedger.filter(
            (entry: LedgerEntry) => entry.slot_id === slot_id && entry.session_date === sessionDate
        );

        // Build roster from local data or defaults
        const ledgerMap: Record<string, LedgerEntry> = {};
        for (const entry of todayLedger) {
            ledgerMap[entry.student_id] = entry;
        }

        const roster = ALL_STUDENT_IDS.map(studentId => {
            const ledger = ledgerMap[studentId];
            return {
                student_id: studentId,
                full_name: studentNameMap[studentId] || `Student (${studentId.substring(0, 8)})`,
                ledger_id: null,
                final_status: ledger?.final_status || 'ABSENT',
                detected_count: ledger?.detected_count ?? 0,
                total_checks: ledger?.total_checks ?? 5,
                is_finalised: false,
                absence_reason: null,
                reason_status: 'PENDING',
                cumulative_percentage: mockPercentages[studentId] || 75
            };
        });

        // Sort: PRESENT first, LATE second, ABSENT last
        roster.sort((a, b) => {
            const priority: Record<string, number> = { 'PRESENT': 3, 'LATE': 2, 'ABSENT': 1 };
            return (priority[b.final_status] || 0) - (priority[a.final_status] || 0);
        });

        console.log(`[List API] Slot: ${slot_id} | Snapshots: ${countLocalSnapshots(slot_id)} | Students: ${roster.length}`);

        return NextResponse.json(roster, { status: 200 });

    } catch (err: any) {
        console.error('List API execution failed:', err);
        return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
    }
});
