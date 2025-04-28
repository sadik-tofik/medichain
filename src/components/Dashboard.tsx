import React from 'react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function Dashboard() {
  const fakeDrugReports = [
    { location: [6.5244, 3.3792], radius: 15 }, // Lagos
    { location: [1.2921, 36.8219], radius: 12 }, // Nairobi
    { location: [0.3136, 32.5811], radius: 8 }, // Kampala
    { location: [30.0444, 31.2357], radius: 10 }, // Cairo
  ]

  const recentActivity = [
    { timestamp: "Apr 24, 2025 - 14:32", medication: "Amoxicillin 500mg", manufacturer: "GlaxoSmithKline", location: "Lagos, Nigeria", status: "GENUINE" },
    { timestamp: "Apr 24, 2025 - 13:47", medication: "Ciprofloxacin 250mg", manufacturer: "Unknown", location: "Nairobi, Kenya", status: "FAKE" },
    { timestamp: "Apr 24, 2025 - 12:15", medication: "Metformin 500mg", manufacturer: "Merck", location: "Accra, Ghana", status: "GENUINE" }
  ]

  const mostCounterfeited = [
    "Amoxicillin",
    "Paracetamol",
    "Ciprofloxacin",
    "Metformin"
  ]

  return (
    <div className="min-h-screen bg-darkbg text-white font-inter p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Alert Box */}
        <div className="lg:col-span-3 bg-red-900/30 border border-red-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">What to do if your medication is flagged as FAKE</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Do not consume the medication under any circumstances</li>
            <li>Keep the packaging intact for evidence</li>
            <li>Report to your local health authority immediately</li>
            <li>Contact the pharmacy or supplier where you purchased it</li>
          </ul>
          <button className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
            Report Counterfeit Medication
          </button>
        </div>

        {/* Stats Cards */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 mb-2">Total Verifications</h3>
          <p className="text-3xl font-bold">1,248,567</p>
          <p className="text-green-500 mt-2">↑ 12.4% from last month</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 mb-2">Fake Drugs Detected</h3>
          <p className="text-3xl font-bold">87,342</p>
          <p className="text-green-500 mt-2">↑ 8.7% from last month</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 mb-2">Verification Rate</h3>
          <p className="text-3xl font-bold">93.2%</p>
          <p className="text-green-500 mt-2">↑ 2.1% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Map */}
        <div className="bg-gray-800 rounded-lg p-6 h-96">
          <h2 className="text-xl font-bold mb-4">Counterfeit Hotspots in Africa</h2>
          <MapContainer 
            center={[8, 20]} 
            zoom={3} 
            style={{ height: '300px', width: '100%', borderRadius: '0.5rem' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {fakeDrugReports.map((report, index) => (
              <CircleMarker
                key={index}
                center={report.location}
                radius={report.radius}
                color="#E84142"
                fillOpacity={0.5}
              />
            ))}
          </MapContainer>
        </div>

        {/* Most Counterfeited */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Most Counterfeited Medications</h2>
          <div className="space-y-3">
            {mostCounterfeited.map((med, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-red-500/30 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-500">{index + 1}</span>
                </div>
                <p>{med}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Verification Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3">TIMESTAMP</th>
                <th className="pb-3">MEDICATION</th>
                <th className="pb-3">MANUFACTURER</th>
                <th className="pb-3">LOCATION</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="py-3">{item.timestamp}</td>
                  <td>{item.medication}</td>
                  <td>{item.manufacturer}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'GENUINE' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="text-blue-400 hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-gray-400">
          Showing 1 to {recentActivity.length} of 42 results
        </div>
      </div>
    </div>
  )
}