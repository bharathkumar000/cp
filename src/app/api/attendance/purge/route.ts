import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '../../../../utils/cors';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_DATA_DIR = path.join(process.cwd(), 'Facerecognition');
const SNAPSHOTS_FILE = path.join(LOCAL_DATA_DIR, 'live_snapshots.json');
const LEDGER_FILE = path.join(LOCAL_DATA_DIR, 'live_ledger.json');

export const POST = withCors(async (request: NextRequest) => {
    try {
        // Delete local snapshot and ledger files
        if (fs.existsSync(SNAPSHOTS_FILE)) {
            fs.unlinkSync(SNAPSHOTS_FILE);
        }
        if (fs.existsSync(LEDGER_FILE)) {
            fs.unlinkSync(LEDGER_FILE);
        }

        console.log('[Purge API] Local snapshot and ledger files cleared.');

        return NextResponse.json({ message: 'Attendance data purged successfully' }, { status: 200 });
    } catch (err: any) {
        console.error('Purge API execution failed:', err);
        return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
    }
});
