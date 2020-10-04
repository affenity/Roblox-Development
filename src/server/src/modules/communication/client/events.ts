import { ServerScriptService, ReplicatedStorage } from "@rbxts/services";
const communicationFolder = ReplicatedStorage.WaitForChild("Communication");

const gameUpdateEvent = new Instance("RemoteEvent");
gameUpdateEvent.Name = "GameUpdate";
gameUpdateEvent.Parent = communicationFolder;


export default {
    gameUpdateEvent
}
