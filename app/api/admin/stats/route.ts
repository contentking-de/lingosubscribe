import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, subDays } from 'date-fns'

export async function GET() {
  try {
    const total = await prisma.subscription.count({ where: { confirmed: true } })
    const totalUnconfirmed = await prisma.subscription.count({ where: { confirmed: false } })
    const notified = await prisma.subscription.count({
      where: { notified: true, confirmed: true },
    })

    // Get signups for the last 30 days (only confirmed)
    const thirtyDaysAgo = startOfDay(subDays(new Date(), 30))
    const dailySignups = await prisma.subscription.groupBy({
      by: ['createdAt'],
      where: {
        confirmed: true,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    })

    // Group by day
    const signupsByDay: Record<string, number> = {}
    dailySignups.forEach((item) => {
      const day = startOfDay(item.createdAt).toISOString().split('T')[0]
      signupsByDay[day] = (signupsByDay[day] || 0) + item._count.id
    })

    // Get last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 29 - i))
      return date.toISOString().split('T')[0]
    })

    const chartData = last30Days.map((day) => ({
      date: day,
      signups: signupsByDay[day] || 0,
    }))

    return NextResponse.json({
      total,
      totalUnconfirmed,
      notified,
      pending: total - notified,
      chartData,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}


