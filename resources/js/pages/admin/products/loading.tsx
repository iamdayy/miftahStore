"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function ProductsLoading() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters Skeleton */}
            <Card className="mb-6 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-40" />
                </div>
              </CardContent>
            </Card>

            {/* Table Skeleton */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        {[...Array(7)].map((_, index) => (
                          <th key={index} className="text-left p-4">
                            <Skeleton className="h-4 w-20" />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-100">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Skeleton className="w-12 h-12 rounded-lg" />
                              <div>
                                <Skeleton className="h-4 w-32 mb-1" />
                                <Skeleton className="h-3 w-16" />
                              </div>
                            </div>
                          </td>
                          {[...Array(6)].map((_, colIndex) => (
                            <td key={colIndex} className="p-4">
                              <Skeleton className="h-4 w-20" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
