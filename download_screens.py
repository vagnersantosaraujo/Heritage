import json
import urllib.request
import os
import re

json_path = '/Users/vsa/.gemini/antigravity/brain/0522e650-136a-4ae1-a428-3c18b22c8d8c/.system_generated/steps/47/output.txt'
output_dir = '/Users/vsa/Developer/Heritage/docs/screens'

os.makedirs(output_dir, exist_ok=True)

with open(json_path, 'r') as f:
    data = json.load(f)

screens = data.get('screens', [])

def sanitize_filename(name):
    return re.sub(r'[^a-zA-Z0-9_\-]', '_', name.replace(' ', '_'))

print(f"Found {len(screens)} screens. Starting download...")

for i, screen in enumerate(screens):
    title = screen.get('title', f'Screen_{i}')
    safe_title = sanitize_filename(title)
    
    html_url = screen.get('htmlCode', {}).get('downloadUrl')
    img_url = screen.get('screenshot', {}).get('downloadUrl')
    
    if html_url:
        html_path = os.path.join(output_dir, f"{safe_title}.html")
        print(f"Downloading HTML for {title}...")
        try:
            urllib.request.urlretrieve(html_url, html_path)
        except Exception as e:
            print(f"Error downloading HTML for {title}: {e}")

    if img_url:
        img_path = os.path.join(output_dir, f"{safe_title}.png")
        print(f"Downloading Screenshot for {title}...")
        try:
            urllib.request.urlretrieve(img_url, img_path)
        except Exception as e:
            print(f"Error downloading image for {title}: {e}")

print("Download complete!")
