// Keeping all of the labels, help texts, error messages, and default values in one place makes keeps main.ts cleaner and makes them easier to change.
// It also opens up the possibility of internationalization in the future.

import {Form} from "@devvit/public-api";

export const KEYS = {
    ACCEPTING_NEW_POSTS: "acceptingNewPosts",
    SHARES_FACTOR: "sharesFactor",
    FLAIR_OVERWRITE: "flairOverwrite",
    FLAIR_TEMPLATE: "flairTemplate",
    FLAIR_TEXT: "flairText",
    FLAIR_CSS: "flairCss",
    LEADERBOARD_MIN_SCORE: "leaderboardMinScore",
    LEADERBOARD_HELP_URL: "leaderboardHelpUrl",
};

export const LABELS = {
    ACCEPTING_NEW_POSTS: "Accepting New Posts",
    SHARES_FACTOR: "Shares Factor",
    FLAIR_SETTINGS: "Flair Settings",
    FLAIR_OVERWRITE: "Overwrite Existing User Flairs",
    FLAIR_TEMPLATE: "Flair Template ID",
    FLAIR_TEXT: "Flair Text",
    FLAIR_CSS: "Flair CSS Class",
    CUSTOM_POST_TITLE: "Leaderboard Post Title",
    FORM: "Create Custom Post",
    FORM_ACCEPT: "Submit",
    FORM_CANCEL: "Cancel",
    LEADERBOARD_MIN_SCORE: "Leaderboard Minimum Score",
    LEADERBOARD_HELP_URL: "Leaderboard Help URL",
};

export const HELP_TEXTS = {
    ACCEPTING_NEW_POSTS: "Whether the app is currently accepting new posts.",
    SHARES_FACTOR: "The number of shares awarded is the cumulative score of all the user's tracked posts multiplied by this number.",
    FLAIR_OVERWRITE: "If this is set to true, users with existing flairs that differ from the defined template will also have their flairs changed.",
    FLAIR_TEMPLATE: "The ID of the flair template to apply to users.",
    FLAIR_TEXT: "The text to display on the flair, must contain the placeholder {{shares}}.",
    FLAIR_CSS: "The CSS class to apply to the flair.",
    CUSTOM_POST_TITLE: "The title to give to the leaderboard post.",
    LEADERBOARD_MIN_SCORE: "The minimum score required to appear on the leaderboard.",
    LEADERBOARD_HELP_URL: "The URL to link to when users click the help button on the leaderboard.",
};

export const ERRORS = {
    FLAIR_TEXT_EMPTY: "Flair text must not be empty.",
    FLAIR_TEXT_NO_PLACEHOLDER: "Flair text must contain the placeholder {{shares}}.",
    CUSTOM_POST_NO_TITLE: "You did not provide a title for the post.",
    CUSTOM_POST_FAILED: "An error occurred while creating the custom post.",
};

export const DEFAULTS = {
    ACCEPTING_NEW_POSTS: false,
    SHARES_FACTOR: 0.1,
    FLAIR_OVERWRITE: false,
    FLAIR_TEMPLATE: "",
    FLAIR_TEXT: ":stonks: {{shares}} share{{s}}",
    FLAIR_CSS: "april24",
    LEADERBOARD_MIN_SCORE: 1,
    LEADERBOARD_HELP_URL: "https://www.reddit.com/r/aww/comments/1bsx0m7/following_in_reddits_tracks_raww_is_going_public/",
};

export const newPostForm: Form = {
    fields: [
        {
            type: "string",
            name: "title",
            label: LABELS.CUSTOM_POST_TITLE,
            helpText: HELP_TEXTS.CUSTOM_POST_TITLE,
        },
    ],
    title: LABELS.FORM,
    acceptLabel: LABELS.FORM_ACCEPT,
    cancelLabel: LABELS.FORM_CANCEL,
};
