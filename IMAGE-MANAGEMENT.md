# 🖼️ Carousel Image Management Guide

## Easy Image Management System

Your carousel images are now renamed with simple, numbered filenames that make it super easy to manage and reorder them.

## Current Carousel Images

### Image Files Location: `/images/`
- **`carousel-1.jpg`** - First image (currently: outdoor learning environment)
- **`carousel-2.jpg`** - Second image (currently: nature-based activities)  
- **`carousel-3.jpg`** - Third image (currently: forest school community)

## How to Change Carousel Order

To reorder which image appears first, second, or third, you have **two easy options**:

### Option 1: Rename the Image Files (Easiest)
Simply rename the image files to change their order:

```bash
# To make current image 2 become the first image:
mv carousel-2.jpg temp.jpg
mv carousel-1.jpg carousel-2.jpg  
mv temp.jpg carousel-1.jpg
```

### Option 2: Edit the Content File
Edit `/content/home-content.json` and change the order in the "images" array:

```json
"carousel": {
  "images": [
    {
      "src": "images/carousel-3.jpg",    ← Change numbers to reorder
      "alt": "Your description here"
    },
    {
      "src": "images/carousel-1.jpg",    ← Change numbers to reorder
      "alt": "Your description here"
    },
    {
      "src": "images/carousel-2.jpg",    ← Change numbers to reorder
      "alt": "Your description here"
    }
  ]
}
```

## How to Replace Carousel Images

### To Replace a Specific Image:
1. **Choose your new image** (make sure it's a good quality JPG)
2. **Rename it** to replace the slot you want:
   - Replace first image: rename to `carousel-1.jpg`
   - Replace second image: rename to `carousel-2.jpg`
   - Replace third image: rename to `carousel-3.jpg`
3. **Copy it** to the `/images/` folder
4. **Refresh your website** - the new image will appear automatically!

### Example: Replace the First Image
```bash
# Copy your new image and rename it
cp "your-new-amazing-photo.jpg" "carousel-1.jpg"
```

## How to Add More Carousel Images

### To Add a 4th Image:
1. **Add your image** as `carousel-4.jpg` in the `/images/` folder
2. **Edit** `/content/home-content.json` and add:
```json
{
  "src": "images/carousel-4.jpg",
  "alt": "Description of your new image"
}
```

### To Add a 5th Image:
Same process with `carousel-5.jpg`, etc.

## Image Requirements for Best Results

### Technical Specs:
- **Format**: JPG or PNG
- **Size**: At least 1200px wide for good quality
- **Aspect ratio**: Any aspect ratio works (landscape or portrait)
- **File size**: Under 5MB for fast loading

### Content Guidelines:
- **High quality**: Clear, well-lit photos
- **Relevant content**: Shows forest school activities, children learning, nature
- **Good composition**: Important elements not at the very edges
- **Diverse content**: Mix of different activities and perspectives

## Current Image Details

### carousel-1.jpg (7.5MB)
- **Source**: PXL_20240325_193110753.jpg
- **Content**: Outdoor learning environment
- **Orientation**: Landscape
- **Quality**: Excellent

### carousel-2.jpg (5.4MB)  
- **Source**: PXL_20240401_191554471.MP.jpg
- **Content**: Nature-based activities and discovery
- **Orientation**: Mixed
- **Quality**: Very good

### carousel-3.jpg (6.0MB)
- **Source**: PXL_20240401_195231915.jpg  
- **Content**: Forest school community connection
- **Orientation**: Portrait
- **Quality**: Excellent

## Quick Tips

### For Best Results:
- **Test different orders** to see what looks best
- **Choose diverse images** that tell different parts of your story
- **Update alt text** to describe each image accurately
- **Keep file sizes reasonable** for fast loading
- **Use high-quality images** that represent your program well

### Easy Testing:
1. Make changes to image files or content
2. Refresh your website at http://localhost:8080
3. See changes immediately
4. Adjust as needed

This system makes it incredibly easy to update your carousel images without touching any code! 🌲✨
