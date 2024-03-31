// Keeping all of the labels, help texts, error messages, and default values in one place makes keeps main.ts cleaner and makes them easier to change.
// It also opens up the possibility of internationalization in the future.

export const KEYS = {
    ACCEPTING_NEW_POSTS: "acceptingNewPosts",
    SHARES_FACTOR: "sharesFactor",
    FLAIR_OVERWRITE: "flairOverwrite",
    FLAIR_TEMPLATE: "flairTemplate",
    FLAIR_TEXT: "flairText",
    FLAIR_CSS: "flairCss",
};

export const LABELS = {
    ACCEPTING_NEW_POSTS: "Accepting New Posts",
    SHARES_FACTOR: "Shares Factor",
    FLAIR_SETTINGS: "Flair Settings",
    FLAIR_OVERWRITE: "Overwrite Existing User Flairs",
    FLAIR_TEMPLATE: "Flair Template ID",
    FLAIR_TEXT: "Flair Text",
    FLAIR_CSS: "Flair CSS Class",
};

export const HELP_TEXTS = {
    ACCEPTING_NEW_POSTS: "Whether the app is currently accepting new posts.",
    SHARES_FACTOR: "The number of shares awarded is the cumulative score of all the user's tracked posts multiplied by this number.",
    FLAIR_OVERWRITE: "If this is set to true, users with existing flairs that differ from the defined template will also have their flairs changed.",
    FLAIR_TEMPLATE: "The ID of the flair template to apply to users.",
    FLAIR_TEXT: "The text to display on the flair, must contain the placeholder {{shares}}.",
    FLAIR_CSS: "The CSS class to apply to the flair.",
};

export const ERRORS = {
    FLAIR_TEXT_EMPTY: "Flair text must not be empty.",
    FLAIR_TEXT_NO_PLACEHOLDER: "Flair text must contain the placeholder {{shares}}.",
};

export const DEFAULTS = {
    ACCEPTING_NEW_POSTS: false,
    SHARES_FACTOR: 0.1,
    FLAIR_OVERWRITE: false,
    FLAIR_TEMPLATE: "",
    FLAIR_TEXT: ":stonks: {{shares}} share{{s}}",
    FLAIR_CSS: "april24",
};
