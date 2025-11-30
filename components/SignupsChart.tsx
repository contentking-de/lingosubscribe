'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  date: string
  signups: number
}

export default function SignupsChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [stats, setStats] = useState({
    total: 0,
    totalUnconfirmed: 0,
    notified: 0,
    pending: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const result = await response.json()
      if (response.ok) {
        setData(result.chartData)
        setStats({
          total: result.total,
          totalUnconfirmed: result.totalUnconfirmed || 0,
          notified: result.notified,
          pending: result.pending,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading chart data...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Confirmed</div>
          <div className="text-3xl font-bold text-primary-600">{stats.total}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Unconfirmed</div>
          <div className="text-3xl font-bold text-gray-600">{stats.totalUnconfirmed}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Notified</div>
          <div className="text-3xl font-bold text-green-600">{stats.notified}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Signups (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getDate()}/${date.getMonth() + 1}`
            }}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })
            }}
          />
          <Line 
            type="monotone" 
            dataKey="signups" 
            stroke="#f0641e" 
            strokeWidth={2}
            dot={{ fill: '#f0641e', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

