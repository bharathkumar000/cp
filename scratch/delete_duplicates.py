import os
import filecmp

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
fusion_dir = os.path.join(root_dir, "Fusion-X")

duplicates = []
deleted_count = 0

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
            # Compare files
            if filecmp.cmp(fusion_file_path, root_file_path, shallow=False):
                duplicates.append(fusion_file_path)

print(f"Deleting {len(duplicates)} exact duplicates in Fusion-X...")

for file_path in duplicates:
    try:
        os.remove(file_path)
        deleted_count += 1
    except Exception as e:
        print(f"Error deleting {file_path}: {e}")

print(f"Successfully deleted {deleted_count} duplicate files.")
