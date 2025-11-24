import React from 'react';
import { Search, Filter } from 'lucide-react';
import { LandSearchFilters } from '../types/LandScraperSchema';

interface SearchFiltersProps {
    filters: LandSearchFilters;
    setFilters: (filters: LandSearchFilters) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    handleSearch: () => void;
    loading: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    handleSearch,
    loading
}) => {
    return (
        <div className="search-panel">
            <div className="search-header">
                <h2 className="search-title">
                    <Search size={20} />
                    Advanced Land Search
                </h2>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="filter-toggle"
                >
                    <Filter size={16} />
                    <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                </button>
            </div>

            {/* Basic Search */}
            {/* Basic Search */}
            {showFilters && (
                <div className="search-grid">
                    <div className="form-group">
                        <label htmlFor="prefecture">Prefecture</label>
                        <select
                            id="prefecture"
                            value={filters.prefecture || ''}
                            onChange={(e) => setFilters({ ...filters, prefecture: e.target.value })}
                        >
                            <option value="">All Prefectures</option>
                            <option value="tokyo">Tokyo</option>
                            <option value="kanagawa">Kanagawa</option>
                            <option value="osaka">Osaka</option>
                            <option value="chiba">Chiba</option>
                            <option value="saitama">Saitama</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="maxPrice">Max Price</label>
                        <select
                            id="maxPrice"
                            value={filters.maxPrice || ''}
                            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                        >
                            <option value="">No limit</option>
                            <option value="30000000">¥3,000万</option>
                            <option value="50000000">¥5,000万</option>
                            <option value="100000000">¥1億</option>
                            <option value="200000000">¥2億</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="minArea">Min Area (m²)</label>
                        <input
                            type="number"
                            id="minArea"
                            placeholder="e.g. 66 (max 150)"
                            value={filters.minArea || ''}
                            onChange={(e) => setFilters({ ...filters, minArea: Number(e.target.value) })}
                            max="150"
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="maxArea">Max Area (m²)</label>
                        <input
                            type="number"
                            id="maxArea"
                            placeholder="e.g. 165 (max 150)"
                            value={filters.maxArea || ''}
                            onChange={(e) => setFilters({ ...filters, maxArea: Number(e.target.value) })}
                            max="150"
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="maxWalkTime">Max Walk Time (min)</label>
                        <select
                            id="maxWalkTime"
                            value={filters.maxWalkTime || ''}
                            onChange={(e) => setFilters({ ...filters, maxWalkTime: Number(e.target.value) })}
                        >
                            <option value="">No limit</option>
                            <option value="5">5 min</option>
                            <option value="10">10 min</option>
                            <option value="15">15 min</option>
                            <option value="20">20 min</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="sortBy">Sort By</label>
                        <select
                            id="sortBy"
                            value={filters.sortBy || 'none'}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                        >
                            <option value="none">None</option>
                            <option value="newest">New/Updated</option>
                            <option value="price">Price</option>
                            <option value="area">Land Area</option>
                            <option value="pricePerTsubo">Price per Tsubo</option>
                            <option value="location">Location</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="sortOrder">Sort Order</label>
                        <select
                            id="sortOrder"
                            value={filters.sortOrder || 'asc'}
                            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })}
                            disabled={!filters.sortBy || filters.sortBy === 'none' || filters.sortBy === 'newest'}
                        >
                            <option value="asc">Ascending (Low to High)</option>
                            <option value="desc">Descending (High to Low)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="search-button"
                            style={{ marginTop: '1.5rem' }}
                        >
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    <Search size={16} />
                                    <span>Search Land</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchFilters;
