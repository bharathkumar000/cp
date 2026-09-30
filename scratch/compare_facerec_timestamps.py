import os

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
facerec_root = os.path.join(root_dir, "Facerecognition")
facerec_fusion = os.path.join(root_dir, "Fusion-X/Facerecognition")

files = [
    "README.md",
    ".gitignore"
]

for f in files:
    r_file = os.path.join(facerec_root, f)
    f_file = os.path.join(facerec_fusion, f)
    
    r_stat = os.stat(r_file)
    f_stat = os.stat(f_file)
    
    print(f"\nFile: {f}")
    print(f"  Root:     Size={r_stat.st_size} bytes, Modified={r_stat.st_mtime}")
    print(f"  Fusion-X: Size={f_stat.st_size} bytes, Modified={f_stat.st_mtime}")
