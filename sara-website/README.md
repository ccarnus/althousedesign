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
```

This generates a static `out/` folder ready for S3.

---

## Deploy to S3

### Prerequisites

- AWS account with S3 access
- AWS CLI installed: `https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html`

### 1. Build

```bash
npm install
npm run build
```

### 2. Create S3 Bucket

```bash
aws s3api create-bucket --bucket althousedesign.com --region us-east-1
```

### 3. Upload Files

```bash
aws s3 sync out/ s3://althousedesign.com --delete --cache-control "public, max-age=3600"
```

### 4. Configure S3 for Static Website

```bash
aws s3api put-bucket-website \
  --bucket althousedesign.com \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "404.html"}
  }'
```

### 5. Point Route 53 to S3

1. Go to **Route 53** → **Hosted Zones** → your domain
2. Create A record pointing to S3 website endpoint: `althousedesign.com.s3-website.us-east-1.amazonaws.com`
3. Repeat for `www` subdomain

Visit `http://althousedesign.com` — it's live!

---

### Update the Site

```bash
npm run build
aws s3 sync out/ s3://althousedesign.com --delete
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
