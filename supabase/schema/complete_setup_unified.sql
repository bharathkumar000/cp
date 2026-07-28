-- =========================================================================
-- CONNECT & PREP - MASTER UNIFIED DATABASE SETUP SCRIPT
-- =========================================================================
-- This script sets up the complete database schema for Connect & Prep in 
-- a single file. Paste this script into the Supabase SQL Editor.
-- =========================================================================

-- -------------------------------------------------------------------------
-- PHASE 1: ENABLE EXTENSIONS
-- -------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- PHASE 2: CREATE BASE TABLES (Foreign key dependency ordered)
-- -------------------------------------------------------------------------

-- 2.1 Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'parent')),
    college TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure correct constraints if table already exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'teacher', 'admin', 'parent'));

-- 2.2 Clubs Directory
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo TEXT NOT NULL, -- Icon or graphic symbol identifier
    batch_year TEXT NOT NULL DEFAULT '2025-2026',
    department TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('technical', 'cultural', 'sports')),
    description TEXT NOT NULL,
    avg_attendance_rate INTEGER NOT NULL DEFAULT 85,
    event_frequency INTEGER NOT NULL DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.3 Campus Events (Linked to Clubs)
CREATE TABLE IF NOT EXISTS public.campus_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL, -- Format: DD/MM/YYYY
    time TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('live', 'upcoming', 'completed')),
    venue TEXT NOT NULL,
    attendance_rate INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.4 Notes Table (Study Materials metadata)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    college TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5 Feedback Table (Standard Authenticated Feedback)
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.6 Study Groups
CREATE TABLE IF NOT EXISTS public.study_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.7 Group Members (Many-to-Many connection for study groups)
CREATE TABLE IF NOT EXISTS public.group_members (
    group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, user_id)
);

-- 2.8 Chat Messages (Study group discussion channels)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.9 Cryptographically Decoupled Anonymous Feedback
CREATE TABLE IF NOT EXISTS public.anonymous_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    daily_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.10 Manual Attendance Records
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course TEXT NOT NULL,
    date TEXT NOT NULL, -- Format: DD-MM-YYYY
    day TEXT NOT NULL,
    present INTEGER NOT NULL DEFAULT 1,
    total INTEGER NOT NULL DEFAULT 1,
    doc TEXT,
    doc_status TEXT DEFAULT '',
    sem TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.11 Parent-Student Relations
CREATE TABLE IF NOT EXISTS public.parent_student (
    parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_id, student_id)
);

-- 2.12 Timetables
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    room TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.13 Exam Schedules
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'Exam', 'Internal'
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.14 Quizzes & Class Tests
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    score TEXT NOT NULL,
    total TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.15 Notice Board
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
    target_role TEXT NOT NULL DEFAULT 'all', -- 'parent', 'student', 'all'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.16 Classroom Booking
CREATE TABLE IF NOT EXISTS public.classroom_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id TEXT NOT NULL,
    date TEXT NOT NULL, -- Format: YYYY-MM-DD
    time_slot TEXT NOT NULL,
    teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    teacher_name TEXT NOT NULL,
    course TEXT NOT NULL,
    branch TEXT NOT NULL,
    sem TEXT NOT NULL,
    section TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (room_id, date, time_slot)
);

-- 2.17 Wallet Balances
CREATE TABLE IF NOT EXISTS public.wallet (
    student_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.18 Wallet Transactions
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.19 Library Books Inventory
CREATE TABLE IF NOT EXISTS public.library_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.20 Library Borrowing Ledger
CREATE TABLE IF NOT EXISTS public.library_borrowing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
    borrow_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    return_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned', 'overdue'))
);

