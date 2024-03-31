import {AppInstall, AppUpgrade, ModAction, PostDelete, PostSubmit} from "@devvit/protos";
import {TriggerContext} from "@devvit/public-api";
import {startSingletonJob} from "devvit-helpers";
import {setPost, userSeen} from "../helpers/redisHelpers.js";
import {updateUser} from "../helpers/sharesHelpers.js";
import {getAppSettings} from "../helpers/settingsHelpers.js";

export async function onPostSubmit ({post, author, subreddit}: PostSubmit, context: TriggerContext) {
    const config = await getAppSettings(context.settings);
    if (!config.acceptingNewPosts) {
        return;
    }

    if (!post || !author || !subreddit) {
        throw "PostSubmit event missing post, author, or subreddit";
    }

    console.log(`Processing new post ${post.id} submitted by ${author.name} (${author.id})`);
    // Add the user to queue if they're not already in it.
    await userSeen(context.redis, author.id, post.createdAt);
    // Add the post to the list of tracked posts.
    await setPost(context.redis, author.id, post.id, post.score);
    // Update the user's flair.
    await updateUser(context.reddit, context.redis, config, author.id, subreddit.name);
}

export async function onPostDelete ({author, subreddit}: PostDelete, context: TriggerContext) {
    if (!author || !subreddit || !author.id || !subreddit.name) {
        throw "PostSubmit event missing author or subreddit data";
    }

    console.log(`Updating due to deleted post by ${author.name} (${author.id})`);
    await updateUser(context.reddit, context.redis, await getAppSettings(context.settings), author.id, subreddit.name);
}

export async function onModAction ({targetPost, subreddit, action}: ModAction, context: TriggerContext) {
    if (!targetPost || !subreddit || !targetPost.authorId || !subreddit.name) {
        return;
    }

    console.log(`Updating due to mod action ${action} on post ${targetPost.id} by ${targetPost.authorId}`);
    await updateUser(context.reddit, context.redis, await getAppSettings(context.settings), targetPost.authorId, subreddit.name);
}

export async function onAppChanged (event: AppInstall | AppUpgrade, context: TriggerContext) {
    try {
        await startSingletonJob(context.scheduler, "userFlairUpdater", "* * * * *", {});
    } catch (e) {
        console.error("Failed to schedule userFlairUpdater job", e);
        throw e;
    }
}
