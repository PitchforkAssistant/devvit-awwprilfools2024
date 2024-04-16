import {ZMember} from "@devvit/protos";
import {RedisClient} from "@devvit/public-api";
import {isT2ID, isT3ID} from "@devvit/shared-types/tid.js";

/**
 * Sets the given post in Redis with the given score.
 * @param {RedisClient} redis Instance of the Devvit's Redis client
 * @param {string} authorId Full T2ID of the author
 * @param {string} postId Full T3ID of the post
 * @param {number} score Score to set for the post, defaults to 1
 */
export async function setPost (redis: RedisClient, authorId: string, postId: string, score: number = 1) {
    await redis.zAdd("posts", {member: `${authorId}:${postId}`, score});
}

/**
 * Sets the given post in Redis with the given score.
 * @param {RedisClient} redis Instance of the Devvit's Redis client
 * @param {string} authorId Full T2ID of the author
 * @param {Record<string, number>} posts Record consisting of post IDs and their scores
 */
export async function setPosts (redis: RedisClient, authorId: string, posts: Record<string, number>) {
    const members: ZMember[] = Object.entries(posts).map(([postId, score]) => ({member: `${authorId}:${postId}`, score}));
    console.log(members);
    await redis.zAdd("posts", ...members);
}

/**
 * Safe way to get the stored post score from Redis.
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @param {string} authorId Full T2ID of the author.
 * @param {string} postId Full T3ID of the post.
 * @param {number} notFoundScore Score to return if the post is not found in Redis, defaults to 0 (minimum possible post score on Reddit).
 * @returns {Promise<number>} Stored score of the post, or the notFoundScore if the post is not found in Redis.
 */
export async function getPostScore (redis: RedisClient, authorId: string, postId: string, notFoundScore: number = 0): Promise<number> {
    try {
        return await redis.zScore("posts", `${authorId}:${postId}`);
    } catch (e) {
        console.log(`Attempted to get post score for untracked post ${postId}`, e);
        return notFoundScore;
    }
}

/**
 * Get user's tracked posts from Redis.
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @param {string} authorId Full T2ID of the author.
 * @returns {Promise<string[]>} List of tracked post IDs for the user, may be empty.
 */
export async function getUserPosts (redis: RedisClient, authorId: string): Promise<Record<string, number>> {
    try {
        const redisPostsScan = await redis.zScan("posts", 0, `${authorId}:*`, Infinity);
        const userTrackedPosts: Record<string, number> = {};
        console.log(redisPostsScan.members);

        redisPostsScan.members.forEach(member => {
            console.log(member);
            const [, postId] = member.member.split(":");
            if (postId && isT3ID(postId)) { // zScan seems to be inserting empty members for some reason, this should filter those and any other invalid IDs out.
                userTrackedPosts[postId] = member.score;
            }
        });

        return userTrackedPosts;
    } catch (e) {
        console.warn(`Failed to get posts for user ${authorId} from Redis`, e);
        return {};
    }
}

/**
 * Sets the first seen timestamp for a given user, use userSeen if you
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @param {string} userId Full T2ID of the user.
 * @param {number} timestamp Timestamp to set as the first seen timestamp
 */
export async function setUserFirstSeen (redis: RedisClient, userId: string, timestamp: number) {
    await redis.zAdd("userFirstSeen", {member: userId, score: timestamp});
}

/**
 * Safe way to get the first seen timestamp for a given user from Redis.
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @param {string} userId Full T2ID of the user.
 * @returns {Promise<number | undefined>} First seen timestamp of the user, or undefined if the user is not found in Redis.
 */
export async function getUserFirstSeen (redis: RedisClient, userId: string): Promise<number | undefined> {
    try {
        const userFirstSeen = await redis.zScore("userFirstSeen", userId);
        return userFirstSeen;
    } catch (e) {
        return undefined;
    }
}

/**
 * Sets the user's position in the queue.
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @param {string} userId Full T2ID of the user.
 * @param {number} timestamp Timestamp to set as the last updated timestamp.
 */
export async function setUserQueue (redis: RedisClient, userId: string, timestamp: number) {
    await redis.zAdd("userQueue", {member: userId, score: timestamp});
}

/**
 * Gets all users in the queue.
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @returns {Promise<string[]>} List of all user IDs in the queue, may be empty.
 */
export async function getQueue (redis: RedisClient): Promise<string[]> {
    try {
        const queue = await redis.zRange("userQueue", 0, -1, {by: "rank"});
        return queue.map(item => item.member);
    } catch (e) {
        console.warn("Failed to get queue from Redis", e);
        return [];
    }
}

/**
 * Sets the first seen timestamp for a given user in Redis and adds the user to the queue if they are new.
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @param {string} userId Full T2ID of the user.
 * @param {number} timestamp Timestamp to set as the first seen timestamp and queue score.
 * @returns {Promise<boolean>} True if this is the first time the user is seen, false if the user was already seen before.
 */
export async function userSeen (redis: RedisClient, userId: string, timestamp: number): Promise<boolean> {
    const userFirstSeen = await getUserFirstSeen(redis, userId);
    if (userFirstSeen === undefined) {
        console.log(`Tracking new user ${userId} at ${timestamp}`);
        await setUserQueue(redis, userId, timestamp);
        await setUserFirstSeen(redis, userId, timestamp);
        return true;
    }
    return false;
}

/**
 * Set the user's shares values in Redis.
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @param {string} userId Full T2ID of the user.
 * @param {number} shares Number of shares to set for the user.
 */
export async function setUserShares (redis: RedisClient, userId: string, username: string, shares: number) {
    await redis.zAdd("shares", {member: `${userId}:${username}`, score: shares});
}

/**
 * Get the user's shares value from Redis.
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @param {string} userId Full T2ID of the user.
 * @param {number} notFoundShares Number of shares to return if the user is not found in Redis, defaults to 0.
 * @returns {Promise<number>} Number of shares the user has, or notFoundShares if the user is not found in Redis.
 */
export async function getUserShares (redis: RedisClient, userId: string, username: string, notFoundShares: number = 0): Promise<number> {
    try {
        const userShares = await redis.zScore("shares", `${userId}:${username}`);
        return userShares;
    } catch (e) {
        console.log(`Attempted to get shares for untracked user ${userId}`, e);
        return notFoundShares;
    }
}

export type LeaderboardUser = {
    id: string;
    username: string;
    shares: number;
}

/**
 *
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @param minShares Minimum number of shares to include in the leaderboard, defaults to 1.
 * @returns {Promise<ZMember[]>} ZMember array, where the member is the user ID and score is the number of shares.
 */
export async function getSharesLeaderboard (redis: RedisClient, minShares: number = 1): Promise<LeaderboardUser[]> {
    try {
        const leaderboardData = await redis.zRange("shares", minShares, Infinity, {by: "score", reverse: true});
        const leaderboard: LeaderboardUser[] = [];
        for (const [, {member, score}] of leaderboardData.entries()) {
            const [userId, username] = member.split(":");
            if (isT2ID(userId) && username) {
                leaderboard.push({id: userId, username, shares: score});
            }
        }
        return leaderboard;
    } catch (e) {
        console.warn("Failed to get shares leaderboard from Redis", e);
        return [];
    }
}
