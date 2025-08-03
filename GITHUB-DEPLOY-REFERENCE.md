# 🚀 GitHub Deployment Commands

## Repository Name: PlacerForestSchool
## Your GitHub Username: snehalmistrybfa

### Step 1: Create GitHub Repository
1. Go to https://github.com/snehalmistrybfa
2. Click "New repository"
3. Repository name: **PlacerForestSchool**
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README

### Step 2: Deploy Your Website
```bash
# Initialize git (already done)
git init

# Add all files
git add .

# Create commit
git commit -m "Initial commit - Placer Forest School website"

# Connect to GitHub repository
git remote add origin https://github.com/snehalmistrybfa/PlacerForestSchool.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to: https://github.com/snehalmistrybfa/PlacerForestSchool
2. Click "Settings" tab
3. Scroll to "Pages" in left sidebar
4. Source: "Deploy from a branch" → main
5. Click Save

### Your Namecheap DNS Settings
**A Records (4 total):**
- Host: @ | Value: 185.199.108.153
- Host: @ | Value: 185.199.109.153  
- Host: @ | Value: 185.199.110.153
- Host: @ | Value: 185.199.111.153

**CNAME Record:**
- Host: www | Value: snehalmistrybfa.github.io.

### Final URLs
- **Production:** https://placerforestschool.com
- **Development:** https://snehalmistrybfa.github.io/PlacerForestSchool