-- 2.21 Campus Location Tracking Data (Simulation)
CREATE TABLE IF NOT EXISTS public.tracking_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------
-- PHASE 3: PERFORMANCE INDEXING
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_messages_group_date ON public.messages (group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_daily_hash_date ON public.anonymous_feedback (daily_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_attendance_student_sem ON public.attendance (student_id, sem);
CREATE INDEX IF NOT EXISTS idx_events_club_status ON public.campus_events (club_id, status);
CREATE INDEX IF NOT EXISTS idx_clubs_type ON public.clubs (type);

-- -------------------------------------------------------------------------
-- PHASE 4: HELPER FUNCTIONS & TRIGGERS
-- -------------------------------------------------------------------------

-- 4.1 Check Admin Status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
        AND auth.uid() IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

-- 4.2 Check Teacher Status
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'teacher'
        AND auth.uid() IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

-- 4.3 Automatically Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, college)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', new.raw_app_meta_data->>'role', 'student'),
    split_part(new.email, '@', 2)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4.4 Restrict Signups to Approved Domains
CREATE OR REPLACE FUNCTION public.check_oauth_domain()
RETURNS TRIGGER AS $$
DECLARE
    user_email text;
    domain_part text;
BEGIN
    user_email := NEW.email;
    domain_part := split_part(user_email, '@', 2);
    
    IF user_email IS NOT NULL AND NOT (domain_part = 'college.edu' OR domain_part = 'vvce') THEN
        RAISE EXCEPTION 'Access denied. Account email must end with @college.edu or @vvce.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS restrict_domain_trigger ON auth.users;
CREATE TRIGGER restrict_domain_trigger
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.check_oauth_domain();

-- 4.5 Chat Message Rate Limiter (Max 1 message per 2 seconds)
CREATE OR REPLACE FUNCTION public.check_message_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.messages
        WHERE sender_id = NEW.sender_id
        AND created_at >= now() - INTERVAL '2 seconds'
    ) THEN
        RAISE EXCEPTION 'Rate limit exceeded: Please wait 2 seconds before sending another message.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_message_rate_limit ON public.messages;
CREATE TRIGGER trigger_message_rate_limit
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.check_message_rate_limit();

-- 4.6 Message Content Sanitizer (Strips HTML tags)
CREATE OR REPLACE FUNCTION public.sanitize_message_content()
RETURNS TRIGGER AS $$
BEGIN
    NEW.content := regexp_replace(NEW.content, '<[^>]*>', '', 'g');
    NEW.content := substring(NEW.content from 1 for 1000);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_sanitize_message ON public.messages;
CREATE TRIGGER trigger_sanitize_message
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.sanitize_message_content();

-- 4.7 Parent-Student Access Checker Helper
CREATE OR REPLACE FUNCTION public.parent_has_access_to_student(p_id UUID, s_id UUID)
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.parent_student
        WHERE parent_id = p_id AND student_id = s_id
    );
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------------------------
-- PHASE 5: ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- -------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_borrowing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_data ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------
-- PHASE 6: DEFINE ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------

-- 6.1 Profiles Policies
CREATE POLICY select_own_profile ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = id);
CREATE POLICY update_own_profile ON public.profiles FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = id) WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);
CREATE POLICY admin_select_all_profiles ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY admin_update_all_profiles ON public.profiles FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6.2 Clubs & Events Policies
CREATE POLICY select_public_clubs ON public.clubs FOR SELECT TO authenticated USING (true);
CREATE POLICY select_public_events ON public.campus_events FOR SELECT TO authenticated USING (true);
CREATE POLICY manage_clubs_admin ON public.clubs FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY manage_events_admin ON public.campus_events FOR ALL TO authenticated USING (public.is_admin() OR public.is_teacher());

-- 6.3 Study Notes Policies
CREATE POLICY insert_own_note ON public.notes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());
CREATE POLICY select_college_notes ON public.notes FOR SELECT USING (auth.uid() IS NOT NULL AND college = (SELECT college FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY delete_own_note ON public.notes FOR DELETE USING (auth.uid() IS NOT NULL AND author_id = auth.uid());
CREATE POLICY admin_manage_all_notes ON public.notes FOR ALL USING (public.is_admin());

-- 6.4 Feedback Policies
CREATE POLICY insert_authenticated_feedback ON public.feedback FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY admin_select_feedback ON public.feedback FOR SELECT USING (public.is_admin());

-- 6.5 Study Groups & Members Policies
CREATE POLICY select_member_groups ON public.study_groups FOR SELECT USING (auth.uid() IS NOT NULL AND (creator_id = auth.uid() OR EXISTS (SELECT 1 FROM public.group_members WHERE group_id = id AND user_id = auth.uid())));
CREATE POLICY modify_own_group ON public.study_groups FOR UPDATE USING (auth.uid() IS NOT NULL AND creator_id = auth.uid()) WITH CHECK (auth.uid() IS NOT NULL AND creator_id = auth.uid());
CREATE POLICY delete_own_group ON public.study_groups FOR DELETE USING (auth.uid() IS NOT NULL AND creator_id = auth.uid());
CREATE POLICY admin_manage_all_groups ON public.study_groups FOR ALL USING (public.is_admin());

CREATE POLICY select_visible_members ON public.group_members FOR SELECT USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.group_members AS self WHERE self.group_id = group_id AND self.user_id = auth.uid()));
CREATE POLICY join_group ON public.group_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY leave_group ON public.group_members FOR DELETE USING (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY admin_manage_all_members ON public.group_members FOR ALL USING (public.is_admin());

-- 6.6 Chat Messages Policies
CREATE POLICY select_group_messages ON public.messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = messages.group_id AND user_id = auth.uid()));
CREATE POLICY insert_group_messages ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL AND sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.group_members WHERE group_id = messages.group_id AND user_id = auth.uid()));

