'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Shield, AlertTriangle, Package, CheckCircle, Clock, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

const verificationData = [
  { month: 'Jan', verified: 1200, fake: 45 },
  { month: 'Feb', verified: 1400, fake: 32 },
  { month: 'Mar', verified: 1800, fake: 28 },
  { month: 'Apr', verified: 2100, fake: 15 },
  { month: 'May', verified: 2300, fake: 22 },
  { month: 'Jun', verified: 2800, fake: 18 },
];

const drugCategoryData = [
  { category: 'Analgesics', count: 3500, color: '#0088FE' },
  { category: 'Antibiotics', count: 2800, color: '#00C49F' },
  { category: 'Cardiovascular', count: 2200, color: '#FFBB28' },
  { category: 'Respiratory', count: 1800, color: '#FF8042' },
  { category: 'Diabetes', count: 1200, color: '#8884D8' },
];

const manufacturerData = [
  { name: 'PharmaCorp', verified: 4500, fake: 12 },
  { name: 'MediTech Ltd', verified: 3200, fake: 8 },
  { name: 'BioSolutions', verified: 2800, fake: 15 },
  { name: 'HealthCare Inc', verified: 2100, fake: 5 },
  { name: 'GlobalMeds', verified: 1800, fake: 22 },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center">
          <BarChart3 className="w-10 h-10 mr-4 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Monitor drug verification trends and supply chain analytics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Verified</p>
                <p className="text-3xl font-bold text-green-800">14,400</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% from last month
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Counterfeits Detected</p>
                <p className="text-3xl font-bold text-red-800">160</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  -12% from last month
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Registered Manufacturers</p>
                <p className="text-3xl font-bold text-blue-800">248</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  +5 new this month
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Verification Rate</p>
                <p className="text-3xl font-bold text-purple-800">98.9%</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  +0.3% improvement
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="manufacturers">Manufacturers</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Trends</CardTitle>
                <CardDescription>Monthly verification vs counterfeit detection</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={verificationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="verified" fill="#10B981" name="Verified" />
                    <Bar dataKey="fake" fill="#EF4444" name="Counterfeit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Drug Categories</CardTitle>
                <CardDescription>Distribution of verified drugs by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={drugCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(1)}%`}
                    >
                      {drugCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Drug Category Performance</CardTitle>
              <CardDescription>Verification statistics by drug category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drugCategoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div>
                        <h4 className="font-semibold">{category.category}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category.count.toLocaleString()} verifications
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {((category.count / drugCategoryData.reduce((acc, cat) => acc + cat.count, 0)) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manufacturers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Manufacturers</CardTitle>
              <CardDescription>Verification performance by manufacturer</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={manufacturerData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="verified" fill="#10B981" name="Verified" />
                  <Bar dataKey="fake" fill="#EF4444" name="Counterfeit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Success Rate</CardTitle>
              <CardDescription>Monthly success rate trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={verificationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`${((value as number) / ((value as number) + 30) * 100).toFixed(1)}%`, 'Success Rate']} />
                  <Area 
                    type="monotone" 
                    dataKey="verified" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Verification Activity
          </CardTitle>
          <CardDescription>Latest drug verification attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { drug: 'Paracetamol 500mg', batch: 'BTC-2024-156', status: 'verified', time: '2 minutes ago', location: 'City Pharmacy, Mumbai' },
              { drug: 'Amoxicillin 250mg', batch: 'BTC-2024-157', status: 'verified', time: '5 minutes ago', location: 'MedPlus, Delhi' },
              { drug: 'Ibuprofen 400mg', batch: 'FAKE-001', status: 'counterfeit', time: '12 minutes ago', location: 'Apollo Pharmacy, Bangalore' },
              { drug: 'Aspirin 75mg', batch: 'BTC-2024-158', status: 'verified', time: '18 minutes ago', location: '1mg Pharmacy, Chennai' },
              { drug: 'Metformin 500mg', batch: 'BTC-2024-159', status: 'verified', time: '25 minutes ago', location: 'Netmeds, Hyderabad' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'verified' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h4 className="font-semibold">{activity.drug}</h4>
                    <p className="text-sm text-muted-foreground">
                      Batch: {activity.batch} • {activity.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={activity.status === 'verified' ? 'default' : 'destructive'}>
                    {activity.status === 'verified' ? 'Verified' : 'Counterfeit'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}