import {
    Workspace,
    PhysicsService,
    RunService,
    UserInputService,
    ReplicatedStorage
} from "@rbxts/services";
import Spring from "./spring";
import createRig from "../src/shared/modules/FPS/createRig";
import setCollisionGroupRecursive from "../src/shared/modules/util/setCollisionGroupRecursive";

while (!Workspace.CurrentCamera) wait();

const currentCamera = Workspace.CurrentCamera;

class FPSManager {
    public viewModel: Model & { Head: BasePart; UpperTorso: BasePart };
    public humanoid: Humanoid & {
        Parent: Model;
    };
    public humanoidRootPart: BasePart;
    public isAiming: boolean;
    public isEquipped: boolean;
    public isAlive: boolean;
    public isR15: true;
    public baseFOV: number;
    public baseWalkSpeed: number;
    public aimLerp: any;
    public armTilt: any;
    public FOV: any;
    public sway: any;
    public bobbing: any;
    public recoil: any;
    public joint: Motor6D;
    public weapon: any;

    constructor (character: Model) {
        this.viewModel = createRig(character);
        // @ts-ignore
        this.humanoid = character.WaitForChild("Humanoid") as Humanoid;
        this.humanoidRootPart = character.WaitForChild("HumanoidRootPart") as BasePart;

        this.isAiming = false;
        this.isEquipped = false;
        this.isAlive = this.humanoid.Health > 0;
        this.isR15 = true;
        this.baseFOV = currentCamera.FieldOfView;
        this.baseWalkSpeed = this.humanoid.WalkSpeed;

        this.aimLerp = new Spring(0,0,0,20,1);
        this.armTilt = new Spring(0,0,0,10,1);
        this.FOV = new Spring(this.baseFOV, 0, this.baseFOV, 20, 1);
        this.sway = new Spring(new Vector3(), new Vector3(), new Vector3(), 15, 1);
        this.recoil = new Spring(new Vector3(), new Vector3(), new Vector3(), 20, 1);
        this.bobbing = new Spring(new Vector3(), new Vector3(), new Vector3(), 10, 1);
        this.joint = new Instance("Motor6D");
        this.joint.Parent = this.viewModel.Head;
        this.joint.Parent = this.viewModel.Head;

        this.init();
        return this;
    }

    init () {
        const lookAroundAnimation = this.humanoid.Parent.WaitForChild("Animate").WaitForChild("idle").FindFirstChild("Animation2");
        if (lookAroundAnimation) lookAroundAnimation.Destroy();

        setCollisionGroupRecursive(this.viewModel.GetChildren(), "viewModel");
    }

    updateArm (key: string) {
        // @ts-ignore
        if (this[key]) {
            const upperArm = this.viewModel.FindFirstChild(`${key}UpperArm`) as BasePart;
            const shoulder = upperArm.FindFirstChild(`${key}Shoulder`) as BasePart;

            // @ts-ignore
            const cf: CFrame = this.weapon[key].CFrame * new CFrame.Angles(math.pi / 2, 0, 0) * new CFrame(0, 1.5,0);
            // @ts-ignore
            shoulder.C1 = cf.Inverse() * shoulder.Part0.CFrame * shoulder.C0;
        }
    }

    updateSway (x: number, y: number) {
        if (this.settings.CAN_SWAY) {
            this.sway.target = new Vector3(math.rad(x), math.rad(y), 0);
        }
    }

    updateClient (dt: any) {
        if (this.isEquipped && this.isAlive) {
            const moveDirection = this.humanoid.MoveDirection;
            const isMoving = moveDirection.Dot(moveDirection) > 0;
            const modifier = (this.isAiming && this.settings.ADS_BOB_MODIFIER || 1) * 0.05;
            const strafe = -this.humanoidRootPart.CFrame.RightVector.Dot(moveDirection);
            const recoilMod = (this.isAiming && 1/3) || 1;
            const speed = this.humanoid.WalkSpeed / 16;
            this.bobbing.target = isMoving ? new Vector3(math.sin(tick() * 7 * speed) * modifier, math.sin(tick() * 10 * speed) * modifier, 0) :
                new Vector3();
            this.armTilt.target = math.rad(((this.isAiming && this.settings.TILT_AIMED) || this.settings.TILT_HOLD) * strafe);

            this.FOV.update(dt);
            this.sway.update(dt);
            this.recoil.update(dt);
            this.aimLerp.update(dt);
            this.armTilt.update(dt);
            this.bobbing.update(dt);

            this.joint.C0 = this.settings.CAMERA_OFFSET * new CFrame(this.bobbing.p) * new CFrame(0,0, recoilMod * this.recoil.p.x) * new CFrame.fromEulerAnglesYXZ(0,0,this.armTilt.p);
            this.joint.C1 = new CFrame().Lerp(this.aimCFrame, this.aimLerp.p);

            currentCamera.FieldOfView = this.FOV.p;
            // @ts-ignore
            currentCamera.CFrame = currentCamera.CFrame * CFrame.fromEulerAnglesYXZ(this.recoil.p.y, this.recoil.p.z, 0);
            this.viewModel.Head.CFrame = currentCamera.CFrame * CFrame.Angles(this.sway.p.y, this.sway.p.x, 0);

            this.updateArm("Right");
            this.updateArm("Left");
        }
    }

    updateServer (dt) {
        if (this.isEquipped && this.isAlive) {
            print("UPDATING SERVER");
        }
    }

    aimDownSights (isAiming: boolean) {
        this.isAiming = isAiming;

        if (this.isEquipped && this.isAlive) {

        }
    }
}


export default FPSManager;
