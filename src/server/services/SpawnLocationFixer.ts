// Automatically fixes SpawnLocation heights to be level with the baseplate

import { Workspace } from "@rbxts/services";

export class SpawnLocationFixer {
	public static fixAllSpawnLocations(): void {
		print("[SpawnLocationFixer] Fixing spawn locations...");

		// DELETE ALL existing spawn locations (they're in wrong places!)
		const spawnLocations: SpawnLocation[] = [];
		Workspace.GetDescendants().forEach((descendant) => {
			if (descendant.IsA("SpawnLocation")) {
				spawnLocations.push(descendant);
			}
		});

		print(`[SpawnLocationFixer] Found ${spawnLocations.size()} existing spawn(s) - DELETING them`);

		// Delete all existing spawns
		spawnLocations.forEach((spawn) => {
			print(`[SpawnLocationFixer] Deleting spawn at ${spawn.Position}`);
			spawn.Destroy();
		});

		// Create ONE new spawn at pizza shop
		print("[SpawnLocationFixer] Creating fresh spawn at Pizza Shop...");
		this.createDefaultSpawn(0);
	}

	private static createDefaultSpawn(baseplateTop: number): void {
		const spawn = new Instance("SpawnLocation");
		spawn.Name = "PizzaShopSpawn";
		spawn.Size = new Vector3(20, 1, 20); // BIGGER spawn zone
		// Spawn DIRECTLY at pizza shop pickup zone
		spawn.Position = new Vector3(0, 2, 0);
		spawn.Anchored = true;
		spawn.BrickColor = BrickColor.Red(); // RED for pizza shop!
		spawn.Material = Enum.Material.Neon;
		spawn.TopSurface = Enum.SurfaceType.Smooth;
		spawn.Transparency = 0.7; // More transparent
		spawn.CanCollide = false;
		spawn.Duration = 0; // Instant respawn
		spawn.Neutral = false; // Force all teams to use this
		spawn.AllowTeamChangeOnTouch = false;
		spawn.Parent = Workspace;

		print(`[SpawnLocationFixer] ✓ Created LARGE spawn at (0, 2, 0) AT PIZZA SHOP`);
	}
}
