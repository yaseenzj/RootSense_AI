import os
import shutil
import random

# Configuration - Absolute Paths
root_dir = r'C:\Users\mhyas\Desktop\rootsense'
output_dir = os.path.join(root_dir, 'rootsense_yolo')
classes = ['Healthy', 'Caries', 'Calculus', 'Gingivitis']
split_ratio = 0.8 

def prepare_data():
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    
    for cls in classes:
        os.makedirs(os.path.join(output_dir, 'train', cls), exist_ok=True)
        os.makedirs(os.path.join(output_dir, 'val', cls), exist_ok=True)
        
        src_path = os.path.join(root_dir, cls)
        if not os.path.exists(src_path):
            print(f"Skipping {cls}: Folder not found.")
            continue

        images = [f for f in os.listdir(src_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        random.shuffle(images)
        split_idx = int(len(images) * split_ratio)
        
        for i, img in enumerate(images):
            target_set = 'train' if i < split_idx else 'val'
            shutil.copy(os.path.join(src_path, img), 
                        os.path.join(output_dir, target_set, cls, img))
            
    print(f"✅ Data split complete! Path: {output_dir}")

if __name__ == "__main__":
    prepare_data()