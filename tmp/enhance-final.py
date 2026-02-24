#!/usr/bin/env python3
"""
Final enhancement pass using gemini-2.5-flash-image for natural-looking results.
"""
import os, sys, base64, json, urllib.request, urllib.error, time

API_KEY = os.environ.get("GOOGLE_AI_API_KEY")
IMAGES_DIR = "/Users/s0m0ohl/placerforestschool/images"
FINAL_DIR = "/Users/s0m0ohl/placerforestschool/images/final"
os.makedirs(FINAL_DIR, exist_ok=True)

MODEL = "gemini-2.5-flash-image"

# Natural-looking prompt - no AI look
PROMPT = """Subtly enhance this photograph as a professional photographer would in Lightroom.
- Gently improve white balance to be slightly warmer
- Subtle increase in clarity and micro-contrast
- Slightly lift shadows and recover highlights
- Make greens look natural and lush (not neon)
- Keep skin tones natural and realistic
- The result should look like a well-exposed photograph, NOT like it was AI-processed
- Maintain the original character and authenticity of the image
- This is a real photo of children at a forest school - it must look completely real and unedited"""

def enhance_image(image_path, output_path):
    name = os.path.basename(image_path)
    print(f"  Processing {name}...")
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
    payload = {
        "contents": [{"parts": [
            {"inlineData": {"mimeType": "image/jpeg", "data": image_data}},
            {"text": PROMPT}
        ]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"),
                                 headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            result = json.loads(resp.read().decode("utf-8"))
        candidates = result.get("candidates", [])
        if candidates:
            for part in candidates[0].get("content", {}).get("parts", []):
                if "inlineData" in part:
                    with open(output_path, "wb") as f:
                        f.write(base64.b64decode(part["inlineData"]["data"]))
                    size_kb = os.path.getsize(output_path) / 1024
                    print(f"  -> Done! {size_kb:.0f}KB")
                    return True
        print("  No image in response")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

print("=" * 60)
print(f"Final Enhancement Pass - {MODEL}")
print("=" * 60)

for i in range(1, 9):
    img_path = os.path.join(IMAGES_DIR, f"carousel-{i}.jpg")
    out_path = os.path.join(FINAL_DIR, f"carousel-{i}.jpg")
    print(f"\n[{i}/8] carousel-{i}.jpg")
    enhance_image(img_path, out_path)
    time.sleep(4)  # Rate limiting

print("\n" + "=" * 60)
print("Final enhancement complete!")
print(f"Output: {FINAL_DIR}")
print("=" * 60)
