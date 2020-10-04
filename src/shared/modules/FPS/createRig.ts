import { Workspace } from "@rbxts/services";

const validParts = [
    "LeftHand", "LeftWrist", "LeftLowerArm", "LeftElbow", "LeftUpperArm", "LeftShoulder",
    "RightHand", "RightWrist", "RightLowerArm", "RightElbow", "RightUpperArm", "RightShoulder",
    "UpperTorso", "Head", "Neck", "Humanoid", "HumanoidDescription"
];
const validMisc = [
  "Shirt",
  "Body Colors"
];

const createRig = (realCharacter: Model) => {
    const currentCamera = Workspace.CurrentCamera;
    const last = realCharacter.Archivable;
    realCharacter.Archivable = true;

    print("before wait");
    for (let index = 0; index < validParts.size(); index++) {
        while (!realCharacter.FindFirstChild(validParts[index], true)) {
            const find = realCharacter.FindFirstChild(validParts[index], true);
            print(find);
            print("not yet:", validParts[index]);
            wait();
        }
    }
    print("after waited hum");

    const clonedCharacter = realCharacter.Clone() as Model & {
        Head: BasePart;
        UpperTorso: BasePart;
    };
    print("cloned character");
    const clonedCharacterHumanoid = clonedCharacter.WaitForChild("Humanoid") as Humanoid;


    print("Everything's there!");

    const clonedCharacterDescendants = clonedCharacter.GetDescendants();
    for (let index = 0; index < clonedCharacterDescendants.size(); index++) {
        const descendant = clonedCharacterDescendants[index] as BasePart;

        if (!validMisc.some(validMiscName => descendant.Name === validMiscName) && !validParts.some(validPartName => validPartName === descendant.Name) && !descendant.IsA("CharacterMesh")) {
            descendant.Destroy();
        }

        if (descendant.IsA("BasePart")) {
            descendant.CanCollide = false;
            descendant.Anchored = false;
            descendant.LocalTransparencyModifier = 0;
            descendant.Transparency = 0;
            print(descendant.CanCollide, descendant.Anchored);
        }
    }

    const clonedCharacterHead = clonedCharacter.FindFirstChild("Head") as BasePart;
    clonedCharacterHead.Anchored = false;
    clonedCharacter.Head.Transparency = 1;

    if (clonedCharacterHumanoid.RigType === Enum.HumanoidRigType.R15) {
        clonedCharacter.UpperTorso.Transparency = 1;
    }

    const newHumanoid = new Instance("Humanoid");
    const humanoidDescription = clonedCharacterHumanoid.FindFirstChildOfClass("HumanoidDescription");
    if (humanoidDescription) {
        print("Found humanoid description");
        humanoidDescription.Clone().Parent = newHumanoid;
    }
    clonedCharacter.Name = "viewModel";

    clonedCharacterHumanoid.Destroy();


    newHumanoid.Parent = clonedCharacter;

    delay(1, () => {
        print("Doing shirts");
        const shirt = clonedCharacter.FindFirstChild("Shirt");
        const pants = clonedCharacter.FindFirstChild("Pants");
        if (shirt) {
            const newShirt = shirt.Clone();
            shirt.Destroy();
            newShirt.Parent = newHumanoid.Parent;
        }

        if (pants) {
            const newPants = pants.Clone();
            pants.Destroy();
            newPants.Parent = newHumanoid.Parent;
        }
    });

    realCharacter.Archivable = last;
    return clonedCharacter;
};

export default createRig;
