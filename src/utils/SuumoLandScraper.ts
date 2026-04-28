import axios from 'axios';
import * as cheerio from 'cheerio';
import { LandProperty, LandSearchFilters, LandShape, RoadDirection, LandRights } from '../types/LandScraperSchema';

// Mapping of prefecture names to Suumo codes
// ar: Area code (010: Hokkaido, 020: Tohoku, 030: Kanto, 040: Shinetsu/Hokuriku, 050: Tokai, 060: Kansai, 070: Chugoku, 080: Shikoku, 090: Kyushu/Okinawa)
// ta: JIS prefecture code (01–47)
const PREFECTURE_CODES: Record<string, { area: string; prefecture: string }> = {
  // Hokkaido
  'hokkaido': { area: '010', prefecture: '01' },
  // Tohoku
  'aomori': { area: '020', prefecture: '02' },
  'iwate': { area: '020', prefecture: '03' },
  'miyagi': { area: '020', prefecture: '04' },
  'akita': { area: '020', prefecture: '05' },
  'yamagata': { area: '020', prefecture: '06' },
  'fukushima': { area: '020', prefecture: '07' },
  // Kanto
  'ibaraki': { area: '030', prefecture: '08' },
  'tochigi': { area: '030', prefecture: '09' },
  'gunma': { area: '030', prefecture: '10' },
  'saitama': { area: '030', prefecture: '11' },
  'chiba': { area: '030', prefecture: '12' },
  'tokyo': { area: '030', prefecture: '13' },
  'kanagawa': { area: '030', prefecture: '14' },
  // Shinetsu / Hokuriku
  'niigata': { area: '040', prefecture: '15' },
  'toyama': { area: '040', prefecture: '16' },
  'ishikawa': { area: '040', prefecture: '17' },
  'fukui': { area: '040', prefecture: '18' },
  'yamanashi': { area: '040', prefecture: '19' },
  'nagano': { area: '040', prefecture: '20' },
  // Tokai
  'gifu': { area: '050', prefecture: '21' },
  'shizuoka': { area: '050', prefecture: '22' },
  'aichi': { area: '050', prefecture: '23' },
  'mie': { area: '050', prefecture: '24' },
  // Kansai
  'shiga': { area: '060', prefecture: '25' },
  'kyoto': { area: '060', prefecture: '26' },
  'osaka': { area: '060', prefecture: '27' },
  'hyogo': { area: '060', prefecture: '28' },
  'nara': { area: '060', prefecture: '29' },
  'wakayama': { area: '060', prefecture: '30' },
  // Chugoku
  'tottori': { area: '070', prefecture: '31' },
  'shimane': { area: '070', prefecture: '32' },
  'okayama': { area: '070', prefecture: '33' },
  'hiroshima': { area: '070', prefecture: '34' },
  'yamaguchi': { area: '070', prefecture: '35' },
  // Shikoku
  'tokushima': { area: '080', prefecture: '36' },
  'kagawa': { area: '080', prefecture: '37' },
  'ehime': { area: '080', prefecture: '38' },
  'kochi': { area: '080', prefecture: '39' },
  // Kyushu / Okinawa
  'fukuoka': { area: '090', prefecture: '40' },
  'saga': { area: '090', prefecture: '41' },
  'nagasaki': { area: '090', prefecture: '42' },
  'kumamoto': { area: '090', prefecture: '43' },
  'oita': { area: '090', prefecture: '44' },
  'miyazaki': { area: '090', prefecture: '45' },
  'kagoshima': { area: '090', prefecture: '46' },
  'okinawa': { area: '090', prefecture: '47' },
};

export class SuumoLandScraper {
  private baseUrl = typeof window !== 'undefined'
    ? '/suumo-api/jj/bukken/ichiran/JJ010FJ001/'
    : 'https://suumo.jp/jj/bukken/ichiran/JJ010FJ001/';

