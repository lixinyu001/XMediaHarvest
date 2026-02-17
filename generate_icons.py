#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, is_round=False):
    img = Image.new('RGBA', (size, size), (33, 150, 243, 255))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    
    if is_round:
        draw.ellipse([2, 2, size-2, size-2], fill=(33, 150, 243, 255))
    
    outer_radius = int(size * 0.35)
    draw.ellipse([center - outer_radius, center - outer_radius, 
                  center + outer_radius, center + outer_radius], 
                 fill=(255, 255, 255, 255))
    
    inner_radius = int(size * 0.25)
    draw.ellipse([center - inner_radius, center - inner_radius, 
                  center + inner_radius, center + inner_radius], 
                 fill=(33, 150, 243, 255))
    
    center_radius = int(size * 0.08)
    draw.ellipse([center - center_radius, center - center_radius, 
                  center + center_radius, center + center_radius], 
                 fill=(255, 255, 255, 255))
    
    return img

def create_notification_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    radius = int(size * 0.35)
    
    draw.ellipse([center - radius, center - radius, 
                  center + radius, center + radius], 
                 fill=(255, 255, 255, 255))
    
    inner_radius = int(size * 0.25)
    draw.ellipse([center - inner_radius, center - inner_radius, 
                  center + inner_radius, center + inner_radius], 
                 fill=(0, 0, 0, 255))
    
    center_radius = int(size * 0.08)
    draw.ellipse([center - center_radius, center - center_radius, 
                  center + center_radius, center + center_radius], 
                 fill=(255, 255, 255, 255))
    
    return img

def main():
    base_dir = "app/src/main/res"
    
    sizes = {
        "mdpi": 48,
        "hdpi": 72,
        "xhdpi": 96,
        "xxhdpi": 144,
        "xxxhdpi": 192
    }
    
    for density, size in sizes.items():
        mipmap_dir = os.path.join(base_dir, f"mipmap-{density}")
        os.makedirs(mipmap_dir, exist_ok=True)
        
        icon = create_icon(size, is_round=False)
        icon.save(os.path.join(mipmap_dir, "ic_launcher.png"))
        
        round_icon = create_icon(size, is_round=True)
        round_icon.save(os.path.join(mipmap_dir, "ic_launcher_round.png"))
        
        print(f"Created {density} icons ({size}x{size})")
    
    notification_sizes = {
        "mdpi": 24,
        "hdpi": 36,
        "xhdpi": 48,
        "xxhdpi": 72,
        "xxxhdpi": 96
    }
    
    for density, size in notification_sizes.items():
        drawable_dir = os.path.join(base_dir, f"drawable-{density}")
        os.makedirs(drawable_dir, exist_ok=True)
        
        icon = create_notification_icon(size)
        icon.save(os.path.join(drawable_dir, "ic_notification.png"))
        
        print(f"Created {density} notification icon ({size}x{size})")
    
    print("\nAll icons created successfully!")

if __name__ == "__main__":
    main()
