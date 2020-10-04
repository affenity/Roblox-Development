import {Players, ReplicatedStorage, RunService} from "@rbxts/services";
import setupFPS from "./setupFPS";

const onNewLoad = () => {
    // Waiting for the player and the character to load in
    while (!Players.LocalPlayer || !Players.LocalPlayer.Character) {
        print(Players.LocalPlayer);
        RunService.RenderStepped.Wait();
    }

    const player = Players.LocalPlayer;
    const character = player.Character as Model;
    // const playerLoadOut = events.functions.GetInfo.InvokeServer("loadout");
    const playerWeapon = ReplicatedStorage.FindFirstChild("Deagle", true) as Model;

    if (playerWeapon) {
        print("Found weapon!");
        setupFPS(player, character, playerWeapon);
    }
};

onNewLoad();
