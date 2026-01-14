import React from 'react';

interface Stats {
    onemsiz: number;
    dusuk: number;
    orta: number;
    onemli: number;
    yuksek: number;
}

interface RiskStatsProps {
    totalRisks: number;
    stats: Stats;
}

const RiskStats: React.FC<RiskStatsProps> = React.memo(({ totalRisks, stats }) => {
    const statConfig = [
        { label: 'Toplam Risk', value: totalRisks, border: 'border-gray-300', bg: 'bg-gray-50', text: 'text-gray-700', sub: 'text-gray-600' },
        { label: 'Önemsiz', value: stats.onemsiz, border: 'border-green-400', bg: 'bg-green-50', text: 'text-green-700', sub: 'text-green-600' },
        { label: 'Düşük', value: stats.dusuk, border: 'border-blue-400', bg: 'bg-blue-50', text: 'text-blue-700', sub: 'text-blue-600' },
        { label: 'Orta', value: stats.orta, border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700', sub: 'text-yellow-600' },
        { label: 'Önemli', value: stats.onemli, border: 'border-orange-400', bg: 'bg-orange-50', text: 'text-orange-700', sub: 'text-orange-600' },
        { label: 'Yüksek', value: stats.yuksek, border: 'border-red-500', bg: 'bg-red-100', text: 'text-red-800', sub: 'text-red-700' },
    ];

    return (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-6 gap-3">
            {statConfig.map((item, index) => (
                <div key={index} className={`border-2 ${item.border} rounded p-3 ${item.bg} text-center`}>
                    <div className={`text-2xl font-bold ${item.text}`}>{item.value}</div>
                    <div className={`text-xs ${item.sub}`}>{item.label}</div>
                </div>
            ))}
        </div>
    );
});

export default RiskStats;
