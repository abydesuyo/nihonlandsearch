import React from 'react';
import { TrendingUp, Building, Calculator, MapPin } from 'lucide-react';
import { formatPrice, formatTsubo } from '../utils/formatters';

interface StatsSummaryProps {
    summary: {
        totalProperties: number;
        avgPrice: number;
        avgPricePerTsubo: number;
        avgArea: number;
    } | null;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ summary }) => {
    if (!summary) return null;

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-content">
                    <div className="stat-icon blue">
                        <Building size={20} />
                    </div>
                    <div className="stat-text">
                        <p>Total Properties</p>
                        <p>{summary.totalProperties}</p>
                    </div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-content">
                    <div className="stat-icon green">
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-text">
                        <p>Avg Price</p>
                        <p>{formatPrice(summary.avgPrice)}</p>
                    </div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-content">
                    <div className="stat-icon purple">
                        <Calculator size={20} />
                    </div>
                    <div className="stat-text">
                        <p>Avg Per Tsubo</p>
                        <p>{formatPrice(summary.avgPricePerTsubo)}</p>
                    </div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-content">
                    <div className="stat-icon orange">
                        <MapPin size={20} />
                    </div>
                    <div className="stat-text">
                        <p>Avg Area</p>
                        <p>{formatTsubo(summary.avgArea)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsSummary;
