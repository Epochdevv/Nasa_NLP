import os
import shutil
import random

def clear_folder(folder_path):
    """Delete all contents of a folder"""
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)
    os.makedirs(folder_path, exist_ok=True)
    print(f"✓ Cleared target folder: {folder_path}")

def copy_random_files(destination_folder, target_folder, num_files=25):
    """
    Select random files from destination folder and copy to target folder.
    Target folder is cleared first.
    """
    
    # Get all XML files in destination folder
    dest_files = [f for f in os.listdir(destination_folder) if f.endswith('.xml')]
    
    print(f"Found {len(dest_files)} XML files in destination folder")
    
    # Select random files
    if len(dest_files) < num_files:
        print(f"Warning: Only {len(dest_files)} files available, selecting all of them")
        selected_files = dest_files
    else:
        selected_files = random.sample(dest_files, num_files)
    
    print(f"Selected {len(selected_files)} random files\n")
    
    # Clear target folder
    clear_folder(target_folder)
    
    # Copy selected files to target
    print("\nCopying files to target folder:")
    for filename in selected_files:
        src = os.path.join(destination_folder, filename)
        dst = os.path.join(target_folder, filename)
        shutil.copy2(src, dst)
        print(f"✓ {filename}")
    
    print(f"\n--- Summary ---")
    print(f"Files copied to target: {len(selected_files)}")

# Usage
if __name__ == "__main__":
    # Get the current script's directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Navigate up one level from filtering_files to reach Nasa_NLP root
    project_root = os.path.dirname(current_dir)
    
    # Set paths relative to the project structure
    destination_folder = os.path.join(project_root, "datas", "grobid_output") 
    target_folder = os.path.join(current_dir, "output_files")
    
    copy_random_files(destination_folder, target_folder, num_files=25)