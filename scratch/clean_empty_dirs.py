import os

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
fusion_dir = os.path.join(root_dir, "Fusion-X")

def remove_empty_dirs(path):
    if not os.path.isdir(path):
        return
        
    # Exclude certain folders
    if any(p in path for p in ['.git', '.next', 'node_modules']):
        return

    # Recursively check subdirectories
    for d in os.listdir(path):
        full_p = os.path.join(path, d)
        if os.path.isdir(full_p):
            remove_empty_dirs(full_p)
            
    # Check if dir is now empty
    if not os.listdir(path):
        try:
            os.rmdir(path)
            print(f"Removed empty directory: {os.path.relpath(path, root_dir)}")
        except Exception as e:
            print(f"Error removing {path}: {e}")

remove_empty_dirs(fusion_dir)
