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

    const checkPost = (post, runResult) => {
        if (post.dataType !== 'post') {
            return;
        }
        expect(post.id)
            .withContext(runResult.format('Post Id'))
            .toBeNonEmptyString();

        warnExpect(post.parsedId)
            .withContext(runResult.format('Post Parsed Id'))
            .toBeNonEmptyString();

        expect(post.url)
            .withContext(runResult.format('Post Url'))
            .toStartWith('https://www.reddit.com/r/');

        warnExpect(post.username)
            .withContext(runResult.format('Post Username'))
            .toBeNonEmptyString();

        warnExpect(post.title)
            .withContext(runResult.format('Post Title'))
            .toBeNonEmptyString();

        warnExpect(post.communityName)
            .withContext(runResult.format('Post Community Name'))
            .toBeNonEmptyString();

        warnExpect(post.parsedCommunityName)
            .withContext(runResult.format('Post Parsed Community Name'))
            .toBeNonEmptyString();

        warnExpect(typeof post.body === 'string' || !post.body)
            .withContext(runResult.format('Post Body'))
            .toBe(true);

        warnExpect(post.createdAt)
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
        expect(community.id)
            .withContext(runResult.format('Community Id'))
            .toBeNonEmptyString();

        warnExpect(community.title)
            .withContext(runResult.format('Community title'))
            .toBeNonEmptyString();

        warnExpect(community.createdAt)
            .withContext(runResult.format('Community created at'))
            .toBeNonEmptyString();

        warnExpect(typeof community.members === 'number' || !community.members)
            .withContext(runResult.format('Community members'))
            .toBe(true);

        warnExpect(community.moderators?.length > 0 || !community.moderators)
            .withContext(runResult.format('Community moderators'))
            .toBe(true);

        expect(community.url)
            .withContext(runResult.format('Community url'))
            .toStartWith('https://www.reddit.com/r/');

        expect(community.dataType)
            .withContext(runResult.format('Community Data Type'))
            .toBe('community');
    };

    const checkComment = (comment, runResult) => {
        if (comment.dataType !== 'comment') {
            return;
        }
        expect(comment.id)
            .withContext(runResult.format('Comment Id'))
            .toBeNonEmptyString();

        warnExpect(comment.parsedId)
            .withContext(runResult.format('Comment Parsed Id'))
            .toBeNonEmptyString();

        expect(comment.url)
            .withContext(runResult.format('Comment Url'))
            .toStartWith('https://www.reddit.com/r/');

        warnExpect(comment.parentId)
            .withContext(runResult.format('Comment Parent Id'))
            .toBeNonEmptyString();

        warnExpect(comment.username)
            .withContext(runResult.format('Comment Username'))
            .toBeNonEmptyString();

        warnExpect(comment.category)
            .withContext(runResult.format('Comment Category'))
            .toBeNonEmptyString();

        warnExpect(comment.communityName)
            .withContext(runResult.format('Comment Community Name'))
            .toBeNonEmptyString();

        warnExpect(comment.body)
            .withContext(runResult.format('Comment Body'))
            .toBeNonEmptyString();

        warnExpect(comment.createdAt)
            .withContext(runResult.format('Comment Created At'))
            .toBeNonEmptyString();

        warnExpect(comment.upVotes)
            .withContext(runResult.format('Comment Up Votes'))
            .toBeInstanceOf(Number);

        warnExpect(comment.numberOfReplies)
            .withContext(runResult.format('Comment Number of Replies'))
            .toBeInstanceOf(Number);

        expect(comment.dataType)
            .withContext(runResult.format('Comment Data Type'))
            .toBe('comment');
    };

    const checkUser = (user, runResult) => {
        if (user.dataType !== 'user') {
            return;
        }

        expect(user.id)
            .withContext(runResult.format('User Id'))
            .toBeNonEmptyString();

        expect(user.url)
            .withContext(runResult.format('User Url'))
            .toStartWith('https://www.reddit.com/user/');

        warnExpect(user.username)
            .withContext(runResult.format('User Username'))
            .toBeNonEmptyString();

        warnExpect(user.userIcon)
            .withContext(runResult.format('User Icon'))
            .toBeNonEmptyString();

        warnExpect(user.postKarma)
            .withContext(runResult.format('User Post Karma'))
            .toBeInstanceOf(Number);

        warnExpect(user.commentKarma)
            .withContext(runResult.format('User Comment Karma'))
            .toBeInstanceOf(Number);

        warnExpect(user.createdAt)
            .withContext(runResult.format('User Created At'))
            .toBeNonEmptyString();

        warnExpect(user.scrapedAt)
            .withContext(runResult.format('User Scraped At'))
            .toBeNonEmptyString();

        warnExpect(user.over18)
            .withContext(runResult.format('User Over 18'))
            .toBeInstanceOf(Boolean);

        expect(user.dataType)
            .withContext(runResult.format('User Data Type'))
            .toBe('user');
    };

    input.versions.forEach((build) => {
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: true,
                        searchUsers: false,
                        searches: ['pizza'],
                        sort: 'relevance',
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Post Health Check',
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
                        .toBeLessThan(12);
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
                            .toBe(10);

                        warnExpect(dataset.items)
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

            it('should search for posts successfully without media links', async () => {
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: true,
                        searchUsers: false,
                        searches: ['pizza'],
                        sort: 'relevance',
                        includeMediaLinks: false,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Post Health Check without media links',
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
                        .toBeLessThan(12);
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
                            .toBe(10);

                        warnExpect(dataset.items)
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

            it('should search for posts limiting post date', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        skipComments: true,
                        skipUserPosts: false,
                        skipCommunity: false,
                        ignoreStartUrls: false,
                        searchPosts: true,
                        searchComments: false,
                        searchCommunities: false,
                        searchUsers: false,
                        sort: 'new',
                        includeNSFW: false,
                        maxItems: 10,
                        maxPostCount: 10,
                        maxComments: 0,
                        maxCommunitiesCount: 0,
                        maxUserCount: 0,
                        scrollTimeout: 40,
                        proxy: {
                            useApifyProxy: true,
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
                        },
                        startUrls: [
                            {
                                url: 'https://www.reddit.com/r/popular/new/',
                            },
                        ],
                        postDateLimit: new Date(Date.now() + 60000 * 60),
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Post Date Limit Health Check',
                });

                await expectAsync(runResult).toHaveStatus('SUCCEEDED');
                await expectAsync(runResult).withLog((log) => {
                    warnExpect(log)
                        .withContext(runResult.format('Log Reference'))
                        .toContain('posts due to date restrictions');
                    warnExpect(log)
                        .withContext(runResult.format('Log TypeError'))
                        .not.toContain('TypeError');
                });

                await expectAsync(runResult).withStatistics((stats) => {
                    expect(stats.requestsRetries)
                        .withContext(runResult.format('Request retries'))
                        .toBeLessThan(12);
                    expect(stats.crawlerRuntimeMillis)
                        .withContext(runResult.format('Run time'))
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBe(0);
                    },
                );
            });

            it('should search for posts using a start url successfully on pro version', async () => {
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: true,
                        searchUsers: false,
                        searches: [],
                        startUrls: [
                            { url: 'https://www.reddit.com/search/?q=networkasaservice&type=posts' },
                        ],
                        sort: 'relevance',
                        isLiteVersion: false,
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit PRO Search Post Start Url Health Check',
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
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBeWithinRange(1, 13);

                        warnExpect(dataset.items)
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

            it('should search for posts using a start url edge case', async () => {
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: true,
                        searchUsers: false,
                        searches: [],
                        startUrls: [
                            { url: 'https://www.reddit.com/search/?q=networkasaservice&type=posts' },
                        ],
                        sort: 'relevance',
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Post Start Url Health Check',
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
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBeWithinRange(1, 13);

                        warnExpect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array'),
                            )
                            .toBeNonEmptyArray();
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
                        },
                        scrollTimeout: 40,
                        searchComments: true,
                        searchCommunities: false,
                        searchPosts: false,
                        searchUsers: false,
                        searches: ['pizza'],
                        sort: 'relevance',
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Comments Health Check',
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
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBeWithinRange(1, 13);

                        warnExpect(dataset.items)
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: false,
                        searchUsers: true,
                        searches: ['pizza'],
                        sort: 'relevance',
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Users Health Check',
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
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBeWithinRange(1, 13);

                        warnExpect(dataset.items)
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: true,
                        searchPosts: false,
                        searchUsers: false,
                        skipComments: false,
                        searches: ['pizza'],
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Search Community Check',
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
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBeWithinRange(1, 13);

                        warnExpect(dataset.items)
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

            it('should search for community successfully in pro version', async () => {
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
                        },
                        scrollTimeout: 40,
                        searchComments: true,
                        searchCommunities: true,
                        searchPosts: false,
                        searchUsers: false,
                        skipComments: false,
                        searches: ['pizza'],
                        isLiteVersion: false,
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Pro Search Community Check',
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
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBeWithinRange(1, 13);

                        warnExpect(dataset.items)
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
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
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Community Check',
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
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBeWithinRange(1, 13);

                        warnExpect(dataset.items)
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

            it('should scrape community without media links', async () => {
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
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
                        includeMediaLinks: false,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Community Check without media links',
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
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBeWithinRange(1, 13);

                        warnExpect(dataset.items)
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
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
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Protected Community Check',
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
                        .toBeWithinRange(1000, 10 * 60000);
                });

                await expectAsync(runResult).withDataset(
                    ({ dataset, info }) => {
                        expect(info.cleanItemCount)
                            .withContext(
                                runResult.format('Dataset cleanItemCount'),
                            )
                            .toBeWithinRange(1, 13);

                        warnExpect(dataset.items)
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

            it('should scrape popular community', async () => {
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
                            apifyProxyGroups: [
                                'RESIDENTIAL',
                            ],
                        },
                        scrollTimeout: 40,
                        searchComments: false,
                        searchCommunities: false,
                        searchPosts: true,
                        searchUsers: false,
                        skipComments: false,
                        skipCommunity: true,
                        startUrls: [
                            { url: 'https://www.reddit.com/r/popular/' },
                        ],
                        includeMediaLinks: true,
                    },
                    options: {
                        build,
                    },
                    name: 'Reddit Popular Community Check',
                });

                await expectAsync(runResult).toHaveStatus('SUCCEEDED');
                await expectAsync(runResult).withLog((log) => {
                    warnExpect(log)
                        .withContext(runResult.format('Log ReferenceError'))
                        .not.toContain('ReferenceError');
                    warnExpect(log)
                        .withContext(runResult.format('Log TypeError'))
                        .not.toContain('TypeError');
                });

                await expectAsync(runResult).withStatistics((stats) => {
                    expect(stats.requestsRetries)
                        .withContext(runResult.format('Request retries'))
                        .toBeLessThan(12);
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
                            .toBeWithinRange(1, 13);

                        warnExpect(dataset.items)
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

        it('should scrape a user a user post and a user comment', async () => {
            const runResult = await run({
                actorId: 'oAuCIx3ItNrs2okjQ',
                input: {
                    debugMode: true,
                    maxComments: 1,
                    maxCommunitiesAndUsers: 5000000,
                    maxItems: 3,
                    maxLeaderBoardItems: 5000000,
                    maxPostCount: 1,
                    proxy: {
                        useApifyProxy: true,
                        apifyProxyGroups: [
                            'RESIDENTIAL',
                        ],
                    },
                    scrollTimeout: 40,
                    searchComments: false,
                    searchCommunities: false,
                    searchPosts: true,
                    searchUsers: false,
                    paid: true,
                    startUrls: [
                        {
                            url: 'https://www.reddit.com/user/BrineOfTheTimes/',
                        },
                        {
                            url: 'https://www.reddit.com/user/BrineOfTheTimes/submitted',
                        },
                        {
                            url: 'https://www.reddit.com/user/BrineOfTheTimes/comments',
                        },
                    ],
                    includeMediaLinks: true,
                },
                options: {
                    build,
                },
                name: 'Reddit User Check',
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
                    .toBeWithinRange(1000, 10 * 60000);
            });

            await expectAsync(runResult).withDataset(({ dataset, info }) => {
                expect(info.cleanItemCount)
                    .withContext(runResult.format('Dataset cleanItemCount'))
                    .toBeWithinRange(1, 5);

                warnExpect(dataset.items)
                    .withContext(runResult.format('Dataset items array'))
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
                    if (result.dataType === 'user') {
                        checkUser(result, runResult);
                    }
                }
            });
        });

        it('should scrape a comment', async () => {
            const runResult = await run({
                actorId: 'oAuCIx3ItNrs2okjQ',
                input: {
                    debugMode: true,
                    maxComments: 10,
                    maxCommunitiesAndUsers: 5000000,
                    maxItems: 10,
                    maxLeaderBoardItems: 5000000,
                    maxPostCount: 1,
                    proxy: {
                        useApifyProxy: true,
                        apifyProxyGroups: [
                            'RESIDENTIAL',
                        ],
                    },
                    scrollTimeout: 40,
                    searchComments: false,
                    searchCommunities: false,
                    searchPosts: true,
                    searchUsers: false,
                    paid: true,
                    startUrls: [
                        {
                            url: 'https://www.reddit.com/r/thunderdev/comments/1f2b8ss/comment/lq3hrs1/',
                        },
                    ],
                    includeMediaLinks: true,
                },
                options: {
                    build,
                },
                name: 'Reddit Comment Check',
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
                    .toBeWithinRange(1000, 10 * 60000);
            });

            await expectAsync(runResult).withDataset(({ dataset, info }) => {
                expect(info.cleanItemCount)
                    .withContext(runResult.format('Dataset cleanItemCount'))
                    .not.toBeLessThan(0);

                warnExpect(dataset.items)
                    .withContext(runResult.format('Dataset items array'))
                    .toBeNonEmptyArray();

                const results = dataset.items;

                const posts = results.filter(({ dataType }) => dataType === 'post');
                const comments = results.filter(({ dataType }) => dataType === 'comment');
                const users = results.filter(({ dataType }) => dataType === 'user');
                const communities = results.filter(({ dataType }) => dataType === 'community');

                const commentId = results.find(({ id }) => id === 't1_lq3hrs1')?.id;

                warnExpect(commentId)
                    .withContext(runResult.format('Comment data'))
                    .toBe('t1_lq3hrs1');

                warnExpect(posts.length)
                    .withContext(runResult.format('Post count'))
                    .toBe(0);
                warnExpect(users.length)
                    .withContext(runResult.format('User count'))
                    .toBe(0);
                warnExpect(communities.length)
                    .withContext(runResult.format('Community count'))
                    .toBe(0);
                warnExpect(comments.length)
                    .withContext(runResult.format('Comment count'))
                    .not.toBeLessThan(0);

                for (const result of results) {
                    if (result.dataType === 'comment') {
                        checkComment(result, runResult);
                    }
                }
            });
        });
    });
};

const input = {
    abortRuns: true,
    defaultTimeout: 900000,
    retryFailedTests: true,
    versions: ['latest'],
    email: 'gustavo@trudax.tech',
    testSpec: main.toString(),
    verboseLogs: true,
};

fs.writeFileSync(
    path.join(__dirname, './storage/key_value_stores/default/INPUT.json'),
    JSON.stringify(input, null, 2),
);
