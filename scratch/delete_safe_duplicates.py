import os

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"

# Files to delete safely
files_to_delete = [
    # Group 1: Root favicon (kept in public/favicon.png, src/app/favicon.png, mobile_app/assets)
    os.path.join(root_dir, "favicon.png"),
    
    # Group 17: assets mockup (kept in public/mockup.png)
    os.path.join(root_dir, "assets/mockup.png"),
    
    # Fusion-X duplicate documents
    os.path.join(root_dir, "Fusion-X/stakeholder_security_brief.txt"),
    os.path.join(root_dir, "Fusion-X/system_architecture.md"),
    os.path.join(root_dir, "Fusion-X/user_flow_architecture.md"),
    os.path.join(root_dir, "Fusion-X/cyber.md"),
    
    # Fusion-X duplicate SQL scripts
    os.path.join(root_dir, "Fusion-X/supabase_attendance_setup.sql"),
    os.path.join(root_dir, "Fusion-X/supabase_clubs_setup.sql"),
    os.path.join(root_dir, "Fusion-X/supabase_notifications_setup.sql"),
    os.path.join(root_dir, "Fusion-X/supabase_attendance_documents.sql"),
    os.path.join(root_dir, "Fusion-X/supabase_auth_hardening.sql"),
    os.path.join(root_dir, "Fusion-X/supabase_anonymous_feedback.sql"),
    os.path.join(root_dir, "Fusion-X/supabase_realtime_chat.sql"),
    os.path.join(root_dir, "Fusion-X/supabase_rls_policies.sql"),
    os.path.join(root_dir, "Fusion-X/supabase_complete_setup.sql"),
    
    # Fusion-X duplicate scripts
    os.path.join(root_dir, "Fusion-X/git_auto_push.py"),
]

deleted_files = []
failed_files = []

for file_path in files_to_delete:
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            deleted_files.append(os.path.relpath(file_path, root_dir))
        except Exception as e:
            failed_files.append((os.path.relpath(file_path, root_dir), str(e)))

print(f"Successfully deleted {len(deleted_files)} files:")
for f in deleted_files:
    print(f"  - {f}")

if failed_files:
    print(f"\nFailed to delete {len(failed_files)} files:")
    for f, err in failed_files:
        print(f"  - {f} (Error: {err})")
