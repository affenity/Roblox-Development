import { helloWorld } from "shared/module";
import { Players, Workspace, RunService, ReplicatedStorage, UserInputService } from "@rbxts/services";
import FPS from "shared/modules/FPS";
import createRig from "../shared/modules/FPS/createRig";
import events from "shared/events";
import inspect from "@rbxts/inspect";

export default function setupFPS (player: Player, character: Model, weapon: Model) {
    const weaponClone = weapon.Clone();

    const updateArm = (key: "Right" | "Left", viewModel: Model) => {
        // @ts-ignore
        const shoulder = viewModel.FindFirstChild(`${key}UpperArm`).FindFirstChild(`${key}Shoulder`) as JointInstance;
        const weaponPart = weapon.FindFirstChild(key) as BasePart;
        // @ts-ignore
        const weaponPosition = weaponPart.CFrame as CFrame;
        // @ts-ignore
        const newWeaponPosition = weaponPosition * CFrame.Angles(math.pi / 2, 0, 0) * new CFrame(0, 1.5, 0) as CFrame;

        // @ts-ignore
        shoulder.C1 = newWeaponPosition.Inverse() * shoulder.Part0.CFrame * shoulder.C0;
    };

    const currentCamera = Workspace.CurrentCamera;
    const mouse = Players.LocalPlayer.GetMouse();
    mouse.Icon = "rbxassetid://78536775";
    const humanoid = character.WaitForChild("Humanoid") as Humanoid;
    const viewModel = createRig(character);
    weapon.Parent = viewModel;
    viewModel.Parent = currentCamera;

    events.events.PlayerInteraction.FireServer("setup", weapon);

    const weaponSettings = require(weapon.WaitForChild("settings") as ModuleScript) as {
        fire: (...args: any) => {};
        jointPosition: CFrame;
        cooldown: number;
    };

    const connectJoint = new Instance("Motor6D");
    // @ts-ignore
    connectJoint.C0 = weaponSettings ? weaponSettings.jointPosition : new CFrame(1, -1.5, -2);
    connectJoint.Part0 = viewModel.Head;
    connectJoint.Part1 = weapon.FindFirstChild("Handle") as BasePart;
    connectJoint.Parent = viewModel.Head;

    const renderConnected = RunService.RenderStepped.Connect( () => {
        // @ts-ignore
        viewModel.Head.CFrame = currentCamera.CFrame;
        updateArm("Right", viewModel);
        updateArm("Left", viewModel);
        // @ts-ignore
        events.events.PlayerMovement.FireServer(currentCamera.CFrame.LookVector.Y);
    });


    let canShoot = true;

    const mouseClick = mouse.Button1Down.Connect(() => {
        mouse.TargetFilter = Workspace.FindFirstChild("Rays");
        if (!canShoot) return;
        canShoot = false;
        weaponSettings.fire(mouse.Hit.Position, mouse.Target);

        delay(weaponSettings.cooldown, () => {
            canShoot = true;
        });
    });

    humanoid.Died.Connect(() => {
        viewModel.Parent = undefined;
        renderConnected.Disconnect();
        player.CharacterAdded.Wait();
        // @ts-ignore
        while (!player.Character.FindFirstChildOfClass("Humanoid")) wait();
        // @ts-ignore
        return setupFPS(player, player.Character, weaponClone);
    });
};
