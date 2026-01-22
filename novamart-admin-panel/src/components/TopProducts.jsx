'use client';

export default function TopProducts({ products }) {
    if (!products || products.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border-base h-full flex flex-col items-center justify-center text-brand-muted">
                <p>No top products found</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border-base flex flex-col h-full">
            <h3 className="text-lg font-bold text-brand-dark mb-6">Top Selling Products</h3>
            <div className="space-y-4 flex-1">
                {products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100 italic flex items-center justify-center text-[10px] text-gray-400">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : 'No Img'}
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-brand-dark line-clamp-1 group-hover:text-brand transition-colors">
                                    {product.name}
                                </h4>
                                <p className="text-xs text-brand-muted">{product.count} sales</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-brand-dark">৳{product.revenue.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
