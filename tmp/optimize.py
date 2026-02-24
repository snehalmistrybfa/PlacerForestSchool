import subprocess, os
IMAGES = [
    "/Users/s0m0ohl/placerforestschool/images/gosia-center-2.jpg",
    "/Users/s0m0ohl/placerforestschool/images/Beth-photo.jpg",
]
for img in IMAGES:
    before = os.path.getsize(img)
    print(f"Optimizing {os.path.basename(img)} ({before/1024:.0f} KB)...")
    r = subprocess.run(["magick", img, "-quality", "80", "-strip", img], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ERROR: {r.stderr}")
    else:
        after = os.path.getsize(img)
        print(f"  Done: {after/1024:.0f} KB (saved {(before-after)/1024:.0f} KB)")
print("Optimization complete!")
