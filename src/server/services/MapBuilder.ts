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
		
		// Add moving traffic
		this.buildMovingTraffic();
		
		// Add trees and plants
		this.buildVegetation();
		
		// Add street details
		this.buildStreetDetails();
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

	private buildMovingTraffic(): void {
		const trafficFolder = new Instance("Folder");
		trafficFolder.Name = "MovingTraffic";
		trafficFolder.Parent = this.mapFolder;

		// Spawn 15 traffic cars at random locations
		const numCars = 15;
		for (let i = 0; i < numCars; i++) {
			task.spawn(() => {
				task.wait(i * 2); // Stagger spawns
				this.createTrafficCar(trafficFolder, i);
			});
		}

		print(`[MapBuilder] ✅ Created ${numCars} moving traffic cars`);
	}

	private createTrafficCar(parent: Folder, id: number): void {
		// Random spawn position on streets
		const streetPositions = [-800, -600, -400, -200, 0, 200, 400, 600, 800];
		const x = streetPositions[math.random(0, streetPositions.size() - 1)];
		const z = streetPositions[math.random(0, streetPositions.size() - 1)];
		
		const car = new Instance("Part");
		car.Name = `TrafficCar_${id}`;
		car.Size = new Vector3(8, 4, 15);
		car.Position = new Vector3(x, 3, z);
		car.Anchored = false;
		car.CanCollide = true;
		
		// Random colors
		const colors = [
			new Color3(0.8, 0.1, 0.1), // Red
			new Color3(0.1, 0.3, 0.8), // Blue
			new Color3(0.2, 0.2, 0.2), // Black
			new Color3(0.8, 0.8, 0.8), // White
			new Color3(0.9, 0.7, 0.1), // Yellow
			new Color3(0.1, 0.6, 0.2), // Green
		];
		car.Color = colors[math.random(0, colors.size() - 1)];
		car.Material = Enum.Material.SmoothPlastic;
		car.Parent = parent;

		// Add BodyVelocity for movement
		const bodyVel = new Instance("BodyVelocity");
		bodyVel.MaxForce = new Vector3(4000, 0, 4000);
		
		// Random direction (N/S or E/W)
		const direction = math.random() > 0.5 ? 
			new Vector3(math.random(20, 40), 0, 0) : 
			new Vector3(0, 0, math.random(20, 40));
		bodyVel.Velocity = direction;
		bodyVel.Parent = car;

		// Add BodyGyro to keep upright
		const bodyGyro = new Instance("BodyGyro");
		bodyGyro.MaxTorque = new Vector3(4000, 4000, 4000);
		bodyGyro.CFrame = car.CFrame;
		bodyGyro.Parent = car;

		// Respawn car if it goes too far
		task.spawn(() => {
			while (car && car.Parent) {
				task.wait(1);
				const dist = car.Position.Magnitude;
				if (dist > 1200) {
					// Respawn at opposite side
					const newX = streetPositions[math.random(0, streetPositions.size() - 1)];
					const newZ = streetPositions[math.random(0, streetPositions.size() - 1)];
					car.Position = new Vector3(newX, 3, newZ);
					
					// New random direction
					const newDirection = math.random() > 0.5 ? 
						new Vector3(math.random(20, 40), 0, 0) : 
						new Vector3(0, 0, math.random(20, 40));
					bodyVel.Velocity = newDirection;
				}
			}
		});
	}

	private buildVegetation(): void {
		const vegFolder = new Instance("Folder");
		vegFolder.Name = "Vegetation";
		vegFolder.Parent = this.mapFolder;

		let treeCount = 0;
		let plantCount = 0;

		// Add trees around buildings and streets
		for (let i = 0; i < 100; i++) {
			const x = math.random(-900, 900);
			const z = math.random(-900, 900);
			
			// Skip if too close to center (pizza shop)
			if (math.sqrt(x * x + z * z) < 150) continue;
			
			// 70% trees, 30% bushes
			if (math.random() > 0.3) {
				this.createTree(new Vector3(x, 0, z), vegFolder);
				treeCount++;
			} else {
				this.createBush(new Vector3(x, 0, z), vegFolder);
				plantCount++;
			}
		}

		print(`[MapBuilder] ✅ Created ${treeCount} trees and ${plantCount} bushes`);
	}

	private createTree(position: Vector3, parent: Folder): void {
		// Tree trunk
		const trunk = new Instance("Part");
		trunk.Name = "TreeTrunk";
		trunk.Size = new Vector3(3, 15, 3);
		trunk.Position = new Vector3(position.X, 8.5, position.Z);
		trunk.Anchored = true;
		trunk.CanCollide = true;
		trunk.Color = new Color3(0.4, 0.25, 0.1);
		trunk.Material = Enum.Material.Wood;
		trunk.Parent = parent;

		// Tree canopy
		const canopy = new Instance("Part");
		canopy.Name = "TreeCanopy";
		canopy.Shape = Enum.PartType.Ball;
		canopy.Size = new Vector3(12, 12, 12);
		canopy.Position = new Vector3(position.X, 18, position.Z);
		canopy.Anchored = true;
		canopy.CanCollide = false;
		canopy.Color = new Color3(0.2, 0.5, 0.2);
		canopy.Material = Enum.Material.Grass;
		canopy.Parent = trunk;
	}

	private createBush(position: Vector3, parent: Folder): void {
		const bush = new Instance("Part");
		bush.Name = "Bush";
		bush.Shape = Enum.PartType.Ball;
		bush.Size = new Vector3(6, 4, 6);
		bush.Position = new Vector3(position.X, 3, position.Z);
		bush.Anchored = true;
		bush.CanCollide = true;
		bush.Color = new Color3(0.15, 0.45, 0.15);
		bush.Material = Enum.Material.Grass;
		bush.Parent = parent;
	}

	private buildStreetDetails(): void {
		const detailsFolder = new Instance("Folder");
		detailsFolder.Name = "StreetDetails";
		detailsFolder.Parent = this.mapFolder;

		let benchCount = 0;
		let signCount = 0;

		// Add benches and trash cans near buildings
		const gridSize = 1000;
		const spacing = 300;

		for (let x = -gridSize; x <= gridSize; x += spacing) {
			for (let z = -gridSize; z <= gridSize; z += spacing) {
				const distFromCenter = math.sqrt(x * x + z * z);
				if (distFromCenter < 150) continue;

				if (math.random() > 0.6) {
					this.createBench(new Vector3(x + 40, 0, z + 40), detailsFolder);
					benchCount++;
				}

				if (math.random() > 0.7) {
					this.createStreetSign(new Vector3(x + 20, 0, z + 20), detailsFolder);
					signCount++;
				}
			}
		}

		print(`[MapBuilder] ✅ Created ${benchCount} benches and ${signCount} street signs`);
	}

	private createBench(position: Vector3, parent: Folder): void {
		// Bench seat
		const seat = new Instance("Part");
		seat.Name = "BenchSeat";
		seat.Size = new Vector3(8, 1, 3);
		seat.Position = new Vector3(position.X, 2.5, position.Z);
		seat.Anchored = true;
		seat.CanCollide = true;
		seat.Color = new Color3(0.4, 0.25, 0.1);
		seat.Material = Enum.Material.Wood;
		seat.Parent = parent;

		// Bench back
		const back = new Instance("Part");
		back.Name = "BenchBack";
		back.Size = new Vector3(8, 3, 0.5);
		back.Position = new Vector3(position.X, 4, position.Z + 1.25);
		back.Anchored = true;
		back.CanCollide = true;
		back.Color = new Color3(0.4, 0.25, 0.1);
		back.Material = Enum.Material.Wood;
		back.Parent = seat;
	}

	private createStreetSign(position: Vector3, parent: Folder): void {
		// Sign post
		const post = new Instance("Part");
		post.Name = "SignPost";
		post.Size = new Vector3(0.5, 8, 0.5);
		post.Position = new Vector3(position.X, 5, position.Z);
		post.Anchored = true;
		post.CanCollide = true;
		post.Color = new Color3(0.3, 0.3, 0.3);
		post.Material = Enum.Material.Metal;
		post.Parent = parent;

		// Sign board
		const board = new Instance("Part");
		board.Name = "SignBoard";
		board.Size = new Vector3(4, 3, 0.2);
		board.Position = new Vector3(position.X, 9, position.Z);
		board.Anchored = true;
		board.CanCollide = false;
		board.Color = new Color3(0.1, 0.6, 0.1);
		board.Material = Enum.Material.SmoothPlastic;
		board.Parent = post;
	}
}
