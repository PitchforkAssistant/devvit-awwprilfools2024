import {SettingsClient} from "@devvit/public-api";

export type AppSettings = {
    acceptingNewPosts: boolean;
    sharesFactor: number;
    flairOverwrite: boolean;
    flairTemplate?: string;
    flairText: string;
    flairCss?: string;
};

export async function getAppSettings (settings: SettingsClient) {
    // TODO: Test that this actually works as expected.
    return settings.getAll<AppSettings>();
}
