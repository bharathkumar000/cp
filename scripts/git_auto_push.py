#!/usr/bin/env python3
import os
import subprocess
import sys
import datetime

# Predefined commit messages for key files
COMMIT_MESSAGES = {
    'next-env.d.ts': 'chore: update Next.js typescript environments and compiler references',
    'src/app/dashboard/layout.js': 'feat: implement macro-level System Control Tower navigation rules',
    'src/components/features/Attendance.jsx': 'feat: re-engineer AI Footfall & Proxy-Risk Audit gateway views',
    'src/components/features/ComplaintBox.jsx': 'feat: restructure Escalation Desk incident logs and resolution actions',
    'src/components/features/DashboardHome.jsx': 'feat: configure System Control Tower grid layouts and widgets',
    'src/components/features/Notifications.jsx': 'refactor: connect Supabase real-time notifications for client synchronization',
    'src/components/features/ParentDashboard.jsx': 'feat: optimize child performance tracking and financial dashboard panels',
    'src/components/features/ProjectHub.jsx': 'feat: transform Project Hub into Tech & Innovation Registry portal',
    'src/context/AuthContext.jsx': 'refactor: enforce input string trimming and role role segregation',
    'src/context/SupabaseAuthContext.tsx': 'refactor: configure secure Supabase authentication provider bindings',
    'src/hooks/useRealtimeMessages.ts': 'feat: implement real-time peer-to-peer message synchronization hooks',
    'src/services/api.js': 'refactor: introduce offline fallback bypass for auth lifecycle endpoints',
    'src/services/mockBackend.js': 'feat: enrich mock database with realistic campus operational metrics',
    'src/utils/notifications.js': 'refactor: optimize native push notification service workers',
    'src/utils/supabase/client.ts': 'feat: implement NEXT_PUBLIC_USE_MOCK_SUPABASE bypass in client',
    'src/utils/supabase/server.ts': 'feat: resolve server-side duplicate return scopes and auth bypasses',
    'mobile_app/lib/config/app_theme.dart': 'refactor: refine app color palette and dark theme definitions',
    'mobile_app/lib/screens/login_screen.dart': 'feat: implement premium login screen with background animation',
    'mobile_app/pubspec.yaml': 'chore: update Flutter dependencies and SDK version bounds',
    'package.json': 'chore: update project dependencies and workspace scripts',
}

def get_git_status_actions():
    """Detects modified, added, deleted, or untracked files and returns a list of (filepath, is_deletion)."""
    try:
        unstaged_out = subprocess.check_output(['git', 'status', '--porcelain']).decode('utf-8')
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Failed to run git status: {e}")
        sys.exit(1)
        
    actions = []
    for line in unstaged_out.strip().split('\n'):
        if not line.strip():
            continue
        status = line[:2]
        path = line[2:].strip()
        # Clean quotes if present
        if path.startswith('"') and path.endswith('"'):
            path = path[1:-1]
        
        is_deletion = 'D' in status
        
        # If it's a directory (untracked directory), list all files recursively
        if not is_deletion and os.path.isdir(path):
            for root, _, filenames in os.walk(path):
                for filename in filenames:
                    filepath = os.path.join(root, filename)
                    actions.append((filepath, False))
        else:
            actions.append((path, is_deletion))
            
    # De-duplicate actions based on filepath
    seen = set()
    unique_actions = []
    for path, is_del in actions:
        # Standardize path separators
        norm_path = path.replace('\\', '/')
        if norm_path not in seen:
            seen.add(norm_path)
            unique_actions.append((path, is_del))
            
    return sorted(unique_actions, key=lambda x: x[0])

def get_commit_message(filepath, is_deletion):
    """Retrieves or generates a commit message for a file."""
    basename = os.path.basename(filepath)
    if is_deletion:
        return f"refactor: remove deprecated {basename}"
        
    normalized_path = filepath.replace('\\', '/')
    for key, msg in COMMIT_MESSAGES.items():
        if normalized_path.endswith(key):
            return msg
            
    # Fallback based on file extensions
    if filepath.endswith('.css'):
        return f"style: configure design layout rules for {basename}"
    elif filepath.endswith('.jsx') or filepath.endswith('.js') or filepath.endswith('.tsx') or filepath.endswith('.ts'):
        return f"feat: implement component structure and logic for {basename}"
    elif filepath.endswith('.dart'):
        return f"feat: implement mobile app module structure for {basename}"
    elif filepath.endswith('.sql'):
        return f"chore: update database setup script for {basename}"
    elif filepath.endswith('.md'):
        return f"docs: update documentation references for {basename}"
    elif filepath.endswith('.py'):
        return f"chore: update workflow automation tools in {basename}"
    else:
        return f"refactor: update config variables in {basename}"

def get_date_for_day(day_offset):
    """Computes a future ISO 8601 datetime starting from today at 12:00 PM (noon) in IST (+05:30)."""
    tz = datetime.timezone(datetime.timedelta(hours=5, minutes=30))
    # Base starting date/time (today)
    now = datetime.datetime.now(tz)
    target_date = now + datetime.timedelta(days=day_offset)
    # Set to 12:00 PM
    target_date = target_date.replace(hour=12, minute=0, second=0, microsecond=0)
    return target_date.isoformat()

