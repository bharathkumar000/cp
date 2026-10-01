import os
import filecmp

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
mobile_root = os.path.join(root_dir, "mobile_app")
mobile_fusion = os.path.join(root_dir, "Fusion-X/mobile_app")

only_in_fusion = []
differing = []

for dirpath, dirnames, filenames in os.walk(mobile_fusion):
    if any(p in dirpath for p in ['.git', '.next', 'node_modules', 'build', '.dart_tool', '.gradle']):
        continue
    for filename in filenames:
        fusion_file = os.path.join(dirpath, filename)
        rel_path = os.path.relpath(fusion_file, mobile_fusion)
        root_file = os.path.join(mobile_root, rel_path)
        
        if not os.path.exists(root_file):
            only_in_fusion.append((fusion_file, root_file))
        else:
            if not filecmp.cmp(fusion_file, root_file, shallow=False):
                differing.append((fusion_file, root_file))

print(f"Files only in Fusion-X/mobile_app: {len(only_in_fusion)}")
for f, r in only_in_fusion:
    print(f"  - Only in Fusion-X: {os.path.relpath(f, root_dir)}")
    
print(f"Differing files: {len(differing)}")
for f, r in differing:
    print(f"  - Differs: {os.path.relpath(f, root_dir)}")
