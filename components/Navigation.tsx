'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Menu, X, Scan, Building2, BarChart3 } from 'lucide-react';
import { WalletConnectButton } from './WalletConnectButton';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">MediChain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/verify" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Scan className="w-4 h-4" />
              <span>Verify</span>
            </Link>
            <Link 
              href="/manufacturers" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Manufacturers</span>
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Button>Get Started</Button>
            <WalletConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/verify" 
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Scan className="w-4 h-4" />
                <span>Verify Drug</span>
              </Link>
              <Link 
                href="/manufacturers" 
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Building2 className="w-4 h-4" />
                <span>Manufacturers</span>
              </Link>
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Button className="w-full mt-4">Get Started</Button>
              <WalletConnectButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}