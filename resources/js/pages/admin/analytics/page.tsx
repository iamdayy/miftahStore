"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

const salesData = [
  { month: "Jan", sales: 45000, orders: 320, customers: 180 },
  { month: "Feb", sales: 52000, orders: 380, customers: 220 },
  { month: "Mar", sales: 48000, orders: 350, customers: 200 },
  { month: "Apr", sales: 61000, orders: 420, customers: 280 },
  { month: "May", sales: 55000, orders: 390, customers: 250 },
  { month: "Jun", sales: 67000, orders: 480, customers: 320 },
]

const topProducts = [
  { name: "Designer Leather Jacket", sales: 245, revenue: 73455, growth: 12 },
  { name: "Luxury Handbag", sales: 189, revenue: 113211, growth: 8 },
  { name: "Premium Sneakers", sales: 167, revenue: 33383, growth: 15 },
  { name: "Elegant Evening Dress", sales: 134, revenue: 53466, growth: 5 },
  { name: "Classic Watch", sales: 98, revenue: 78402, growth: -3 },
]

const customerSegments = [
  { segment: "New Customers", count: 1250, percentage: 35, color: "from-blue-500 to-cyan-500" },
  { segment: "Returning Customers", count: 1890, percentage: 53, color: "from-green-500 to-emerald-500" },
  { segment: "VIP Customers", count: 430, percentage: 12, color: "from-purple-500 to-pink-500" },
]

export default function Analytics() {
  const [mounted, setMounted] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Track your business performance</p>
              </div>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
              </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-0 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-10" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$328,000</div>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5% from last period
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-10" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,340</div>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.2% from last period
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-0 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-10" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,250</div>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +15.3% from last period
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-0 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-10" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$140.17</div>
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -2.1% from last period
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sales Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Sales Overview
                    </CardTitle>
                    <CardDescription>Monthly sales performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {salesData.map((data, index) => (
                        <motion.div
                          key={data.month}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                            <span className="font-medium">{data.month}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${data.sales.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{data.orders} orders</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Customer Segments */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Customer Segments
                    </CardTitle>
                    <CardDescription>Customer distribution by type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {customerSegments.map((segment, index) => (
                        <motion.div
                          key={segment.segment}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{segment.segment}</span>
                            <span className="text-sm text-gray-600">{segment.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${segment.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              className={`h-2 rounded-full bg-gradient-to-r ${segment.color}`}
                            />
                          </div>
                          <div className="text-right text-sm text-gray-500">{segment.percentage}%</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    Top Performing Products
                  </CardTitle>
                  <CardDescription>Best selling products by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-3 font-semibold text-gray-700">Product</th>
                          <th className="text-left p-3 font-semibold text-gray-700">Sales</th>
                          <th className="text-left p-3 font-semibold text-gray-700">Revenue</th>
                          <th className="text-left p-3 font-semibold text-gray-700">Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product, index) => (
                          <motion.tr
                            key={product.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                          >
                            <td className="p-3">
                              <div className="font-medium text-gray-900">{product.name}</div>
                            </td>
                            <td className="p-3 text-gray-700">{product.sales}</td>
                            <td className="p-3 font-semibold text-gray-900">${product.revenue.toLocaleString()}</td>
                            <td className="p-3">
                              <div
                                className={`flex items-center gap-1 ${
                                  product.growth >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {product.growth >= 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {Math.abs(product.growth)}%
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
