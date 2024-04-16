import {Devvit, SettingScope} from "@devvit/public-api";
import {userFlairUpdater} from "./handlers/scheduler.js";
import {onAppChanged, onModAction, onPostDelete, onPostSubmit} from "./handlers/triggers.js";
import {KEYS, LABELS, HELP_TEXTS, DEFAULTS, newPostForm} from "./constants.js";
import {validateDisableUpdates, validateFlairSharesPlaceholder} from "./handlers/validators.js";
import {formOnSubmit} from "./handlers/formSubmit.js";
import {SharesLeaderboardPost} from "./customPost/index.js";
import {formActionPressed} from "./handlers/menuPress.js";

// Enable any Devvit features you might need.
Devvit.configure({
    redditAPI: true,
    redis: true,
    media: true,
});

// Set up the configuration field presented to the user for each installation (subreddit) of the app.
Devvit.addSettings([
    {
        name: KEYS.ACCEPTING_NEW_POSTS,
        type: "boolean",
        label: LABELS.ACCEPTING_NEW_POSTS,
        helpText: HELP_TEXTS.ACCEPTING_NEW_POSTS,
        defaultValue: DEFAULTS.ACCEPTING_NEW_POSTS,
        scope: SettingScope.Installation,
    },
    {
        name: KEYS.SHARES_FACTOR,
        type: "number",
        label: LABELS.SHARES_FACTOR,
        helpText: HELP_TEXTS.SHARES_FACTOR,
        defaultValue: DEFAULTS.SHARES_FACTOR,
        scope: SettingScope.Installation,
    },
    {
        type: "group",
        label: LABELS.FLAIR_SETTINGS,
        fields: [
            {
                name: KEYS.FLAIR_OVERWRITE,
                type: "boolean",
                label: LABELS.FLAIR_OVERWRITE,
                helpText: HELP_TEXTS.FLAIR_OVERWRITE,
                defaultValue: DEFAULTS.FLAIR_OVERWRITE,
                scope: SettingScope.Installation,
            },
            {
                name: KEYS.FLAIR_TEMPLATE,
                type: "string",
                label: LABELS.FLAIR_TEMPLATE,
                helpText: HELP_TEXTS.FLAIR_TEMPLATE,
                defaultValue: DEFAULTS.FLAIR_TEMPLATE,
                scope: SettingScope.Installation,
            },
            {
                name: KEYS.FLAIR_TEXT,
                type: "string",
                label: LABELS.FLAIR_TEXT,
                helpText: HELP_TEXTS.FLAIR_TEXT,
                defaultValue: DEFAULTS.FLAIR_TEXT,
                onValidate: validateFlairSharesPlaceholder,
                scope: SettingScope.Installation,
            },
            {
                name: KEYS.FLAIR_CSS,
                type: "string",
                label: LABELS.FLAIR_CSS,
                helpText: HELP_TEXTS.FLAIR_CSS,
                defaultValue: DEFAULTS.FLAIR_CSS,
                scope: SettingScope.Installation,
            },
        ],
    },
    {
        name: KEYS.LEADERBOARD_MIN_SCORE,
        type: "number",
        label: LABELS.LEADERBOARD_MIN_SCORE,
        helpText: HELP_TEXTS.LEADERBOARD_MIN_SCORE,
        defaultValue: DEFAULTS.LEADERBOARD_MIN_SCORE,
        scope: SettingScope.Installation,
    },
    {
        name: KEYS.LEADERBOARD_HELP_URL,
        type: "string",
        label: LABELS.LEADERBOARD_HELP_URL,
        helpText: HELP_TEXTS.LEADERBOARD_HELP_URL,
        defaultValue: DEFAULTS.LEADERBOARD_HELP_URL,
        scope: SettingScope.Installation,
    },
    {
        name: KEYS.DISABLE_UPDATES,
        type: "boolean",
        label: LABELS.DISABLE_UPDATES,
        helpText: HELP_TEXTS.DISABLE_UPDATES,
        defaultValue: DEFAULTS.DISABLE_UPDATES,
        onValidate: validateDisableUpdates,
        scope: SettingScope.Installation,
    },
]);

Devvit.addSchedulerJob({
    name: "userFlairUpdater",
    onRun: userFlairUpdater,
});

Devvit.addTrigger({
    events: ["AppInstall", "AppUpgrade"],
    onEvent: onAppChanged,
});

Devvit.addTrigger({
    event: "PostSubmit",
    onEvent: onPostSubmit,
});

Devvit.addTrigger({
    event: "PostDelete",
    onEvent: onPostDelete,
});

Devvit.addTrigger({
    event: "ModAction",
    onEvent: onModAction,
});

Devvit.addMenuItem({
    label: "Create Leadboard Post",
    forUserType: "moderator",
    location: "subreddit",
    onPress: formActionPressed,
});

export const submitPostFormKey = Devvit.createForm(
    newPostForm,
    formOnSubmit
);

Devvit.addCustomPostType(SharesLeaderboardPost);

export default Devvit;
