// Server-side delivery management system

import { Players, ReplicatedStorage } from "@rbxts/services";
import {
	DeliveryTask,
	DeliveryResult,
	PlayerScore,
	GameState,
	PIZZA_SHOP,
	DELIVERY_LOCATIONS,
	GameConfig,
	calculateDeliveryTime,
	calculateBaseReward,
} from "shared/module";
import { HttpService } from "@rbxts/services";
import { VehicleSpawner } from "./VehicleSpawner";
import { VehicleAutoFlip } from "./VehicleAutoFlip";

interface ActiveDelivery {
	task: DeliveryTask;
	startTime: number;
	driftBonus: number;
	jumpCount: number;
}

export class DeliveryService {
	private activeDeliveries = new Map<Player, ActiveDelivery>();
	private playerScores = new Map<Player, PlayerScore>();
	private deliveryLocationsFolder?: Folder;

	// Remote events (to be created)
	private remoteEvents = new Map<string, RemoteEvent>();

	constructor() {
		this.setupRemoteEvents();
		this.createDeliveryMarkers();
		this.setupPlayerHandlers();
	}

	private setupRemoteEvents(): void {
		const remoteFolder = ReplicatedStorage.FindFirstChild("RemoteEvents") as Folder;
		let folder: Folder;

		if (!remoteFolder) {
			folder = new Instance("Folder");
			folder.Name = "RemoteEvents";
			folder.Parent = ReplicatedStorage;
		} else {
			folder = remoteFolder;
		}

		// Create remote events
		const eventNames = [
			"RequestNewDelivery",
			"CompleteDelivery",
			"ReportDrift",
			"ReportJump",
			"DeliveryStarted",
			"DeliveryCompleted",
			"ScoreUpdated",
			"GameStateChanged",
			"DriftBonus",
			"JumpBonus",
		];

		eventNames.forEach((name) => {
			let event = folder.FindFirstChild(name) as RemoteEvent;
			if (!event) {
				event = new Instance("RemoteEvent");
				event.Name = name;
				event.Parent = folder;
			}
			this.remoteEvents.set(name, event);
		});
	}

	private createDeliveryMarkers(): void {
		this.deliveryLocationsFolder = new Instance("Folder");
		this.deliveryLocationsFolder.Name = "DeliveryLocations";
		this.deliveryLocationsFolder.Parent = game.Workspace;

		// Create pizza shop marker
		this.createLocationMarker(PIZZA_SHOP);

		// Create delivery location markers
		DELIVERY_LOCATIONS.forEach((location) => {
			this.createLocationMarker(location);
		});
	}

	private createLocationMarker(location: { name: string; position: Vector3; color: Color3 }): void {
		// Place marker DIRECTLY on ground at Y=1 (same as vehicle driving level!)
		const groundPosition = new Vector3(location.position.X, 1, location.position.Z);
		
		print(`[DeliveryService] Creating marker for ${location.name} at (${groundPosition.X}, ${groundPosition.Y}, ${groundPosition.Z})`);
		
		// HUGE flat marker on the ground
		const marker = new Instance("Part");
		marker.Name = location.name;
		marker.Size = new Vector3(50, 0.5, 50); // MASSIVE 50x50 zone!
		marker.Position = groundPosition;
		marker.Anchored = true;
		marker.CanCollide = false; // Drive through it
		marker.Color = location.color;
		marker.Material = Enum.Material.Neon;
		marker.Transparency = 0.3; // More visible
		marker.Parent = this.deliveryLocationsFolder;

		// Add a SUPER tall beam for visibility from anywhere
		const beam = new Instance("Part");
		beam.Name = "Beam";
		beam.Size = new Vector3(4, 300, 4); // HUGE beam
		beam.Position = groundPosition.add(new Vector3(0, 150, 0)); // Center at 150 up
		beam.Anchored = true;
		beam.CanCollide = false;
		beam.Color = location.color;
		beam.Material = Enum.Material.Neon;
		beam.Transparency = 0.4; // More visible
		beam.Parent = marker;

		// Add label
		const billboard = new Instance("BillboardGui");
		billboard.Name = "Label";
		billboard.Size = new UDim2(0, 200, 0, 50);
		billboard.StudsOffset = new Vector3(0, 5, 0);
		billboard.AlwaysOnTop = true;
		billboard.Parent = marker;

		const label = new Instance("TextLabel");
		label.Size = new UDim2(1, 0, 1, 0);
		label.BackgroundTransparency = 1;
		label.Text = location.name;
		label.TextColor3 = new Color3(1, 1, 1);
		label.TextScaled = true;
		label.Font = Enum.Font.GothamBold;
		label.Parent = billboard;
	}

