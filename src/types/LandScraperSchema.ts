export enum LandUseZone {
  FIRST_CLASS_LOW_RISE_RESIDENTIAL = 'FIRST_CLASS_LOW_RISE_RESIDENTIAL',
  SECOND_CLASS_LOW_RISE_RESIDENTIAL = 'SECOND_CLASS_LOW_RISE_RESIDENTIAL',
  FIRST_CLASS_MEDIUM_HIGH_RESIDENTIAL = 'FIRST_CLASS_MEDIUM_HIGH_RESIDENTIAL',
  SECOND_CLASS_MEDIUM_HIGH_RESIDENTIAL = 'SECOND_CLASS_MEDIUM_HIGH_RESIDENTIAL',
  FIRST_CLASS_RESIDENTIAL = 'FIRST_CLASS_RESIDENTIAL',
  SECOND_CLASS_RESIDENTIAL = 'SECOND_CLASS_RESIDENTIAL',
  QUASI_RESIDENTIAL = 'QUASI_RESIDENTIAL',
  NEIGHBORHOOD_COMMERCIAL = 'NEIGHBORHOOD_COMMERCIAL',
  COMMERCIAL = 'COMMERCIAL',
  QUASI_INDUSTRIAL = 'QUASI_INDUSTRIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  EXCLUSIVE_INDUSTRIAL = 'EXCLUSIVE_INDUSTRIAL',
  UNDEFINED = 'UNDEFINED'
}

export enum LandShape {
  REGULAR = 'REGULAR',
  IRREGULAR = 'IRREGULAR',
  CORNER = 'CORNER',
  FLAG_SHAPED = 'FLAG_SHAPED',
  OTHER = 'OTHER'
}

export enum RoadDirection {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
  NORTHEAST = 'NORTHEAST',
  NORTHWEST = 'NORTHWEST',
  SOUTHEAST = 'SOUTHEAST',
  SOUTHWEST = 'SOUTHWEST'
}

export enum LandRights {
  OWNERSHIP = 'OWNERSHIP',
  LEASEHOLD = 'LEASEHOLD',
  OTHER = 'OTHER'
}

export interface LandProperty {
  id: string;
  title: string;
  price: bigint;
  pricePerTsubo: number;
  pricePerM2: number;

  // Location
  prefecture: string;
  city: string;
  district: string;
  address: string;
  nearestStation: string;
  walkTimeToStation: number;
  latitude?: number;
  longitude?: number;

  // Area
  landAreaTsubo: number;
  landAreaM2: number;
  landAreaSqFt?: number;

  // Regulations
  buildingCoverageRatio: number;
  floorAreaRatio: number;
  landUseZone: LandUseZone;
  heightRestriction?: number;

  // Characteristics
  landShape: LandShape;
  frontRoadWidth: number;
  frontRoadDirection: RoadDirection;

  // Infrastructure
  hasElectricity: boolean;
  hasGas: boolean;
  hasWater: boolean;
  hasSewage: boolean;

  // Legal
  landRights: LandRights;
  restrictions: string[];

  // Market data
  listedDate: Date;
  lastUpdated: Date;
  daysOnMarket: number;

  // Additional
  images: string[];
  description: string;
  agentName: string;
  agentLicense: string;
  agentContact: string;

  // Metadata
  sourceUrl: string;
  scrapedAt: Date;

  // Relationships
  priceHistory?: PriceHistory[];
}

export interface PriceHistory {
  id: string;
  propertyId: string;
  price: bigint;
  recordedAt: Date;
}

export interface SearchQuery {
  id: string;
  filters: Record<string, any>;
  resultCount: number;
  executedAt: Date;
}

export interface LandSearchFilters {
  prefecture?: string;
  city?: string;
  minPrice?: number; // In yen
  maxPrice?: number; // In yen
  minPricePerTsubo?: number;
  maxPricePerTsubo?: number;
  minArea?: number; // In m2
  maxArea?: number; // In m2
  landUseZones?: LandUseZone[];
  maxWalkTime?: number; // In minutes from station
  sortBy?: 'newest' | 'location' | 'price' | 'area' | 'pricePerTsubo' | 'none';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number; // Results per page (10, 20, 30, 50, 100)
}