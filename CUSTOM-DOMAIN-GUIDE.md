# 🌐 Custom Domain Setup Guide

## Step 1: Choose and Buy a Domain Name

### Recommended Domain Registrars:
- **Namecheap** (namecheap.com) - Great prices, easy setup
- **Google Domains** (domains.google.com) - Simple integration
- **GoDaddy** (godaddy.com) - Popular, lots of features
- **Cloudflare** (cloudflare.com) - Good pricing, includes security

### Domain Name Ideas for Your Forest School:
- `placerforestschool.com` 
- `forestschoolplacer.com`
- `placernatureschool.com`
- `rocklinforestschool.com`
- `lincolnforestschool.org`

**Cost:** Usually $10-15/year for .com domains

---

## Step 2: GitHub Pages Custom Domain Setup

### Method 1: Using GitHub Interface (Easiest)

1. **Deploy to GitHub Pages first:**
   ```bash
   # In your project folder
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/placer-forest-school.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your GitHub repository
   - Settings → Pages
   - Source: "Deploy from a branch" → main
   - Wait for initial deployment

3. **Add Custom Domain:**
   - Still in Settings → Pages
   - Under "Custom domain", enter: `placerforestschool.com`
   - Check "Enforce HTTPS" (recommended)
   - Click Save

4. **GitHub creates CNAME file automatically**

### Method 2: Manual CNAME File

Create this file in your project root:

**File: `/CNAME`** (no extension)
```
placerforestschool.com
```

Then commit and push:
```bash
git add CNAME
git commit -m "Add custom domain"
git push
```

---

## Step 3: Configure DNS at Your Domain Registrar

### For Apex Domain (placerforestschool.com):

**Add these A Records:**
```
Type: A
Host: @ (or leave blank)
Value: 185.199.108.153

Type: A  
Host: @ (or leave blank)
Value: 185.199.109.153

Type: A
Host: @ (or leave blank) 
Value: 185.199.110.153

Type: A
Host: @ (or leave blank)
Value: 185.199.111.153
```

### For WWW Subdomain (www.placerforestschool.com):

**Add CNAME Record:**
```
Type: CNAME
Host: www
Value: YOUR_USERNAME.github.io
```

---

## Step 4: Wait for DNS Propagation

- **Time:** Usually 15 minutes to 24 hours
- **Check status:** Use tools like `dig placerforestschool.com` or dnschecker.org
- **GitHub will show green checkmark** when ready

---

## Step 5: Update Your Website Content

Update the domain in your content files:

### In `/content/home-content.json`:
```json
"openGraph": {
  "title": "Placer Forest School - Nature-Based Learning",
  "description": "Rooted in Respect. Inspired by Nature. Built for Connection.",
  "url": "https://placerforestschool.com"
}
```

### In `/content/site-config.json`:
```json
"site": {
  "domain": "https://placerforestschool.com"
}
```

---

## 🔒 SSL Certificate (FREE with GitHub Pages!)

GitHub Pages provides **free SSL certificates** automatically:
- ✅ Your site will be secure (HTTPS)
- ✅ Automatic renewal
- ✅ Trusted by all browsers
- ✅ Green padlock in browser

---

## 🚀 Complete Timeline

1. **Buy domain** → 5 minutes
2. **Deploy to GitHub Pages** → 10 minutes  
3. **Configure custom domain** → 5 minutes
4. **Set DNS records** → 5 minutes
5. **Wait for propagation** → 15 minutes to 24 hours
6. **SSL certificate activates** → Automatic

**Total active time: ~25 minutes** ⏱️

---

## 💡 Pro Tips

### Domain Name Best Practices:
- ✅ Keep it short and memorable
- ✅ Use .com if available (.org also good for schools)
- ✅ Avoid hyphens and numbers
- ✅ Make it easy to spell

### Cost Saving:
- **First year:** Often $1-5 with promotions
- **Renewal:** Usually $10-15/year
- **Privacy protection:** Often included free

### Multiple Domains:
You can buy multiple domains and point them all to the same site:
- `placerforestschool.com` (primary)
- `forestschoolplacer.com` (redirect)
- `placernatureschool.com` (redirect)

---

## 🛠️ Troubleshooting

### If your domain doesn't work:
1. **Check DNS:** Use dnschecker.org
2. **Verify A records:** Should point to GitHub's IPs
3. **CNAME file:** Must exist in repository root
4. **Wait longer:** DNS can take up to 24 hours

### GitHub Pages Status:
- Green checkmark = Working ✅
- Yellow warning = In progress ⚠️  
- Red X = Configuration error ❌

---

## 📧 Email Setup (Optional)

Your domain registrar usually offers email:
- `info@placerforestschool.com`
- `enrollment@placerforestschool.com`

**Alternative:** Use Google Workspace ($6/month) for professional email with your domain.

---

## Final Result 🎉

After setup, your visitors can access your website at:
- ✅ `https://placerforestschool.com`
- ✅ `https://www.placerforestschool.com`  
- ✅ Secure SSL certificate
- ✅ Professional appearance
- ✅ Easy to remember and share!
