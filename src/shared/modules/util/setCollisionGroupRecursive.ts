import {PhysicsService} from "@rbxts/services";

export default function setCollisionGroupRecursive(children: Instance[], group: string) {
    for (let i = 0; i < children.size(); i++) {
        const child = children[i];

        if (child.IsA("BasePart")) {
            PhysicsService.SetPartCollisionGroup(child, group);
        }

        setCollisionGroupRecursive(child.GetChildren(), group);
    }
}
