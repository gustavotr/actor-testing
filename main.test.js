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
        expect(product.id)
            .withContext(runResult.format('Product ID'))
            .toBeNonEmptyNumber();

        expect(product.name)
            .withContext(runResult.format('Product Name'))
            .toBeNonEmptyString();

        expect(product.url)
            .withContext(runResult.format('Product Url'))
            .toStartWith('https://www.macys.com/');

        expect(product.rating)
            .withContext(runResult.format('Product Rating'))
            .toBeNonEmptyString();

        expect(product.brand)
            .withContext(runResult.format('Product Brand'))
            .toBeNonEmptyString();

        expect(product.images)
            .withContext(runResult.format('Product Images'))
            .toBeNonEmptyArray();

        expect(product.category)
            .withContext(runResult.format('Product Category'))
            .toBeNonEmptyString();

        expect(product.description)
            .withContext(runResult.format('Product Description'))
            .toBeNonEmptyString();

        expect(product.details)
            .withContext(runResult.format('Product Details'))
            .toBeNonEmptyArray();

        expect(product.offers)
            .withContext(runResult.format('Product Offers'))
            .toBeNonEmptyArray();

        expect(product.colors)
            .withContext(runResult.format('Product Colors'))
            .toBeNonEmptyArray();
    };

    ['beta', 'latest'].forEach((build) => {
        describe(`Macys scraper (${build} version)`, () => {
            it('should search for jeans', async () => {
                const runResult = await run({
                    actorId: 'WZAd8MxvZpRpWdZTa',
                    input: {
                        maxItems: 10,
                        search: 'Jeans',
                        proxy: {
                            useApifyProxy: true,
                        },
                        apiData: false,
                        debugMode: true,
                        outputStoreName: '',
                        checkDuplicates: false,
                    },
                    options: {
                        build,
                    },
                    name: 'Macys Search Health Check',
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
                                runResult.format('Dataset cleanItemCount')
                            )
                            .toBe(10);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array')
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;
                        for (const product of results) {
                            checkProduct(product, runResult);
                        }
                    }
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
    JSON.stringify(input, null, 2)
);