-- 6.7 Anonymous Feedback Policies
CREATE POLICY insert_anonymous_feedback ON public.anonymous_feedback FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY select_admin_feedback ON public.anonymous_feedback FOR SELECT TO authenticated USING (public.is_admin());

-- 6.8 Attendance Policies
CREATE POLICY select_attendance_student ON public.attendance FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.is_teacher() OR public.is_admin());
CREATE POLICY insert_attendance_teacher ON public.attendance FOR INSERT TO authenticated WITH CHECK (public.is_teacher() OR public.is_admin());
CREATE POLICY update_attendance_allowed ON public.attendance FOR UPDATE TO authenticated USING (auth.uid() = student_id OR public.is_teacher() OR public.is_admin()) WITH CHECK (auth.uid() = student_id OR public.is_teacher() OR public.is_admin());
CREATE POLICY delete_attendance_teacher ON public.attendance FOR DELETE TO authenticated USING (public.is_teacher() OR public.is_admin());

-- 6.9 Parent-Student Policies
CREATE POLICY select_parent_student ON public.parent_student FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = student_id);

-- 6.10 Timetable, Exams & Quizzes Policies
CREATE POLICY select_timetable ON public.timetables FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.parent_has_access_to_student(auth.uid(), student_id) OR public.is_teacher());
CREATE POLICY insert_timetable_teacher ON public.timetables FOR INSERT WITH CHECK (public.is_teacher() OR public.is_admin());
CREATE POLICY update_timetable_teacher ON public.timetables FOR UPDATE USING (public.is_teacher() OR public.is_admin());
CREATE POLICY delete_timetable_teacher ON public.timetables FOR DELETE USING (public.is_teacher() OR public.is_admin());

CREATE POLICY select_exams ON public.exams FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.parent_has_access_to_student(auth.uid(), student_id) OR public.is_teacher());
CREATE POLICY insert_exams_teacher ON public.exams FOR INSERT WITH CHECK (public.is_teacher() OR public.is_admin());
CREATE POLICY update_exams_teacher ON public.exams FOR UPDATE USING (public.is_teacher() OR public.is_admin());
CREATE POLICY delete_exams_teacher ON public.exams FOR DELETE USING (public.is_teacher() OR public.is_admin());

CREATE POLICY select_quizzes ON public.quizzes FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.parent_has_access_to_student(auth.uid(), student_id) OR public.is_teacher());
CREATE POLICY insert_quizzes_teacher ON public.quizzes FOR INSERT WITH CHECK (public.is_teacher() OR public.is_admin());
CREATE POLICY update_quizzes_teacher ON public.quizzes FOR UPDATE USING (public.is_teacher() OR public.is_admin());
CREATE POLICY delete_quizzes_teacher ON public.quizzes FOR DELETE USING (public.is_teacher() OR public.is_admin());

-- 6.11 Notice Board & Bookings Policies
CREATE POLICY select_notices ON public.notices FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_notices_teacher ON public.notices FOR INSERT WITH CHECK (public.is_teacher() OR public.is_admin());
CREATE POLICY update_notices_teacher ON public.notices FOR UPDATE USING (public.is_teacher() OR public.is_admin());
CREATE POLICY delete_notices_teacher ON public.notices FOR DELETE USING (public.is_teacher() OR public.is_admin());

CREATE POLICY select_classroom_bookings ON public.classroom_bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_classroom_bookings ON public.classroom_bookings FOR INSERT TO authenticated WITH CHECK (public.is_teacher() OR public.is_admin());
CREATE POLICY delete_classroom_bookings ON public.classroom_bookings FOR DELETE TO authenticated USING (auth.uid() = teacher_id OR public.is_admin());

