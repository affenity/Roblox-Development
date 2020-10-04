import { ReplicatedStorage, Workspace, ServerScriptService, Players } from "@rbxts/services";
import gameStates from "shared/tmp/gameStates";
import Config from "shared/config";


export function checkCanStart () {
    const currentPlayers = Players.GetPlayers();

    return (currentPlayers.size() >= Config.game.minimumPlayers) && (!gameStates.gameState.gameRunning);
}

export function startRound () {
    const currentPlayers = Players.GetPlayers();
    const canStart = checkCanStart();

    if (!canStart) {
        return false;
    }

    gameStates.gameState.gameRunning = true;

    print("Game starting...");
}
