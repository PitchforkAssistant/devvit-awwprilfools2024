import {Context, UseIntervalResult, UseStateResult} from "@devvit/public-api";
import {getSharesLeaderboard} from "../helpers/redisHelpers.js";
import {AppSettings, getAppSettings} from "../helpers/settingsHelpers.js";

export type LeaderboardEntry = {
    id: string;
    username: string;
    shares: number;
    rank: number;
};

export class LeaderboardState {
    readonly appConfig: UseStateResult<AppSettings>;

    readonly leaderboardEntries: UseStateResult<LeaderboardEntry[]>;
    readonly leaderboardPage: UseStateResult<number>;
    readonly leaderboardPageSize: number = 7;

    readonly refresher: UseIntervalResult;

    constructor (public context: Context) {
        this.appConfig = context.useState<AppSettings>(async () => getAppSettings(this.context.settings));
        this.leaderboardEntries = context.useState<LeaderboardEntry[]>(async () => this.fetchLeaderboard());
        this.leaderboardPage = context.useState(1);
        this.refresher = context.useInterval(async () => this.updateLeaderboard(), 60000);
        this.refresher.start();
    }

    get leaderboard (): LeaderboardEntry[] {
        return this.leaderboardEntries[0];
    }

    set leaderboard (value: LeaderboardEntry[]) {
        this.leaderboardEntries[1](value);
    }

    get config (): AppSettings {
        return this.appConfig[0];
    }

    set config (value: AppSettings) {
        this.appConfig[1](value);
    }

    get page (): number {
        return this.leaderboardPage[0];
    }

    set page (value: number) {
        if (value < 1 || value > this.maxPage) {
            return;
        }

        this.leaderboardPage[1](value);
    }

    get maxPage (): number {
        return Math.ceil(this.leaderboard.length / this.leaderboardPageSize);
    }

    async fetchLeaderboard () {
        const leaderboardData = await getSharesLeaderboard(this.context.redis, this.config.leaderboardMinScore);
        const leaderboard: LeaderboardEntry[] = [];
        for (const [i, {id, username, shares}] of leaderboardData.entries()) {
            leaderboard.push({id, username, shares, rank: i + 1});
        }
        return leaderboard;
    }

    async updateLeaderboard () {
        this.leaderboard = await this.fetchLeaderboard();
        this.refresher.start();
    }
}
