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


## Build for Production

```bash
npm run build
```

This generates a static `out/` folder ready for deployment.

---

## Deploy to AWS (S3 + CloudFront + SSL)

### Prerequisites

- AWS account
- Domain in Route 53
- AWS CLI installed: `https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html`
- Configured AWS credentials: `aws configure`

### 1. Build the Site

```bash
npm install
npm run build
```

This creates an `out/` directory with all static files.

### 2. Create S3 Bucket

```bash
DOMAIN="althousedesign.com"
aws s3api create-bucket --bucket $DOMAIN --region us-east-1
```

**Note**: Bucket name must match your domain exactly.

### 3. Configure S3 Bucket Policy

Allow CloudFront to access the bucket:

```bash
cat > bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::DOMAIN_NAME/*"
    }
  ]
}
EOF

sed -i 's/DOMAIN_NAME/'$DOMAIN'/g' bucket-policy.json
aws s3api put-bucket-policy --bucket $DOMAIN --policy file://bucket-policy.json
```

### 4. Upload Files to S3

```bash
aws s3 sync out/ s3://$DOMAIN --delete --cache-control "public, max-age=86400"
```

### 5. Request SSL Certificate (ACM)

```bash
CERT_ARN=$(aws acm request-certificate \
  --domain-name $DOMAIN \
  --subject-alternative-names "www.$DOMAIN" \
  --region us-east-1 \
  --query 'CertificateArn' \
  --output text)

echo "Certificate ARN: $CERT_ARN"
```

**Important**: Validate the certificate in ACM console (takes 5-10 minutes).

### 6. Create CloudFront Distribution

```bash
cat > cloudfront-config.json << 'EOF'
{
  "CallerReference": "althousedesign-1",
  "Comment": "Althouse Design",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3Origin",
        "DomainName": "DOMAIN_NAME.s3.us-east-1.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "CachePolicies": {
      "Quantity": 0,
      "Items": []
    },
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "Compress": true,
    "ViewerProtocolPolicy": "redirect-to-https",
    "TargetOriginId": "S3Origin",
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "MinTTL": 0
  },
  "CacheBehaviors": [
    {
      "PathPattern": "*.html",
      "AllowedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      },
      "CachePolicies": {
        "Quantity": 0,
        "Items": []
      },
      "Compress": true,
      "ViewerProtocolPolicy": "redirect-to-https",
      "TargetOriginId": "S3Origin",
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {"Forward": "none"}
      },
      "TrustedSigners": {
        "Enabled": false,
        "Quantity": 0
      },
      "MinTTL": 0,
      "DefaultTTL": 0,
      "MaxTTL": 0
    }
  ],
  "Enabled": true,
  "ViewerCertificate": {
    "CloudFrontDefaultCertificate": false,
    "ACMCertificateArn": "CERT_ARN_HERE",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "Certificate": "CERT_ARN_HERE",
    "CertificateSource": "acm"
  },
  "Aliases": {
    "Quantity": 2,
    "Items": ["althousedesign.com", "www.althousedesign.com"]
  },
  "WebACLId": "",
  "HttpVersion": "http2and3",
  "IsIPV6Enabled": true
}
EOF

sed -i 's|CERT_ARN_HERE|'$CERT_ARN'|g' cloudfront-config.json
sed -i 's/DOMAIN_NAME/'$DOMAIN'/g' cloudfront-config.json

DIST_ID=$(aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json \
  --query 'Distribution.Id' \
  --output text)

echo "CloudFront Distribution ID: $DIST_ID"
```

Save the Distribution ID for later.

### 7. Point Route 53 to CloudFront

```bash
# Get CloudFront domain
CF_DOMAIN=$(aws cloudfront get-distribution --id $DIST_ID --query 'Distribution.DomainName' --output text)

echo "CloudFront Domain: $CF_DOMAIN"

# Get Route 53 Hosted Zone ID
ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name $DOMAIN --query 'HostedZones[0].Id' --output text | cut -d'/' -f3)

# Create DNS records
aws route53 change-resource-record-sets --hosted-zone-id $ZONE_ID --change-batch '{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "'$DOMAIN'",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "'$CF_DOMAIN'",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "www.'$DOMAIN'",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "'$CF_DOMAIN'",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}'
```

### 8. Wait for Propagation

```bash
# Wait 5 minutes, then test:
curl -I https://althousedesign.com
```

You should see a 200 response with `x-amz-version-id` header.

---

### Update the Site

After making changes:

```bash
npm run build
aws s3 sync out/ s3://$DOMAIN --delete

# Invalidate CloudFront cache to see changes immediately
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

---

### Commands Reference

```bash
# Check distribution status
aws cloudfront get-distribution --id $DIST_ID

# View CloudFront URL
aws cloudfront get-distribution --id $DIST_ID --query 'Distribution.DomainName'

# Invalidate cache
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"

# List all distributions
aws cloudfront list-distributions

# Delete a distribution (must be disabled first)
aws cloudfront delete-distribution --id $DIST_ID --if-match ETAG
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
│   └── contact/page.tsx    # Contact (placeholder)
├── components/
│   ├── Navigation.tsx      # Fixed top nav with mobile menu
│   ├── Hero.tsx            # Full-screen hero
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
