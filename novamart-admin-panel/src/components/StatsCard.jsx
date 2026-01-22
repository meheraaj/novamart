import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function StatsCard({ title, value, type = 'brand', trend }) {
    const isPositive = trend > 0;

    const colors = {
        brand: 'text-brand',
        yellow: 'text-yellow',
        tree: 'text-brand-tree-dark',
        danger: 'text-brand-danger',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border-base hover:shadow-md transition-shadow duration-200">
            <h3 className="text-sm font-medium text-brand-muted uppercase tracking-wider mb-2">{title}</h3>
            <div className="flex items-end justify-between">
                <p className={`text-3xl font-bold ${colors[type] || 'text-brand-dark'}`}>{value}</p>
                <div className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    <span>{Math.abs(trend)}%</span>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Compared to last month</p>
        </div>
    );
}
