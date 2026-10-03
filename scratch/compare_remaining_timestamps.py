import os

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
fusion_dir = os.path.join(root_dir, "Fusion-X")

differing = [
    "src/index.css",
    "src/context/AuthContext.jsx",
    "src/app/layout.js",
    "src/app/dashboard/layout.js",
    "src/app/dashboard/page.js",
    "src/app/api/ai-chat/route.ts",
    "src/services/api.js",
    ".env",
    ".gitignore",
    "package.json"
]

for f in differing:
    r_file = os.path.join(root_dir, f)
    f_file = os.path.join(fusion_dir, f)
    
    if os.path.exists(r_file) and os.path.exists(f_file):
        r_stat = os.stat(r_file)
        f_stat = os.stat(f_file)
        
        print(f"\nFile: {f}")
        print(f"  Root:     Size={r_stat.st_size} bytes, Modified={r_stat.st_mtime}")
        print(f"  Fusion-X: Size={f_stat.st_size} bytes, Modified={f_stat.st_mtime}")