  async searchLand(filters: LandSearchFilters, page: number = 1): Promise<LandProperty[]> {
    try {
      const url = this.buildUrl(filters, page);
      console.log(`Scraping URL: ${url}`);

      // Use axios for both browser and Node.js
      // In browser, axios will use the proxy defined in vite.config.ts
      const response = await axios.get(url, {
        headers: typeof window === 'undefined' ? {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        } : {}
      });
      const responseData = response.data;

      console.log(`Response data length: ${responseData.length}`);

      const $ = cheerio.load(responseData);
      const propertyUnits = $('.property_unit');
      console.log(`Found ${propertyUnits.length} property units`);
      const properties: LandProperty[] = [];

      propertyUnits.each((_, element) => {
        try {
          const title = $(element).find('.property_unit-title a').text().trim();
          const relativeUrl = $(element).find('.property_unit-title a').attr('href');
          const url = relativeUrl ? 'https://suumo.jp' + relativeUrl : '';
          const priceText = $(element).find('dt:contains("販売価格") + dd .dottable-value').text().trim();
          const address = $(element).find('dt:contains("所在地") + dd').text().trim();
          const stationText = $(element).find('dt:contains("沿線・駅") + dd').text().trim();
          const areaText = $(element).find('dt:contains("土地面積") + dd').text().trim();
          const ratioText = $(element).find('dt:contains("建ぺい率・容積率") + dd').text().trim();

          const price = this.parsePrice(priceText);
          const { landAreaM2, landAreaTsubo } = this.parseArea(areaText);
          const { buildingCoverageRatio, floorAreaRatio } = this.parseRatios(ratioText);
          const { nearestStation, walkTimeToStation } = this.parseStation(stationText);

          const allText = $(element).text();
          const detailsText = $(element).find('.dottable').text();
          const hasElectricity = /電気/.test(detailsText) || /電気/.test(allText);
          const hasGas = /都市ガス|ガス/.test(detailsText) || /都市ガス|ガス/.test(allText);
          const hasWater = /上水道|公営水道|水道/.test(detailsText) || /上水道|公営水道|水道/.test(allText);
          const hasSewage = /下水道|公共下水/.test(detailsText) || /下水道|公共下水/.test(allText);

          const roadText = $(element).find('dt:contains("接道状況") + dd, dt:contains("接道") + dd').text().trim();
          const roadWidthMatch = roadText.match(/(\d+(?:\.\d+)?)m/);
          const frontRoadWidth = roadWidthMatch ? parseFloat(roadWidthMatch[1]) : 0;

          const zoneText = $(element).find('dt:contains("用途地域") + dd').text().trim();
          const chimokunText = $(element).find('dt:contains("地目") + dd').text().trim();

          // Extract basic info
          const property: LandProperty = {
            id: url.split('/nc_')[1]?.replace('/', '') || Math.random().toString(36).substr(2, 9),
            title,
            price,
            pricePerTsubo: landAreaTsubo > 0 ? Number(price) / landAreaTsubo : 0,
            pricePerM2: landAreaM2 > 0 ? Number(price) / landAreaM2 : 0,
            prefecture: 'Tokyo', // Default for now, should parse from address
            city: address.split('都')[1]?.split('市')[0] || '',
            district: address,
            address,
            nearestStation,
            walkTimeToStation,
            landAreaTsubo,
            landAreaM2,
            buildingCoverageRatio,
            floorAreaRatio,
            landUseZone: (zoneText || 'UNDEFINED') as any,
            chimoku: chimokunText || undefined,
            frontRoadWidth,
            frontRoadDirection: RoadDirection.NORTH, // Need detail page
            landShape: LandShape.REGULAR, // Need detail page
            hasElectricity,
            hasGas,
            hasWater,
            hasSewage,
            landRights: LandRights.OWNERSHIP, // Assumption
            restrictions: [],
            listedDate: new Date(),
            lastUpdated: new Date(),
            daysOnMarket: 0,
            images: [], // Need to extract images
            description: '',
            agentName: '',
            agentLicense: '',
            agentContact: '',
            sourceUrl: url,
            scrapedAt: new Date()
          };

          // Extract images
          $(element).find('.ui-thumb img').each((_, img) => {
            const src = $(img).attr('rel') || $(img).attr('src');
            if (src) property.images.push(src);
          });

          properties.push(property);
        } catch (e) {
          console.error('Error parsing property:', e);
        }
      });

      return properties;
    } catch (error) {
      console.error('Error scraping Suumo:', error);
      return [];
    }
  }

