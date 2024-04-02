import {FormOnSubmitEvent} from "@devvit/public-api";
import {Context} from "@devvit/public-api";
import {ERRORS} from "../constants.js";
import {LeadeboardPreview} from "../customPost/components/preview.js";

export async function formOnSubmit (event: FormOnSubmitEvent, context: Context) {
    // The logic for creating a custom post.
    const subredditName = (await context.reddit.getCurrentSubreddit()).name;

    let title = "";
    if (event.values.title) {
        title = String(event.values.title);
    }
    if (!title) {
        context.ui.showToast(ERRORS.CUSTOM_POST_NO_TITLE);
        return;
    }

    try {
        const newPost = await context.reddit.submitPost({
            title,
            subredditName,
            preview: LeadeboardPreview,
        });
        context.ui.showToast({
            text: "Custom post created, redirecting...",
            appearance: "success",
        });
        context.ui.navigateTo(newPost);
    } catch (e) {
        console.error("Error creating custom post", e);
        context.ui.showToast(ERRORS.CUSTOM_POST_FAILED);
    }
}
