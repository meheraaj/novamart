'use client';

export default function DashboardFilters({ activeRange, onRangeChange }) {
    const ranges = [
        { id: 'today', label: 'Today' },
        { id: '7d', label: 'Last 7 Days' },
        { id: '30d', label: 'Last 30 Days' },
    ];

    return (
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
            {ranges.map((range) => (
                <button
                    key={range.id}
                    onClick={() => onRangeChange(range.id)}
                    className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${activeRange === range.id
                            ? 'bg-white text-brand shadow-sm'
                            : 'text-brand-muted hover:text-brand-dark'
                        }`}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
}
