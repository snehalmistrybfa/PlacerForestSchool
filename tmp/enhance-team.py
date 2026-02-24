import os, subprocess
IMAGES = ["/Users/s0m0ohl/placerforestschool/images/gosia-center-2.jpg", "/Users/s0m0ohl/placerforestschool/images/Beth-photo.jpg"]
print("Optimizing images with ImageMagick...")
for img in IMAGES:
    before = os.path.getsize(img)
    r = subprocess.run(["/opt/homebrew/bin/magick", img, "-quality", "80", "-strip", img], capture_output=True, text=True)
    if r.returncode == 0:
        after = os.path.getsize(img)
        print(f"  {os.path.basename(img)}: {before/1024:.0f} KB -> {after/1024:.0f} KB")
    else:
        print(f"  Error: {r.stderr}")
print("Done!")