-- 6.12 Wallet & Library Demo Policies (Open permissions to keep charts loading easily)
CREATE POLICY wallet_access ON public.wallet FOR ALL TO authenticated USING (true);
CREATE POLICY wallet_tx_access ON public.wallet_transactions FOR ALL TO authenticated USING (true);
CREATE POLICY library_books_access ON public.library_books FOR ALL TO authenticated USING (true);
CREATE POLICY library_borrowing_access ON public.library_borrowing FOR ALL TO authenticated USING (true);
CREATE POLICY tracking_data_access ON public.tracking_data FOR ALL TO authenticated USING (true);

-- -------------------------------------------------------------------------
-- PHASE 7: STORAGE BUCKETS CONFIGURATION & STORAGE POLICIES
-- -------------------------------------------------------------------------

-- 7.1 Setup buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('study-materials', 'study-materials', false)
ON CONFLICT (id) DO NOTHING;

-- 7.2 Storage RLS Rules
DROP POLICY IF EXISTS "Public read for profile pictures" ON storage.objects;
CREATE POLICY "Public read for profile pictures" ON storage.objects FOR SELECT USING (bucket_id = 'public-assets');

DROP POLICY IF EXISTS "Authenticated upload of profile pictures" ON storage.objects;
CREATE POLICY "Authenticated upload of profile pictures" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'public-assets' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Upload only to user folder" ON storage.objects;
CREATE POLICY "Upload only to user folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'study-materials' AND auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Download from same college or teacher bypass" ON storage.objects;
CREATE POLICY "Download from same college or teacher bypass" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'study-materials' AND auth.uid() IS NOT NULL AND (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher') OR (SELECT college FROM public.profiles WHERE id = auth.uid()) = (SELECT college FROM public.profiles WHERE id = (storage.foldername(name))[1]::uuid)));

DROP POLICY IF EXISTS "Delete own study materials" ON storage.objects;
CREATE POLICY "Delete own study materials" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'study-materials' AND auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text);

-- -------------------------------------------------------------------------
-- PHASE 8: ENABLE REALTIME CHANNELS REPLICATION
-- -------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
    
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.classroom_bookings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_transactions;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tracking_data;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
    WHEN OTHERS THEN
        NULL;
END $$;

-- -------------------------------------------------------------------------
-- PHASE 9: INSTANT MOCK USERS SEED
-- -------------------------------------------------------------------------

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, confirmation_token)
VALUES 
-- bk@vvce (Student - bk)
('00000000-0000-0000-0000-000000000001', 'bk@vvce', '$2a$10$YeKwh0RXYyQ44KbWfOw4R.eRMX/kpopbaBz20YzxcgxaUBO7cng3W', now(), 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"bharath kumar a","role":"student"}', now(), now(), 'authenticated', ''),
-- ananya@vvce (Student - ananya)
('00000000-0000-0000-0000-000000000002', 'ananya@vvce', '$2a$10$Y4w6QA7w8.0HXxQGPY0i3OLrI6.14Ojw0D3wFUUzzx.d/ZLQD3g2u', now(), 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"ananya yk","role":"student"}', now(), now(), 'authenticated', ''),
-- riddhi@vvce (Student - riddhi)
('00000000-0000-0000-0000-000000000003', 'riddhi@vvce', '$2a$10$wx44a16VcC1QgvCvP.uwLemHBbWS4mi7rYI7bd0goJoqSWIxFq9Aa', now(), 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"riddhi","role":"student"}', now(), now(), 'authenticated', ''),
-- bhav@vvce (Maths Teacher - bhav)
('00000000-0000-0000-0000-000000000004', 'bhav@vvce', '$2a$10$lzLKX1OS/lBqqqGkjd9kEut/Ye7BFbHUldo91bj60BMBofZWHVDDq', now(), 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"bhavana","role":"teacher"}', now(), now(), 'authenticated', ''),
-- abhi@vvce (Parent - abhi)
('00000000-0000-0000-0000-000000000005', 'abhi@vvce', '$2a$10$EEIBm91s0h5pPZAjwabjpOhdJLyLezF6LDASyIMV/ex6shNMiIjR2', now(), 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"abhi","role":"parent"}', now(), now(), 'authenticated', ''),
-- preksha@vvce (Parent - preksha)
('00000000-0000-0000-0000-000000000006', 'preksha@vvce', '$2a$10$f8JIR6MBG71C5hVTYcsG0uTyPsWCZN0r.u5m2rdxCkI1T/aB2SN2q', now(), 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"preksha","role":"parent"}', now(), now(), 'authenticated', ''),
-- rishith@vvce (Student - rishith)
('00000000-0000-0000-0000-000000000007', 'rishith@vvce', '$2a$10$wx44a16VcC1QgvCvP.uwLemHBbWS4mi7rYI7bd0goJoqSWIxFq9Aa', now(), 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"rishith","role":"student"}', now(), now(), 'authenticated', ''),
-- bp@vvce (Student - bp)
('00000000-0000-0000-0000-000000000008', 'bp@vvce', crypt('bp', gen_salt('bf')), now(), 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"bharath p","role":"student"}', now(), now(), 'authenticated', ''),
-- anagha@vvce (Student - anagha)
('00000000-0000-0000-0000-000000000009', 'anagha@vvce', crypt('anagha', gen_salt('bf')), now(), 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"anagha","role":"student"}', now(), now(), 'authenticated', '')
ON CONFLICT (id) DO NOTHING;

