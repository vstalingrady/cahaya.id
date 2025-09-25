// This is a conceptual example of how to modify your page to work with Contentful
// You would need to install the Contentful SDK: npm install contentful

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Shield, TrendingUp, Wallet, BarChart3, Coins, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

// Map icon names to actual components
const iconMap = {
  wallet: Wallet,
  shield: Shield,
  trendingUp: TrendingUp,
  barChart3: BarChart3,
  coins: Coins,
  zap: Zap,
};

// This would be replaced with actual Contentful client setup
// import contentfulClient from '../lib/contentful';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  // These would be populated from CMS data
  const [cmsData, setCmsData] = useState(null);
  
  useEffect(() => {
    setIsVisible(true);
    
    // This would fetch data from Contentful
    /*
    const fetchCmsData = async () => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'landingPage'
        });
        setCmsData(response.items[0].fields);
      } catch (error) {
        console.error('Error fetching CMS data:', error);
      }
    };
    
    fetchCmsData();
    */
  }, []);

  // Default content (what you currently have)
  const defaultData = {
    title: "Caharaya - Take Control of Your Finances",
    heroHeading: "Take Control of Your Finances",
    heroSubtitle: "caharaya helps you manage your money, track spending, and achieve your financial goals with ease.",
    ctaPrimaryText: "Get Started",
    ctaPrimaryLink: "/signup",
    ctaSecondaryText: "View Demo",
    ctaSecondaryLink: "/demo",
    featureCards: [
      {
        title: "Track Spending",
        description: "Monitor where your money goes with intuitive charts",
        icon: "barChart3"
      },
      {
        title: "Set Goals",
        description: "Achieve your savings targets faster",
        icon: "coins"
      },
      {
        title: "Smart Alerts",
        description: "Get notified about unusual spending",
        icon: "zap"
      }
    ],
    featureItems: [
      {
        title: "Bank-Level Security",
        description: "Your financial data is protected with military-grade encryption and never shared with third parties.",
        icon: "shield"
      },
      {
        title: "Smart Insights",
        description: "Get personalized recommendations to help you save more and spend smarter based on your habits.",
        icon: "trendingUp"
      },
      {
        title: "All-in-One Platform",
        description: "Connect all your accounts in one place for a complete view of your financial health.",
        icon: "wallet"
      }
    ],
    ctaSection: {
      heading: "Ready to Transform Your Financial Life?",
      subtitle: "Join thousands of users who have taken control of their finances with caharaya.",
      buttonText: "Create Your Account",
      buttonLink: "/signup"
    },
    footer: {
      copyrightText: `© ${new Date().getFullYear()} caharaya. All rights reserved.`,
      links: [
        { text: "Terms", url: "/terms-of-service" },
        { text: "Privacy", url: "#" },
        { text: "Support", url: "#" }
      ]
    }
  };

  const data = cmsData || defaultData;

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background has-hero-glow" />
      <div className="absolute inset-x-0 top-[-80px] -z-10 h-[300px] w-full bg-background has-glowing-dots-glow" />
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Caharaya",
            "description": "Personal finance management platform that helps you manage money, track spending, and achieve financial goals.",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-serif">caharaya</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/demo">Demo</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className={`text-4xl md:text-6xl font-bold font-serif leading-tight has-blurry-glow-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {data.heroHeading} <span className="text-primary animate-text-glow">Finances</span>
          </h1>
          <p className={`text-lg md:text-xl text-muted-foreground mt-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {data.heroSubtitle}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mt-10 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link href={data.ctaPrimaryLink}>
                {data.ctaPrimaryText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={data.ctaSecondaryLink}>{data.ctaSecondaryText}</Link>
            </Button>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className={`mt-20 md:mt-32 flex justify-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative w-full max-w-4xl h-64 md:h-96 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.featureCards.map((card, index) => {
                  const IconComponent = iconMap[card.icon] || Wallet;
                  return (
                    <div key={index} className="bg-card border border-border rounded-xl p-6 w-full md:w-48 h-48 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow animate-fade-in-up">
                      <div className="rounded-full bg-primary/10 p-4 mb-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-center">{card.title}</h3>
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl font-bold font-serif">Why Choose Caharaya?</h2>
          <p className="text-muted-foreground mt-4">
            Our platform provides everything you need to take control of your financial future.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.featureItems.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Wallet;
            return (
              <div key={index} className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="rounded-full bg-primary/10 p-4 w-12 h-12 flex items-center justify-center mb-6">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-foreground">
            {data.ctaSection.heading}
          </h2>
          <p className="text-primary-foreground/90 mt-4 max-w-2xl mx-auto">
            {data.ctaSection.subtitle}
          </p>
          <Button 
            size="lg" 
            className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 animate-slow-pulse" 
            asChild
          >
            <Link href={data.ctaSection.buttonLink}>{data.ctaSection.buttonText}</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-serif">caharaya</span>
          </div>
          <div className="flex space-x-6 mt-6 md:mt-0">
            {data.footer.links.map((link, index) => (
              <Link key={index} href={link.url} className="text-muted-foreground hover:text-foreground">
                {link.text}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center text-muted-foreground text-sm mt-8">
          {data.footer.copyrightText}
        </div>
      </footer>
    </div>
  );
}