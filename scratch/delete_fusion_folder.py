import shutil
import os

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
fusion_dir = os.path.join(root_dir, "Fusion-X")

if os.path.exists(fusion_dir):
    try:
        shutil.rmtree(fusion_dir)
        print(f"Successfully deleted the entire duplicate Fusion-X folder: Fusion-X/")
    except Exception as e:
        print(f"Error deleting Fusion-X folder: {e}")
else:
    print("Fusion-X folder does not exist.")
