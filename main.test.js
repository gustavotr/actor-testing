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
    const checkProduct = (product, runResult) => {
        expect(product.title)
            .withContext(runResult.format('Product Name'))
            .toBeNonEmptyString();

        expect(product.price)
            .withContext(runResult.format('Product Price'))
            .toBeNonEmptyString();

        expect(product.rating)
            .withContext(runResult.format('Product Rating'))
            .toBeNonEmptyString();

        expect(product.reviews)
            .withContext(runResult.format('Product Reviews'))
            .toBeNonEmptyString();

        expect(product.condition)
            .withContext(runResult.format('Product Condition'))
            .toBeNonEmptyString();

        expect(product.seller)
            .withContext(runResult.format('Product Seller'))
            .toBeNonEmptyString();

        expect(product.quantity_available)
            .withContext(runResult.format('Product Quantity Available'))
            .toBeNonEmptyString();

        expect(product.description)
            .withContext(runResult.format('Product Description'))
            .toBeNonEmptyString();

        expect(product.images)
            .withContext(runResult.format('Product Images'))
            .toBeNonEmptyArray();

        expect(product.url)
            .withContext(runResult.format('Product Url'))
            .toBeNonEmptyString();

        expect(product.currency)
            .withContext(runResult.format('Product Currency'))
            .toBeNonEmptyString();
    };

    ['beta', 'latest'].forEach((build) => {
        describe(`Mercadolibre scraper (${build} version)`, () => {
            it('should search for smartphone in Mexico', async () => {
                const runResult = await run({
                    actorId: 'q0PB9Xd1hjynYAEhi',
                    input: {
                        debugMode: true,
                        domainCode: 'MX',
                        fastMode: false,
                        maxItemCount: 5,
                        proxy: {
                            useApifyProxy: true,
                        },
                        search: 'smartphone',
                    },
                    options: {
                        build,
                    },
                    name: 'Mercadolibre Search Health Check',
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
                        .toBeWithinRange(30 * 1000, 2 * 60 * 1000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBeWithinRange(5, 7);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array'),
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;
                        for (const product of results) {
                            checkProduct(product, runResult);
                        }
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
