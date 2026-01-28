// Automatically generates a detailed city layout

import { Workspace } from "@rbxts/services";
import { PIZZA_SHOP, DELIVERY_LOCATIONS } from "shared/module";

export class MapBuilder {
	private mapFolder: Folder;

	constructor() {
		this.mapFolder = new Instance("Folder");
		this.mapFolder.Name = "CityMap";
		this.mapFolder.Parent = Workspace;

		print("[MapBuilder] Building detailed city (3x larger)...");
		this.buildCity();
		print("[MapBuilder] ✅ City complete!");
	}

	private buildCity(): void {
		// Build base ground (reasonable size - 2000x2000)
		this.buildGroundPlane();
		
		// Add boundary walls
		this.buildBoundaryWalls();
		
		// Build street grid
		this.buildFlatStreets();
		
		// Build buildings
		this.buildBuildings();
		
		// Add street lights
		this.buildStreetLights();
		
		// Add parked cars
		this.buildParkedCars();
	}

	private buildGroundPlane(): void {
		// Create ground plane - 2000x2000 (comfortable size)
		const ground = new Instance("Part");
		ground.Name = "GroundPlane";
		ground.Size = new Vector3(2000, 1, 2000);
		ground.Position = new Vector3(0, 0.5, 0); // Surface at Y=1
		ground.Anchored = true;
		ground.CanCollide = true;
		ground.Color = new Color3(0.3, 0.5, 0.3); // Green grass
		ground.Material = Enum.Material.Grass;
		ground.TopSurface = Enum.SurfaceType.Smooth;
		ground.BottomSurface = Enum.SurfaceType.Smooth;
		ground.Parent = this.mapFolder;

		print("[MapBuilder] ✅ Ground plane: 2000x2000");
	}

	private buildBoundaryWalls(): void {
		const boundaryFolder = new Instance("Folder");
		boundaryFolder.Name = "BoundaryWalls";
		boundaryFolder.Parent = this.mapFolder;

		const wallHeight = 50;
		const wallThickness = 10;
		const mapEdge = 1000; // Half of map size

		// North wall
		const northWall = new Instance("Part");
		northWall.Name = "NorthWall";
		northWall.Size = new Vector3(2000 + wallThickness * 2, wallHeight, wallThickness);
		northWall.Position = new Vector3(0, wallHeight / 2, mapEdge);
		northWall.Anchored = true;
		northWall.CanCollide = true;
		northWall.Transparency = 0.5;
		northWall.Color = new Color3(1, 0.3, 0.3);
		northWall.Material = Enum.Material.ForceField;
		northWall.Parent = boundaryFolder;

		// South wall
		const southWall = northWall.Clone();
		southWall.Name = "SouthWall";
		southWall.Position = new Vector3(0, wallHeight / 2, -mapEdge);
		southWall.Parent = boundaryFolder;

		// East wall
		const eastWall = new Instance("Part");
		eastWall.Name = "EastWall";
		eastWall.Size = new Vector3(wallThickness, wallHeight, 2000);
		eastWall.Position = new Vector3(mapEdge, wallHeight / 2, 0);
		eastWall.Anchored = true;
		eastWall.CanCollide = true;
		eastWall.Transparency = 0.5;
		eastWall.Color = new Color3(1, 0.3, 0.3);
		eastWall.Material = Enum.Material.ForceField;
		eastWall.Parent = boundaryFolder;

		// West wall
		const westWall = eastWall.Clone();
		westWall.Name = "WestWall";
		westWall.Position = new Vector3(-mapEdge, wallHeight / 2, 0);
		westWall.Parent = boundaryFolder;

		print("[MapBuilder] ✅ Created boundary walls (2000x2000 map)");
	}

	private buildFlatStreets(): void {
		const streetFolder = new Instance("Folder");
		streetFolder.Name = "Streets";
		streetFolder.Parent = this.mapFolder;

		const streetWidth = 40;
		const gridSize = 1000; // 1000 studs from center (2000x2000 total)
		const spacing = 200;

		let streetCount = 0;

		// North-South streets
		for (let x = -gridSize; x <= gridSize; x += spacing) {
			const street = new Instance("Part");
			street.Name = `Street_NS_${x}`;
			street.Size = new Vector3(streetWidth, 0.1, gridSize * 2);
			street.Position = new Vector3(x, 1.05, 0);
			street.Anchored = true;
			street.CanCollide = false;
			street.Color = new Color3(0.2, 0.2, 0.2);
			street.Material = Enum.Material.Asphalt;
			street.TopSurface = Enum.SurfaceType.Smooth;
			street.Parent = streetFolder;
			streetCount++;
		}

		// East-West streets
		for (let z = -gridSize; z <= gridSize; z += spacing) {
			const street = new Instance("Part");
			street.Name = `Street_EW_${z}`;
			street.Size = new Vector3(gridSize * 2, 0.1, streetWidth);
			street.Position = new Vector3(0, 1.05, z);
			street.Anchored = true;
			street.CanCollide = false;
			street.Color = new Color3(0.2, 0.2, 0.2);
			street.Material = Enum.Material.Asphalt;
			street.TopSurface = Enum.SurfaceType.Smooth;
			street.Parent = streetFolder;
			streetCount++;
		}

		print(`[MapBuilder] ✅ Created ${streetCount} streets`);
	}

