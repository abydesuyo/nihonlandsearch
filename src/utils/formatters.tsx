
import { Zap } from 'lucide-react';
import { LandProperty } from '../types/LandScraperSchema';

export const formatPrice = (price: number | bigint) => {
    const priceNum = Number(price);
    if (priceNum >= 100000000) {
        return `¥${(priceNum / 100000000).toFixed(1)}億`;
    } else if (priceNum >= 10000) {
        return `¥${(priceNum / 10000).toFixed(0)}万`;
    }
    return `¥${priceNum.toLocaleString()}`;
};

export const formatTsubo = (tsubo: number) => `${tsubo.toFixed(1)}坪`;

export const getUtilityIcons = (property: LandProperty) => {
    const utilities = [];
    if (property.hasElectricity) utilities.push({ icon: <Zap size={16} />, label: '電気' });
    if (property.hasGas) utilities.push({ icon: '🔥', label: 'ガス' });
    if (property.hasWater) utilities.push({ icon: '💧', label: '上水道' });
    if (property.hasSewage) utilities.push({ icon: '🚰', label: '下水道' });
    return utilities;
};

export const getBuildingPotential = (property: LandProperty) => {
    const maxBuilding = (property.landAreaM2 * property.buildingCoverageRatio / 100);
    const maxFloor = (property.landAreaM2 * property.floorAreaRatio / 100);
    return { maxBuilding, maxFloor };
};
