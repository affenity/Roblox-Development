import events from "shared/events";
import inspect from "@rbxts/inspect";

const neckC0 = new CFrame(0, 0.8, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1);
const waistC0 = new CFrame(0, 0.2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1);

// @ts-ignore
events.events.PlayerMovement.OnServerEvent.Connect((player, theta: number) => {
    const character = player.Character as unknown as {
        Head: BasePart & {
          Neck: Motor6D;
        };
        UpperTorso: BasePart & {
          Waist: Motor6D;
        };
    };
    if (!character) return;

    const neck = character.Head.Neck;
    const waist = character.UpperTorso.Waist;

    // @ts-ignore
    neck.C0 = neckC0 * CFrame.fromEulerAnglesYXZ(theta * 0.5, 0, 0);
    // @ts-ignore
    waist.C0 = waistC0 * CFrame.fromEulerAnglesYXZ(theta * 0.5, 0, 0);
});