	private setupPlayerHandlers(): void {
		// Handle new delivery requests
		const requestEvent = this.remoteEvents.get("RequestNewDelivery")!;
		requestEvent.OnServerEvent.Connect((player) => {
			this.startNewDelivery(player);
		});

		// Handle delivery completion
		const completeEvent = this.remoteEvents.get("CompleteDelivery")!;
		completeEvent.OnServerEvent.Connect((player) => {
			this.completeDelivery(player);
		});

		// Handle drift reports
		const driftEvent = this.remoteEvents.get("ReportDrift")!;
		driftEvent.OnServerEvent.Connect((player, driftTime: unknown) => {
			if (typeIs(driftTime, "number")) {
				this.reportDrift(player, driftTime);
			}
		});

		// Handle jump reports
		const jumpEvent = this.remoteEvents.get("ReportJump")!;
		jumpEvent.OnServerEvent.Connect((player) => {
			this.reportJump(player);
		});

		// Initialize score for new players
		Players.PlayerAdded.Connect((player) => {
			this.initializePlayer(player);
			
			// NOTE: Vehicle spawning disabled - using premade jeep from toolbox
			// Uncomment below to spawn our custom car:
			// task.wait(2);
			// const vehicle = VehicleSpawner.spawnPlayerVehicle(player);
			// new VehicleAutoFlip(vehicle);
		});

		// Cleanup on player leave
		Players.PlayerRemoving.Connect((player) => {
			this.activeDeliveries.delete(player);
			this.playerScores.delete(player);
		});
	}

	private initializePlayer(player: Player): void {
		const initialScore: PlayerScore = {
			totalScore: 0,
			deliveriesCompleted: 0,
			totalTips: 0,
			bestDeliveryTime: math.huge,
			longestDriftTime: 0,
		};
		this.playerScores.set(player, initialScore);

		// Send initial state
		this.sendScoreUpdate(player);
	}

	public startNewDelivery(player: Player): void {
		print("=".rep(60));
		print(`[DeliveryService] 📦 NEW DELIVERY REQUEST from ${player.Name}`);
		
		// Don't start if player already has active delivery
		if (this.activeDeliveries.has(player)) {
			print(`[DeliveryService] ⚠️ Player ${player.Name} already has active delivery - skipping`);
			print("=".rep(60));
			return;
		}

		// Pick random delivery location
		const randomIndex = math.random(0, DELIVERY_LOCATIONS.size() - 1);
		const deliveryLocation = DELIVERY_LOCATIONS[randomIndex];
		print(`[DeliveryService] 🎲 Random location [${randomIndex}]: ${deliveryLocation.name}`);

		// Calculate distance and time
		const distance = PIZZA_SHOP.position.sub(deliveryLocation.position).Magnitude;
		const heightDiff = deliveryLocation.position.Y - PIZZA_SHOP.position.Y;
		const timeLimit = calculateDeliveryTime(distance);
		const baseReward = calculateBaseReward(distance, heightDiff);
		print(`[DeliveryService] 📏 Distance: ${math.floor(distance)}m | Time: ${timeLimit}s | Reward: $${baseReward}`);

		// Create delivery task
		const task: DeliveryTask = {
			id: HttpService.GenerateGUID(false),
			pickupLocation: PIZZA_SHOP,
			deliveryLocation: deliveryLocation,
			timeLimit: timeLimit,
			baseReward: baseReward,
			distanceMeters: math.floor(distance),
		};
		print(`[DeliveryService] 📋 Task ID: ${task.id}`);
		print(`[DeliveryService] 🍕 Pickup: ${PIZZA_SHOP.name} at (${PIZZA_SHOP.position.X}, ${PIZZA_SHOP.position.Y}, ${PIZZA_SHOP.position.Z})`);
		print(`[DeliveryService] 🎯 Delivery: ${deliveryLocation.name} at (${deliveryLocation.position.X}, ${deliveryLocation.position.Y}, ${deliveryLocation.position.Z})`);

		// Store active delivery
		const activeDelivery: ActiveDelivery = {
			task: task,
			startTime: os.clock(),
			driftBonus: 0,
			jumpCount: 0,
		};
		this.activeDeliveries.set(player, activeDelivery);
		print(`[DeliveryService] ✅ Active delivery stored in map`);

		// Notify client
		const event = this.remoteEvents.get("DeliveryStarted");
		if (event) {
			event.FireClient(player, task);
			print(`[DeliveryService] 🚀 DeliveryStarted event FIRED to ${player.Name}`);
		} else {
			print(`[DeliveryService] ❌ ERROR: DeliveryStarted event not found!`);
		}

		print(`[DeliveryService] ✅ DELIVERY SETUP COMPLETE for ${player.Name}`);
		print("=".rep(60));
	}

