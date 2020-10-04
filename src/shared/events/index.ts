import {ReplicatedStorage} from "@rbxts/services";
const communicationFolder = ReplicatedStorage.WaitForChild("COMMUNICATION");

export default {
    functions: {
        GetInfo: communicationFolder.WaitForChild("GetInfoFunction") as RemoteFunction,
    },
    events: {
        PlayerMovement: communicationFolder.WaitForChild("PlayerMovementEvent") as RemoteEvent,
        GameUpdate: communicationFolder.WaitForChild("GameUpdateEvent") as RemoteEvent,
        PlayerInteraction: communicationFolder.WaitForChild("PlayerInteractionEvent") as RemoteEvent
    }
}
