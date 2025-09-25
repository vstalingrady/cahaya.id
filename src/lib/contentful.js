// lib/contentful.js
import { createClient } from 'contentful';

// Initialize Contentful client
// You'll need to get these values from your Contentful account
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

export default client;

// Types for TypeScript (if using TypeScript)
/*
export interface FeatureCard {
  title: string;
  description: string;
  icon: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface FooterLink {
  text: string;
  url: string;
}

export interface LandingPageData {
  title: string;
  metaDescription: string;
  heroHeading: string;
  heroSubtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  featureCards: FeatureCard[];
  featureItems: FeatureItem[];
  ctaSection: {
    heading: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
  footer: {
    copyrightText: string;
    links: FooterLink[];
  };
}
*/