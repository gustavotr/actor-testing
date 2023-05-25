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
    const checkPost = (post, runResult) => {
        if (post.dataType !== 'post') {
            return;
        }
        expect(post.id)
            .withContext(runResult.format('Post Id'))
            .toBeNonEmptyString();

        expect(post.parsedId)
            .withContext(runResult.format('Post Parsed Id'))
            .toBeNonEmptyString();

        expect(post.url)
            .withContext(runResult.format('Post Url'))
            .toStartWith('https://www.reddit.com/r/');

        expect(post.username)
            .withContext(runResult.format('Post Username'))
            .toBeNonEmptyString();

        expect(post.title)
            .withContext(runResult.format('Post Title'))
            .toBeNonEmptyString();

        expect(post.communityName)
            .withContext(runResult.format('Post Community Name'))
            .toBeNonEmptyString();

        expect(post.parsedCommunityName)
            .withContext(runResult.format('Post Parsed Community Name'))
            .toBeNonEmptyString();

        expect(typeof post.body === 'string' || !post.body)
            .withContext(runResult.format('Post Body'))
            .toBe(true);

        expect(post.createdAt)
            .withContext(runResult.format('Post Created At'))
            .toBeNonEmptyString();

        expect(post.dataType)
            .withContext(runResult.format('Post Data Type'))
            .toBe('post');
    };

    const checkCommunity = (community, runResult) => {
        if (community.dataType !== 'community') {
            return;
        }
        expect(community.title)
            .withContext(runResult.format('Community title'))
            .toBeNonEmptyString();

        expect(community.alternatineTitle)
            .withContext(runResult.format('Community alternatine title'))
            .toBeNonEmptyString();

        expect(community.createdAt)
            .withContext(runResult.format('Community created at'))
            .toBeNonEmptyString();

        expect(community.members)
            .withContext(runResult.format('Community members'))
            .toBeInstanceOf(Number);

        expect(community.moderators)
            .withContext(runResult.format('Community moderators'))
            .toBeNonEmptyArray();

        expect(community.communityUrl)
            .withContext(runResult.format('Community url'))
            .toStartWith(
                `https://www.reddit.com/${community.alternatineTitle}`,
            );
    };

    const checkComment = (comment, runResult) => {
        if (comment.dataType !== 'comment') {
            return;
        }
        expect(comment.id)
            .withContext(runResult.format('Comment Id'))
            .toBeNonEmptyString();

        expect(comment.parsedId)
            .withContext(runResult.format('Comment Parsed Id'))
            .toBeNonEmptyString();

        expect(comment.url)
            .withContext(runResult.format('Comment Url'))
            .toStartWith('https://www.reddit.com/r/');

        expect(comment.parentId)
            .withContext(runResult.format('Comment Parent Id'))
            .toBeNonEmptyString();

        expect(comment.username)
            .withContext(runResult.format('Comment Username'))
            .toBeNonEmptyString();

        expect(comment.category)
            .withContext(runResult.format('Comment Category'))
            .toBeNonEmptyString();

        expect(comment.communityName)
            .withContext(runResult.format('Comment Community Name'))
            .toBeNonEmptyString();

        expect(comment.body)
            .withContext(runResult.format('Comment Body'))
            .toBeNonEmptyString();

        expect(comment.createdAt)
            .withContext(runResult.format('Comment Created At'))
            .toBeNonEmptyString();

        expect(comment.upVotes)
            .withContext(runResult.format('Comment Up Votes'))
            .toBeInstanceOf(Number);

        expect(comment.numberOfreplies)
            .withContext(runResult.format('Comment Number of replies'))
            .toBeInstanceOf(Number);

        expect(comment.dataType)
            .withContext(runResult.format('Comment Data Type'))
            .toBe('comment');
    };

    ['beta', 'latest'].forEach((build) => {
        describe(`Reddit scraper (${build} version)`, () => {
            it('should search for posts successfully', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        maxComments: 0,
                        maxCommunitiesCount: 0,
                        maxItems: 10,
                        maxLeaderBoardItems: 0,
                        maxPostCount: 10,
                        proxy: {
                            useApifyProxy: true,
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: true,
                        searchUsers: false,
                        searches: ['pizza'],
                        sort: 'relevance',
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Post Health Check',
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
                        for (const post of results) {
                            checkPost(post, runResult);
                        }
                    },
                );
            });

            it('should search for comments successfully', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        maxComments: 10,
                        maxCommunitiesCount: 0,
                        maxItems: 10,
                        maxLeaderBoardItems: 0,
                        maxPostCount: 0,
                        proxy: {
                            useApifyProxy: true,
                        },
                        scrollTimeout: 40,
                        searchComments: true,
                        searchCommunities: false,
                        searchPosts: false,
                        searchUsers: false,
                        searches: ['pizza'],
                        sort: 'relevance',
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Comments Health Check',
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
                            .toBeWithinRange(1, 10);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array'),
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;

                        for (const comment of results) {
                            checkComment(comment, runResult);
                        }
                    },
                );
            });

            it('should search for users successfully', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        maxComments: 0,
                        maxCommunitiesCount: 10,
                        maxItems: 10,
                        maxLeaderBoardItems: 0,
                        maxPostCount: 0,
                        proxy: {
                            useApifyProxy: true,
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: false,
                        searchUsers: true,
                        searches: ['pizza'],
                        sort: 'relevance',
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Users Health Check',
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
                            .toBeWithinRange(1, 10);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array'),
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;

                        for (const post of results) {
                            checkPost(post);
                        }
                    },
                );
            });

            it('should search for community successfully', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        maxComments: 2,
                        maxCommunitiesCount: 2,
                        maxItems: 10,
                        maxLeaderBoardItems: 2,
                        maxPostCount: 2,
                        proxy: {
                            useApifyProxy: true,
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: true,
                        searchPosts: false,
                        searchUsers: false,
                        skipComments: false,
                        searches: ['pizza'],
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Community Check',
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
                            .toBe(2);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array'),
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;

                        for (const result of results) {
                            if (result.dataType === 'post') {
                                checkPost(result, runResult);
                            }
                            if (result.dataType === 'community') {
                                checkCommunity(result, runResult);
                            }
                            if (result.dataType === 'comment') {
                                checkComment(result, runResult);
                            }
                        }
                    },
                );
            });

            it('should scrape community', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        maxComments: 2,
                        maxCommunitiesCount: 2,
                        maxItems: 10,
                        maxLeaderBoardItems: 2,
                        maxPostCount: 2,
                        proxy: {
                            useApifyProxy: true,
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: true,
                        searchUsers: false,
                        skipComments: false,
                        startUrls: [
                            {
                                url: 'https://www.reddit.com/r/AskReddit/',
                            },
                        ],
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Community Check',
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

                        for (const result of results) {
                            if (result.dataType === 'post') {
                                checkPost(result, runResult);
                            }
                            if (result.dataType === 'community') {
                                checkCommunity(result, runResult);
                            }
                            if (result.dataType === 'comment') {
                                checkComment(result, runResult);
                            }
                        }
                    },
                );
            });

            it('should scrape protected community', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        maxComments: 2,
                        maxCommunitiesCount: 2,
                        maxItems: 10,
                        maxLeaderBoardItems: 2,
                        maxPostCount: 2,
                        proxy: {
                            useApifyProxy: true,
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: true,
                        searchUsers: false,
                        skipComments: false,
                        startUrls: [
                            {
                                url: 'https://www.reddit.com/r/nsfw/',
                            },
                        ],
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Protected Community Check',
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
                        .toBeWithinRange(10 * 1000, 10 * 60 * 1000);
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

                        for (const result of results) {
                            if (result.dataType === 'post') {
                                checkPost(result, runResult);
                            }
                            if (result.dataType === 'community') {
                                checkCommunity(result, runResult);
                            }
                            if (result.dataType === 'comment') {
                                checkComment(result, runResult);
                            }
                        }
                    },
                );
            });

            it('should search for url from popular community', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        maxComments: 2,
                        maxCommunitiesCount: 2,
                        maxItems: 10,
                        maxLeaderBoardItems: 2,
                        maxPostCount: 2,
                        proxy: {
                            useApifyProxy: true,
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: true,
                        searchUsers: false,
                        skipComments: false,
                        startUrls: ['https://www.reddit.com/r/popular/'],
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Popular Community Check',
                });

                await expectAsync(runResult).toHaveStatus('SUCCEEDED');
                await expectAsync(runResult).withLog((log) => {
                    expect(log)
                        .withContext(runResult.format('Log ReferenceError'))
                        .not.toContain('ReferenceError');
                    expect(log)
                        .withContext(runResult.format('Log TypeError'))
                        .not.toContain('TypeError');
                });

                await expectAsync(runResult).withStatistics((stats) => {
                    expect(stats.requestsRetries)
                        .withContext(runResult.format('Request retries'))
                        .toBeLessThan(3);
                    expect(stats.crawlerRuntimeMillis)
                        .withContext(runResult.format('Run time'))
                        .toBeWithinRange(1 * 60, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBe(3);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array'),
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;

                        for (const result of results) {
                            if (result.dataType === 'post') {
                                checkPost(result, runResult);
                            }
                            if (result.dataType === 'community') {
                                checkCommunity(result, runResult);
                            }
                            if (result.dataType === 'comment') {
                                checkComment(result, runResult);
                            }
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
