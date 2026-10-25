-- =========================================================================
-- FIX: Allow anon role to INSERT into attendance tables
-- This enables the face recognition system to write attendance data
-- without needing a SUPABASE_SERVICE_ROLE_KEY
-- =========================================================================

-- 1. Allow anon INSERT on attendance_snapshots
DROP POLICY IF EXISTS anon_insert_snapshots ON public.attendance_snapshots;
CREATE POLICY anon_insert_snapshots ON public.attendance_snapshots
    FOR INSERT TO anon WITH CHECK (true);

-- 2. Allow anon SELECT on attendance_snapshots
DROP POLICY IF EXISTS anon_select_snapshots ON public.attendance_snapshots;
CREATE POLICY anon_select_snapshots ON public.attendance_snapshots
    FOR SELECT TO anon USING (true);

-- 3. Allow anon INSERT on attendance_session_ledger
DROP POLICY IF EXISTS anon_insert_ledger ON public.attendance_session_ledger;
CREATE POLICY anon_insert_ledger ON public.attendance_session_ledger
    FOR INSERT TO anon WITH CHECK (true);

-- 4. Allow anon UPDATE on attendance_session_ledger
DROP POLICY IF EXISTS anon_update_ledger ON public.attendance_session_ledger;
CREATE POLICY anon_update_ledger ON public.attendance_session_ledger
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 5. Allow anon SELECT on attendance_session_ledger
DROP POLICY IF EXISTS anon_select_ledger ON public.attendance_session_ledger;
CREATE POLICY anon_select_ledger ON public.attendance_session_ledger
    FOR SELECT TO anon USING (true);

-- 6. Allow anon SELECT on profiles (needed by snapshot API to fetch student list)
DROP POLICY IF EXISTS anon_select_profiles ON public.profiles;
CREATE POLICY anon_select_profiles ON public.profiles
    FOR SELECT TO anon USING (true);

-- 7. Allow anon INSERT on notifications (for detection alerts)
DROP POLICY IF EXISTS anon_insert_notifications ON public.notifications;
CREATE POLICY anon_insert_notifications ON public.notifications
    FOR INSERT TO anon WITH CHECK (true);

-- 8. Allow anon DELETE on attendance tables (for purging before new session)
DROP POLICY IF EXISTS anon_delete_snapshots ON public.attendance_snapshots;
CREATE POLICY anon_delete_snapshots ON public.attendance_snapshots
    FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS anon_delete_ledger ON public.attendance_session_ledger;
CREATE POLICY anon_delete_ledger ON public.attendance_session_ledger
    FOR DELETE TO anon USING (true);
