# Contentful Content Models for Caharaya Landing Page

## 1. Landing Page (Main Entry Point)
- **Content Type ID**: `landingPage`
- **Fields**:
  - title (Short text)
  - metaDescription (Short text)
  - heroHeading (Short text)
  - heroSubtitle (Short text)
  - ctaPrimaryText (Short text)
  - ctaPrimaryLink (Short text)
  - ctaSecondaryText (Short text)
  - ctaSecondaryLink (Short text)

## 2. Feature Card
- **Content Type ID**: `featureCard`
- **Fields**:
  - title (Short text)
  - description (Short text)
  - icon (Short text - icon name from Lucide or custom)
  - order (Integer - for sorting)

## 3. Feature Item
- **Content Type ID**: `featureItem`
- **Fields**:
  - title (Short text)
  - description (Short text)
  - icon (Short text - icon name from Lucide or custom)
  - order (Integer - for sorting)

## 4. Testimonial (Optional)
- **Content Type ID**: `testimonial`
- **Fields**:
  - name (Short text)
  - role (Short text)
  - company (Short text)
  - quote (Long text)
  - avatar (Media)
  - order (Integer - for sorting)

## 5. Call to Action Section
- **Content Type ID**: `ctaSection`
- **Fields**:
  - heading (Short text)
  - subtitle (Short text)
  - buttonText (Short text)
  - buttonLink (Short text)

## 6. Footer
- **Content Type ID**: `footer`
- **Fields**:
  - copyrightText (Short text)
  - links (JSON - array of {text, url} objects)