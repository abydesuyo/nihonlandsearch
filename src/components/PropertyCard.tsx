import React from 'react';
import { MapPin, Building } from 'lucide-react';
import { LandProperty } from '../types/LandScraperSchema';
import { formatPrice, formatTsubo, getUtilityIcons, getBuildingPotential, getLandUseZoneLabel } from '../utils/formatters';

interface PropertyCardProps {
    property: LandProperty;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const potential = getBuildingPotential(property);
    const utilities = getUtilityIcons(property);

    return (
        <div className="property-card">
            {/* Property Image */}
            <div className="property-image" style={{ height: property.images.length > 0 ? '240px' : '120px' }}>
                {property.images.length > 0 ? (
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                ) : (
                    <div className="image-placeholder" style={{ padding: '1rem' }}>
                        <Building size={32} />
                    </div>
                )}
                {property.landUseZone !== 'UNDEFINED' && (
                    <div className="zone-badge">
                        {getLandUseZoneLabel(property.landUseZone)}
                    </div>
                )}
            </div>

            {/* Property Details */}
            <div className="property-details">
                <div className="property-header">
                    <h3 className="property-title">{property.title}</h3>
                    <div className="property-price">
                        <p className="main-price">{formatPrice(property.price)}</p>
                        <p className="sub-price">{formatPrice(property.pricePerTsubo)}/坪</p>
                    </div>
                </div>

                <div className="property-location">
                    <MapPin size={16} />
                    <span>{property.city}, {property.prefecture}</span>
                    <span>•</span>
                    <span>{property.nearestStation} {property.walkTimeToStation}分</span>
                </div>

                {/* Land Specs */}
                <div className="specs-grid">
                    <div className="spec-box">
                        <p className="label">Area</p>
                        <p className="value">{formatTsubo(property.landAreaTsubo)}</p>
                        <p className="sub-value">{property.landAreaM2.toFixed(1)}m²</p>
                    </div>
                    <div className="spec-box">
                        <p className="label">Building Coverage</p>
                        <p className="value">{property.buildingCoverageRatio > 0 ? `${property.buildingCoverageRatio}%` : '—'}</p>
                        <p className="sub-value">{property.buildingCoverageRatio > 0 ? `Max ${potential.maxBuilding.toFixed(0)}m²` : '—'}</p>
                    </div>
                </div>

                {/* Building Potential */}
                <div className="building-potential">
                    <p className="title">🏗️ Building Potential</p>
                    <div className="content">
                        <span>Floor Area Ratio: {property.floorAreaRatio > 0 ? `${property.floorAreaRatio}%` : '—'}</span>
                        <span>Max Floor: {property.floorAreaRatio > 0 ? `${potential.maxFloor.toFixed(0)}m²` : '—'}</span>
                    </div>
                    <div className="road-info">
                        Road Width: {property.frontRoadWidth > 0 ? `${property.frontRoadWidth}m` : '—'}
                    </div>
                    {property.landCategory && (
                        <div className="road-info" style={{ marginTop: '0.25rem' }}>
                            地目: {property.landCategory}
                        </div>
                    )}
                </div>

                {/* Utilities */}
                <div className="utilities">
                    <div className="utility-tags">
                        {utilities.map((utility, index) => (
                            <span key={index} className="utility-tag">
                                {typeof utility.icon === 'string' ? utility.icon : utility.icon} {utility.label}
                            </span>
                        ))}
                    </div>
                    <button
                        className="view-details"
                        onClick={() => window.open(property.sourceUrl, '_blank')}
                    >
                        View Details →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
