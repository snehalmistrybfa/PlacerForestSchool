#!/usr/bin/env python3
"""Send resized carousel images to Gemini 2.0 Flash for natural enhancement."""

import base64
import json
import os
import sys
import time
import urllib.request
import urllib.error

API_KEY = "AIzaSyDmNAsO_DLRbwQq-2mwSoWploW_uGF2qtA"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key={API_KEY}"

PROMPT = (
    "Subtly enhance this outdoor nature photograph. Apply gentle Lightroom-style "
    "adjustments: slightly warmer white balance, gently lift shadows, natural color "
    "enhancement, soft clarity boost. Keep it looking completely natural and authentic "
    "- like a skilled photographer's edit, not AI-processed."
)

BASE_DIR = "/Users/s0m0ohl/placerforestschool/images/compare"

IMAGES = [
    (f"{BASE_DIR}/resized-carousel-1.jpg", f"{BASE_DIR}/gemini-carousel-1.jpg"),
    (f"{BASE_DIR}/resized-carousel-5.jpg", f"{BASE_DIR}/gemini-carousel-5.jpg"),
    (f"{BASE_DIR}/resized-carousel-9.jpg", f"{BASE_DIR}/gemini-carousel-9.jpg"),
]


def enhance_image(input_path, output_path):
    """Send image to Gemini API and save the enhanced result."""
    name = os.path.basename(input_path)
    print(f"\n{'='*60}")
    print(f"Processing: {name}")
    print(f"  Input:  {input_path}")
    print(f"  Output: {output_path}")

    # Read and encode the image
    with open(input_path, "rb") as f:
        image_data = f.read()
    b64_image = base64.b64encode(image_data).decode("utf-8")
    input_size_kb = len(image_data) / 1024
    print(f"  Input size: {input_size_kb:.0f} KB")

    # Build request payload
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": PROMPT},
                    {
                        "inlineData": {
                            "mimeType": "image/jpeg",
                            "data": b64_image,
                        }
                    },
                ]
            }
        ],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }

    body = json.dumps(payload).encode("utf-8")
    print(f"  Request payload size: {len(body) / (1024*1024):.1f} MB")

    req = urllib.request.Request(
        API_URL,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    # Send request with retries
    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            print(f"  Sending to Gemini API (attempt {attempt})...", flush=True)
            with urllib.request.urlopen(req, timeout=120) as resp:
                result = json.loads(resp.read().decode("utf-8"))
            break
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8", errors="replace")
            print(f"  HTTP Error {e.code}: {error_body[:500]}")
            if attempt < max_retries and e.code in (429, 500, 503):
                wait = 10 * attempt
                print(f"  Retrying in {wait}s...")
                time.sleep(wait)
                continue
            return False
        except Exception as e:
            print(f"  Error: {e}")
            if attempt < max_retries:
                wait = 10 * attempt
                print(f"  Retrying in {wait}s...")
                time.sleep(wait)
                continue
            return False

    # Extract image from response
    candidates = result.get("candidates", [])
    if not candidates:
        print(f"  ERROR: No candidates in response")
        print(f"  Response keys: {list(result.keys())}")
        if "error" in result:
            print(f"  Error: {result['error']}")
        return False

    parts = candidates[0].get("content", {}).get("parts", [])
    print(f"  Response has {len(parts)} parts")

    image_found = False
    for i, part in enumerate(parts):
        if "text" in part:
            print(f"  Part {i} (text): {part['text'][:200]}")
        if "inlineData" in part:
            print(f"  Part {i} (image): mimeType={part['inlineData'].get('mimeType')}")
            img_b64 = part["inlineData"]["data"]
            img_bytes = base64.b64decode(img_b64)
            with open(output_path, "wb") as f:
                f.write(img_bytes)
            out_size_kb = len(img_bytes) / 1024
            print(f"  Saved enhanced image: {out_size_kb:.0f} KB")
            image_found = True

    if not image_found:
        print(f"  ERROR: No image data found in response parts")
        print(f"  Full response: {json.dumps(result, indent=2)[:1000]}")
        return False

    return True


def main():
    print("Gemini Image Enhancement Script")
    print(f"Processing {len(IMAGES)} images")

    results = []
    for input_path, output_path in IMAGES:
        success = enhance_image(input_path, output_path)
        results.append((os.path.basename(input_path), success))
        if success:
            # Small delay between API calls to avoid rate limiting
            time.sleep(3)

    print(f"\n{'='*60}")
    print("RESULTS SUMMARY")
    print(f"{'='*60}")
    for name, success in results:
        status = "OK" if success else "FAILED"
        print(f"  {name}: {status}")

    all_ok = all(s for _, s in results)
    if all_ok:
        print("\nAll images enhanced successfully!")
    else:
        print("\nSome images failed. Check errors above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
