import {RedditAPIClient, RedisClient} from "@devvit/public-api";
import {getUserPosts, setPosts, setUserQueue, setUserShares} from "./redisHelpers.js";
import {AppSettings} from "./settingsHelpers.js";

/**
 * Calculate and store the total shares for a user based on the cumulative score of their posts.
 * @param {RedditAPIClient} reddit Reddit API client.
 * @param {RedisClient} redis Instance of the Devvit's Redis client.
 * @param {string} userId Full T2ID of the user.
 * @param {number} sharesFactor Shares factor to multiply each post's score by.
 * @returns Total shares.
 */
export async function updateUserShares (reddit: RedditAPIClient, redis: RedisClient, userId: string, sharesFactor: number): Promise<number> {
    console.log(`Updating shares for user ${userId}`);
    const storedPosts = await getUserPosts(redis, userId);

    if (Object.keys(storedPosts).length === 0) {
        console.log(`User ${userId} has no tracked posts, skipping`);
        return 0;
    }

    const newPosts: Record<string, number> = {};
    let scoreSum = 0;
    for (const [postId, storedScore] of Object.entries(storedPosts)) {
        const post = await reddit.getPostById(postId);
        if (!post || !post.authorId || post.spam || post.removed || post.removedBy || post.removedByCategory) {
            // Set removed/deleted post scores to 0.
            console.log(`Post ${postId} is removed or deleted, setting score to 0`);
            newPosts[postId] = 0;
            continue;
        }

        // We only want to increase scores to prevent abuse and vote fuzzing issues.
        if (storedScore < post.score) {
            newPosts[postId] = post.score;
        } else {
            newPosts[postId] = storedScore;
        }
        console.log(`Post ${postId} has a score of ${newPosts[postId]} (was ${storedScore})`);
        scoreSum += newPosts[postId];
    }

    console.log(`User ${userId} has a total score of ${scoreSum}`);
    await setPosts(redis, userId, newPosts); // Update the stored scores.

    const shares = Math.floor(scoreSum * sharesFactor);
    console.log(`User ${userId} has ${shares} shares`);
    await setUserShares(redis, userId, shares); // Update the user's total shares. We want a list of them in case we make a leaderboard or something.

    return shares;
}

export function canChangeFlair (config: AppSettings, flairCss?: string) {
    if (config.flairOverwrite) {
        return true;
    }

    if (flairCss) {
        return config.flairCss === flairCss;
    } else {
        return true;
    }
}

export async function updateUser (reddit: RedditAPIClient, redis: RedisClient, config: AppSettings, userId: string, currentSubname?: string) {
    if (!currentSubname) {
        currentSubname = (await reddit.getCurrentSubreddit()).name;
    }
    const shares = await updateUserShares(reddit, redis, userId, config.sharesFactor);
    const user = await reddit.getUserById(userId).catch(() => {
        console.log("User not found, shadowbanned or deleted?");
    });
    if (!user) {
        return;
    }
    const userFlair = await user.getUserFlairBySubreddit(currentSubname);
    if (canChangeFlair(config, userFlair?.flairCssClass)) {
        console.log(`Shares updated for ${user.username} (${userId}), updating flair`);
        if (shares > 0) {
            const flairText = config.flairText.replace("{{s}}", shares > 1 ? "s" : "").replace("{{shares}}", shares.toFixed(0));
            if (userFlair?.flairText !== flairText) {
                console.log(`Changing flair for user ${user.username} (${userId}) to ${flairText}`);
                await reddit.setUserFlair({
                    subredditName: currentSubname,
                    username: user.username,
                    text: flairText.replace("{{shares}}", shares.toFixed(0)),
                    cssClass: config.flairCss,
                    flairTemplateId: config.flairTemplate,
                });
            } else {
                console.log(`Not changing flair for user ${user.username} (${userId}) in ${currentSubname}, flair is already correct`);
            }
        } else if (shares < 1 && userFlair?.flairText) {
            console.log("Removing flair for user ", user.username);
            await reddit.removeUserFlair(currentSubname, user.username);
        } else {
            console.log(`${user.username} has no shares and no flair, not changing flair`);
        }
    } else {
        console.log(`Can't change flair for user ${user.username} (${userId}) in ${currentSubname}`);
    }
    console.log(`Updating user ${user.username} (${userId}) in the queue`);
    await setUserQueue(redis, userId, Date.now());
    console.log(`User ${user.username} (${userId}) fully updated`);
}
