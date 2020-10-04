import { ReplicatedStorage } from "@rbxts/services";
import frameRemoteFunction from "../frameRemoteFunction";
import frameRemoteEvent from "../frameRemoteEvent";

const communicationFolder = ReplicatedStorage.WaitForChild("COMMUNICATION");
const GetInfoFunction = frameRemoteFunction(communicationFolder.WaitForChild("GetInfo") as RemoteFunction);
const GameUpdateEvent = frameRemoteEvent(communicationFolder.WaitForChild("GameUpdate") as RemoteEvent);
const PlayerInteractionEvent = frameRemoteEvent(communicationFolder.WaitForChild("PlayerInteraction") as RemoteEvent);

export default {
    GetInfoFunction,
    GameUpdateEvent,
    PlayerInteractionEvent
};
