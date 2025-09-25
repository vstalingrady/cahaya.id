'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import CaharayaIcon from '@/components/icons/caharaya-icon';
import CaharayaIconText from '@/components/icons/caharaya-icon-text';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email Us",
      details: ["support@caharaya.app", "partnerships@caharaya.app"]
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Call Us",
      details: ["+62 21 1234 5678", "Mon-Fri, 9:00 AM - 6:00 PM WIB"]
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Visit Us",
      details: ["Jl. Jenderal Sudirman Kav. 52-53", "Jakarta 12190, Indonesia"]
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Business Hours",
      details: ["Monday-Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 2:00 PM", "Sunday: Closed"]
    }
  ];

  return (
    <div className="relative w-full bg-background text-foreground">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background" />
      
      {/* Hero Section */}
      <div className="w-full py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-6">
              Have questions about Caharaya? We're here to help. Reach out to us through any of the channels below.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold font-serif mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Enter your email address" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  placeholder="What is this regarding?" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  placeholder="How can we help you?" 
                  rows={5} 
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold font-serif mb-6">Contact Information</h2>
            <p className="text-muted-foreground mb-8">
              Prefer to reach us directly? Use the contact information below to get in touch with our team.
            </p>
            
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex">
                  <div className="rounded-full bg-primary/10 p-3 mr-4">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* FAQ CTA */}
            <div className="mt-12 p-6 bg-muted rounded-2xl">
              <h3 className="font-semibold text-lg mb-2">Need quick answers?</h3>
              <p className="text-muted-foreground mb-4">
                Check out our FAQ section for common questions and answers.
              </p>
              <Button variant="outline" asChild>
                <Link href="/faq">
                  Visit FAQ Section
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-foreground">
            Need Help with Your Account?
          </h2>
          <p className="text-primary-foreground/90 mt-4 max-w-2xl mx-auto">
            For account-specific issues, visit our support center for step-by-step guides and troubleshooting.
          </p>
          <Button 
            size="lg" 
            className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90" 
            asChild
          >
            <Link href="/support">
              Visit Support Center
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <CaharayaIcon className="h-8 w-8 text-primary" />
            <CaharayaIconText className="h-6 hidden md:block" />
          </div>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground">
              Support
            </Link>
          </div>
        </div>
        <div className="text-center text-muted-foreground text-sm mt-8">
          © {new Date().getFullYear()} caharaya. All rights reserved.
        </div>
      </footer>
    </div>
  );
}