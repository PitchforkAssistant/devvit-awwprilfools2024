import {Devvit} from "@devvit/public-api";

export type LeaderboardRowProps = {
    username: string;
    shares: number;
    rank: number;
    id: string;
    navigateToProfile: () => void | Promise<void>;
};

export const LeaderboardRow = (props: LeaderboardRowProps) => {
    function rankColor (rank: number): string {
        switch (rank) {
        case 1:
            return "#c9b037";
        case 2:
            return "#b4b4b4";
        case 3:
            return "#ad8a56";
        default:
            return "";
        }
    }

    return (
        <hstack alignment="middle center" cornerRadius="small" gap="small" width="100%" minWidth="100%" grow>
            <zstack alignment="middle center" height={"32px"} minWidth={"32px"} cornerRadius="full" border="thick" borderColor={rankColor(props.rank)}>
                <text alignment="middle center">{props.rank}</text>
            </zstack>
            <spacer grow/>
            <avatar size="small" facing="right" id={props.id} thingId={props.id} />
            <button onPress={props.navigateToProfile}>{props.username}</button>
            <spacer grow/>
            <zstack alignment="middle center" cornerRadius="full">
                <text>{props.shares} {props.shares > 1 ? "shares" : "share"}</text>
            </zstack>
        </hstack>
    );
};
