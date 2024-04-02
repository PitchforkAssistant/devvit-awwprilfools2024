import {SettingsClient} from "@devvit/public-api";

export type AppSettings = {
    acceptingNewPosts: boolean;
    sharesFactor: number;
    flairOverwrite: boolean;
    flairTemplate?: string;
    flairText: string;
    flairCss?: string;
    leaderboardHelpUrl: string;
    leaderboardMinScore: number;
};

export async function getAppSettings (settings: SettingsClient) {
    return settings.getAll<AppSettings>();
}
