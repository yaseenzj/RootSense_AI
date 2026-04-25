import os
import shutil
import random

# Configuration
root_dir = '.'  # Looking inside the 'rootsense' folder
output_dir = 'rootsense_yolo'
classes = ['Healthy', 'Caries', 'Calculus', 'Gingivitis']
split_ratio = 0.8  # 80% for training

def prepare_data():
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir) # Clean start
    
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
        
        # Copy files
        for i, img in enumerate(images):
            target_set = 'train' if i < split_idx else 'val'
            shutil.copy(os.path.join(src_path, img), 
                        os.path.join(output_dir, target_set, cls, img))
            
    print(f"✅ Data split complete! Check the '{output_dir}' folder.")

if __name__ == "__main__":
    prepare_data()