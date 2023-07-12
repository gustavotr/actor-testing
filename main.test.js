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
    const checkProfile = (profile, runResult) => {
        expect(profile.name)
            .withContext(runResult.format('Profile Name'))
            .toBeNonEmptyString();

        expect(profile.location)
            .withContext(runResult.format('Profile Location'))
            .toBeNonEmptyString();

        expect(profile.locality)
            .withContext(runResult.format('Profile Locality'))
            .toBeNonEmptyString();

        expect(profile.country)
            .withContext(runResult.format('Profile Country'))
            .toBeNonEmptyString();

        expect(profile.title)
            .withContext(runResult.format('Profile Title'))
            .toBeNonEmptyString();

        expect(profile.jobSuccess)
            .withContext(runResult.format('Profile Job Success'))
            .toBeNonEmptyString();

        expect(profile.hourlyRate)
            .withContext(runResult.format('Profile Hourly Rate'))
            .toBeNonEmptyString();

        expect(profile.totalHours)
            .withContext(runResult.format('Profile Total Hours'))
            .toBeNonEmptyString();

        expect(profile.totalJobs)
            .withContext(runResult.format('Profile Total Jobs'))
            .toBeNonEmptyString();

        expect(profile.skills)
            .withContext(runResult.format('Profile Skills'))
            .toBeNonEmptyString();

        expect(profile.profileUrl)
            .withContext(runResult.format('Profile Url'))
            .toStartWith('https://www.upwork.com/freelancers/~');
    };

    const checkJob = (job, runResult) => {
        expect(job.title)
            .withContext(runResult.format('Job title'))
            .toBeNonEmptyString();

        expect(job.description)
            .withContext(runResult.format('Job Description'))
            .toBeNonEmptyString();

        expect(job.jobType)
            .withContext(runResult.format('Job Type'))
            .toBeNonEmptyString();

        expect(job.contractorTier)
            .withContext(runResult.format('Job Contractor Tier'))
            .toBeNonEmptyString();

        expect(job.skills)
            .withContext(runResult.format('Job Skills'))
            .toBeNonEmptyString();

        expect(job.duration)
            .withContext(runResult.format('Job Duration'))
            .toBeNonEmptyString();

        expect(job.engagement)
            .withContext(runResult.format('Job Engagement'))
            .toBeNonEmptyString();

        expect(job.createdAt)
            .withContext(runResult.format('Job Created At'))
            .toBeNonEmptyString();

        expect(job.scrapedAt)
            .withContext(runResult.format('Job Scraped At'))
            .toBeNonEmptyString();

        expect(job.url)
            .withContext(runResult.format('Job Url'))
            .toStartWith('https://www.upwork.com/freelance-jobs/apply/');

        expect(job.applyUrl)
            .withContext(runResult.format('Job Apply Url'))
            .toStartWith('https://www.upwork.com/ab/proposals/job/~');
    };

    ['beta', 'latest'].forEach((build) => {
        describe(`Upwork scraper (${build} version)`, () => {
            it('should scrape hire url', async () => {
                const runResult = await run({
                    actorId: 'QO4eKupwzgl5yAkKY',
                    input: {
                        debugMode: true,
                        extendOutputFunction:
                            'async () => {\n  return { timestamp: Date.now() }\n\n}',
                        maxItems: 10,
                        proxy: {
                            useApifyProxy: true,
                        },
                        rhrs: false,
                        searchFor: 'talent',
                        startUrls: [
                            'https://www.upwork.com/hire/blockchain-developers/',
                        ],
                        useBuiltInSearch: false,
                    },
                    options: {
                        build,
                    },
                    name: 'Upwork Hire URL Health Check',
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
                        for (const profile of results) {
                            checkProfile(profile, runResult);
                        }
                    }
                );
            });

            it('should search for profiles using built in search', async () => {
                const runResult = await run({
                    actorId: 'QO4eKupwzgl5yAkKY',
                    input: {
                        category: '531770282580668419',
                        debugMode: true,
                        extendOutputFunction:
                            'async () => {\n  return { timestamp: Date.now() }\n\n}',
                        maxItems: 5,
                        proxy: {
                            useApifyProxy: true,
                        },
                        rhrs: false,
                        search: 'PHP',
                        searchFor: 'talent',
                        startUrls: ['https://www.upwork.com/search/profiles/'],
                        useBuiltInSearch: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Upwork Search Profile Health Check',
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
                            .toBe(5);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array')
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;
                        for (const profile of results) {
                            checkProfile(profile, runResult);
                        }
                    }
                );
            });

            it('should search for jobs using built in search', async () => {
                const runResult = await run({
                    actorId: 'QO4eKupwzgl5yAkKY',
                    input: {
                        debugMode: true,
                        extendOutputFunction:
                            'async () => {\n  return { timestamp: Date.now() }\n\n}',
                        maxItems: 5,
                        proxy: {
                            useApifyProxy: true,
                        },
                        search: 'javascript',
                        searchFor: 'job',
                        startUrls: ['https://www.upwork.com/search/profiles/'],
                        useBuiltInSearch: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Upwork Search Job Health Check',
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
                            .toBe(5);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array')
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;
                        for (const job of results) {
                            checkJob(job, runResult);
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
