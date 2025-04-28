import React, { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function Verify() {
  const [scanResult, setScanResult] = useState(null)
  const [scanHistory, setScanHistory] = useState([
    { medication: "Amoxicillin 500mg", timestamp: "April 24, 2025 - 14:32" },
    { medication: "Paracetamol 500mg", timestamp: "April 25, 2025 - 09:55" },
    { medication: "Lisinopril 10mg", timestamp: "April 22, 2025 - 18:47" }
  ])

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('scanner', {
      qrbox: {
        width: 250,
        height: 250
      },
      fps: 10,
    }, (decodedText) => {
      handleScan(decodedText)
    })

    scanner.render()

    return () => {
      scanner.clear()
    }
  }, [])

  const handleScan = (result) => {
    setScanResult({
      status: Math.random() > 0.3 ? 'GENUINE' : 'FAKE',
      medication: "Amoxicillin 500mg",
      manufacturer: "GlaxoSmithKline",
      batchNumber: "BATCH200424",
      expiry: "April 2027",
      timestamp: new Date().toLocaleString()
    })
    
    setScanHistory(prev => [{
      medication: "Amoxicillin 500mg",
      timestamp: new Date().toLocaleString()
    }, ...prev.slice(0, 4)])
  }

  return (
    <div className="min-h-screen bg-darkbg text-white font-inter p-8">
      <h1 className="text-3xl font-bold mb-8">QR Scanner</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Scanner Section */}
        <div className="lg:w-2/3">
          <p className="text-gray-400 mb-4">Position the QR code within the frame to scan</p>
          <div id="scanner" className="w-full h-96 bg-gray-800 rounded-lg mb-6"></div>
          
          <div className="flex gap-4 mb-8">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg">
              Upload Image
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg">
              Toggle Flash
            </button>
            <button className="bg-cardano hover:bg-blue-800 px-4 py-2 rounded-lg">
              Start Camera
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg">
              Switch Camera
            </button>
          </div>
          
          {scanResult && (
            <div className={`p-6 rounded-lg mb-8 ${scanResult.status === 'GENUINE' ? 'bg-genuine' : 'bg-fake'}`}>
              <h2 className="text-2xl font-bold mb-4">{scanResult.status}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300">Medication</p>
                  <p className="font-bold">{scanResult.medication}</p>
                </div>
                <div>
                  <p className="text-gray-300">Manufacturer</p>
                  <p className="font-bold">{scanResult.manufacturer}</p>
                </div>
                <div>
                  <p className="text-gray-300">Batch Number</p>
                  <p className="font-bold">{scanResult.batchNumber}</p>
                </div>
                <div>
                  <p className="text-gray-300">Expiry Date</p>
                  <p className="font-bold">{scanResult.expiry}</p>
                </div>
              </div>
              <p className="text-gray-300 mt-4">Verified On: {scanResult.timestamp}</p>
            </div>
          )}
        </div>
        
        {/* Scan History */}
        <div className="lg:w-1/3">
          <h2 className="text-xl font-bold mb-4">Scan History</h2>
          <div className="bg-gray-800 rounded-lg p-4">
            {scanHistory.map((item, index) => (
              <div key={index} className="py-3 border-b border-gray-700 last:border-0">
                <p className="font-medium">{item.medication}</p>
                <p className="text-gray-400 text-sm">{item.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}