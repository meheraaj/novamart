export default function RecentOrders({ orders = [] }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-border-base overflow-hidden">
            <div className="p-6 border-b border-border-base flex justify-between items-center">
                <h3 className="text-lg font-bold text-brand-dark">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-fill-base text-xs uppercase text-brand-muted font-semibold tracking-wider">
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-base">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-fill-secondary transition-colors">
                                <td className="px-6 py-4 font-medium text-brand-dark">#{order.id}</td>
                                <td className="px-6 py-4 text-brand-muted">{order.user?.name || 'Guest'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status?.name)}`}>
                                        {order.status?.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-brand-dark font-medium">৳{order.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
