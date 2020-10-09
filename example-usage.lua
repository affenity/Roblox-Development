local NPCHandler = require(script.Parent.NPCHandler);
local npcs = {};

-- Target positions (array of possible locations)
local pos = {workspace.Pos1.Position, workspace.Pos2.Position};

-- Getting & inserting all NPCs in the NPCs folder to a table
for _, npc in pairs(workspace.NPCs:GetChildren()) do
	table.insert(npcs, npc)
end

-- Gets all the NPCs in the "NPCs" folder in Workspace to move to the targetPosition (Vector3)

function goToPoint (targetPosition, createParts) 		
	for _, npc in pairs(npcs) do
		local handler = NPCHandler:New(npc);
		local pathCreated = handler:CalculatePath(pos[math.random(1,#pos)], createParts)
		if pathCreated then handler:StartWalk() end
		
		handler:OnFinished(function (status)
			print("A NPC is finished with status of:", status);
		end)
	end
	
end

goToPoint(workspace.Pos1.Position, true)
