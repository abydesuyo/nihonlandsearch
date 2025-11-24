import React, { useState, useEffect } from 'react';
import { LandProperty, LandSearchFilters } from '../types/LandScraperSchema';
import Header from './Header';
import SearchFilters from './SearchFilters';
import StatsSummary from './StatsSummary';
import PropertyCard from './PropertyCard';

import { LandScraperAPI } from '../utils/SuumoLandScraper';


const LandSearchUI: React.FC = () => {
  const [properties, setProperties] = useState<LandProperty[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<LandSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [summary, setSummary] = useState<any>(null);

  // const { toggleTheme } = useTheme();
  const api = new LandScraperAPI();

  // Sample data for demonstration - REMOVED as per instruction

  useEffect(() => {
    // Initial search when component mounts
    handleSearch();
  }, []); // Empty dependency array means it runs once on mount

  const handleSearch = async () => {
    setLoading(true);
    setPage(1); // Reset to page 1 on new search
    try {
      const results = await api.searchProperties(filters, 1);
      setProperties(results);

      setSummary({
        totalProperties: results.length,
        avgPrice: results.length > 0
          ? Number(results.reduce((sum, p) => sum + p.price, BigInt(0))) / results.length
          : 0,
        avgPricePerTsubo: results.length > 0
          ? results.reduce((sum, p) => sum + p.pricePerTsubo, 0) / results.length
          : 0,
        avgArea: results.length > 0
          ? results.reduce((sum, p) => sum + p.landAreaTsubo, 0) / results.length
          : 0
      });
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const newResults = await api.searchProperties(filters, nextPage);
      setProperties(prev => [...prev, ...newResults]);
      setPage(nextPage);

      // Update summary with combined results
      const allProperties = [...properties, ...newResults];
      setSummary({
        totalProperties: allProperties.length,
        avgPrice: allProperties.length > 0
          ? Number(allProperties.reduce((sum, p) => sum + p.price, BigInt(0))) / allProperties.length
          : 0,
        avgPricePerTsubo: allProperties.length > 0
          ? allProperties.reduce((sum, p) => sum + p.pricePerTsubo, 0) / allProperties.length
          : 0,
        avgArea: allProperties.length > 0
          ? allProperties.reduce((sum, p) => sum + p.landAreaTsubo, 0) / allProperties.length
          : 0
      });
    } catch (error) {
      console.error('Error loading more properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="land-search-container">
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <SearchFilters
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        handleSearch={handleSearch}
        loading={loading}
      />

      <StatsSummary summary={summary} />

      {/* Results */}
      {/* Results */}
      {viewMode === 'grid' ? (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="map-view-placeholder" style={{
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          color: '#94a3b8',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '3rem' }}>🗺️</div>
          <h3>Map View Coming Soon</h3>
          <p>We are working on integrating Google Maps to visualize these {properties.length} properties.</p>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Switch back to Grid View
          </button>
        </div>
      )}

      {/* Load More */}
      <div className="load-more">
        <button onClick={handleLoadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More Properties'}
        </button>
      </div>
    </div>
  );
};

export default LandSearchUI;