  private buildUrl(filters: LandSearchFilters, page: number): string {
    const params = new URLSearchParams();

    // Default to Tokyo if not specified or not found
    let areaCode = '030'; // Kanto
    let prefectureCode = '13'; // Tokyo

    if (filters.prefecture) {
      const code = PREFECTURE_CODES[filters.prefecture];
      if (code) {
        areaCode = code.area;
        prefectureCode = code.prefecture;
      }
    }

    params.append('ar', areaCode);
    params.append('bs', '030'); // Land
    params.append('ta', prefectureCode);

    // Pagination
    // Suumo uses 'page' parameter now (formerly 'pn')
    params.append('page', page.toString());

    // Results per page (default to 100)
    params.append('pc', (filters.limit || 100).toString());

    // Price (kb and kt are in 万円 - 10,000 yen units)
    // Guard with > 0 to skip 0/undefined/NaN; use Math.floor to ensure integer values
    if (filters.minPrice && filters.minPrice > 0) {
      params.append('kb', Math.floor(filters.minPrice / 10000).toString());
    }
    if (filters.maxPrice && filters.maxPrice > 0) {
      params.append('kt', Math.floor(filters.maxPrice / 10000).toString());
    }

    // Area in m2 (mb = minimum, tt = maximum)
    // Suumo has a limit of 150 sqm for these parameters
    if (filters.minArea) {
      const cappedMin = Math.min(filters.minArea, 150);
      params.append('mb', cappedMin.toString());
    }
    if (filters.maxArea) {
      const cappedMax = Math.min(filters.maxArea, 150);
      params.append('tt', cappedMax.toString());
    }

    // Walk time to station in minutes
    if (filters.maxWalkTime) params.append('cn', filters.maxWalkTime.toString());

    // Sort options
    // po = sort field, pj = sort direction (1=asc, 2=desc)
    if (filters.sortBy && filters.sortBy !== 'none') {
      const sortMap: Record<string, { po: string; pj: string }> = {
        'newest': { po: '1', pj: '2' }, // New/Updated (po=1, pj=2)
        'location': { po: '3', pj: filters.sortOrder === 'desc' ? '2' : '1' }, // Location
        'price': { po: '5', pj: filters.sortOrder === 'desc' ? '2' : '1' }, // Price
        'area': { po: '9', pj: filters.sortOrder === 'desc' ? '2' : '1' }, // Land area
        'pricePerTsubo': { po: '13', pj: filters.sortOrder === 'desc' ? '2' : '1' } // Price per tsubo
      };

      const sort = sortMap[filters.sortBy];
      if (sort) {
        params.append('po', sort.po);
        params.append('pj', sort.pj);
      }
    }

    const finalUrl = `${this.baseUrl}?${params.toString()}`;
    const actualSuumoUrl = finalUrl.replace('/suumo-api', 'https://suumo.jp');

    console.log('=== SUUMO URL DEBUG ===');
    console.log('Actual Suumo URL:', actualSuumoUrl);
    console.log('Min Area (mb):', filters.minArea);
    console.log('Max Area (tt):', filters.maxArea);
    console.log('Full params:', params.toString());
    console.log('=======================');

    return finalUrl;
  }


