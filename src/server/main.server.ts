import {Players, ReplicatedStorage, Workspace} from "@rbxts/services";
import * as Database from "./src/modules/database";
import gameStates from "../shared/tmp/gameStates";
import * as leaderboard from "./src/modules/leaderboard";
import events from "shared/events";
const map = Workspace.WaitForChild("Toxicity");
const spawns = map.WaitForChild("Spawn");

Players.PlayerAdded.Connect(player => {
    player.CharacterAdded.Connect(character => {
        print("PLAYER CHARACTER ADDED");
        const spawnNum = spawns.GetChildren().size();
        const chosenN = math.random(1, spawnNum);
        print(spawnNum);
        print(chosenN);
        const chosenSpawn = spawns.GetChildren()[chosenN] as BasePart;
        character.WaitForChild("Humanoid");
        wait();
        print("MOVING PLAYER");
        const torso = character.FindFirstChild("UpperTorso") as BasePart;
        print("MOVING PLAYER TO", chosenSpawn.CFrame);
        torso.CFrame = chosenSpawn.CFrame;
    });

    print(`Player ${player.Name} just joined!`);



    const playerData = Database.get(tostring(player.UserId));
    gameStates.playerData[tostring(player.UserId)] = playerData;
    leaderboard.createForPlayer(player, playerData);
});

Players.PlayerRemoving.Connect(player => {
    print(`Player ${player.Name} is leaving!`);

    const playerData = (gameStates.playerData[tostring(player.UserId)] as object || Database.get(tostring(player.UserId)));

    // Save their data
    Database.set(tostring(player.UserId), playerData);

    print("Saved the player's data!");
});

game.BindToClose(() => {
    // Waiting for X seconds so everything can complete
    //wait(2);
});
