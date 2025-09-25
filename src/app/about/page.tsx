import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  ArrowRight, 
  Users, 
  Target, 
  Eye, 
  Zap, 
  Heart, 
  Award, 
  Lightbulb, 
  Shield,
  Wallet,
  BarChart3,
  PieChart,
  ClipboardList,
  PiggyBank,
  Sparkles,
  Bell,
  Smartphone,
  Brain
} from 'lucide-react';
import CaharayaIcon from '@/components/icons/caharaya-icon';
import CaharayaIconText from '@/components/icons/caharaya-icon-text';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Vstalin Grady",
      role: "CEO",
      bio: "Visionary leader with a passion for solving real-world financial problems through technology. Committed to bringing financial clarity to every Indonesian.",
      image: "/images/team/placeholder-ceo.svg"
    },
    {
      name: "Aurelryo Oscar Jonathan",
      role: "CTO",
      bio: "Tech innovator with expertise in financial technology and secure data management. Leads our engineering team in building cutting-edge financial solutions.",
      image: "/images/team/placeholder-cto.svg"
    }
  ];

  const values = [
    {
      icon: <Eye className="h-8 w-8 text-primary" />,
      title: "Clarity",
      description: "We believe financial clarity is the foundation of financial freedom. Our mission is to eliminate the confusion that plagues digitally-active Indonesians."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Simplicity",
      description: "Financial management should be simple and intuitive. We strip away complexity to deliver a seamless experience."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Empowerment",
      description: "We empower our users with tools and insights to make confident financial decisions and achieve their goals."
    }
  ];

  return (
    <div className="relative w-full bg-background text-foreground overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background" />
      
      {/* Hero Section */}
      <div className="w-full py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
              Our Mission: <span className="text-primary">Financial Clarity</span> for All Indonesians
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-6">
              We're on a mission to solve the massive problem of Financial Fragmentation that affects millions of digitally-active Indonesians.
            </p>
          </div>
        </div>
      </div>

      {/* The Problem Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-serif mb-6">The Problem We Solve</h2>
            <p className="text-muted-foreground mb-4">
              The average young person in Indonesia has their money and financial life scattered across numerous platforms:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="rounded-full bg-primary/10 p-1 mr-3 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>Multiple Bank Accounts: Primary salary, secondary account, digital bank</span>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-primary/10 p-1 mr-3 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>Multiple E-Wallets: Transport, shopping, general payments, promotions</span>
              </li>
            </ul>
            <p className="text-muted-foreground">
              This fragmentation creates significant real-world problems: No Clarity, Mental Anxiety, and Inefficiency in managing finances.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  <span>BCA Account</span>
                </div>
                <span className="font-mono">Rp 2.500.000</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                  <span>Mandiri Account</span>
                </div>
                <span className="font-mono">Rp 1.200.000</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                  <span>GoPay</span>
                </div>
                <span className="font-mono">Rp 150.000</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                  <span>OVO</span>
                </div>
                <span className="font-mono">Rp 85.000</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                  <span>ShopeePay</span>
                </div>
                <span className="font-mono">Rp 220.000</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary rounded-lg text-primary-foreground mt-6">
                <span className="font-semibold">Total Net Worth</span>
                <span className="font-mono font-bold text-xl">Rp 4.155.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Solution Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-serif mb-4">Our Solution: The Financial Command Center</h2>
          <p className="text-muted-foreground">
            Caharaya provides a single, secure, and intuitive "command center" for a user's entire financial life.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Aggregation</h3>
            <p className="text-muted-foreground">
              Using a secure, one-time linking process powered by licensed Open Banking API partners, connect all your financial accounts.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Unified Dashboard</h3>
            <p className="text-muted-foreground">
              See your Total Net Worth - a single, powerful number that is the sum of all your connected accounts in real-time.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Proactive Champion</h3>
            <p className="text-muted-foreground">
              Upgrade to Caharaya Pro for features like Unified Bills Hub, E-Wallet Optimizer, and AI Financial Advisor.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h3 className="text-2xl font-bold font-serif mb-6 text-center">Powerful Features for Smarter Finance</h3>
          
          {/* Dashboard Preview */}
          <div className="mb-8 p-6 bg-gradient-to-br from-card to-primary/5 rounded-2xl border border-border">
            <h4 className="font-bold text-lg mb-4 flex items-center">
              <Wallet className="h-5 w-5 text-primary mr-2" />
              Unified Dashboard Preview
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart Visualization */}
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-sm font-semibold text-muted-foreground">Net Worth Trend</h5>
                  <span className="text-xs text-muted-foreground">Last 6 months</span>
                </div>
                <div className="h-32 relative">
                  <div className="absolute inset-0 flex items-end justify-between gap-1">
                    {/* Chart line - simplified representation */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-full bg-primary/20 rounded-t" style={{ height: '30%' }}></div>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-full bg-primary/40 rounded-t" style={{ height: '45%' }}></div>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-full bg-primary/60 rounded-t" style={{ height: '60%' }}></div>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-full bg-primary/80 rounded-t" style={{ height: '75%' }}></div>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-full bg-primary rounded-t" style={{ height: '90%' }}></div>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-full bg-primary/90 rounded-t" style={{ height: '95%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Apr</span>
                  <span className="text-xs text-muted-foreground">Sep</span>
                </div>
              </div>
              
              {/* Account Summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Total Assets</span>
                  </div>
                  <span className="font-semibold">Rp 212.2jt</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Cash Accounts</span>
                  </div>
                  <span className="font-semibold">Rp 86.2jt</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-sm">Investments</span>
                  </div>
                  <span className="font-semibold">Rp 125jt</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary rounded-lg text-primary-foreground mt-2">
                  <span className="font-semibold">Net Worth</span>
                  <span className="font-bold text-lg">Rp 212.2jt</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Unified Dashboard</h4>
              <p className="text-sm text-muted-foreground">See all your accounts in one place</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Smart Analytics</h4>
              <p className="text-sm text-muted-foreground">Track spending patterns and trends</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Budgeting</h4>
              <p className="text-sm text-muted-foreground">Set and track custom budgets</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Automated Savings</h4>
              <p className="text-sm text-muted-foreground">Save automatically with vaults</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-serif mb-4">Our Vision</h2>
          <p className="text-muted-foreground">
            We have a clear roadmap to transform financial management for Indonesians.
          </p>
        </div>

        <div className="space-y-16">
          {/* Stage 1 */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-start mb-6">
              <div className="rounded-full bg-primary/10 p-3 mr-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif mb-2">Stage 1: The Immediate Vision — CLARITY</h3>
                <h4 className="text-xl font-semibold mb-4">(The Product: Caharaya)</h4>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Our immediate vision is to bring clarity and control to the chaotic financial lives of every young Indonesian.
            </p>
            <p className="text-muted-foreground mb-4">
              We will build Caharaya, the single most intuitive and powerful financial command center. It will be the place where the daily anxiety of managing scattered bank accounts and e-wallets disappears, replaced by a simple, unified, and beautiful view of one's entire financial world. We will solve the real, painful problem of financial fragmentation that our generation faces every single day.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-start mb-6">
              <div className="rounded-full bg-primary/10 p-3 mr-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif mb-2">Stage 2: The Deeper Vision — TRUST</h3>
                <h4 className="text-xl font-semibold mb-4">(The Philosophy: The Financial Champion)</h4>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              But a dashboard is not the true vision. Our deeper vision is to create a true "Financial Champion" for our users.
            </p>
            <p className="text-muted-foreground">
              We are building a proactive, intelligent agent that doesn't just report the past, but actively works to improve the user's future. It will be a trusted ally that finds savings, warns of financial pitfalls, and guides them towards their goals. We are not in the business of selling data or features; we are in the business of building a relationship of unbreakable trust between a user and their money.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-serif mb-4">Our Leadership Team</h2>
          <p className="text-muted-foreground">
            Meet the people driving Caharaya's mission forward.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-muted rounded-xl w-16 h-16 flex items-center justify-center mr-4 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={`${member.name}`}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-serif mb-4">Our Core Values</h2>
          <p className="text-muted-foreground">
            These principles guide everything we do at Caharaya.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-foreground">
            Join Our Mission
          </h2>
          <p className="text-primary-foreground/90 mt-4 max-w-2xl mx-auto">
            Be part of the movement to bring financial clarity to millions of Indonesians.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" 
              asChild
            >
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" 
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
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