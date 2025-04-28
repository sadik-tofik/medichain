import React from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-darkbg text-white font-inter p-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-4xl font-bold mb-6">Scan. Verify. Save Lives.</h1>
        <p className="text-xl text-gray-300 mb-10">
          Protect yourself and your loved ones from counterfeit medications. Our blockchain-powered 
          verification system ensures you receive genuine pharmaceuticals.
        </p>
        <button className="bg-cardano hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full text-lg transition-all">
          Scan Medication Now
        </button>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800 rounded-xl p-6 max-w-4xl mx-auto mb-16">
        <p className="text-2xl font-bold text-center mb-4">250K+ deaths/year from fake drugs</p>
        <p className="text-gray-400 text-center">
          According to the World Health Organization, counterfeit medication claim over a quarter 
          million lives annually. Verification saves lives.
        </p>
      </div>

      {/* Trust Badges */}
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-gray-400 mb-6">Trusted By Global Health Organizations</p>
        <div className="flex justify-center gap-12">
          <div className="text-center">
            <div className="h-16 w-16 bg-white rounded-full mx-auto mb-2"></div>
            <p>World Health Organization</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-cardano rounded-full mx-auto mb-2"></div>
            <p>Cardano Blockchain</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-avalanche rounded-full mx-auto mb-2"></div>
            <p>Avalanche Network</p>
          </div>
        </div>
      </div>
    </div>
  )
}