	private buildBuildings(): void {
		const buildingFolder = new Instance("Folder");
		buildingFolder.Name = "Buildings";
		buildingFolder.Parent = this.mapFolder;

		const gridSize = 1000; // Match map size
		const spacing = 200;
		let buildingCount = 0;
		let skippedCount = 0;
		
		// Build buildings at each intersection (except near pizza shop and delivery locations!)
		for (let x = -gridSize; x <= gridSize; x += spacing) {
			for (let z = -gridSize; z <= gridSize; z += spacing) {
				// Skip pizza shop area (center 0,0)
				const distFromCenter = math.sqrt(x * x + z * z);
				if (distFromCenter < 100) {
					continue; // Don't build near pizza shop!
				}

				// Build 4 buildings around each intersection
				const offsets = [
					{ x: 60, z: 60 },
					{ x: -60, z: 60 },
					{ x: 60, z: -60 },
					{ x: -60, z: -60 },
				];

				offsets.forEach((offset) => {
					const buildingPos = new Vector3(x + offset.x, 0, z + offset.z);
					
					// Check if this building would overlap with any delivery location
					let tooCloseToDelivery = false;
					for (const deliveryLoc of DELIVERY_LOCATIONS) {
						const distToDelivery = new Vector3(
							buildingPos.X - deliveryLoc.position.X,
							0,
							buildingPos.Z - deliveryLoc.position.Z
						).Magnitude;
						
						if (distToDelivery < 80) { // Stay 80 studs away from delivery markers
							tooCloseToDelivery = true;
							skippedCount++;
							break;
						}
					}
					
					if (!tooCloseToDelivery && math.random() > 0.3) { // 70% chance for building
						this.createBuilding(buildingPos, buildingFolder);
						buildingCount++;
					}
				});
			}
		}

		print(`[MapBuilder] ✅ Created ${buildingCount} buildings (skipped ${skippedCount} near delivery zones)`);
	}

	private createBuilding(position: Vector3, parent: Folder): void {
		const height = math.random(20, 80); // Random height
		const width = math.random(30, 60);
		const depth = math.random(30, 60);

		// Main building body
		const building = new Instance("Part");
		building.Name = "Building";
		building.Size = new Vector3(width, height, depth);
		building.Position = new Vector3(position.X, height / 2 + 1, position.Z);
		building.Anchored = true;
		building.CanCollide = true;
		
		// Random building colors - more varied
		const buildingType = math.random(1, 3);
		if (buildingType === 1) {
			// Modern glass tower
			building.Color = new Color3(0.4, 0.5, 0.6);
			building.Material = Enum.Material.Glass;
			building.Transparency = 0.3;
		} else if (buildingType === 2) {
			// Brick building
			building.Color = new Color3(0.6, 0.4, 0.3);
			building.Material = Enum.Material.Brick;
		} else {
			// Concrete building
			const shade = math.random(40, 70) / 100;
			building.Color = new Color3(shade, shade, shade * 1.1);
			building.Material = Enum.Material.Concrete;
		}
		building.Parent = parent;

		// Add windows
		this.addWindows(building, width, height, depth);
		
		// Add entrance door
		this.addDoor(building, width, depth);
		
		// Add rooftop details
		this.addRoof(building, width, depth, height);
	}

	private addWindows(building: Part, width: number, height: number, depth: number): void {
		const windowSize = 3;
		const windowSpacing = 6;
		const floors = math.floor(height / windowSpacing);

		for (let floor = 1; floor < floors; floor++) {
			const yPos = -height / 2 + floor * windowSpacing;

			// Front and back windows
			for (let i = -2; i <= 2; i++) {
				const window1 = new Instance("Part");
				window1.Name = "Window";
				window1.Size = new Vector3(windowSize, windowSize, 0.2);
				window1.Position = building.Position.add(new Vector3(i * windowSpacing, yPos, depth / 2 + 0.1));
				window1.Anchored = true;
				window1.CanCollide = false;
				window1.Color = new Color3(0.6, 0.8, 1);
				window1.Material = Enum.Material.Glass;
				window1.Transparency = 0.3;
				window1.Parent = building;

				const window2 = new Instance("Part");
				window2.Name = "Window";
				window2.Size = new Vector3(windowSize, windowSize, 0.2);
				window2.Position = building.Position.add(new Vector3(i * windowSpacing, yPos, -depth / 2 - 0.1));
				window2.Anchored = true;
				window2.CanCollide = false;
				window2.Color = new Color3(0.6, 0.8, 1);
				window2.Material = Enum.Material.Glass;
				window2.Transparency = 0.3;
				window2.Parent = building;
			}
		}
	}