-- Force profile updates
UPDATE public.profiles SET role = 'student' WHERE id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000009');
UPDATE public.profiles SET role = 'teacher' WHERE id = '00000000-0000-0000-0000-000000000004';
UPDATE public.profiles SET role = 'parent' WHERE id IN ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006');

-- Link parent-student relations
INSERT INTO public.parent_student (parent_id, student_id)
VALUES 
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002'), -- abhi -> ananya
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002')  -- preksha -> ananya
ON CONFLICT DO NOTHING;

-- Seed Clubs
INSERT INTO public.clubs (id, name, logo, batch_year, department, type, description, avg_attendance_rate, event_frequency)
VALUES
('11111111-1111-1111-1111-111111111111', 'Innovators & Visionaries Club (IVC)', 'Cpu', '2025-2026', 'Strictly Technical Execution & Innovation', 'technical', 'Driving cutting-edge breakthroughs in IoT, aerospace tech, hardware automation, and deep embedded systems.', 94, 5),
('22222222-2222-2222-2222-222222222222', 'Binary Beasts coding Club', 'Code2', '2025-2026', 'Advanced Competitive Programming & Algorithmic Excellence', 'technical', 'Empowering developers with web3 architectures, data structure execution, and top-tier algorithmic training.', 89, 6),
('33333333-3333-3333-3333-333333333333', 'Zenith Cultural Crew', 'Music', '2025-2026', 'Creative & Performing Arts Synchronization', 'cultural', 'Integrating cultural rhythm and theatrical expression across regional, national, and international stages.', 97, 4),
('44444444-4444-4444-4444-444444444444', 'Strikers Football Club', 'Trophy', '2025-2026', 'Institutional Athletics & Varsity Sports', 'sports', 'Cultivating relentless athletic discipline, strategy, and tournament-winning football coordination.', 91, 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Campus Events
INSERT INTO public.campus_events (id, club_id, title, description, date, time, status, venue, attendance_rate)
VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'IoT & Edge Computing Hackathon', 'A 36-hour physical build marathon crafting edge solutions.', '30/05/2026', '09:00 AM', 'live', 'Embedded Labs A & B', NULL),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Drone Dynamics Workshop', 'Practical autonomous flight path scheduling using AI algorithms.', '04/06/2026', '11:00 AM', 'upcoming', 'Open Grounds / Seminar Hall 2', NULL),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'RFID Access Systems Panel', 'Analysis of hardware-level RFID tap validation systems.', '15/05/2026', '02:00 PM', 'completed', 'Auditorium 1', 94),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Introduction to Web3', 'Exploring Ethereum Virtual Machine and decentralized web client sync.', '29/05/2026', '03:00 PM', 'live', 'Computer Center 3', NULL),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Algorithmic CodeQuest 2026', 'High-speed data structures and dynamic programming competition.', '10/06/2026', '10:00 AM', 'upcoming', 'Coding Labs A & B', NULL),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Symphony of Lights Prep', 'Auditions and practices for the upcoming Annual Cultural Fest.', '02/06/2026', '04:30 PM', 'upcoming', 'Open Air Theatre', NULL),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Street Play Marathon', 'A dramatic presentation focusing on social engineering issues.', '12/05/2026', '01:30 PM', 'completed', 'Quadrangle Dome', 97),
(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'Inter-Department Football Selections', 'Physical selection trials for the upcoming VTU state tournament.', '29/05/2026', '07:00 AM', 'live', 'Sports Arena Field 1', NULL),
(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'Athletic Endurance Training', 'Synchronized strength & sprint marathon for varsity recruits.', '05/06/2026', '06:00 AM', 'upcoming', 'Campus Running Track', NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Attendance
INSERT INTO public.attendance (student_id, course, date, day, present, total, sem)
VALUES 
('00000000-0000-0000-0000-000000000002', '1BMATE201 - Applied Mathematics - II for EE Stream', '20-05-2026', 'Wednesday', 1, 1, '2 - Semester'),
('00000000-0000-0000-0000-000000000002', '1BMATE201 - Applied Mathematics - II for EE Stream', '21-05-2026', 'Thursday', 1, 1, '2 - Semester'),
('00000000-0000-0000-0000-000000000002', '1BMATE201 - Applied Mathematics - II for EE Stream', '22-05-2026', 'Friday', 0, 1, '2 - Semester'),
('00000000-0000-0000-0000-000000000008', '1BMATE201 - Applied Mathematics - II for EE Stream', '20-05-2026', 'Wednesday', 1, 1, '2 - Semester'),
('00000000-0000-0000-0000-000000000008', '1BMATE201 - Applied Mathematics - II for EE Stream', '21-05-2026', 'Thursday', 1, 1, '2 - Semester'),
('00000000-0000-0000-0000-000000000008', '1BMATE201 - Applied Mathematics - II for EE Stream', '22-05-2026', 'Friday', 0, 1, '2 - Semester')
ON CONFLICT DO NOTHING;

-- Seed Timetables
INSERT INTO public.timetables (student_id, subject, day, time, room)
VALUES
('00000000-0000-0000-0000-000000000002', '1BMATE201 - Applied Mathematics - II', 'Monday', '09:00 AM - 10:00 AM', 'L-301'),
('00000000-0000-0000-0000-000000000002', '1BPLCO203 - Introduction to C Programming', 'Monday', '10:15 AM - 11:15 AM', 'CS-Lab'),
('00000000-0000-0000-0000-000000000002', '1BPHYT202 - Applied Physics', 'Tuesday', '11:30 AM - 12:30 PM', 'Physics-Lab'),
('00000000-0000-0000-0000-000000000008', '1BMATE201 - Applied Mathematics - II', 'Monday', '09:00 AM - 10:00 AM', 'L-301'),
('00000000-0000-0000-0000-000000000008', '1BPLCO203 - Introduction to C Programming', 'Monday', '10:15 AM - 11:15 AM', 'CS-Lab'),
('00000000-0000-0000-0000-000000000008', '1BPHYT202 - Applied Physics', 'Tuesday', '11:30 AM - 12:30 PM', 'Physics-Lab')
ON CONFLICT DO NOTHING;

-- Seed Exams
INSERT INTO public.exams (student_id, subject, type, date, time)
VALUES
('00000000-0000-0000-0000-000000000002', '1BMATE201 - Applied Mathematics - II', 'Internals 1', '15-06-2026', '10:00 AM'),
('00000000-0000-0000-0000-000000000002', '1BPLCO203 - Introduction to C Programming', 'Final Exam', '22-06-2026', '02:00 PM'),
('00000000-0000-0000-0000-000000000008', '1BMATE201 - Applied Mathematics - II', 'Internals 1', '15-06-2026', '10:00 AM'),
('00000000-0000-0000-0000-000000000008', '1BPLCO203 - Introduction to C Programming', 'Final Exam', '22-06-2026', '02:00 PM')
ON CONFLICT DO NOTHING;

-- Seed Quizzes
INSERT INTO public.quizzes (student_id, subject, title, score, total, date)
VALUES
('00000000-0000-0000-0000-000000000002', '1BMATE201 - Applied Mathematics - II', 'Unit Test 1', '8', '10', '12-05-2026'),
('00000000-0000-0000-0000-000000000002', '1BPLCO203 - Introduction to C Programming', 'Quiz 1', '9', '10', '19-05-2026'),
('00000000-0000-0000-0000-000000000008', '1BMATE201 - Applied Mathematics - II', 'Unit Test 1', '8', '10', '12-05-2026'),
('00000000-0000-0000-0000-000000000008', '1BPLCO203 - Introduction to C Programming', 'Quiz 1', '9', '10', '19-05-2026')
ON CONFLICT DO NOTHING;

-- Seed Notices
INSERT INTO public.notices (title, message, date, target_role)
VALUES
('Internals Notice', 'Semester 2 first internal assessment will commence from 15th June 2026. Attendance is mandatory.', '24-05-2026', 'all'),
('Parent Teacher Association Meeting', 'PTA meeting scheduled for 30th May 2026 at 10 AM in the main auditorium.', '24-05-2026', 'parent')
ON CONFLICT DO NOTHING;
