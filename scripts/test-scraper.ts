import { SuumoLandScraper } from '../src/utils/SuumoLandScraper';

async function main() {
    const scraper = new SuumoLandScraper();
    console.log('Starting scraper test...');

    try {
        const results = await scraper.searchLand({
            prefecture: 'Osaka',
            minPrice: 10000000,
            maxPrice: 50000000
        });

        console.log(`Found ${results.length} properties.`);
        if (results.length > 0) {
            console.log('First property:', JSON.stringify(results[0], (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
                , 2));
        }
    } catch (error) {
        console.error('Error running scraper:', error);
    }
}

main();
