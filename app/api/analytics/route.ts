import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get verification statistics
    const [
      totalVerifications,
      genuineVerifications,
      totalBatches,
      batchesByManufacturer
    ] = await Promise.all([
      prisma.verification.count(),
      prisma.verification.count({
        where: { isGenuine: true }
      }),
      prisma.batch.count(),
      prisma.batch.groupBy({
        by: ['manufacturer'],
        _count: {
          batchId: true
        },
        orderBy: {
          _count: {
            batchId: 'desc'
          }
        },
        take: 10
      })
    ]);

    const fakeVerifications = totalVerifications - genuineVerifications;
    
    // Get recent verifications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentVerifications = await prisma.verification.findMany({
      where: {
        timestamp: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        batch: true
      },
      orderBy: { timestamp: 'desc' },
      take: 10
    });
    
    // Calculate monthly trends using Prisma (compatible with Neon)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyVerifications = await prisma.verification.findMany({
      where: {
        timestamp: {
          gte: sixMonthsAgo
        }
      },
      select: {
        timestamp: true,
        isGenuine: true
      }
    });
    
    // Group by month manually (more compatible across databases)
    const monthlyData = monthlyVerifications.reduce((acc, verification) => {
      const month = verification.timestamp.toISOString().slice(0, 7); // YYYY-MM format
      
      if (!acc[month]) {
        acc[month] = { total: 0, genuine: 0, fake: 0 };
      }
      
      acc[month].total++;
      if (verification.isGenuine) {
        acc[month].genuine++;
      } else {
        acc[month].fake++;
      }
      
      return acc;
    }, {} as Record<string, { total: number; genuine: number; fake: number }>);
    
    const monthlyTrends = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month: new Date(month + '-01'),
        ...data
      }))
      .sort((a, b) => b.month.getTime() - a.month.getTime())
      .slice(0, 6);
    
    return NextResponse.json({
      summary: {
        totalVerifications,
        genuineVerifications,
        fakeVerifications,
        totalBatches,
        verificationRate: totalVerifications > 0 ? (genuineVerifications / totalVerifications * 100).toFixed(1) : '0'
      },
      recentVerifications,
      batchesByManufacturer,
      monthlyTrends
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}