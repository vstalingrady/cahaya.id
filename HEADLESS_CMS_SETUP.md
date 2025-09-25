# Headless CMS Setup Guide for Caharaya

This guide will help you set up Contentful as a visual CMS for your Caharaya landing page while keeping all the beautiful design and functionality.

## Prerequisites

1. A Contentful account (free tier available at contentful.com)
2. Your existing Next.js project
3. Node.js and npm installed

## Step 1: Set up Contentful Account

1. Go to [contentful.com](https://www.contentful.com/) and create an account
2. Create a new space for your Caharaya project
3. Note down your:
   - Space ID (Settings > General Settings)
   - Content Delivery API Key (Settings > API keys)

## Step 2: Install Contentful SDK

```bash
npm install contentful
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_ENVIRONMENT=master
```

## Step 4: Set up Content Models

In your Contentful space, create the following content types:

### Landing Page Content Type
1. Go to Content model > Add content type
2. Name: `Landing Page`
3. ID: `landingPage`
4. Add fields:
   - title (Short text)
   - metaDescription (Short text)
   - heroHeading (Short text)
   - heroSubtitle (Short text)
   - ctaPrimaryText (Short text)
   - ctaPrimaryLink (Short text)
   - ctaSecondaryText (Short text)
   - ctaSecondaryLink (Short text)

### Feature Card Content Type
1. Go to Content model > Add content type
2. Name: `Feature Card`
3. ID: `featureCard`
4. Add fields:
   - title (Short text)
   - description (Short text)
   - icon (Short text - e.g., "barChart3", "coins", "zap")
   - order (Integer)

### Feature Item Content Type
1. Go to Content model > Add content type
2. Name: `Feature Item`
3. ID: `featureItem`
4. Add fields:
   - title (Short text)
   - description (Short text)
   - icon (Short text - e.g., "shield", "trendingUp", "wallet")
   - order (Integer)

### CTA Section Content Type
1. Go to Content model > Add content type
2. Name: `CTA Section`
3. ID: `ctaSection`
4. Add fields:
   - heading (Short text)
   - subtitle (Short text)
   - buttonText (Short text)
   - buttonLink (Short text)

### Footer Content Type
1. Go to Content model > Add content type
2. Name: `Footer`
3. ID: `footer`
4. Add fields:
   - copyrightText (Short text)
   - links (JSON object)

## Step 5: Create Content

1. Go to Content > Add entry
2. Create entries for each content type with your actual content
3. Publish all entries

## Step 6: Enable Visual Editing

Contentful offers a visual editing experience through their Contentful App:

1. Install the Contentful Chrome extension
2. Configure it to work with your localhost development server
3. You'll be able to click on elements on your page and edit content directly

## Alternative: Use a Visual CMS Like Sanity

If you prefer Sanity.io:

1. `npx sanity init` in your project
2. Follow the prompts to create a new Sanity project
3. Define your schema in `schemas/`
4. Use `@sanity/client` instead of `contentful`

## Benefits of This Approach

✅ Visual content editing without losing your design
✅ Keep all animations and interactive elements
✅ Maintain SEO optimizations
✅ Easy to update content without coding
✅ Professional content management
✅ Can be extended with more content types later

## Next Steps

1. Set up your Contentful account
2. Create the content models as described
3. Add your actual content
4. Test the integration with your Next.js app
5. Enable visual editing for real-time content updates

This approach gives you the best of both worlds: a beautiful, custom-designed website with the flexibility to update content visually!