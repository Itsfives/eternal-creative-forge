# Deployment Instructions

## Overview
This document provides step-by-step instructions for deploying your restored Lovable Portfolio Site to various hosting platforms.

## Prerequisites
- ✅ Database restored and functioning
- ✅ Environment variables configured
- ✅ Source code ready for deployment
- ✅ Storage buckets configured

## Platform-Specific Deployment

### 1. Vercel (Recommended)

**Step 1: Prepare for Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

**Step 2: Configure Project**
```bash
# Initialize Vercel project
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up environment variables
```

**Step 3: Environment Variables**
In Vercel dashboard:
1. Go to Project → Settings → Environment Variables
2. Add all variables from `environment_template.env`
3. Set for Production, Preview, and Development

**Step 4: Deploy**
```bash
# Deploy to production
vercel --prod
```

### 2. Netlify

**Step 1: Build Configuration**
Create `netlify.toml` in project root:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Step 2: Deploy via Git**
1. Connect GitHub repository to Netlify
2. Configure build settings
3. Add environment variables in Site Settings

**Step 3: Custom Domain (Optional)**
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS records

### 3. Digital Ocean App Platform

**Step 1: Create App Spec**
Create `.do/app.yaml`:
```yaml
name: portfolio-site
services:
- name: web
  source_dir: /
  github:
    repo: your-username/your-repo
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: VITE_SUPABASE_URL
    value: YOUR_SUPABASE_URL
  - key: VITE_SUPABASE_PUBLISHABLE_KEY
    value: YOUR_SUPABASE_KEY
  - key: VITE_SUPABASE_PROJECT_ID
    value: YOUR_PROJECT_ID
```

### 4. Railway

**Step 1: Connect Repository**
1. Connect GitHub repository to Railway
2. Railway auto-detects Node.js project

**Step 2: Environment Variables**
Add environment variables in Railway dashboard

**Step 3: Custom Domain**
Configure custom domain in Railway settings

### 5. AWS Amplify

**Step 1: Connect Repository**
1. Connect GitHub repository to AWS Amplify
2. Configure build settings

**Step 2: Build Specification**
Create `amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Custom VPS/Server Deployment

### Using PM2 and Nginx

**Step 1: Server Setup**
```bash
# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install pm2@latest -g

# Install Nginx
sudo apt update
sudo apt install nginx
```

**Step 2: Deploy Application**
```bash
# Clone repository
git clone your-repo-url
cd your-project

# Install dependencies
npm install

# Build production version
npm run build

# Serve with PM2
pm2 serve dist 3000 --spa
pm2 startup
pm2 save
```

**Step 3: Nginx Configuration**
Create `/etc/nginx/sites-available/your-domain`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Step 4: SSL Certificate**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
      - VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID}
```

## Post-Deployment Checklist

### ✅ Verification Steps
1. **Functionality Testing**
   - [ ] Home page loads correctly
   - [ ] Portfolio items display
   - [ ] Authentication works
   - [ ] Admin panel accessible
   - [ ] File uploads functional
   - [ ] Contact forms working

2. **Performance Testing**
   - [ ] Page load times acceptable
   - [ ] Images load properly
   - [ ] Mobile responsiveness
   - [ ] SEO meta tags present

3. **Security Verification**
   - [ ] HTTPS enabled
   - [ ] Environment variables secure
   - [ ] Database permissions correct
   - [ ] No exposed credentials

### 🔧 Troubleshooting

**Common Issues:**

1. **Environment Variables Not Loading**
   - Verify all environment variables are set
   - Check variable naming (VITE_ prefix required)
   - Restart deployment after changes

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Test database connectivity

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Review build logs for errors

4. **Routing Issues**
   - Ensure SPA redirect rules configured
   - Check React Router setup
   - Verify base URL configuration

### 📈 Performance Optimization

1. **Caching Strategy**
   - Enable CDN caching
   - Configure browser caching headers
   - Use service worker for offline support

2. **Image Optimization**
   - Compress images before upload
   - Use WebP format when possible
   - Implement lazy loading

3. **Bundle Optimization**
   - Code splitting implementation
   - Tree shaking enabled
   - Minimize bundle size

## Monitoring and Maintenance

### Analytics Setup
- Configure Google Analytics
- Set up error tracking (Sentry)
- Monitor Core Web Vitals

### Backup Strategy
- Schedule database backups
- Monitor storage usage
- Document update procedures

### Security Updates
- Regular dependency updates
- Monitor security advisories
- Keep runtime environments updated

---

**Need Help?**
- Check deployment platform documentation
- Review application logs
- Test locally before deploying
- Contact support if issues persist