  private parsePrice(text: string): bigint {
    // Japanese price format examples:
    // "44億9000万円" -> 4,490,000,000 (4.49 billion)
    // "1億2000万円" -> 120,000,000 (120 million)
    // "9000万円" -> 90,000,000 (90 million)
    // "1761万7000円～3080万円" -> take min: 17,617,000

    const cleanText = text.replace(/,/g, '').split('～')[0];
    let price = 0;

    // Parse 億 (oku = hundred million = 100,000,000)
    const okuMatch = cleanText.match(/(\d+)億/);
    if (okuMatch) {
      price += parseInt(okuMatch[1]) * 100000000;
    }

    // Parse 万 (man = ten thousand = 10,000)
    // Match the pattern after 億 if present, or standalone
    const manMatch = cleanText.match(/億(\d+)万/) || cleanText.match(/^(\d+)万/);
    if (manMatch) {
      price += parseInt(manMatch[1]) * 10000;
    }

    // Parse remaining yen after 万
    const yenMatch = cleanText.match(/万(\d+)円/);
    if (yenMatch) {
      price += parseInt(yenMatch[1]);
    }

    return BigInt(price);
  }

  private parseArea(text: string): { landAreaM2: number, landAreaTsubo: number } {
    // Example: "115.01m2～123.66m2（34.79坪～37.40坪）"
    const m2Match = text.match(/(\d+(\.\d+)?)m2/);
    const tsuboMatch = text.match(/(\d+(\.\d+)?)坪/);

    return {
      landAreaM2: m2Match ? parseFloat(m2Match[1]) : 0,
      landAreaTsubo: tsuboMatch ? parseFloat(tsuboMatch[1]) : 0
    };
  }

  private parseRatios(text: string): { buildingCoverageRatio: number, floorAreaRatio: number } {
    // Suumo uses various formats:
    // Format 1: "建ペい率:40%(角地:50%) 容積率:80%"
    // Format 2: "建ペい率：40％、容積率：80％" (Japanese colon and full-width %)
    // Format 3: "建ぺい率：40/容積率：80" (slash separator, no %)

    // Try to match building coverage ratio (建ペい率 or 建ぺい率)
    // Match either : or ：, then digits, optionally followed by % or ％
    const kenpeiMatch = text.match(/建[ペぺ]い率[：:]\s*(\d+)[％%]?/) ||
      text.match(/(\d+)[％%]?\/容積率/); // For slash format

    // Try to match floor area ratio (容積率)
    const yosekiMatch = text.match(/容積率[：:]\s*(\d+)[％%]?/);

    const result = {
      buildingCoverageRatio: kenpeiMatch ? parseInt(kenpeiMatch[1]) : 0,
      floorAreaRatio: yosekiMatch ? parseInt(yosekiMatch[1]) : 0
    };

    return result;
  }

  private parseStation(text: string): { nearestStation: string, walkTimeToStation: number } {
    // Example: "ＪＲ青梅線「昭島」徒歩20分"
    const stationMatch = text.match(/「(.+)」/);
    const walkMatch = text.match(/徒歩(\d+)分/);

    return {
      nearestStation: stationMatch ? stationMatch[1] : '',
      walkTimeToStation: walkMatch ? parseInt(walkMatch[1]) : 0
    };
  }
}

export class LandScraperAPI {
  private scraper: SuumoLandScraper;

  constructor() {
    this.scraper = new SuumoLandScraper();
  }

  async searchProperties(filters: LandSearchFilters, page: number = 1): Promise<LandProperty[]> {
    return await this.scraper.searchLand(filters, page);
  }

  async scrapePrefecture(prefecture: string, maxPages: number = 10): Promise<void> {
    console.log(`Starting to scrape ${prefecture} with max ${maxPages} pages`);
    // Implementation would go here
  }

  async runDailyScraping(): Promise<void> {
    console.log('Running daily scraping job');
    // Implementation would go here
  }
}

export type { LandProperty, LandSearchFilters } from '../types/LandScraperSchema';
export { LandUseZone } from '../types/LandScraperSchema';