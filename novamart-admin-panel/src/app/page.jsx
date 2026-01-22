'use client';

import { useEffect, useState } from 'react';
import http from '@/lib/http';
import StatsCard from '@/components/StatsCard';
import SalesChart from '@/components/SalesChart';
import RecentOrders from '@/components/RecentOrders';
import StatusChart from '@/components/StatusChart';
import TopProducts from '@/components/TopProducts';

import DashboardFilters from '@/components/DashboardFilters';
import LowStockAlerts from '@/components/LowStockAlerts';

export default function Dashboard() {
  const [selectedRange, setSelectedRange] = useState('7d');
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    salesData: [],
    recentOrders: [],
    statusData: [],
    topProducts: [],
    lowStockProducts: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await http.get(`/analytics/dashboard?range=${selectedRange}`);
        if (res.status === 200) {
          const data = res.data;
          setStats({
            products: data.totalProducts,
            orders: data.totalOrders,
            users: data.totalUsers,
            revenue: data.totalRevenue,
            salesData: data.salesChartData,
            recentOrders: data.recentOrders,
            statusData: data.statusData,
            topProducts: data.topProducts,
            lowStockProducts: data.lowStockProducts
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [selectedRange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Dashboard Overview</h2>
          <p className="text-sm text-brand-muted">Real-time performance metrics</p>
        </div>
        <DashboardFilters activeRange={selectedRange} onRangeChange={setSelectedRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`৳${stats.revenue.toFixed(2)}`}
          type="brand"
          trend={8.5}
        />
        <StatsCard
          title="Total Orders"
          value={stats.orders}
          type="yellow"
          trend={-2.4}
        />
        <StatsCard
          title="Total Products"
          value={stats.products}
          type="purple"
          trend={12.5}
        />
        <StatsCard
          title="Total Users"
          value={stats.users}
          type="tree"
          trend={5.7}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={stats.salesData} />
        </div>
        <div className="lg:col-span-1">
          <LowStockAlerts products={stats.lowStockProducts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart data={stats.statusData} />
        <TopProducts products={stats.topProducts} />
      </div>

      <div className="grid grid-cols-1">
        <RecentOrders orders={stats.recentOrders} />
      </div>
    </div>
  );
}

