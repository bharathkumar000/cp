import os
import hashlib

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"

# Dictionary to hold md5: list of file paths
hash_map = {}

# Compute MD5 of a file
def get_md5(file_path):
    hash_md5 = hashlib.md5()
    try:
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception as e:
        return None

# Scan the directory
for dirpath, dirnames, filenames in os.walk(root_dir):
    # Exclude venv, .git, .next, node_modules
    if any(p in dirpath for p in ['.git', '.next', 'node_modules', 'venv']):
        continue
        
    for filename in filenames:
        file_path = os.path.join(dirpath, filename)
        if os.path.islink(file_path):
            continue
        # Get hash
        file_hash = get_md5(file_path)
        if file_hash:
            if file_hash not in hash_map:
                hash_map[file_hash] = []
            hash_map[file_hash].append(file_path)

# Filter for duplicates
duplicates = {h: paths for h, paths in hash_map.items() if len(paths) > 1}

print(f"Total unique file hashes with duplicates: {len(duplicates)}")
total_dup_files = sum(len(paths) - 1 for paths in duplicates.values())
print(f"Total duplicate files to delete: {total_dup_files}")

print("\n--- SAMPLE OF DUPLICATE GROUPS ---")
group_count = 0
for h, paths in duplicates.items():
    if group_count >= 15:
        break
    print(f"\nGroup {group_count + 1} (Hash: {h}):")
    for path in paths:
        print(f"  - {os.path.relpath(path, root_dir)}")
    group_count += 1

if len(duplicates) > 15:
    print(f"\n... and {len(duplicates) - 15} more groups.")
