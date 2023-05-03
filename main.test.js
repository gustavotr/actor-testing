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
    ['beta', 'latest'].forEach((build) => {
        describe(`Reddit scraper (${build} version)`, () => {
            it('should search for posts succefully', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        maxComments: 0,
                        maxCommunitiesAndUsers: 0,
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
                    name: 'Reddit Post Health Check',
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
                            expect(post.id)
                                .withContext(runResult.format('Id'))
                                .toBeNonEmptyString();

                            expect(post.parsedId)
                                .withContext(runResult.format('Parsed Id'))
                                .toBeNonEmptyString();

                            expect(post.url)
                                .withContext(runResult.format('Url'))
                                .toStartWith('https://www.reddit.com/r/');

                            expect(post.username)
                                .withContext(runResult.format('Username'))
                                .toBeNonEmptyString();

                            expect(post.title)
                                .withContext(runResult.format('Title'))
                                .toBeNonEmptyString();

                            expect(post.communityName)
                                .withContext(runResult.format('Community Name'))
                                .toBeNonEmptyString();

                            expect(post.parsedCommunityName)
                                .withContext(
                                    runResult.format('Parsed Community Name'),
                                )
                                .toBeNonEmptyString();

                            expect(post.parsedCommunityName)
                                .withContext(
                                    runResult.format('Parsed Community Name'),
                                )
                                .toBeNonEmptyString();

                            expect(post.body)
                                .withContext(runResult.format('Body'))
                                .toBeNonEmptyString();

                            expect(post.createdAt)
                                .withContext(runResult.format('Created At'))
                                .toBeNonEmptyString();

                            expect(post.dataType)
                                .withContext(runResult.format('Data Type'))
                                .toBe('post');
                        }
                    },
                );
            });
            it('should search for comments succefully', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        maxComments: 10,
                        maxCommunitiesAndUsers: 0,
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
                            .toBe(10);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array'),
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;

                        for (const comment of results) {
                            expect(comment.id)
                                .withContext(runResult.format('Id'))
                                .toBeNonEmptyString();

                            expect(comment.parsedId)
                                .withContext(runResult.format('Parsed Id'))
                                .toBeNonEmptyString();

                            expect(comment.url)
                                .withContext(runResult.format('Url'))
                                .toStartWith('https://www.reddit.com/r/');

                            expect(comment.parentId)
                                .withContext(runResult.format('Parent Id'))
                                .toBeNonEmptyString();

                            expect(comment.username)
                                .withContext(runResult.format('Username'))
                                .toBeNonEmptyString();

                            expect(comment.category)
                                .withContext(runResult.format('Category'))
                                .toBeNonEmptyString();

                            expect(comment.communityName)
                                .withContext(runResult.format('Community Name'))
                                .toBeNonEmptyString();

                            expect(comment.body)
                                .withContext(runResult.format('Body'))
                                .toBeNonEmptyString();

                            expect(comment.createdAt)
                                .withContext(runResult.format('Created At'))
                                .toBeNonEmptyString();

                            expect(comment.upVotes)
                                .withContext(runResult.format('Up Votes'))
                                .toBeInstanceOf(Number);

                            expect(comment.numberOfreplies)
                                .withContext(
                                    runResult.format('Number of replies'),
                                )
                                .toBeInstanceOf(Number);

                            expect(comment.dataType)
                                .withContext(runResult.format('Data Type'))
                                .toBe('comment');
                        }
                    },
                );
            });

            it('should search for users succefully', async () => {
                const runResult = await run({
                    actorId: 'oAuCIx3ItNrs2okjQ',
                    input: {
                        debugMode: true,
                        maxComments: 0,
                        maxCommunitiesAndUsers: 10,
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
                            .toBe(10);

                        expect(dataset.items)
                            .withContext(
                                runResult.format('Dataset items array'),
                            )
                            .toBeNonEmptyArray();

                        const results = dataset.items;

                        for (const post of results) {
                            expect(post.id)
                                .withContext(runResult.format('Id'))
                                .toBeNonEmptyString();

                            expect(post.parsedId)
                                .withContext(runResult.format('Parsed Id'))
                                .toBeNonEmptyString();

                            expect(post.url)
                                .withContext(runResult.format('Url'))
                                .toStartWith('https://www.reddit.com/r/');

                            expect(post.username)
                                .withContext(runResult.format('Username'))
                                .toBeNonEmptyString();

                            expect(post.title)
                                .withContext(runResult.format('Title'))
                                .toBeNonEmptyString();

                            expect(post.communityName)
                                .withContext(runResult.format('Community Name'))
                                .toBeNonEmptyString();

                            expect(post.parsedCommunityName)
                                .withContext(
                                    runResult.format('Parsed Community Name'),
                                )
                                .toBeNonEmptyString();

                            expect(post.parsedCommunityName)
                                .withContext(
                                    runResult.format('Parsed Community Name'),
                                )
                                .toBeNonEmptyString();

                            expect(post.body)
                                .withContext(runResult.format('Body'))
                                .toBeNonEmptyString();

                            expect(post.createdAt)
                                .withContext(runResult.format('Created At'))
                                .toBeNonEmptyString();

                            expect(post.dataType)
                                .withContext(runResult.format('Data Type'))
                                .toBe('post');
                        }
                    },
                );
            });
            // it('works with url input for community, post and user (reddit-url)', async () => {
            //     // it would be great to support other types of url but none other is working at the moment
            //     const runResult = await run({
            //         taskId: 'A3K29MChfzrcZykXX',
            //         options: {
            //             build,
            //         },
            //     });

            //     await expectAsync(runResult).toHaveStatus('SUCCEEDED');
            //     await expectAsync(runResult).withLog((log) => {
            //         expect(log)
            //             .withContext(runResult.format('Log ReferenceError'))
            //             .not.toContain('ReferenceError');
            //         expect(log)
            //             .withContext(runResult.format('Log TypeError'))
            //             .not.toContain('TypeError');
            //     });

            //     await expectAsync(runResult).withStatistics((stats) => {
            //         expect(stats.requestsRetries)
            //             .withContext(runResult.format('Request retries'))
            //             .toBeLessThan(3);
            //         expect(stats.crawlerRuntimeMillis)
            //             .withContext(runResult.format('Run time'))
            //             .toBeWithinRange(0.1 * 60000, 10 * 60000);
            //     });

            //     await expectAsync(runResult).withDataset(
            //         ({ dataset, info }) => {
            //             expect(info.cleanItemCount)
            //                 .withContext(
            //                     runResult.format('Dataset cleanItemCount'),
            //                 )
            //                 .toBeWithinRange(2, 6);
            //             // I would like it to be 3 as stated in input, but doesnt work like that in the moment - have always more

            //             expect(dataset.items)
            //                 .withContext(
            //                     runResult.format('Dataset items array'),
            //                 )
            //                 .toBeNonEmptyArray();

            //             const results = dataset.items;

            //             let post;
            //             let community;
            //             let comment;

            //             for (const r in results) {
            //                 if (results[r].dataType === 'post') {
            //                     post = results[r];
            //                 }
            //                 if (results[r].dataType === 'community') {
            //                     community = results[r];
            //                 }
            //                 if (results[r].dataType === 'user-comments') {
            //                     comment = results[r];
            //                 }
            //             }

            //             // checking the post
            //             expect(post.postUrl)
            //                 .withContext(runResult.format('Post url'))
            //                 .toBe(
            //                     'https://www.reddit.com/r/nasa/comments/lcllo8/biden_press_sec_jen_psaki_affirms_admin_support/',
            //                 );

            //             expect(post.communityName)
            //                 .withContext(
            //                     runResult.format('Post community name'),
            //                 )
            //                 .toBe('r/nasa');

            //             expect(post.numberOfVotes)
            //                 .withContext(
            //                     runResult.format('Post number of votes'),
            //                 )
            //                 .toBeGreaterThan(20000);

            //             expect(post.postedBy)
            //                 .withContext(runResult.format('Post posted by'))
            //                 .toBe('u/RadionSPW');

            //             // expect(post.postedDate)
            //             //     .withContext(runResult.format('Post posted date'))
            //             //     .toStartWith('2021-02-05');

            //             expect(post.title)
            //                 .withContext(runResult.format('Post title'))
            //                 .toBe(
            //                     'Biden Press Sec Jen Psaki Affirms Admin Support for Artemis Program',
            //                 );

            //             expect(post.comments)
            //                 .withContext(runResult.format('Post comments'))
            //                 .toBeNonEmptyArray();

            //             // checking the community
            //             expect(community.title)
            //                 .withContext(runResult.format('Community title'))
            //                 .toBe('Minecraft on reddit');

            //             expect(community.title2)
            //                 .withContext(runResult.format('Community title2'))
            //                 .toBe('r/Minecraft');

            //             expect(community.createdAt)
            //                 .withContext(
            //                     runResult.format('Community created at'),
            //                 )
            //                 .toBe('2009-06-11T00:00:00.000Z');

            //             expect(community.members)
            //                 .withContext(runResult.format('Community members'))
            //                 .toBeGreaterThan(111111);
            //             // make it bigger when fixed

            //             expect(community.moderators)
            //                 .withContext(
            //                     runResult.format('Community moderators'),
            //                 )
            //                 .toBeNonEmptyArray();

            //             expect(community.moderators)
            //                 .withContext(
            //                     runResult.format(
            //                         'Community moderators contains',
            //                     ),
            //                 )
            //                 .toContain('BritishEnglishPolice');

            //             expect(community.communityUrl)
            //                 .withContext(runResult.format('Community url'))
            //                 .toBe('https://www.reddit.com/r/Minecraft/');

            //             expect(community.posts)
            //                 .withContext(runResult.format('Community posts'))
            //                 .toBeNonEmptyArray();

            //             expect(community.posts.length)
            //                 .withContext(
            //                     runResult.format('Community posts length'),
            //                 )
            //                 .toBe(3);

            //             // checking the comment
            //             expect(comment.user)
            //                 .withContext(runResult.format('Comment user'))
            //                 .toBe('lukaskrivka');

            //             expect(comment.userUrl)
            //                 .withContext(runResult.format('Comment user url'))
            //                 .toBe('https://www.reddit.com/user/lukaskrivka/');

            //             expect(comment.comments)
            //                 .withContext(runResult.format('Comment comments'))
            //                 .toBeNonEmptyArray();
            //         },
            //     );
            // });
            // it('works with search term for posts (reddit-search-post-date)', async () => {
            //     const runResult = await run({
            //         taskId: 'HCrcjOjHkVapBLLGG',
            //         options: {
            //             build,
            //         },
            //     });

            //     await expectAsync(runResult).toHaveStatus('SUCCEEDED');
            //     await expectAsync(runResult).withLog((log) => {
            //         expect(log)
            //             .withContext(runResult.format('Log ReferenceError'))
            //             .not.toContain('ReferenceError');
            //         expect(log)
            //             .withContext(runResult.format('Log TypeError'))
            //             .not.toContain('TypeError');
            //     });

            //     await expectAsync(runResult).withStatistics((stats) => {
            //         expect(stats.requestsRetries)
            //             .withContext(runResult.format('Request retries'))
            //             .toBeLessThan(3);
            //         expect(stats.crawlerRuntimeMillis)
            //             .withContext(runResult.format('Run time'))
            //             .toBeWithinRange(0.1 * 60000, 10 * 60000);
            //     });

            //     await expectAsync(runResult).withDataset(
            //         ({ dataset, info }) => {
            //             expect(info.cleanItemCount)
            //                 .withContext(
            //                     runResult.format('Dataset cleanItemCount'),
            //                 )
            //                 .toBe(3);

            //             expect(dataset.items)
            //                 .withContext(
            //                     runResult.format('Dataset items array'),
            //                 )
            //                 .toBeNonEmptyArray();

            //             const results = dataset.items;

            //             for (const r in results) {
            //                 expect(results[r].dataType)
            //                     .withContext(runResult.format('Data type'))
            //                     .toBe('post');

            //                 expect(results[r].postUrl)
            //                     .withContext(runResult.format('Post url'))
            //                     .toStartWith('https://www.reddit.com/');

            //                 expect(results[r].communityName)
            //                     .withContext(runResult.format('Community name'))
            //                     .toStartWith('r/');

            //                 expect(results[r].communityUrl)
            //                     .withContext(runResult.format('Community url'))
            //                     .toStartWith('https://www.reddit.com/r/');

            //                 expect(results[r].numberOfVotes)
            //                     .withContext(
            //                         runResult.format('Number of votes'),
            //                     )
            //                     .toBeGreaterThan(10);

            //                 expect(results[r].title.toLowerCase())
            //                     .withContext(runResult.format('Post title'))
            //                     .toContain('fun');

            //                 expect(results[r].comments)
            //                     .withContext(runResult.format('Comments'))
            //                     .toBeNonEmptyArray();

            //                 expect(
            //                     moment()
            //                         .subtract(24, 'hour')
            //                         .diff(results[r].postedDate),
            //                 )
            //                     .withContext(runResult.format('Post date'))
            //                     .toBeLessThan(0);
            //             }
            //         },
            //     );
            // });
            // it('search term for communities ("reddit-search-communities")', async () => {
            //     const runResult = await run({
            //         taskId: 'QmfQoVf7KSFebAIXB',
            //         options: {
            //             build,
            //         },
            //     });

            //     await expectAsync(runResult).toHaveStatus('SUCCEEDED');
            //     await expectAsync(runResult).withLog((log) => {
            //         expect(log)
            //             .withContext(runResult.format('Log ReferenceError'))
            //             .not.toContain('ReferenceError');
            //         expect(log)
            //             .withContext(runResult.format('Log TypeError'))
            //             .not.toContain('TypeError');
            //     });

            //     await expectAsync(runResult).withStatistics((stats) => {
            //         expect(stats.requestsRetries)
            //             .withContext(runResult.format('Request retries'))
            //             .toBeLessThan(3);
            //         expect(stats.crawlerRuntimeMillis)
            //             .withContext(runResult.format('Run time'))
            //             .toBeWithinRange(1 * 60, 10 * 60000);
            //     });

            //     await expectAsync(runResult).withDataset(
            //         ({ dataset, info }) => {
            //             expect(info.cleanItemCount)
            //                 .withContext(
            //                     runResult.format('Dataset cleanItemCount'),
            //                 )
            //                 .toBe(3);

            //             expect(dataset.items)
            //                 .withContext(
            //                     runResult.format('Dataset items array'),
            //                 )
            //                 .toBeNonEmptyArray();

            //             const results = dataset.items;

            //             let isCorrectPosts = false;
            //             let isCorrectPostNumber = false;

            //             for (const r in results) {
            //                 if (Array.isArray(results[r].posts)) {
            //                     isCorrectPosts = true;
            //                 }
            //                 if (results[r].posts?.length > 0) {
            //                     isCorrectPostNumber = true;
            //                 }

            //                 expect(results[r].title)
            //                     .withContext(
            //                         runResult.format('Community title'),
            //                     )
            //                     .toBeNonEmptyString();

            //                 expect(results[r].members)
            //                     .withContext(
            //                         runResult.format(
            //                             'Number of community members',
            //                         ),
            //                     )
            //                     .toBeGreaterThan(1000);

            //                 expect(results[r].moderators)
            //                     .withContext(
            //                         runResult.format('Community moderators'),
            //                     )
            //                     .toBeNonEmptyArray();

            //                 expect(results[r].communityUrl)
            //                     .withContext(runResult.format('Community url'))
            //                     .toStartWith('https://www.reddit.com/r/');

            //                 expect(results[r].category)
            //                     .withContext(
            //                         runResult.format('Community category'),
            //                     )
            //                     .toBeNonEmptyString();

            //                 expect(results[r].dataType)
            //                     .withContext(runResult.format('Data type'))
            //                     .toBe('community');
            //             }
            //             expect(isCorrectPosts)
            //                 .withContext(runResult.format('Community posts'))
            //                 .toBe(true);

            //             expect(isCorrectPostNumber)
            //                 .withContext(
            //                     runResult.format('Community posts number'),
            //                 )
            //                 .toBe(true);
            //         },
            //     );
            // });
            // it('search term for url from gslink, community channel and popular ("reddit-gslink")', async () => {
            //     const runResult = await run({
            //         taskId: 'jQaE940zqPLsvgzkq',
            //         options: {
            //             build,
            //         },
            //     });

            //     await expectAsync(runResult).toHaveStatus('SUCCEEDED');
            //     await expectAsync(runResult).withLog((log) => {
            //         expect(log)
            //             .withContext(runResult.format('Log ReferenceError'))
            //             .not.toContain('ReferenceError');
            //         expect(log)
            //             .withContext(runResult.format('Log TypeError'))
            //             .not.toContain('TypeError');
            //     });

            //     await expectAsync(runResult).withStatistics((stats) => {
            //         expect(stats.requestsRetries)
            //             .withContext(runResult.format('Request retries'))
            //             .toBeLessThan(3);
            //         expect(stats.crawlerRuntimeMillis)
            //             .withContext(runResult.format('Run time'))
            //             .toBeWithinRange(1 * 60, 10 * 60000);
            //     });

            //     await expectAsync(runResult).withDataset(
            //         ({ dataset, info }) => {
            //             expect(info.cleanItemCount)
            //                 .withContext(
            //                     runResult.format('Dataset cleanItemCount'),
            //                 )
            //                 .toBe(3);

            //             expect(dataset.items)
            //                 .withContext(
            //                     runResult.format('Dataset items array'),
            //                 )
            //                 .toBeNonEmptyArray();

            //             const results = dataset.items;

            //             for (const r in results) {
            //                 expect(results[r].title)
            //                     .withContext(
            //                         runResult.format('Community title'),
            //                     )
            //                     .toBe('popular');

            //                 expect(results[r].category)
            //                     .withContext(
            //                         runResult.format('Community category'),
            //                     )
            //                     .toBeNonEmptyString();

            //                 expect(results[r].dataType)
            //                     .withContext(runResult.format('Data type'))
            //                     .toBe('community');

            //                 expect(results[r].posts)
            //                     .withContext(
            //                         runResult.format('Community posts'),
            //                     )
            //                     .toBeNonEmptyArray();

            //                 expect(results[r].posts.length)
            //                     .withContext(
            //                         runResult.format('Community posts number'),
            //                     )
            //                     .toBe(1);
            //             }
            //         },
            //     );
            // });
        });
    });
};

const input = {
    abortRuns: true,
    defaultTimeout: 900000,
    retryFailedTests: true,
    testSpec: main.toString(),
    verboseLogs: true,
};

fs.writeFileSync(
    path.join(__dirname, './storage/key_value_stores/default/INPUT.json'),
    JSON.stringify(input, null, 2),
);
