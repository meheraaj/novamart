'use client';

import { FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

export default function LowStockAlerts({ products = [] }) {
    if (!products || products.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border-base h-full flex flex-col items-center justify-center text-brand-muted">
                <p>All stock levels are healthy</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border-base flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-brand-dark flex items-center">
                    <FaExclamationTriangle className="text-yellow-500 mr-2" />
                    Low Stock Alerts
                </h3>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                    {products.length} Items
                </span>
            </div>

            <div className="space-y-4 flex-1">
                {products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 group hover:border-yellow-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-white flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                                {product.image?.thumbnail || product.image ? (
                                    <img src={product.image?.thumbnail || product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] text-gray-400 italic">No Img</span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-brand-dark line-clamp-1">
                                    {product.name}
                                </h4>
                                <p className="text-xs text-red-500 font-medium">Only {product.quantity} left in stock</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border-base">
                <Link href="/products" className="text-brand text-sm font-semibold hover:underline flex justify-center">
                    View All Products
                </Link>
            </div>
        </div>
    );
}
