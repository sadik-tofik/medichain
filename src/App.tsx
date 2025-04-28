import React, { useState } from 'react'
import Home from './components/Home'
import Verify from './components/Verify'
import Dashboard from './components/Dashboard'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home />
      case 'verify': return <Verify />
      case 'dashboard': return <Dashboard />
      default: return <Home />
    }
  }

  return (
    <div className="font-inter">
      {/* Simple Navigation */}
      <nav className="bg-gray-900 p-4 flex justify-center gap-6">
        <button 
          onClick={() => setCurrentPage('home')} 
          className={`px-4 py-2 rounded-lg ${currentPage === 'home' ? 'bg-cardano' : 'bg-gray-800'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentPage('verify')} 
          className={`px-4 py-2 rounded-lg ${currentPage === 'verify' ? 'bg-cardano' : 'bg-gray-800'}`}
        >
          Verify
        </button>
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className={`px-4 py-2 rounded-lg ${currentPage === 'dashboard' ? 'bg-cardano' : 'bg-gray-800'}`}
        >
          Dashboard
        </button>
      </nav>

      {renderPage()}
    </div>
  )
}