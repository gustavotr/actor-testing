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
    const checkResult = (result, runResult) => {
        expect(result.name)
            .withContext(runResult.format('Name'))
            .toBeNonEmptyString();

        expect(result.address)
            .withContext(runResult.format('Address'))
            .toBeNonEmptyString();

        expect(result.url)
            .withContext(runResult.format('Url'))
            .toBeNonEmptyString();

        expect(result.categories)
            .withContext(runResult.format('Categories'))
            .toBeNonEmptyArray();
    };

    ['beta', 'latest'].forEach((build) => {
        describe(`Yellowpages scraper (${build} version)`, () => {
            it('should search for results successfully', async () => {
                const runResult = await run({
                    actorId: 'wWqrTazDTGHCGTFvw',
                    input: {
                        debugMode: false,
                        location: 'Los Angeles',
                        maxItems: 20,
                        search: 'Dentist',
                    },
                    options: {
                        build,
                    },
                    name: 'Yellowpages Search Health Check',
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
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBe(20);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array'),
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;
                        for (const result of results) {
                            checkResult(result, runResult);
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
    retryFailedTests: true,
    email: 'gustavo@trudax.tech',
    testSpec: main.toString(),
    verboseLogs: true,
};

fs.writeFileSync(
    path.join(__dirname, './storage/key_value_stores/default/INPUT.json'),
    JSON.stringify(input, null, 2),
);