	public completeDelivery(player: Player): void {
		const activeDelivery = this.activeDeliveries.get(player);
		if (!activeDelivery) {
			return;
		}

		const timeTaken = os.clock() - activeDelivery.startTime;
		const timeLimit = activeDelivery.task.timeLimit;
		const timeRemaining = timeLimit - timeTaken;
		const success = timeRemaining > 0;

		if (!success) {
			// Failed delivery - time ran out
			this.activeDeliveries.delete(player);
			const failResult: DeliveryResult = {
				success: false,
				timeTaken: timeTaken,
				timeRemaining: 0,
				baseReward: 0,
				speedBonus: 0,
				driftBonus: 0,
				totalTip: 0,
			};

			const event = this.remoteEvents.get("DeliveryCompleted")!;
			event.FireClient(player, failResult);
			return;
		}

		// Calculate bonuses
		const speedBonus = math.floor(timeRemaining * GameConfig.SPEED_BONUS_MULTIPLIER);
		let totalBonus = speedBonus + activeDelivery.driftBonus;

		// Fast delivery bonus
		if (timeTaken < timeLimit * GameConfig.FAST_DELIVERY_THRESHOLD) {
			totalBonus += GameConfig.FAST_DELIVERY_BONUS;
		}

		// Jump bonus
		totalBonus += activeDelivery.jumpCount * GameConfig.JUMP_BONUS;

		const totalTip = activeDelivery.task.baseReward + totalBonus;

		// Update player score
		const score = this.playerScores.get(player)!;
		score.totalScore += totalTip;
		score.deliveriesCompleted += 1;
		score.totalTips += totalBonus;
		score.bestDeliveryTime = math.min(score.bestDeliveryTime, timeTaken);

		// Create result
		const result: DeliveryResult = {
			success: true,
			timeTaken: timeTaken,
			timeRemaining: timeRemaining,
			baseReward: activeDelivery.task.baseReward,
			speedBonus: speedBonus,
			driftBonus: activeDelivery.driftBonus,
			totalTip: totalTip,
		};

		// Notify client
		const event = this.remoteEvents.get("DeliveryCompleted")!;
		event.FireClient(player, result);

		// Send updated score
		this.sendScoreUpdate(player);

		// Clear active delivery
		this.activeDeliveries.delete(player);

		print(
			`[DeliveryService] ${player.Name} completed delivery! Time: ${math.floor(timeTaken)}s, Tip: $${totalTip}`
		);
	}

	private reportDrift(player: Player, driftTime: number): void {
		const activeDelivery = this.activeDeliveries.get(player);
		if (!activeDelivery) return;

		const driftBonus = math.floor(driftTime * GameConfig.DRIFT_BONUS_PER_SECOND);
		activeDelivery.driftBonus += driftBonus;

		// Update longest drift
		const score = this.playerScores.get(player)!;
		score.longestDriftTime = math.max(score.longestDriftTime, driftTime);

		// Notify client of bonus
		const event = this.remoteEvents.get("DriftBonus")!;
		event.FireClient(player, driftBonus);
	}

	private reportJump(player: Player): void {
		const activeDelivery = this.activeDeliveries.get(player);
		if (!activeDelivery) return;

		activeDelivery.jumpCount += 1;

		// Notify client
		const event = this.remoteEvents.get("JumpBonus")!;
		event.FireClient(player);
	}

	private sendScoreUpdate(player: Player): void {
		const score = this.playerScores.get(player);
		if (!score) return;

		const event = this.remoteEvents.get("ScoreUpdated")!;
		event.FireClient(player, score);
	}

	public getPlayerScore(player: Player): PlayerScore | undefined {
		return this.playerScores.get(player);
	}

	public hasActiveDelivery(player: Player): boolean {
		return this.activeDeliveries.has(player);
	}
}