def main():
    print("=" * 60)
    print("  [INIT] GIT STREAK COMMIT AUTOMATOR (127-DAY FUTURE STREAK)")
    print("=" * 60)
    
    # Check if dry-run
    dry_run = "--dry-run" in sys.argv
    if dry_run:
        print("[STATUS] Running in DRY-RUN mode. No commits will be made.")
        print("-" * 60)
        
    # Get current branch
    try:
        branch = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD']).decode('utf-8').strip()
    except Exception:
        branch = 'main'
        
    print(f"[STATUS] Target Branch: {branch}")
    
    actions = get_git_status_actions()
    total_actions = len(actions)
    print(f"[STATUS] Detected {total_actions} file changes to stage.")
    
    # We want exactly 127 commits total to cover 127 days.
    total_days = 127
    planned_commits = []
    
    # 1. Plan commits for actual file actions
    for idx, (path, is_del) in enumerate(actions):
        day_offset = idx
        date_str = get_date_for_day(day_offset)
        msg = get_commit_message(path, is_del)
        planned_commits.append({
            'type': 'file',
            'path': path,
            'is_deletion': is_del,
            'date': date_str,
            'message': msg,
            'day': day_offset + 1
        })
        
    # 2. Plan empty commits to fill the rest of the 127 days
    remaining_commits = total_days - len(planned_commits)
    if remaining_commits > 0:
        print(f"[STATUS] Padding streak with {remaining_commits} empty commits to reach {total_days} days.")
        for i in range(remaining_commits):
            day_offset = len(planned_commits)
            date_str = get_date_for_day(day_offset)
            msg = f"chore: maintain contribution streak empty commit {i+1}"
            planned_commits.append({
                'type': 'empty',
                'date': date_str,
                'message': msg,
                'day': day_offset + 1
            })
            
    # Print the plan for user visibility
    print("\n--- PLANNED COMMIT SCHEDULE ---")
    for commit in planned_commits[:10]:
        c_type = "FILE" if commit['type'] == 'file' else "EMPTY"
        action_str = f"[{commit['day']}/127] ({c_type}) {commit['date']} | {commit['message']}"
        if commit['type'] == 'file':
            status_tag = "[DEL]" if commit['is_deletion'] else "[ADD/MOD]"
            action_str += f" ({status_tag} {commit['path']})"
        print(action_str)
        
    if len(planned_commits) > 10:
        print(f"... and {len(planned_commits) - 10} more commits up to day 127 ...")
        last_commit = planned_commits[-1]
        c_type = "FILE" if last_commit['type'] == 'file' else "EMPTY"
        print(f"[{last_commit['day']}/127] ({c_type}) {last_commit['date']} | {last_commit['message']}")
    print("-" * 60)
    
    if dry_run:
        print("[COMPLETE] Dry-run completed. No changes made.")
        return
        
    # Execute the commits
    print("[EXEC] Executing commit plan...")
    success_count = 0
    
    # Make sure we are at git root
    git_root = subprocess.check_output(['git', 'rev-parse', '--show-toplevel']).decode('utf-8').strip()
    os.chdir(git_root)
    
    # Environment variables dict to inherit from current process
    env = os.environ.copy()
    
    for idx, commit in enumerate(planned_commits):
        # Set Git author and committer dates
        env['GIT_AUTHOR_DATE'] = commit['date']
        env['GIT_COMMITTER_DATE'] = commit['date']
        
        try:
            if commit['type'] == 'file':
                path = commit['path']
                if commit['is_deletion']:
                    # Stage deletion
                    subprocess.run(['git', 'rm', '--cached', path], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                else:
                    # Stage modification/addition
                    subprocess.run(['git', 'add', path], check=True)
                
                # Commit
                subprocess.run(['git', 'commit', '-m', commit['message']], check=True, env=env, stdout=subprocess.DEVNULL)
            else:
                # Empty commit
                subprocess.run(['git', 'commit', '--allow-empty', '-m', commit['message']], check=True, env=env, stdout=subprocess.DEVNULL)
                
            success_count += 1
            if success_count % 10 == 0 or success_count == len(planned_commits):
                print(f"[PROGRESS] Completed commit {success_count}/{len(planned_commits)}...")
        except subprocess.CalledProcessError as e:
            print(f"[ERROR] Failed at commit {idx+1} ({commit['message']}): {e}")
            sys.exit(1)
            
    print(f"\n[SUCCESS] Generated {success_count} commits successfully locally!")
    
    # Push to origin
    print(f"[PUSH] Pushing all commits to remote branch '{branch}'...")
    try:
        subprocess.run(['git', 'push', 'origin', branch], check=True)
        print("[SUCCESS] Pushed successfully! All files are now visible in the repository, and the 127-day streak has been pre-populated.")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Failed to push commits: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
