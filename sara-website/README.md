# Althouse Design

**althousedesign.com** — Expertly sourced. Distinctly Domestic. Atlanta Interiors.

A Next.js "Coming Soon" website for Althouse Design interior studio.

---

## Run Locally

### Prerequisites

- Node.js 20.9+
- npm

### Setup

```bash
cd sara-website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API keys or environment variables required.

---

## Add Your Own Images

### Hero image

Replace `public/images/hero.jpg` with your own photo.

### Project images

Replace any of the files in `public/images/projects/` (`01.jpg` through `09.jpg`) with your own photos. The grid picks them up automatically.

```
public/
└── images/
    ├── hero.jpg              ← main hero background
    └── projects/
        ├── 01.jpg
        ├── 02.jpg
        ...
        └── 09.jpg
```

### Custom images (other pages / future use)

Place additional images in `public/images/custom/` and reference them in components as:

```tsx
import Image from "next/image";

<Image src="/images/custom/my-photo.jpg" alt="Description" width={800} height={600} />
```

Image metadata (alt text, display order) for the project grid lives in [`lib/images.ts`](lib/images.ts) — edit that file to update captions or add/remove entries.

---

## Email Notifications

The `/api/notify` endpoint is scaffolded and ready. To wire in a real email provider:

1. Install your provider SDK: `npm install resend` (or SendGrid, Nodemailer, etc.)
2. Create a `.env.local` file and add your keys
3. Follow the instructions in [`app/api/notify/route.ts`](app/api/notify/route.ts)

---

## Build for Production

```bash
npm run build
npm start
```

---

## Deploy to EC2

### 1. Provision EC2 Instance

- **AMI**: Ubuntu 22.04 LTS
- **Instance type**: t3.small (minimum) or t3.medium
- **Security groups**: Allow inbound on ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
- Attach an Elastic IP if using a custom domain

### 2. Install Node.js and PM2

```bash
# Connect via SSH
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Install nvm + Node.js 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node -v   # should print v20.x.x

# Install PM2 (process manager)
npm install -g pm2
```

### 3. Deploy the App

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/sara-website.git
cd sara-website

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "althouse-design" -- start
pm2 save
pm2 startup   # follow the printed command to auto-start on reboot
```

### 4. Configure Nginx as Reverse Proxy

```bash
sudo apt update && sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/althouse-design
```

Paste:

```nginx
server {
    listen 80;
    server_name althousedesign.com www.althousedesign.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/althouse-design /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d althousedesign.com -d www.althousedesign.com
# Follow prompts — Certbot auto-configures HTTPS and renewal
```

### 6. Point Your Domain

In your DNS provider (Route 53, Cloudflare, etc.), create an A record:

```
althousedesign.com     →  YOUR_EC2_ELASTIC_IP
www.althousedesign.com →  YOUR_EC2_ELASTIC_IP
```

### Useful PM2 Commands

```bash
pm2 status                   # check app status
pm2 logs althouse-design     # view logs
pm2 restart althouse-design  # restart after a code update
pm2 stop althouse-design     # stop
```

---

## Project Structure

```
sara-website/
├── app/
│   ├── layout.tsx          # Root layout (nav + footer + fonts)
│   ├── page.tsx            # Home — Coming Soon hero
│   ├── projects/page.tsx   # Projects (under construction)
│   ├── about/page.tsx      # About (placeholder)
│   ├── contact/page.tsx    # Contact (placeholder)
│   └── api/notify/route.ts # Email notification endpoint (scaffold)
├── components/
│   ├── Navigation.tsx      # Fixed top nav with mobile menu
│   ├── Hero.tsx            # Full-screen hero
│   ├── EmailSignup.tsx     # Email capture form
│   ├── ProjectGrid.tsx     # Project image grid
│   └── Footer.tsx          # Site footer
├── lib/
│   └── images.ts           # Image paths and alt text — edit here
├── public/
│   └── images/
│       ├── hero.jpg        ← replace with your hero photo
│       ├── projects/       ← replace 01–09.jpg with your project photos
│       └── custom/         ← additional images for future use
└── README.md
```

---

## Brand Colors

| Token              | Hex       | Usage             |
|--------------------|-----------|-------------------|
| `brand-slate`      | `#788990` | Primary text, nav |
| `brand-terracotta` | `#974315` | Accents, CTAs     |
| `brand-cream`      | `#F0EDE4` | Background, text  |
| `brand-sand`       | `#E3D6C5` | Borders, dividers |
| `brand-sage`       | `#8d957e` | Secondary accents |
