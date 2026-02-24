import subprocess, os
imgs = ["/Users/s0m0ohl/placerforestschool/images/gosia-center-2.jpg", "/Users/s0m0ohl/placerforestschool/images/Beth-photo.jpg"]
for img in imgs:
    sz = os.path.getsize(img)
    print(f"{os.path.basename(img)}: {sz/1024:.0f} KB")
    r = subprocess.run(["/opt/homebrew/bin/magick", img, "-quality", "80", "-strip", img])
    nsz = os.path.getsize(img)
    print(f"  -> {nsz/1024:.0f} KB")
print("Done")
