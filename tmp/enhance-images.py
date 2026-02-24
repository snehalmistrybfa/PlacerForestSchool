#!/usr/bin/env python3
"""
Enhance carousel images using Google Gemini API (Imagen/nano banana).
Uses the Gemini 2.0 Flash image editing capability.
"""
import os
import sys
import base64
import json
import urllib.request
import urllib.error
import time

API_KEY = os.environ.get("GOOGLE_AI_API_KEY")
if not API_KEY:
    print("ERROR: GOOGLE_AI_API_KEY not found in environment")
    sys.exit(1)

IMAGES_DIR = "/Users/s0m0ohl/placerforestschool/images"
ENHANCED_DIR = "/Users/s0m0ohl/placerforestschool/images/enhanced"
os.makedirs(ENHANCED_DIR, exist_ok=True)

def enhance_image(image_path, output_path, prompt):
    """Use Gemini to enhance an image."""
    print(f"  Enhancing {os.path.basename(image_path)}...")

    # Read and encode the image
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")

    # Use Gemini 2.0 Flash with image generation
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key={API_KEY}"

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inlineData": {
                            "mimeType": "image/jpeg",
                            "data": image_data
                        }
                    },
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"]
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))

        # Extract the image from response
        candidates = result.get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            for part in parts:
                if "inlineData" in part:
                    img_b64 = part["inlineData"]["data"]
                    with open(output_path, "wb") as f:
                        f.write(base64.b64decode(img_b64))
                    print(f"  -> Saved enhanced image to {output_path}")
                    return True
                elif "text" in part:
                    print(f"  Text response: {part['text'][:200]}")

        print(f"  WARNING: No image in response for {os.path.basename(image_path)}")
        print(f"  Response keys: {json.dumps(result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].keys() if candidates else 'no candidates', default=str)}")
        return False

    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8") if e.readable() else "no body"
        print(f"  ERROR ({e.code}): {error_body[:300]}")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

# Enhancement prompt for nature/forest school photos
ENHANCE_PROMPT = """Edit this photo to make it look more vibrant and professional for a website carousel banner.
Enhance the colors to be warmer and more inviting - make greens richer, sky bluer, and overall lighting more golden/warm.
Slightly increase contrast and saturation to make it pop.
Keep it natural-looking, not over-processed. This is for a forest school website."""

print("=" * 60)
print("Enhancing Carousel Images with Gemini API")
print("=" * 60)

for i in range(1, 9):
    img_path = os.path.join(IMAGES_DIR, f"carousel-{i}.jpg")
    out_path = os.path.join(ENHANCED_DIR, f"carousel-{i}.jpg")

    if not os.path.exists(img_path):
        print(f"SKIP: carousel-{i}.jpg not found")
        continue

    print(f"\n[{i}/8] Processing carousel-{i}.jpg")
    success = enhance_image(img_path, out_path, ENHANCE_PROMPT)

    if success:
        # Check output file size
        size_kb = os.path.getsize(out_path) / 1024
        print(f"  Size: {size_kb:.0f}KB")

    # Rate limiting
    time.sleep(2)

print("\n" + "=" * 60)
print("Enhancement complete!")
print(f"Enhanced images saved to: {ENHANCED_DIR}")
print("=" * 60)
