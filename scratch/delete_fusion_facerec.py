import shutil
import os

root_dir = "/Users/bharathkumara/Desktop/PROJECTS/one-campus"
facerec_fusion = os.path.join(root_dir, "Fusion-X/Facerecognition")

if os.path.exists(facerec_fusion):
    try:
        shutil.rmtree(facerec_fusion)
        print(f"Successfully deleted the duplicate face recognition directory inside Fusion-X: Fusion-X/Facerecognition")
    except Exception as e:
        print(f"Error deleting Fusion-X/Facerecognition: {e}")
else:
    print("Fusion-X/Facerecognition directory does not exist.")
