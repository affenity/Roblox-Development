--[[ 
	Coded by: CodeTheIdiot (Now Visualizememe)
	--
	Date: 02.12.2018
	--
	As requested by: [REDACTED]
	--
	
	This is a NPC handler. You initiate it by calling NPCHandler:New(<Character of the NPC>);
	The code is OO, so you need to assign it to a variable like: local npc = NPCHandler:New(<Character>);
	
	When you want to calculate a path for the NPC, you simply do npc:CalculatePath(<Vector3>, <CreateParts>) where <Vector3> is the position and <CreateParts>
	is if the code should create a part for each waypoint. This function returns: <Success>, <Waypoints (if success)>
	
	Once you want to get the NPC to start walking, just call npc:StartWalk(), the NPC handler will make sure you have calculated a path previously, otherwise it will error.
	
	You can also know when the NPC is finished (either reached destination or gave up), where the callback parameter is a boolean indicating if the :StartWalk() was a 
	success. Call this with npc:OnFinished(function(<status>)
	
	You can also at any time (after calling :CalculatePath()), call the function :CreateParts()  - which creates the parts for the waypoints or :DeleteParts()  - which deletes the
	parts for the waypoints (if any are made)
	
	Note that this NPC Handler does not check whether or not the Character exists (other than when calling :New()). If you know when the character has died, been deleted
	or anything, please manually call :Finished(false), so that the code does not continue, but deletes all references, variables to free up memory.
	
	Check the script called "Main" in ServerScript for a quick demo, which also shows the memory used. (messy)
		
--]]





-- // Pathfinding Service

local PathfindingService = game:GetService("PathfindingService");


-- // Config for the PathfindingService

local PathParameters = {
	-- How close to each corner
	AgentRadius = 2,
	-- Max height
	AgentHeight = 5
};




-- // Logic

local funcs = {};


-- // The methods

local function CallValidator (self)
	-- // Making sure the user called the function with a colon
	if not self then return error(("Please only call this function using a colon (:) and not a dot (.) Tracebak: \n" .. debug.traceback())) end;
	return self;
end







-- // Initiates a new class \\ 
------------------------------------


function funcs:New (Character)
	
	-- // Validating
	
	CallValidator(self);
	
	-- Checking that the user provided a NPC character and that it exists
	if ( not Character or not game:IsAncestorOf(Character) or not Character:FindFirstChildOfClass("Humanoid") ) then return error("Please provide the NPC character that is a descendant of the game") end;
	
	-- // Creating a setup for this class
	
	local NpcSetup = {
			-- The NPC itself
			Character = Character,
			-- The NPC's humanoid
			Humanoid = Character:FindFirstChildOfClass("Humanoid"),
			
			-- The current waypoints for the path
			Waypoints = {},
			-- The current parts created for the waypoints
			Parts = {},
			-- The current index of the waypoints
			CurrentWaypoint = nil,
			-- A connected function when the path gets blocked
			OnBlockedPath = nil,
			-- A connected function when the NPC has finished walking to a waypoint
			OnMoveFinished = nil,
			-- When the NPC last tried to move to a waypoint
			LastMove = nil,
			-- The current path (retrieved by PathfindingService:CreatePath())
			CurrentPath = PathfindingService:CreatePath(PathParameters),
			-- The target the NPC should move to
			TargetPosition = nil,
			-- Whether or not the NPC should stop
			Stop = false,
			-- All callbacks when the NPC is done
			Callbacks = {}
	}
		
		self.__index = self;
		setmetatable(NpcSetup, self)
		
		
		return NpcSetup;	
end


-----------------------------------
-- \\ Initiates a new class //



-- // Calculates a path \\
--------------------------------


function funcs:CalculatePath (TargetPosition, CreateParts)
	-- // Validating
	CallValidator(self);
	
	self.TargetPosition = TargetPosition or self.TargetPosition;
	
	-- Making sure the user has provided a target position
	if self.TargetPosition == nil then return error("No target position has been provided") end;
	
	
	-- Calculating the path
	self.CurrentPath:ComputeAsync(self.Character:GetPrimaryPartCFrame().p, self.TargetPosition);
	
	-- Checking if the path was created successfully
	if self.CurrentPath.Status == Enum.PathStatus.Success then
		-- // The path was created successfully
		
		-- Get the waypoints 
		self.Waypoints = self.CurrentPath:GetWaypoints();
		-- Set the current waypoint (index
		self.CurrentWaypoint = 1;
		
		-- If the user wants to create parts for each waypoint
		if CreateParts then self:CreateParts(); end;
		
		-- The first is a boolean to indicate that it was successful (or not), and the second is the waypoints
		return true, self.Waypoins;
	else
		-- // The path was not created successfully
		
		-- Settings Stop to true to make sure nothing proceeds.
		self.Stop = true;
		self:Finished(false)
		-- Indicating that it was not successful
		return false;
	end
	
end


--------------------------------
-- \\ Calculates a path //


-- // Gets the NPC to start walking and following the waypoints \\
-------------------------------------------------------------------------------------


function funcs:StartWalk ()
	
	-- // Validating
	
	CallValidator(self);
	
	-- Makes sure there are waypoints before starting to walk
	if #self.Waypoints <= 0 then return error("Cannot get the NPC to walk with no waypoints. Please calculate a path for the NPC using the CalculatePath function!") end;
		
	--if self.OnBlockedPath then self.OnBlockedPath:disconnect() end;
	--if self.OnMoveFinished then self.OnMoveFinished:disconnect() end;
	
	self.OnBlockedPath = self.CurrentPath.Blocked:Connect(function(blockedWaypoint)
		-- // The path was blocked
		
		-- Attempting to calculate a new path
		local pathSuccess = self:CalculatePath(nil, (#self.Parts>0));
		-- If it could not create a new path, then stop
		if not pathSuccess then return warn("Failed to calculate a new path for the NPC") end;
		
		if blockedWaypoint > self.CurrentWaypoint then
			-- Just recalculating the path
			
			-- (Nothing here, but still keeping it in case we want to do something else)
				
		else
			-- Start to walk again because the path was blocked immediately
			self:StartWalk();
		end
		
	end)
	
	
	self.OnMoveFinished = self.Humanoid.MoveToFinished:Connect(function(destinationReached)
		
		
		if destinationReached then
			-- // The desired destination was reached
			
			-- In case the previous MoveTo failed
			self.HasAttempted = nil;
			
			-- If the Stop variable is set to true, or the current waypoint (index) reached the last (or the amount of waypoints), then stop
			if self.CurrentWaypoint >= #self.Waypoints then return self:Finished(true) end;
			if self.Stop then return self:Finished(false) end;
			
			-- Incrementing the current waypoint (index)
			self.CurrentWaypoint = self.CurrentWaypoint + 1;
			
			-- Moving the humanoid to the next waypoint
			self.Humanoid:MoveTo(self.Waypoints[self.CurrentWaypoint].Position);
		else
			
			-- If the last MoveTo did not go wrong
			if not self.HasAttempted then
				-- print'Failed to reach destination, attempting once more before giving up'
				
				-- Setting HasAttempted to true so we know it failed this time, and will stop trying if the next MoveTo fails
				self.HasAttempted = true;
				-- Calculates a new path
				local pathCreated = self:CalculatePath(nil, (#self.Parts>0));
				if pathCreated then
					-- // A new path was created successfully
					
					-- Starting to walk with the new waypoints
					self:StartWalk()
				else
					-- // Failed to create a new path
					self:Finished(false)
					return;
				end
				
			else
				-- // If it failed the last MoveTo as well, then stop it from continuing
					
				-- print'Gave up'
				self.Stop = true;
				self:Finished(false)
			end
			
		end
		
	end)
	
		-- Incrementing the current waypoint
		self.CurrentWaypoint = (self.CurrentWaypoint or 0) + 1;
		-- Starts moving the humanoid
		self.Humanoid:MoveTo(self.Waypoints[self.CurrentWaypoint].Position);
	
end


-------------------------------------------------------------------------------------
-- \\ Gets the NPC to start walking and following the waypoints //



-- // Creates parts for the waypoints \\
----------------------------------------------


function funcs:CreateParts ()
	
	-- Validating
	CallValidator(self)
	
	-- // If there are any previous parts, delete them from existence and table
	
	
	
	-- // Create a part for each waypoint
	for _, waypoint in pairs(self.Waypoints) do
		
		-- Creating a part for the waypoint
		
		local part = Instance.new("Part")
			part.Shape = "Ball"
			part.Material = "Neon"
			part.Size = Vector3.new(0.6, 0.6, 0.6)
			part.Position = waypoint.Position
			part.Anchored = true
			part.CanCollide = false
			part.Parent = workspace;
		
		-- Inserting the part to the Parts table, so we can delete them later if needed
		table.insert(self.Parts, part);
				
	end
	
end


----------------------------------------------
-- \\ Creates parts for the waypoints //




-- // Deletes all parts from the Parts table \\
----------------------------------------------------

function funcs:DeleteParts ()
	-- Validating
	CallValidator(self);
	
	-- // Checking if there are parts, and then deleting them
		
	if self.Parts and #self.Parts > 0 then
		for num, part in pairs(self.Parts) do
			part:Destroy();
			self.Parts[num] = nil;
		end
	end
	
	end
	

----------------------------------------------------
-- \\ Deletes all parts from the Parts table //



-- // Calling this when the NPC is finished doing its task (or failed) \\
--------------------------------------------------------------------------------


function funcs:Finished (success)
	-- Validating
	CallValidator(self);
	
	-- // Disconnecting the connected functions
	
	if self.OnBlockedPath then self.OnBlockedPath:disconnect() end;
	if self.OnMoveFinished then self.OnMoveFinished:disconnect() end;
	
	-- // Calling all callbacks
	
	for _, cb in pairs(self.Callbacks) do
		cb(success)
	end
	
	-- Deleting reference
	self = nil;
	
	return true;
end


--------------------------------------------------------------------------------
-- \\ Calling this when the NPC is finished doing its task (or failed) //


-- // Adding a callback to the Callbacks table \\
-------------------------------------------------------


function funcs:OnFinished (callback)
	-- Validating
	CallValidator(self)
	
	-- Inserting to Callbacks table
	table.insert(self.Callbacks, callback)
end


-------------------------------------------------------
-- \\ Adding a callback to the Callbacks table //




return funcs;
