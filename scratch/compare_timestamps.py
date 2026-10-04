import os

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
mobile_root = os.path.join(root_dir, "mobile_app")
mobile_fusion = os.path.join(root_dir, "Fusion-X/mobile_app")

files = [
    "lib/screens/dashboard_screen.dart",
    "lib/screens/login_screen.dart",
    "lib/config/app_theme.dart",
    "pubspec.yaml"
]

for f in files:
    r_file = os.path.join(mobile_root, f)
    f_file = os.path.join(mobile_fusion, f)
    
    r_stat = os.stat(r_file)
    f_stat = os.stat(f_file)
    
    print(f"\nFile: {f}")
    print(f"  Root:     Size={r_stat.st_size} bytes, Modified={r_stat.st_mtime}")
    print(f"  Fusion-X: Size={f_stat.st_size} bytes, Modified={f_stat.st_mtime}")
