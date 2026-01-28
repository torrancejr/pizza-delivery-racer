// Server-side vehicle spawner - creates pizza delivery vehicles

import { Workspace } from "@rbxts/services";

export class VehicleSpawner {
	public static createVehicle(spawnPosition: Vector3): Model {
		const vehicle = new Instance("Model");
		vehicle.Name = "PizzaDeliveryCar";

		// Main body
		const body = new Instance("Part");
		body.Name = "Body";
		body.Size = new Vector3(8, 4, 12);
		body.Position = spawnPosition;
		body.Color = new Color3(1, 0.2, 0.2); // Red
		body.Material = Enum.Material.SmoothPlastic;
		body.TopSurface = Enum.SurfaceType.Smooth;
		body.BottomSurface = Enum.SurfaceType.Smooth;
		body.Parent = vehicle;
		vehicle.PrimaryPart = body;

		// Use ROBLOX VehicleSeat for built-in driving!
		const seat = new Instance("VehicleSeat");
		seat.Name = "DriverSeat";
		seat.Size = new Vector3(2, 1, 2);
		seat.Position = spawnPosition.add(new Vector3(0, 1, 0));
		seat.Transparency = 0.5;
		seat.CanCollide = false;
		
		// Configure VehicleSeat properties
		seat.HeadsUpDisplay = false; // Hide default HUD
		seat.MaxSpeed = 120;
		seat.Torque = 200; // High acceleration
		seat.TurnSpeed = 15; // Fast turning
		seat.Parent = vehicle;

		// Weld seat to body
		const seatWeld = new Instance("WeldConstraint");
		seatWeld.Part0 = body;
		seatWeld.Part1 = seat;
		seatWeld.Parent = seat;
		
		// Pizza sign
		const sign = new Instance("Part");
		sign.Name = "PizzaSign";
		sign.Size = new Vector3(3, 1, 3);
		sign.Position = spawnPosition.add(new Vector3(0, 3, 0));
		sign.Color = new Color3(1, 0.8, 0);
		sign.Material = Enum.Material.Neon;
		sign.Shape = Enum.PartType.Cylinder;
		sign.Orientation = new Vector3(0, 0, 90);
		sign.CanCollide = false;
		sign.Massless = true;
		sign.Parent = vehicle;
		
		const signWeld = new Instance("WeldConstraint");
		signWeld.Part0 = body;
		signWeld.Part1 = sign;
		signWeld.Parent = sign;

		vehicle.Parent = Workspace;
		print("[VehicleSpawner] Created vehicle with Roblox VehicleSeat!");
		return vehicle;
	}

	public static spawnPlayerVehicle(player: Player): Model {
		// ALWAYS spawn at pizza shop at ground level
		// Road surface is at Y=0.5, vehicle body height is 3 studs
		// Bottom of body should be at Y=0.5, so center at Y=2
		// IGNORE PLAYER POSITION - always spawn at (8, 2, 0) regardless!
		const spawnPos = new Vector3(8, 2, 0); // 8 studs from spawn, FIXED Y=2

		const vehicle = this.createVehicle(spawnPos);
		vehicle.Name = "PlayerVehicle"; // Important: matches what GameManager looks for
		
		const character = player.Character;

		// Seat the player in the vehicle
		if (character) {
			const seat = vehicle.FindFirstChild("DriverSeat") as VehicleSeat;
			if (seat) {
				task.wait(0.3); // Small delay to ensure vehicle is loaded
				const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
				if (humanoid) {
					seat.Sit(humanoid);
				}
			}
		}

		print(`[VehicleSpawner] Created vehicle for ${player.Name} at ${spawnPos}`);

		return vehicle;
	}
}
