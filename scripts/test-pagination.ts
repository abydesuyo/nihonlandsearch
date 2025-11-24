import { SuumoLandScraper } from '../src/utils/SuumoLandScraper';
import { LandSearchFilters } from '../src/types/LandScraperSchema';

async function testPagination() {
    const scraper = new SuumoLandScraper();
    const filters: LandSearchFilters = {
        prefecture: 'osaka'
    };

    console.log('--- Testing Page 1 ---');
    const page1 = await scraper.searchLand(filters, 1);
    console.log(`Page 1 results: ${page1.length}`);
    if (page1.length > 0) {
        console.log('First property:', page1[0].title);
    }

    console.log('\n--- Testing Page 2 ---');
    const page2 = await scraper.searchLand(filters, 2);
    console.log(`Page 2 results: ${page2.length}`);
    if (page2.length > 0) {
        console.log('First property:', page2[0].title);
    }

    if (page1.length > 0 && page2.length > 0) {
        if (page1[0].id !== page2[0].id) {
            console.log('\nSUCCESS: Page 1 and Page 2 contain different properties.');
        } else {
            console.log('\nWARNING: Page 1 and Page 2 seem to have the same first property. Pagination might not be working.');
        }
    } else {
        console.log('\nERROR: Could not get results for one or both pages.');
    }
}

testPagination();
