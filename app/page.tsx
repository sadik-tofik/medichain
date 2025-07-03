import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Scan, Building2, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <Shield className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
          MediChain
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Secure pharmaceutical supply chain verification using Cardano blockchain technology. 
          Protect patients from counterfeit drugs with immutable verification.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/verify">
            <Button size="lg" className="w-full sm:w-auto">
              <Scan className="mr-2" />
              Verify Drug
            </Button>
          </Link>
          <Link href="/manufacturers">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Building2 className="mr-2" />
              Manufacturer Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="verification-card border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scan className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Instant Verification</CardTitle>
            <CardDescription>
              Scan QR codes to instantly verify drug authenticity using blockchain technology
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="verification-card border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle>Blockchain Security</CardTitle>
            <CardDescription>
              Powered by Cardano blockchain for immutable and transparent drug tracking
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="verification-card border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle>Supply Chain Analytics</CardTitle>
            <CardDescription>
              Track and analyze pharmaceutical supply chain data in real-time
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Platform Impact</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <p className="text-muted-foreground">Drugs Verified</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
            <p className="text-muted-foreground">Registered Manufacturers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
            <p className="text-muted-foreground">Partner Pharmacies</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
            <p className="text-muted-foreground">Accuracy Rate</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Manufacturer Mints NFT</h3>
            <p className="text-muted-foreground">
              Drug manufacturers create unique NFTs for each batch on the Cardano blockchain
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">QR Code Generated</h3>
            <p className="text-muted-foreground">
              Each drug package receives a unique QR code linked to its blockchain record
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Instant Verification</h3>
            <p className="text-muted-foreground">
              Pharmacists and patients scan codes to verify authenticity in real-time
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-primary to-green-600 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Supply Chain?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join the revolution in pharmaceutical verification and protect patients worldwide
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/verify">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Start Verifying
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}