import os
import filecmp

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
fusion_dir = os.path.join(root_dir, "Fusion-X")

only_in_fusion = []
differing = []

# Scan src
src_fusion = os.path.join(fusion_dir, "src")
src_root = os.path.join(root_dir, "src")
if os.path.exists(src_fusion):
    for dirpath, dirnames, filenames in os.walk(src_fusion):
        for filename in filenames:
            fusion_file = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(fusion_file, src_fusion)
            root_file = os.path.join(src_root, rel_path)
            
            if not os.path.exists(root_file):
                only_in_fusion.append(fusion_file)
            elif not filecmp.cmp(fusion_file, root_file, shallow=False):
                differing.append(fusion_file)

# Scan server
server_fusion = os.path.join(fusion_dir, "server")
server_root = os.path.join(root_dir, "server")
if os.path.exists(server_fusion):
    for dirpath, dirnames, filenames in os.walk(server_fusion):
        for filename in filenames:
            fusion_file = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(fusion_file, server_fusion)
            root_file = os.path.join(server_root, rel_path)
            
            if not os.path.exists(root_file):
                only_in_fusion.append(fusion_file)
            elif not filecmp.cmp(fusion_file, root_file, shallow=False):
                differing.append(fusion_file)

# Check single files
single_files = [".env", ".gitignore", "package.json", "package-lock.json"]
for f in single_files:
    fusion_file = os.path.join(fusion_dir, f)
    root_file = os.path.join(root_dir, f)
    if os.path.exists(fusion_file):
        if not os.path.exists(root_file):
            only_in_fusion.append(fusion_file)
        elif not filecmp.cmp(fusion_file, root_file, shallow=False):
            differing.append(fusion_file)

print(f"Files only in Fusion-X (will copy to root): {len(only_in_fusion)}")
for f in only_in_fusion:
    print(f"  - {os.path.relpath(f, root_dir)}")
    
print(f"Differing files (needs compare): {len(differing)}")
for f in differing:
    print(f"  - {os.path.relpath(f, root_dir)}")
