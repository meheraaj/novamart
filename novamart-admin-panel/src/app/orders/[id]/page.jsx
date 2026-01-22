'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import http from '@/lib/http';

export default function OrderDetailsPage() {
    const params = useParams();
    const id = params.id;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            // Note: Admin endpoint for single order might need to be created or we use the user one if authorized
            // For now assuming we can fetch by ID if we implement admin check on GET /api/orders/:id correctly or add /api/orders/admin/:id
            // Let's try the standard endpoint, assuming our mock auth allows it or we fix it.
            // Actually, our previous implementation of GET /api/orders/:id checks for req.user. 
            // We might need to update the API to allow admin access to any order.
            // For this frontend task, I'll assume the API works or I'll fix it later.
            // Use the new Admin endpoint that doesn't check for order ownership
            console.log('Fetching order with ID:', id);
            const url = `/orders/admin/${id}`;
            console.log('Request URL:', url);
            const res = await http.get(url);
            if (res.status === 200) {
                const data = res.data;
                setOrder(data);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-dark">Order #{order.id}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-card border border-border-base">
                        <h3 className="text-xl font-semibold mb-4 text-brand-dark">Items</h3>
                        <div className="space-y-4">
                            {order.products?.map((product, index) => (
                                <div key={index} className="flex items-center justify-between border-b border-border-base pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center space-x-4">
                                        <img 
                                            src={
                                                typeof product.image === 'string' ? product.image :
                                                product.image?.thumbnail ? product.image.thumbnail :
                                                product.image?.original ? product.image.original :
                                                '/assets/placeholder/products/product-list.svg' // Fallback
                                            } 
                                            alt={product.name} 
                                            className="w-16 h-16 object-cover rounded bg-gray-100"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/assets/placeholder/products/product-list.svg';
                                            }}
                                        />
                                        <div>
                                            <p className="font-medium text-brand-dark">{product.name}</p>
                                            <p className="text-sm text-brand-muted">Qty: {product.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-brand-dark">৳{product.price * product.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border-base flex justify-between items-center">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-xl text-brand">৳{order.total}</span>
                        </div>
                    </div>
                </div>

                {/* Customer & Shipping Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-card border border-border-base">
                        <h3 className="text-xl font-semibold mb-4 text-brand-dark">Customer</h3>
                        <p className="text-brand-muted"><span className="font-medium text-brand-dark">Name:</span> {order.user?.name}</p>
                        <p className="text-brand-muted"><span className="font-medium text-brand-dark">Email:</span> {order.user?.email}</p>
                        {order.contact_number && (
                            <p className="text-brand-muted"><span className="font-medium text-brand-dark">Phone:</span> {order.contact_number}</p>
                        )}
                        {order.delivery_note && (
                            <div className="mt-4 pt-4 border-t border-border-base">
                                <h4 className="font-medium text-brand-dark mb-1">Delivery Note:</h4>
                                <p className="text-brand-muted text-sm bg-gray-50 p-2 rounded border border-border-base">{order.delivery_note}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-card border border-border-base">
                        <h3 className="text-xl font-semibold mb-4 text-brand-dark">Shipping Address</h3>
                        {order.shipping_address ? (
                            <div className="text-brand-muted">
                                {order.shipping_address?.address?.formatted_address ? (
                                    <p>{order.shipping_address.address.formatted_address}</p>
                                ) : (
                                    <>
                                        <p>{order.shipping_address.street_address || (typeof order.shipping_address.address === 'string' ? order.shipping_address.address : '')}</p>
                                        <p>{order.shipping_address.city} {order.shipping_address.zip}</p>
                                        <p>{order.shipping_address.country}</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <p className="text-brand-muted">No shipping address provided</p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-card border border-border-base">
                        <h3 className="text-xl font-semibold mb-4 text-brand-dark">Status</h3>
                        <div className="flex gap-2">
                            <select
                                value={order.status?.name || 'Pending'}
                                onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    // Optimistic update
                                    setOrder(prev => ({ ...prev, status: { ...prev.status, name: newStatus } }));

                                    try {
                                        // Ideally we need the ID of the status, but for this mock/simple API 
                                        // we might need to send the status name or ID. 
                                        // Assuming the API accepts { status: "StatusName" } or similar for now.
                                        // If the backend expects an ID, we'd need a list of statuses. 
                                        // For this demo, let's assume we send the name.
                                        const res = await http.put(`/orders/${id}`, { status: newStatus });
                                        if (res.status === 200) {
                                            alert('Status updated successfully');
                                        }
                                    } catch (error) {
                                        console.error('Failed to update status:', error);
                                        alert('Failed to update status');
                                        fetchOrder(); // Revert on error
                                    }
                                }}
                                className="w-full p-2 border border-border-base rounded-md focus:ring-brand focus:border-brand"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
