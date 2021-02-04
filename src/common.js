const Apify = require('apify'); // eslint-disable-line no-unused-vars
/**
 * @typedef {{
    *   runId: string,
    *   hashCode: string,
    *   data: Pick<Apify.ActorRun,
    *      | 'actId'
    *      | 'defaultDatasetId'
    *      | 'defaultKeyValueStoreId'
    *      | 'defaultRequestQueueId'
    *      | 'id'
    *      | 'buildNumber'
    *   >,
    * }} Result
    */

/**
 * @typedef {(params: RunParams) => Promise<Result>} Runner
 */

/**
 * @typedef {{
 *  taskId?: string,
 *  actorId?: string,
 *  input?: any,
 *  options?: Parameters<Apify.callTask>[2]
 *  nonce?: string
 * }} RunParams
 */

/** @param {Result} run */
const isRunResult = (run) => run
    && typeof run.hashCode === 'string'
    && !!run.hashCode
    && !!run.data;

/**
 * @param {Result} runResult
 * @returns {(message: string) => string}
 */
const formatRunMessage = (runResult) => (message) => `${message}\nhttps://my.apify.com/actors/${runResult.data.actId}#/runs/${runResult.runId} :`;

/**
 * @param {string} body
 */
const linkToMkdwn = (body) => {
    return [...body.matchAll(/(https:\/\/[\S]+)/gm)].reduce((out, matches) => {
        if (!matches[1]) {
            return out;
        }

        return `${out.slice(0, matches.index)}${out.slice(matches.index).replace(matches[1], `<${matches[1]}|${matches[1].split('/').pop()}>`)}`;
    }, body);
};

/** @param {any} result */
const collectFailed = (result) => {
    return Object.values(result).flatMap((v) => {
        if (!v.specs || !v.specs.length || !v.specs.some((spec) => spec.failedExpectations.length)) {
            return [];
        }

        return v.specs.flatMap((spec) => spec.failedExpectations.map((s) => `\`\`\`${linkToMkdwn(s.message)}\`\`\``));
    });
};

module.exports = {
    formatRunMessage,
    isRunResult,
    collectFailed,
};