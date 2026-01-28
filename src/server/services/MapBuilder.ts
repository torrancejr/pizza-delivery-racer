// Automatically generates a simple flat city layout

import { Workspace } from "@rbxts/services";

export class MapBuilder {
	private mapFolder: Folder;

	constructor() {
		this.mapFolder = new Instance("Folder");
		this.mapFolder.Name = "CityMap";
		this.mapFolder.Parent = Workspace;

		print("[MapBuilder] Building flat city with streets...");
		this.buildCity();
		print("[MapBuilder] ✅ City complete!");
	}

	private buildCity(): void {
		// Build base ground
		this.buildGroundPlane();
		
		// Build simple flat street grid
		this.buildFlatStreets();
	}

	private buildGroundPlane(): void {
		// Create massive flat ground plane - grass base
		const ground = new Instance("Part");
		ground.Name = "GroundPlane";
		ground.Size = new Vector3(3000, 1, 3000); // HUGE
		ground.Position = new Vector3(0, 0.5, 0); // Surface at Y=1
		ground.Anchored = true;
		ground.CanCollide = true;
		ground.Color = new Color3(0.3, 0.5, 0.3); // Green grass
		ground.Material = Enum.Material.Grass;
		ground.TopSurface = Enum.SurfaceType.Smooth;
		ground.BottomSurface = Enum.SurfaceType.Smooth;
		ground.Parent = this.mapFolder;

		print("[MapBuilder] ✅ Ground plane: 3000x3000 at Y=0.5");
	}

	private buildFlatStreets(): void {
		const streetFolder = new Instance("Folder");
		streetFolder.Name = "Streets";
		streetFolder.Parent = this.mapFolder;

		const streetWidth = 40; // Wide streets
		const gridSize = 1000; // 1000 studs from center
		const spacing = 200; // Street every 200 studs

		let streetCount = 0;

		// North-South streets (vertical lines)
		for (let x = -gridSize; x <= gridSize; x += spacing) {
			const street = new Instance("Part");
			street.Name = `Street_NS_${x}`;
			street.Size = new Vector3(streetWidth, 0.1, gridSize * 2);
			street.Position = new Vector3(x, 1.05, 0); // Just above ground
			street.Anchored = true;
			street.CanCollide = false; // Don't block driving!
			street.Color = new Color3(0.2, 0.2, 0.2); // Dark gray
			street.Material = Enum.Material.Asphalt;
			street.TopSurface = Enum.SurfaceType.Smooth;
			street.Parent = streetFolder;
			streetCount++;
		}

		// East-West streets (horizontal lines)
		for (let z = -gridSize; z <= gridSize; z += spacing) {
			const street = new Instance("Part");
			street.Name = `Street_EW_${z}`;
			street.Size = new Vector3(gridSize * 2, 0.1, streetWidth);
			street.Position = new Vector3(0, 1.05, z); // Just above ground
			street.Anchored = true;
			street.CanCollide = false; // Don't block driving!
			street.Color = new Color3(0.2, 0.2, 0.2); // Dark gray
			street.Material = Enum.Material.Asphalt;
			street.TopSurface = Enum.SurfaceType.Smooth;
			street.Parent = streetFolder;
			streetCount++;
		}

		print(`[MapBuilder] ✅ Created ${streetCount} flat streets`);
	}
}
