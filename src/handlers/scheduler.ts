import {Context, ScheduledJobEvent} from "@devvit/public-api";
import {getQueue} from "../helpers/redisHelpers.js";
import {updateUser} from "../helpers/sharesHelpers.js";
import {getAppSettings} from "../helpers/settingsHelpers.js";

export async function userFlairUpdater (event: ScheduledJobEvent, context: Context) {
    console.log(`userFlairUpdater job ran at ${new Date().toISOString()}\nevent:\n${JSON.stringify(event)}\ncontext:\n${JSON.stringify(context)}`);
    const config = await getAppSettings(context.settings);
    const currentSubname = (await context.reddit.getCurrentSubreddit()).name;

    const queuedUsers = await getQueue(context.redis);
    console.log("Queued users:", queuedUsers);
    for (const userId of queuedUsers) {
        console.log(`Updating user ${userId}`);
        try {
            await updateUser(context.reddit, context.redis, config, userId, currentSubname);
        } catch (e) {
            console.error(`Failed to update user ${userId}`, e);
            continue;
        }
    }

    console.log("userFlairUpdater job fully finished");
}
