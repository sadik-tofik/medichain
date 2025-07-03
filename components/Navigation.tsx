'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';
import { WalletConnectButton } from './WalletConnectButton';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MediChain</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/verify" className="text-gray-700 hover:text-primary">
                Verify
              </Link>
              <Link href="/manufacturer" className="text-gray-700 hover:text-primary">
                Manufacturer
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary">
                Dashboard
              </Link>
              <WalletConnectButton />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/verify"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Verify
              </Link>
              <Link
                href="/manufacturer"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Manufacturer
              </Link>
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <div className="px-3 py-2">
                <WalletConnectButton />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}