	private addDoor(building: Part, width: number, depth: number): void {
		const door = new Instance("Part");
		door.Name = "Door";
		door.Size = new Vector3(6, 10, 0.5);
		door.Position = building.Position.add(new Vector3(0, -building.Size.Y / 2 + 5, depth / 2 + 0.3));
		door.Anchored = true;
		door.CanCollide = false;
		door.Color = new Color3(0.3, 0.2, 0.1);
		door.Material = Enum.Material.Wood;
		door.Parent = building;
	}

	private addRoof(building: Part, width: number, depth: number, height: number): void {
		const roof = new Instance("Part");
		roof.Name = "Roof";
		roof.Size = new Vector3(width + 2, 1, depth + 2);
		roof.Position = building.Position.add(new Vector3(0, height / 2 + 0.5, 0));
		roof.Anchored = true;
		roof.CanCollide = false;
		roof.Color = new Color3(0.2, 0.2, 0.2);
		roof.Material = Enum.Material.Concrete;
		roof.Parent = building;
	}

	private buildStreetLights(): void {
		const lightFolder = new Instance("Folder");
		lightFolder.Name = "StreetLights";
		lightFolder.Parent = this.mapFolder;

		const gridSize = 1000; // Match map size
		const spacing = 200;
		let lightCount = 0;

		// Place lights at intersections
		for (let x = -gridSize; x <= gridSize; x += spacing) {
			for (let z = -gridSize; z <= gridSize; z += spacing) {
				// Skip pizza shop area
				const distFromCenter = math.sqrt(x * x + z * z);
				if (distFromCenter < 50) continue;

				this.createStreetLight(new Vector3(x + 25, 0, z + 25), lightFolder);
				lightCount++;
			}
		}

		print(`[MapBuilder] ✅ Created ${lightCount} street lights`);
	}

	private createStreetLight(position: Vector3, parent: Folder): void {
		// Pole
		const pole = new Instance("Part");
		pole.Name = "LightPole";
		pole.Size = new Vector3(1, 15, 1);
		pole.Position = new Vector3(position.X, 8.5, position.Z);
		pole.Anchored = true;
		pole.CanCollide = false;
		pole.Color = new Color3(0.2, 0.2, 0.2);
		pole.Material = Enum.Material.Metal;
		pole.Parent = parent;

		// Light
		const light = new Instance("Part");
		light.Name = "Light";
		light.Size = new Vector3(3, 1, 3);
		light.Position = new Vector3(position.X, 16, position.Z);
		light.Anchored = true;
		light.CanCollide = false;
		light.Color = new Color3(1, 1, 0.8);
		light.Material = Enum.Material.Neon;
		light.Parent = pole;

		// Point light
		const pointLight = new Instance("PointLight");
		pointLight.Brightness = 2;
		pointLight.Range = 60;
		pointLight.Color = new Color3(1, 0.9, 0.7);
		pointLight.Parent = light;
	}

	private buildParkedCars(): void {
		const carFolder = new Instance("Folder");
		carFolder.Name = "ParkedCars";
		carFolder.Parent = this.mapFolder;

		const gridSize = 1000; // Match map size
		const spacing = 200;
		let carCount = 0;

		// Place random parked cars along streets
		for (let x = -gridSize; x <= gridSize; x += spacing) {
			for (let z = -gridSize; z <= gridSize; z += spacing) {
				// Skip pizza shop area
				const distFromCenter = math.sqrt(x * x + z * z);
				if (distFromCenter < 100) continue;

				if (math.random() > 0.7) { // 30% chance for parked car
					const offset = math.random() > 0.5 ? 30 : -30;
					this.createParkedCar(
						new Vector3(x + offset, 0, z),
						carFolder
					);
					carCount++;
				}
			}
		}

		print(`[MapBuilder] ✅ Created ${carCount} parked cars`);
	}

	private createParkedCar(position: Vector3, parent: Folder): void {
		const car = new Instance("Part");
		car.Name = "ParkedCar";
		car.Size = new Vector3(8, 4, 15);
		car.Position = new Vector3(position.X, 3, position.Z);
		car.Anchored = true;
		car.CanCollide = true;
		
		// Random car colors
		const colors = [
			new Color3(1, 0.2, 0.2), // Red
			new Color3(0.2, 0.2, 1), // Blue
			new Color3(0.2, 0.2, 0.2), // Black
			new Color3(0.9, 0.9, 0.9), // White
			new Color3(0.8, 0.8, 0.2), // Yellow
		];
		car.Color = colors[math.random(0, colors.size() - 1)];
		car.Material = Enum.Material.SmoothPlastic;
		car.Parent = parent;
	}
}
