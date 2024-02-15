const fs = require('fs');
const path = require('path');

const main = ({
    it,
    xit,
    run,
    expect,
    expectAsync,
    input,
    moment,
    describe,
}) => {
    const checkProducts = (products, runResult) => {
        // Test Required fields
        products.forEach((product) => {
            expect(product.id)
                .withContext(runResult.format('Product ID'))
                .toBeNonEmptyString();

            expect(product.name)
                .withContext(runResult.format('Product Name'))
                .toBeNonEmptyString();

            expect(product.description)
                .withContext(runResult.format('Product Description'))
                .toBeInstanceOf(String);

            expect(product.url)
                .withContext(runResult.format('Product Url'))
                .toStartWith('https://www.nordstrom.com/');

            expect(product.brand)
                .withContext(runResult.format('Product Brand'))
                .toBeNonEmptyString();

            expect(product.rating)
                .withContext(runResult.format('Product Rating'))
                .toBeInstanceOf(Number);

            expect(product.reviewCount)
                .withContext(runResult.format('Product Review Count'))
                .toBeInstanceOf(Number);

            expect(product.isAvailable)
                .withContext(runResult.format('Product Availability'))
                .toBeDefined();

            expect(product.currencyCode)
                .withContext(runResult.format('Product Currency Code'))
                .toBeNonEmptyString();

            expect(product.price)
                .withContext(runResult.format('Product Price'))
                .toBeGreaterThan(0);

            expect(product.scrapedAt)
                .withContext(runResult.format('Product Scraped At'))
                .toBeNonEmptyString();

            expect(Array.isArray(product.sizes))
                .withContext(runResult.format('Product Sizes is an Array'))
                .toBeTrue();

            expect(Array.isArray(product.colors))
                .withContext(runResult.format('Product Colors is an Array'))
                .toBeTrue();
        });

        const hasSizes = products.some((product) => product.sizes?.length > 0);
        expect(hasSizes)
            .withContext(runResult.format('Product Sizes are scraped'))
            .toBeTrue();

        const hasColors = products.some((product) => product.colors?.length > 0);
        expect(hasColors)
            .withContext(runResult.format('Product Colors are scraped'))
            .toBeTrue();
    };

    ['beta', 'latest'].forEach((build) => {
        describe(`Nordstrom scraper (${build} version)`, () => {
            it('should search for jeans in Italy', async () => {
                const runResult = await run({
                    actorId: '6aR43uctzkv89eGJy',
                    input: {
                        country: 'Italy',
                        debugMode: true,
                        extendOutputFunction: '\n',
                        maxItems: 10,
                        proxy: {
                            useApifyProxy: true,
                        },
                        search: 'Jeans',
                    },
                    options: {
                        build,
                    },
                    name: 'Nordstrom Search Health Check',
                });

                await expectAsync(runResult).toHaveStatus('SUCCEEDED');
                await expectAsync(runResult).withLog((log) => {
                    expect(log)
                        .withContext(runResult.format('Log ReferenceError'))
                        .not.toContain('ReferenceError');
                    expect(log)
                        .withContext(runResult.format('Log TypeError'))
                        .not.toContain('TypeError');
                    expect(log)
                        .withContext(runResult.format('Log DEBUG'))
                        .toContain('DEBUG');
                });

                await expectAsync(runResult).withStatistics((stats) => {
                    expect(stats.requestsRetries)
                        .withContext(runResult.format('Request retries'))
                        .toBeLessThan(5);
                    expect(stats.crawlerRuntimeMillis)
                        .withContext(runResult.format('Run time'))
                        .toBeWithinRange(0.1 * 60000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBe(10);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array'),
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;
                        checkProducts(results, runResult);
                    },
                );
            });
        });
    });
};

const input = {
    abortRuns: true,
    defaultTimeout: 900000,
    retryFailedTests: false,
    email: 'gustavo@trudax.tech',
    testSpec: main.toString(),
    verboseLogs: true,
};

fs.writeFileSync(
    path.join(__dirname, './storage/key_value_stores/default/INPUT.json'),
    JSON.stringify(input, null, 2),
);
