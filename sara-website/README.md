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

## Build for Production (Static Export)

```bash
npm run build
```

This generates a static `out/` folder with HTML, CSS, and JavaScript files ready for S3.

---

## Deploy to AWS S3 + CloudFront + Route 53

This site is optimized for static hosting. The email signup uses **Formspree** (serverless, no backend needed).

### Prerequisites

- AWS account with S3, CloudFront, and Route 53 access
- AWS CLI installed: `https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html`
- Domain registered in Route 53 (you already have this)

### 0. Set Up Email (Formspree)

Before deploying, configure the email signup form:

1. Go to **https://formspree.io** and sign up (free tier available)
2. Create a new form for `althousedesign.com`
3. Copy your **Form ID** (looks like `xxxxxxxxxxxx`)
4. Update `components/EmailSignup.tsx`, replace `YOUR_FORMSPREE_ID` with your actual ID:
   ```tsx
   const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
   ```
5. Test locally: `npm run dev`, submit a test email, verify it arrives

### 1. Build the Site

```bash
npm install
npm run build
```

This creates an `out/` directory with all static files.

### 2. Create S3 Bucket

```bash
# Set your domain as the bucket name
DOMAIN="althousedesign.com"
aws s3api create-bucket --bucket $DOMAIN --region us-east-1
```

**Note**: Bucket name must match your domain exactly.

### 3. Enable Static Website Hosting on S3

```bash
aws s3api put-bucket-website \
  --bucket $DOMAIN \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "404.html"}
  }'
```

### 4. Block Public Access (Security First)

```bash
aws s3api put-public-access-block \
  --bucket $DOMAIN \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

CloudFront will access the bucket via Origin Access Control (OAC), not public URLs.

### 5. Upload Files to S3

```bash
aws s3 sync out/ s3://$DOMAIN --delete --cache-control "public, max-age=3600"
```

- `--delete`: removes old files not in `out/`
- `--cache-control`: cache files for 1 hour; adjust as needed

### 6. Create ACM SSL Certificate

```bash
aws acm request-certificate \
  --domain-name $DOMAIN \
  --subject-alternative-names "www.$DOMAIN" \
  --validation-method DNS \
  --region us-east-1
```

**Manual validation**: AWS will email you or ask you to add DNS records to Route 53. Follow the prompts and wait for the certificate to be **ISSUED** (can take a few minutes).

Get the certificate ARN:
```bash
aws acm list-certificates --region us-east-1
```

Copy the ARN for the certificate.

### 7. Create CloudFront Distribution

```bash
# Replace with your certificate ARN from step 6
CERT_ARN="arn:aws:acm:us-east-1:xxxxx:certificate/xxxxx"

aws cloudfront create-distribution \
  --origin-domain-name "$DOMAIN.s3.us-east-1.amazonaws.com" \
  --default-root-object "index.html" \
  --enabled \
  --viewer-protocol-policy "redirect-to-https" \
  --certificate-arn "$CERT_ARN" \
  --domain-names "$DOMAIN" "www.$DOMAIN" \
  --region us-east-1
```

Save the **Distribution ID** and **Domain Name** (looks like `d111111abcdef8.cloudfront.net`).

**Easier approach**: Use the AWS Console instead:
1. Go to **CloudFront** → **Create Distribution**
2. Set **Origin Domain**: `$DOMAIN.s3.us-east-1.amazonaws.com`
3. Set **Default Root Object**: `index.html`
4. Set **Viewer Protocol Policy**: `Redirect HTTP to HTTPS`
5. Set **SSL Certificate**: Select your ACM certificate
6. Add **Alternate Domain Names**: `althousedesign.com` and `www.althousedesign.com`
7. Create

### 8. Update Route 53 DNS Records

```bash
# Get your CloudFront domain name from step 7
CLOUDFRONT_DOMAIN="d111111abcdef8.cloudfront.net"

# Create Route 53 records
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_HOSTED_ZONE_ID \
  --change-batch '{
    "Changes": [
      {
        "Action": "CREATE",
        "ResourceRecordSet": {
          "Name": "'$DOMAIN'",
          "Type": "A",
          "AliasTarget": {
            "HostedZoneId": "Z2FDTNDATAQYW2",
            "DNSName": "'$CLOUDFRONT_DOMAIN'",
            "EvaluateTargetHealth": false
          }
        }
      },
      {
        "Action": "CREATE",
        "ResourceRecordSet": {
          "Name": "www.'$DOMAIN'",
          "Type": "A",
          "AliasTarget": {
            "HostedZoneId": "Z2FDTNDATAQYW2",
            "DNSName": "'$CLOUDFRONT_DOMAIN'",
            "EvaluateTargetHealth": false
          }
        }
      }
    ]
  }'
```

**Easier approach**: Use the AWS Console:
1. Go to **Route 53** → **Hosted Zones** → your domain
2. Click **Create Record**
3. Set **Name**: (leave empty for root domain)
4. Set **Record type**: `A`
5. Toggle **Alias** ON
6. Choose **CloudFront distribution** from dropdown
7. Create
8. Repeat for `www` subdomain

### 9. Verify DNS Propagation

```bash
# Wait 2-5 minutes, then test:
nslookup althousedesign.com
dig althousedesign.com

# Visit in browser:
# https://althousedesign.com
# https://www.althousedesign.com
```

---

### Updating the Site

After making changes:

```bash
npm run build
aws s3 sync out/ s3://$DOMAIN --delete --cache-control "public, max-age=3600"

# Invalidate CloudFront cache (speeds up updates):
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| 403 Forbidden | Check S3 bucket policy — CloudFront OAC should have access |
| CORS errors | Email form won't submit — verify Formspree ID in `EmailSignup.tsx` |
| DNS not resolving | Wait 5-10 minutes for Route 53 propagation; clear browser cache |
| Old content showing | Run the CloudFront invalidation command above |

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
