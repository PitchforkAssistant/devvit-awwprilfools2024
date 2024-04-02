import {CustomPostType, Devvit} from "@devvit/public-api";
import {LeaderboardState} from "./state.js";
import {LeaderboardRow} from "./components/leaderboardRow.js";

export const SharesLeaderboardPost: CustomPostType = {
    name: "SharesLeaderboardPost",
    description: "Post that displays the users with the most shares.",
    height: "tall",
    render: context => {
        const state = new LeaderboardState(context);
        return (
            <blocks height="tall">
                <vstack minHeight={"100%"} minWidth={"100%"} width="100%" alignment="top center" gap="small" grow>
                    <hstack alignment="center middle" minWidth="100%" border="thick" padding="small" gap="large">
                        <image imageHeight={48} imageWidth={48} url="stonks.png" />
                        <vstack alignment="center middle" grow>
                            <text style="heading">$AWW Shareholders</text>
                        </vstack>
                        <button icon="help" onPress={() => {
                            state.context.ui.navigateTo("https://www.reddit.com/r/aww/comments/1bsx0m7/following_in_reddits_tracks_raww_is_going_public/");
                        }}></button>
                    </hstack>
                    <vstack alignment="middle center" padding="medium" gap="medium" grow>
                        <vstack alignment="top start" gap="small" grow>
                            {state.leaderboard.slice((state.page - 1) * state.leaderboardPageSize, state.page * state.leaderboardPageSize).map(entry => (
                                <LeaderboardRow id={entry.id} username={entry.username} shares={entry.shares} rank={entry.rank} navigateToProfile={() => {
                                    state.context.ui.navigateTo(`https://reddit.com/u/${entry.username}`);
                                }} />
                            ))}
                        </vstack>
                        <vstack alignment="bottom start" grow>
                            <hstack alignment="middle center" gap="small">
                                <button disabled={state.page === 1} onPress={() => {
                                    state.page -= 1;
                                }}> &lt; </button>
                                <spacer />
                                <text onPress={() => {
                                    state.page = 1;
                                }}>{state.page}</text>
                                <spacer />
                                <button disabled={state.page === state.maxPage} onPress={() => {
                                    state.page += 1;
                                }}> &gt; </button>
                            </hstack>
                        </vstack>
                    </vstack>
                </vstack>
            </blocks>
        );
    },
};
