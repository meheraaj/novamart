'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import http from '@/lib/http';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await http.get('/orders/all');
            const data = res.data;
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-dark">Orders</h2>

            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-border-base">
                <table className="w-full text-left">
                    <thead className="bg-fill-base border-b border-border-base">
                        <tr>
                            <th className="p-4 font-semibold text-brand-muted">Order ID</th>
                            <th className="p-4 font-semibold text-brand-muted">Customer</th>
                            <th className="p-4 font-semibold text-brand-muted">Date</th>
                            <th className="p-4 font-semibold text-brand-muted">Total</th>
                            <th className="p-4 font-semibold text-brand-muted">Status</th>
                            <th className="p-4 font-semibold text-brand-muted">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id || order.id} className="border-b border-border-base hover:bg-fill-secondary">
                                <td className="p-4 font-medium text-brand-dark">#{order.id}</td>
                                <td className="p-4 text-brand-muted">
                                    {order.user?.name || 'Guest'}
                                    <div className="text-xs text-brand-muted">{order.user?.email}</div>
                                </td>
                                <td className="p-4 text-brand-muted">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-brand-muted">৳{order.total}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${order.status?.name === 'Delivered'
                                            ? 'bg-green-100 text-green-800'
                                            : order.status?.name === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {order.status?.name || 'Unknown'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="text-brand hover:text-brand-tree"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
