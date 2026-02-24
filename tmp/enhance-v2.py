#!/usr/bin/env python3
"""
Re-enhance carousel-7 with a subtler prompt, and try gemini-2.5-flash-image for comparison.
"""
import os, sys, base64, json, urllib.request, urllib.error, time

API_KEY = os.environ.get("GOOGLE_AI_API_KEY")
IMAGES_DIR = "/Users/s0m0ohl/placerforestschool/images"
ENHANCED_DIR = "/Users/s0m0ohl/placerforestschool/images/enhanced"
V2_DIR = "/Users/s0m0ohl/placerforestschool/images/enhanced-v2"
os.makedirs(V2_DIR, exist_ok=True)

def enhance_image(image_path, output_path, prompt, model="gemini-2.0-flash-exp-image-generation"):
    print(f"  Enhancing with {model}...")
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
    payload = {
        "contents": [{"parts": [
            {"inlineData": {"mimeType": "image/jpeg", "data": image_data}},
            {"text": prompt}
        ]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"),
                                 headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
        candidates = result.get("candidates", [])
        if candidates:
            for part in candidates[0].get("content", {}).get("parts", []):
                if "inlineData" in part:
                    with open(output_path, "wb") as f:
                        f.write(base64.b64decode(part["inlineData"]["data"]))
                    size_kb = os.path.getsize(output_path) / 1024
                    print(f"  -> Saved {size_kb:.0f}KB to {os.path.basename(output_path)}")
                    return True
        print("  No image in response")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

# Re-do carousel-7 with subtler prompt
SUBTLE_PROMPT = """Slightly enhance this photo for a website.
Make colors a bit warmer and more natural. Gentle increase in contrast.
Keep it realistic and natural looking - do NOT over-saturate.
This shows children painting outdoors at a nature school."""

print("=== Re-enhancing carousel-7 with subtler prompt ===")
enhance_image(
    os.path.join(IMAGES_DIR, "carousel-7.jpg"),
    os.path.join(ENHANCED_DIR, "carousel-7.jpg"),
    SUBTLE_PROMPT
)

time.sleep(3)

# Try gemini-2.5-flash-image on a couple images for comparison
ENHANCE_PROMPT = """Edit this photo to make it look more vibrant and professional for a website carousel banner.
Enhance the colors to be warmer and more inviting - make greens richer, sky bluer, and overall lighting more golden/warm.
Slightly increase contrast and saturation to make it pop.
Keep it natural-looking, not over-processed. This is for a forest school website."""

print("\n=== Trying gemini-2.5-flash-image model ===")
for i in [1, 3, 6]:
    print(f"\n[carousel-{i}]")
    enhance_image(
        os.path.join(IMAGES_DIR, f"carousel-{i}.jpg"),
        os.path.join(V2_DIR, f"carousel-{i}.jpg"),
        ENHANCE_PROMPT,
        model="gemini-2.5-flash-image"
    )
    time.sleep(3)

print("\nDone!")
