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
    warnings,
}) => {
    const warnExpect = (actual) => {
        const wrap = (contextMessage) => ({
            toBeNonEmptyString: () => {
                if (typeof actual !== 'string' || actual.trim().length === 0) {
                    warnings.push(`[WARNING] ${contextMessage}: Expected non-empty string, got ${JSON.stringify(actual)}`);
                }
            },
            toStartWith: (prefix) => {
                if (typeof actual !== 'string' || !actual.startsWith(prefix)) {
                    warnings.push(`[WARNING] ${contextMessage}: Expected to start with "${prefix}", got ${JSON.stringify(actual)}`);
                }
            },
            toBe: (expected) => {
                if (actual !== expected) {
                    warnings.push(`[WARNING] ${contextMessage}: Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
                }
            },
            toBeInstanceOf: (type) => {
                if (actual == null || actual.constructor !== type) {
                    warnings.push(`[WARNING] ${contextMessage}: Expected instance of ${type.name}, got ${actual?.constructor?.name || typeof actual}`);
                }
            },
            toContain: (str) => {
                if (typeof actual !== 'string' || !actual.includes(str)) {
                    warnings.push(`[WARNING] ${contextMessage}: Expected to contain "${str}", got ${JSON.stringify(actual)}`);
                }
            },
            toBeNonEmptyArray: () => {
                if (!Array.isArray(actual) || actual.length === 0) {
                    warnings.push(`[WARNING] ${contextMessage}: Expected non-empty array`);
                }
            },
            toBeLessThan: (expected) => {
                if (typeof actual !== 'number' || actual >= expected) {
                    warnings.push(`[WARNING] ${contextMessage}: Expected less than ${expected}, got ${actual}`);
                }
            },
            toMatch: (regex) => {
                if (typeof actual !== 'string' || !regex.test(actual)) {
                    warnings.push(`[WARNING] ${contextMessage}: Expected to match ${regex}, got ${JSON.stringify(actual)}`);
                }
            },
            not: {
                toContain: (str) => {
                    if (typeof actual === 'string' && actual.includes(str)) {
                        warnings.push(`[WARNING] ${contextMessage}: Expected NOT to contain "${str}"`);
                    }
                },
                toBeLessThan: (expected) => {
                    if (typeof actual !== 'number' || actual < expected) {
                        warnings.push(`[WARNING] ${contextMessage}: Expected NOT to be less than ${expected}, got ${actual}`);
                    }
                },
            },
        });
        return {
            withContext: (msg) => wrap(msg),
        };
    };

    const checkProducts = (products, runResult) => {
        const { title } = products.find((p) => p.title?.length) || {};
        expect(title)
            .withContext(runResult.format('Product Name'))
            .toBeNonEmptyString();

        const { price } = products.find((p) => p.price?.length) || {};
        expect(price)
            .withContext(runResult.format('Product Price'))
            .toBeNonEmptyString();

        const { rating } = products.find((p) => p.rating?.length) || {};
        warnExpect(rating)
            .withContext(runResult.format('Product Rating'))
            .toBeNonEmptyString();

        const { reviews } = products.find((p) => p.reviews?.length) || {};
        warnExpect(reviews)
            .withContext(runResult.format('Product Reviews'))
            .toBeNonEmptyString();

        const { condition } = products.find((p) => p.condition?.length) || {};
        warnExpect(condition)
            .withContext(runResult.format('Product Condition'))
            .toBeNonEmptyString();

        const { seller } = products.find((p) => p.seller?.length) || {};
        warnExpect(seller)
            .withContext(runResult.format('Product Seller'))
            .toBeNonEmptyString();

        const { quantity_available: quantityAvailable } = products.find((p) => p.quantity_available?.length) || {};
        warnExpect(quantityAvailable)
            .withContext(runResult.format('Product Quantity Available'))
            .toBeNonEmptyString();

        const { description } = products.find((p) => p.description?.length) || {};
        warnExpect(description)
            .withContext(runResult.format('Product Description'))
            .toBeNonEmptyString();

        const { images } = products.find((p) => p.images?.length) || {};
        warnExpect(images)
            .withContext(runResult.format('Product Images'))
            .toBeNonEmptyArray();

        const { url } = products.find((p) => p.url?.length) || {};
        expect(url)
            .withContext(runResult.format('Product Url'))
            .toBeNonEmptyString();

        const { currency } = products.find((p) => p.currency?.length) || {};
        warnExpect(currency)
            .withContext(runResult.format('Product Currency'))
            .toBeNonEmptyString();
    };

    const checkVehicles = (products, runResult) => {
        const { title } = products.find((p) => p.title?.length) || {};
        expect(title)
            .withContext(runResult.format('Vehicle Name'))
            .toBeNonEmptyString();

        const { price } = products.find((p) => p.price?.length) || {};
        expect(price)
            .withContext(runResult.format('Vehicle Price'))
            .toBeNonEmptyString();

        const { condition } = products.find((p) => p.condition?.length) || {};
        warnExpect(condition)
            .withContext(runResult.format('Vehicle Condition'))
            .toBeNonEmptyString();

        const { seller } = products.find((p) => p.seller?.length) || {};
        warnExpect(seller)
            .withContext(runResult.format('Vehicle Seller'))
            .toBeNonEmptyString();

        const { quantity_available: quantityAvailable } = products.find((p) => p.quantity_available?.length) || {};
        warnExpect(quantityAvailable)
            .withContext(runResult.format('Vehicle Quantity Available'))
            .toBeNonEmptyString();

        const { description } = products.find((p) => p.description?.length) || {};
        warnExpect(description)
            .withContext(runResult.format('Vehicle Description'))
            .toBeNonEmptyString();

        const { images } = products.find((p) => p.images?.length) || {};
        warnExpect(images)
            .withContext(runResult.format('Vehicle Images'))
            .toBeNonEmptyArray();

        const { url } = products.find((p) => p.url?.length) || {};
        expect(url)
            .withContext(runResult.format('Vehicle Url'))
            .toMatch(/https:\/\/(carro|auto)/);

        const { currency } = products.find((p) => p.currency?.length) || {};
        warnExpect(currency)
            .withContext(runResult.format('Vehicle Currency'))
            .toBeNonEmptyString();
    };
    const testForCountry = (countryCode, build) => {
        it(`should search for smartphone in ${countryCode}`, async () => {
            const runResult = await run({
                actorId: 'q0PB9Xd1hjynYAEhi',
                input: {
                    debugMode: true,
                    domainCode: countryCode,
                    fastMode: false,
                    maxItemCount: 5,
                    proxy: {
                        useApifyProxy: true,
                        apifyProxyGroups: ['RESIDENTIAL'],
                    },
                    search: 'smartphone',
                },
                options: {
                    build,
                },
                name: `Mercadolibre ${countryCode} Search Health Check`,
            });

            await expectAsync(runResult).toHaveStatus('SUCCEEDED');
            await expectAsync(runResult).withLog((log) => {
                warnExpect(log)
                    .withContext(runResult.format('Log ReferenceError'))
                    .not.toContain('ReferenceError');
                warnExpect(log)
                    .withContext(runResult.format('Log TypeError'))
                    .not.toContain('TypeError');
                warnExpect(log)
                    .withContext(runResult.format('Log DEBUG'))
                    .toContain('DEBUG');
            });

            await expectAsync(runResult).withStatistics((stats) => {
                expect(stats.requestsRetries)
                    .withContext(runResult.format('Request retries'))
                    .toBeLessThan(5);
                expect(stats.crawlerRuntimeMillis)
                    .withContext(runResult.format('Run time'))
                    .toBeWithinRange(10 * 1000, 2 * 60 * 1000);
            });

            await expectAsync(runResult).withDataset(
                ({ dataset, info }) => {
                    expect(info.cleanItemCount)
                        .withContext(
                            runResult.format('Dataset cleanItemCount'),
                        )
                        .toBeWithinRange(1, 7);

                    warnExpect(dataset.items)
                        .withContext(
                            runResult.format('Dataset items array'),
                        )
                        .toBeNonEmptyArray();

                    const results = dataset.items;
                    checkProducts(results, runResult);
                },
            );
        });

        it(`should paginate with no issues in ${countryCode}`, async () => {
            const runResult = await run({
                actorId: 'q0PB9Xd1hjynYAEhi',
                input: {
                    debugMode: true,
                    domainCode: countryCode,
                    fastMode: true,
                    maxItemCount: 300,
                    proxy: {
                        useApifyProxy: true,
                        apifyProxyGroups: ['RESIDENTIAL'],
                    },
                    search: 'smartphone',
                },
                options: {
                    build,
                },
                name: `Mercadolibre ${countryCode} Pagination Health Check`,
            });

            await expectAsync(runResult).toHaveStatus('SUCCEEDED');
            await expectAsync(runResult).withLog((log) => {
                warnExpect(log)
                    .withContext(runResult.format('Log pagination'))
                    .not.toContain('Added 1 more page(s) to pagination.');
            });

            await expectAsync(runResult).withDataset(
                ({ dataset, info }) => {
                    expect(info.cleanItemCount)
                        .withContext(
                            runResult.format('Dataset cleanItemCount'),
                        )
                        .toBeWithinRange(250, 310);

                    warnExpect(dataset.items)
                        .withContext(
                            runResult.format('Dataset items array'),
                        )
                        .toBeNonEmptyArray();

                    const results = dataset.items;
                    checkProducts(results, runResult);
                },
            );
        });

        it(`should search for vehicles category in ${countryCode}`, async () => {
            const runResult = await run({
                actorId: 'q0PB9Xd1hjynYAEhi',
                input: {
                    debugMode: true,
                    domainCode: countryCode,
                    fastMode: false,
                    maxItemCount: 5,
                    proxy: {
                        useApifyProxy: true,
                        apifyProxyGroups: ['RESIDENTIAL'],
                    },
                    search: 'peugeot 3008',
                    searchType: 'vehicles',
                },
                options: {
                    build,
                },
                name: `Mercadolibre ${countryCode} Search Health Check`,
            });

            await expectAsync(runResult).toHaveStatus('SUCCEEDED');
            await expectAsync(runResult).withLog((log) => {
                warnExpect(log)
                    .withContext(runResult.format('Log ReferenceError'))
                    .not.toContain('ReferenceError');
                warnExpect(log)
                    .withContext(runResult.format('Log TypeError'))
                    .not.toContain('TypeError');
                warnExpect(log)
                    .withContext(runResult.format('Log DEBUG'))
                    .toContain('DEBUG');
            });

            await expectAsync(runResult).withStatistics((stats) => {
                expect(stats.requestsRetries)
                    .withContext(runResult.format('Request retries'))
                    .toBeLessThan(5);
                expect(stats.crawlerRuntimeMillis)
                    .withContext(runResult.format('Run time'))
                    .toBeWithinRange(10 * 1000, 2 * 60 * 1000);
            });

            await expectAsync(runResult).withDataset(
                ({ dataset, info }) => {
                    expect(info.cleanItemCount)
                        .withContext(
                            runResult.format('Dataset cleanItemCount'),
                        )
                        .toBeWithinRange(1, 7);

                    warnExpect(dataset.items)
                        .withContext(
                            runResult.format('Dataset items array'),
                        )
                        .toBeNonEmptyArray();

                    const results = dataset.items;
                    checkVehicles(results, runResult);
                },
            );
        });
    };

    input.versions.forEach((build) => {
        describe(`Mercadolibre scraper (${build} version)`, () => {
            [
                // 'AR',
                // 'BO',
                'BR',
                // 'CL',
                // 'CO',
                // 'CR',
                // 'DO',
                // 'EC',
                // 'GT',
                // 'HN',
                'MX',
                // 'NI',
                // 'PA',
                // 'PY',
                // 'PE',
                // 'SV',
                // 'UY',
                // 'VE',
            ].forEach((countryCode) => {
                testForCountry(countryCode, build);
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
