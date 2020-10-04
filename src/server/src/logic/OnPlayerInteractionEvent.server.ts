import { ReplicatedStorage } from "@rbxts/services";
import events from "shared/events";
import inspect from "@rbxts/inspect";
import gameStates from "../../../shared/tmp/gameStates";

// @ts-ignore
events.events.PlayerInteraction.OnServerEvent.Connect((player: Player & {
    Character: Model;
}, command: string, other: unknown, other2?: number) => {
    if (command === "setup") {
        const weapon = other as Model;
        if (!weapon) return print("NOT FOUND WEAPON");
        const cloned = weapon.Clone() as Model;
        const joint = new Instance("Motor6D");
        joint.Part0 = player.Character.FindFirstChild("RightHand") as BasePart;
        joint.Part1 = cloned.FindFirstChild("Handle") as BasePart;
        joint.Parent = cloned.FindFirstChild("Handle") as BasePart;
        cloned.Parent = player.Character;

        const weaponSettings = weapon.FindFirstChild("settings") as ModuleScript;
        const weaponHoldAnimation = weaponSettings.FindFirstChild("HoldAnim") as Animation;
        const humanoid = player.Character.FindFirstChildOfClass("Humanoid") as Humanoid;
        const loaded = humanoid.LoadAnimation(weaponHoldAnimation);

        print(inspect(humanoid));
        print(loaded);


        loaded.Looped = true;
        loaded.Play();
    } else if (command === "tutorialFinished") {
        print("PLAYER FINISHED TUTORIAL");
    } else if (command === "damage") {
        const player = other as Player;
        if (other2) {
            // @ts-ignore
            const hum = player.Character.FindFirstChild("Humanoid") as Humanoid;
            if (hum) {
                hum.TakeDamage(other2);
            }
        }
    }
});
