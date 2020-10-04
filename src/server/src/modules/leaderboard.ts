export function createForPlayer (player: Player, values: {[key: string]: unknown}) {
    print("Creating leaderboard for player:", player.Name);

    const leaderboard = player.FindFirstChild("leaderstats") as Folder || new Instance("Folder");
    leaderboard.Name = "leaderstats";
    leaderboard.ClearAllChildren();

    const valuesKeys = Object.keys(values);
    for (let index = 0; index < valuesKeys.size(); index++) {
        const value = values[valuesKeys[index]];
        if (typeOf(value) === "number") {
            const leaderstat = new Instance("IntValue");
            leaderstat.Name = `${valuesKeys[index]}`;
            // @ts-ignore
            leaderstat.Value = value;
            leaderstat.Parent = leaderboard;
        }
    }

    leaderboard.Parent = player;
}
