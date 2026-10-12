import os
import hashlib

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"

exclude_folders = ['.git', '.next', 'node_modules', 'venv', 'build', '.gradle', '.dart_tool', 'ios', 'macos', 'windows', 'linux']

hash_map = {}

def get_md5(file_path):
    hash_md5 = hashlib.md5()
    try:
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception as e:
        return None

for dirpath, dirnames, filenames in os.walk(root_dir):
    # Check if any excluded folder name is part of the path segments
    path_segments = os.path.normpath(dirpath).split(os.sep)
    if any(folder in path_segments for folder in exclude_folders):
        continue
        
    for filename in filenames:
        file_path = os.path.join(dirpath, filename)
        if os.path.islink(file_path):
            continue
        file_hash = get_md5(file_path)
        if file_hash:
            if file_hash not in hash_map:
                hash_map[file_hash] = []
            hash_map[file_hash].append(file_path)

duplicates = {h: paths for h, paths in hash_map.items() if len(paths) > 1}

print(f"Total unique file hashes with duplicates (excluding build/platform folders): {len(duplicates)}")
total_dup_files = sum(len(paths) - 1 for paths in duplicates.values())
print(f"Total duplicate files to delete: {total_dup_files}")

print("\n--- DUPLICATE GROUPS (SAFE SCAN) ---")
group_count = 0
for h, paths in duplicates.items():
    print(f"\nGroup {group_count + 1} (Hash: {h}):")
    for path in paths:
        print(f"  - {os.path.relpath(path, root_dir)}")
    group_count += 1
