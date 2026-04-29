
import { Zap } from 'lucide-react';
import { LandProperty, LandUseZone } from '../types/LandScraperSchema';

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

const LAND_USE_ZONE_LABELS: Record<LandUseZone, string> = {
    [LandUseZone.FIRST_CLASS_LOW_RISE_RESIDENTIAL]:    '第1種低層住居専用',
    [LandUseZone.SECOND_CLASS_LOW_RISE_RESIDENTIAL]:   '第2種低層住居専用',
    [LandUseZone.FIRST_CLASS_MEDIUM_HIGH_RESIDENTIAL]: '第1種中高層住居専用',
    [LandUseZone.SECOND_CLASS_MEDIUM_HIGH_RESIDENTIAL]:'第2種中高層住居専用',
    [LandUseZone.FIRST_CLASS_RESIDENTIAL]:             '第1種住居',
    [LandUseZone.SECOND_CLASS_RESIDENTIAL]:            '第2種住居',
    [LandUseZone.QUASI_RESIDENTIAL]:                   '準住居',
    [LandUseZone.NEIGHBORHOOD_COMMERCIAL]:             '近隣商業',
    [LandUseZone.COMMERCIAL]:                          '商業',
    [LandUseZone.QUASI_INDUSTRIAL]:                    '準工業',
    [LandUseZone.INDUSTRIAL]:                          '工業',
    [LandUseZone.EXCLUSIVE_INDUSTRIAL]:                '工業専用',
    [LandUseZone.UNDEFINED]:                           '',
};

export const getLandUseZoneLabel = (zone: LandUseZone): string =>
    LAND_USE_ZONE_LABELS[zone] ?? '';
