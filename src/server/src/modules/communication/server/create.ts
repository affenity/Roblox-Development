import {ServerScriptService} from "@rbxts/services";


export default function () {
    const GameStatusEvent = new Instance("BindableEvent");
    const PlayerUpdatedEvent = new Instance("BindableEvent");

    GameStatusEvent.Name = "GameStatusEvent";
    GameStatusEvent.Parent = ServerScriptService.FindFirstChild("Communication");
    PlayerUpdatedEvent.Name = "PlayerUpdatedEvent";
    PlayerUpdatedEvent.Parent = ServerScriptService.FindFirstChild("Communication");

    return {
        GameStatusEvent,
        PlayerUpdatedEvent
    }
}
