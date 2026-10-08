import shutil
import os

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
mobile_fusion = os.path.join(root_dir, "Fusion-X/mobile_app")

if os.path.exists(mobile_fusion):
    try:
        shutil.rmtree(mobile_fusion)
        print(f"Successfully deleted the duplicate mobile app directory inside Fusion-X: Fusion-X/mobile_app")
    except Exception as e:
        print(f"Error deleting Fusion-X/mobile_app: {e}")
else:
    print("Fusion-X/mobile_app directory does not exist.")
