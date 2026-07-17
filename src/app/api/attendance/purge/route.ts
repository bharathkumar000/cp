import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '../../../../utils/cors';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Local file paths - computed lazily to prevent Turbopack from statically analyzing and bundling the dataset directory
function getLocalPaths() {
    if (process.env.VERCEL) {
        return {
            dataDir: '/tmp/Facerecognition',
            snapshotsFile: '/tmp/Facerecognition/live_snapshots.json',
            ledgerFile: '/tmp/Facerecognition/live_ledger.json',
        };
    }
    const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'Facerecognition');
    return {
        dataDir: dir,
        snapshotsFile: path.join(dir, 'live_snapshots.json'),
        ledgerFile: path.join(dir, 'live_ledger.json'),
    };
}

export const POST = withCors(async (request: NextRequest) => {
    try {
        const { snapshotsFile, ledgerFile } = getLocalPaths();
        // Delete local snapshot and ledger files
        if (fs.existsSync(snapshotsFile)) {
            fs.unlinkSync(snapshotsFile);
        }
        if (fs.existsSync(ledgerFile)) {
            fs.unlinkSync(ledgerFile);
        }

        console.log('[Purge API] Local snapshot and ledger files cleared.');

        return NextResponse.json({ message: 'Attendance data purged successfully' }, { status: 200 });
    } catch (err: any) {
        console.error('Purge API execution failed:', err);
        return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
    }
});
