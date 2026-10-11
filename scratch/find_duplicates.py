import os
import filecmp

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
fusion_dir = os.path.join(root_dir, "Fusion-X")

duplicates = []
different = []
only_in_fusion = []

for dirpath, dirnames, filenames in os.walk(fusion_dir):
    if any(p in dirpath for p in ['.git', '.next', 'node_modules']):
        continue
        
    for filename in filenames:
        fusion_file_path = os.path.join(dirpath, filename)
        rel_path = os.path.relpath(fusion_file_path, fusion_dir)
        root_file_path = os.path.join(root_dir, rel_path)
        
        if os.path.exists(root_file_path):
            if os.path.isdir(root_file_path):
                continue
            if filecmp.cmp(fusion_file_path, root_file_path, shallow=False):
                duplicates.append((fusion_file_path, root_file_path))
            else:
                different.append((fusion_file_path, root_file_path))
        else:
            only_in_fusion.append(fusion_file_path)

print(f"Total duplicates found: {len(duplicates)}")
print(f"Total different found: {len(different)}")
print(f"Total only in Fusion-X: {len(only_in_fusion)}")

print("\n--- DIFFERENT FILES (same path, different content) ---")
for f_path, r_path in different[:30]:
    print(f"Differs: {os.path.relpath(f_path, root_dir)}")
if len(different) > 30:
    print(f"... and {len(different) - 30} more.")

print("\n--- ONLY IN FUSION-X (no counterpart in root) ---")
for f_path in only_in_fusion:
    print(f"Only in Fusion-X: {os.path.relpath(f_path, root_dir)}")
