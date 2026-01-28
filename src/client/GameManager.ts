// Main client-side game manager that orchestrates all systems

import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { VehicleController } from "./controllers/VehicleController";
import { DriftManager } from "./controllers/DriftManager";
import { TimerManager, ScoreTracker } from "./controllers/TimerManager";
import { GameHUD } from "./ui/GameHUD";
import { EffectsManager } from "./effects/EffectsManager";
import { DeliveryTask, DeliveryResult, PlayerScore } from "shared/module";

export class GameManager {
	private player: Player;
	private character?: Model;
	private vehicle?: Model;

	// Controllers
	private vehicleController?: VehicleController;
	private driftManager?: DriftManager;
	private timerManager: TimerManager;
	private scoreTracker: ScoreTracker;
	private hud: GameHUD;
	private effectsManager?: EffectsManager;

	// Game state
	private currentDelivery?: DeliveryTask;
	private deliveryArrow?: Part;
	private isInPickupZone = false;
	private isInDeliveryZone = false;
	private hasPizza = false;
	private isFirstDelivery = true;

	// Remote events
	private remoteEvents = new Map<string, RemoteEvent>();

	constructor() {
		print("[GameManager] 🎮 Constructor starting...");
		this.player = Players.LocalPlayer;
		this.timerManager = new TimerManager();
		this.scoreTracker = new ScoreTracker();
		this.hud = new GameHUD();
		print("[GameManager] ✅ Basic components initialized");

		print("[GameManager] 🔌 Setting up remote events...");
		this.setupRemoteEvents();
		print("[GameManager] ✅ Remote events ready");
		
		print("[GameManager] 👤 Setting up character...");
		this.setupCharacter();
		
		print("[GameManager] 📞 Setting up callbacks...");
		this.setupCallbacks();
		
		print("[GameManager] ⌨️ Setting up input listener...");
		this.setupInputListener();
		
		print("[GameManager] ✅ GameManager fully initialized!");
	}

	private setupRemoteEvents(): void {
		print("[GameManager] Waiting for RemoteEvents folder...");
		const folder = ReplicatedStorage.WaitForChild("RemoteEvents", 10) as Folder;
		
		if (!folder) {
			print("[GameManager] ❌ ERROR: RemoteEvents folder not found after 10 seconds!");
			return;
		}
		print("[GameManager] ✅ RemoteEvents folder found");

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

		print(`[GameManager] Waiting for ${eventNames.size()} remote events...`);
		eventNames.forEach((name) => {
			const event = folder.WaitForChild(name, 5) as RemoteEvent;
			if (event) {
				this.remoteEvents.set(name, event);
				print(`[GameManager] ✅ ${name} event found`);
			} else {
				print(`[GameManager] ❌ ${name} event NOT FOUND!`);
			}
		});

		print(`[GameManager] Total events loaded: ${this.remoteEvents.size()}`);

		// Setup listeners
		this.setupRemoteListeners();
	}

	private setupRemoteListeners(): void {
		print("[GameManager] 🔔 Setting up remote event listeners...");
		
		// Delivery started
		const deliveryStartedEvent = this.remoteEvents.get("DeliveryStarted");
		if (deliveryStartedEvent) {
			deliveryStartedEvent.OnClientEvent.Connect((task: unknown) => {
				print("[GameManager] 📨 DeliveryStarted event received!");
				if (this.isDeliveryTask(task)) {
					this.onDeliveryStarted(task);
				} else {
					print("[GameManager] ❌ Received invalid delivery task data!");
				}
			});
			print("[GameManager] ✅ DeliveryStarted listener connected");
		} else {
			print("[GameManager] ❌ DeliveryStarted event not found - listener NOT connected!");
		}

		// Delivery completed
		const deliveryCompletedEvent = this.remoteEvents.get("DeliveryCompleted")!;
		deliveryCompletedEvent.OnClientEvent.Connect((result: unknown) => {
			warn("🔥🔥🔥 DELIVERY COMPLETED EVENT RECEIVED FROM SERVER!");
			warn("Result: " + tostring(result));
			if (this.isDeliveryResult(result)) {
				warn("✅ Result is valid, calling onDeliveryCompleted...");
				this.onDeliveryCompleted(result);
			} else {
				warn("❌ Result is NOT valid!");
			}
		});

		// Score updated
		const scoreUpdatedEvent = this.remoteEvents.get("ScoreUpdated")!;
		scoreUpdatedEvent.OnClientEvent.Connect((score: unknown) => {
			if (this.isPlayerScore(score)) {
				this.onScoreUpdated(score);
			}
		});

		// Drift bonus
		const driftBonusEvent = this.remoteEvents.get("DriftBonus")!;
		driftBonusEvent.OnClientEvent.Connect((bonus: unknown) => {
			if (typeIs(bonus, "number")) {
				this.hud.showDriftScore(bonus);
			}
		});

		// Jump bonus
		const jumpBonusEvent = this.remoteEvents.get("JumpBonus")!;
		jumpBonusEvent.OnClientEvent.Connect(() => {
			this.hud.showNotification("+$25 JUMP BONUS!", 1.5);
		});
	}

	// Type guards
	private isDeliveryTask(obj: unknown): obj is DeliveryTask {
		return typeIs(obj, "table") && typeIs((obj as DeliveryTask).id, "string");
	}

	private isDeliveryResult(obj: unknown): obj is DeliveryResult {
		return typeIs(obj, "table") && typeIs((obj as DeliveryResult).success, "boolean");
	}

	private isPlayerScore(obj: unknown): obj is PlayerScore {
		return typeIs(obj, "table") && typeIs((obj as PlayerScore).totalScore, "number");
	}

	private setupCharacter(): void {
		const setupChar = (char: Model) => {
			this.character = char;

			// Wait for character to load
			task.wait(1);

			// Find or create vehicle
			this.setupVehicle();
		};

		if (this.player.Character) {
			setupChar(this.player.Character);
		}

		this.player.CharacterAdded.Connect((char) => {
			print("[GameManager] 🔄 Character respawned! Re-seating in vehicle...");
			setupChar(char);
		});
	}

	private setupVehicle(): void {
		print("[GameManager] 🚗 setupVehicle() called");
		// Wait for vehicle (either "PlayerVehicle" or any model with a VehicleSeat)
		const waitForVehicle = () => {
			// Try to find our spawned vehicle first
			let vehicle = Workspace.FindFirstChild("PlayerVehicle") as Model;
			
			// If not found, look for ANY model with a VehicleSeat (like the jeep!)
			if (!vehicle) {
				print("[GameManager] No PlayerVehicle found, searching for any VehicleSeat...");
				const allModels = Workspace.GetDescendants();
				for (const item of allModels) {
					if (item.IsA("Model")) {
						const vehicleSeat = item.FindFirstChildWhichIsA("VehicleSeat");
						if (vehicleSeat) {
							vehicle = item;
							print(`[GameManager] ✅ Found vehicle: ${vehicle.Name}`);
							break;
						}
					}
				}
			}

			if (vehicle) {
				this.vehicle = vehicle;
				print(`[GameManager] ✅ Vehicle found: ${vehicle.Name}`);
				
				// CHECK IF VEHICLE HAS PRIMARY PART
				if (!vehicle.PrimaryPart) {
					print(`[GameManager] ⚠️ WARNING: Vehicle has no PrimaryPart! Trying to set it...`);
					// Try to set the VehicleSeat as PrimaryPart
					const seat = vehicle.FindFirstChildWhichIsA("VehicleSeat", true);
					if (seat) {
						vehicle.PrimaryPart = seat;
						print(`[GameManager] ✅ Set VehicleSeat as PrimaryPart`);
					}
				} else {
					print(`[GameManager] ✅ Vehicle PrimaryPart: ${vehicle.PrimaryPart.Name}`);
				}

				// AUTO-SIT IN VEHICLE - FORCE IT!
				const vehicleSeat = vehicle.FindFirstChildWhichIsA("VehicleSeat", true) as VehicleSeat;
				if (vehicleSeat && this.character) {
					const humanoid = this.character.FindFirstChild("Humanoid") as Humanoid;
					const rootPart = this.character.FindFirstChild("HumanoidRootPart") as Part;
					
					if (humanoid && rootPart) {
						print("[GameManager] 🪑 Force-sitting player in vehicle...");
						
						// Move character directly to vehicle seat
						task.wait(0.5);
						rootPart.CFrame = vehicleSeat.CFrame.add(new Vector3(0, 2, 0));
						
						task.wait(0.3);
						vehicleSeat.Sit(humanoid);
						
						task.wait(0.3);
						// Force-sit again if needed
						if (!humanoid.Sit) {
							vehicleSeat.Sit(humanoid);
						}
						
						print("[GameManager] ✅ Player force-seated in vehicle!");
						
						// PREVENT LEAVING VEHICLE - disable jump
						humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, false);
						print("[GameManager] ✅ Jump disabled - player cannot exit vehicle!");
					}
				}

				// Setup controllers
				print("[GameManager] 🎮 Setting up controllers...");
				this.vehicleController = new VehicleController(vehicle);
				this.driftManager = new DriftManager(vehicle);
				this.effectsManager = new EffectsManager(vehicle);
				print("[GameManager] ✅ Controllers ready!");

				// Start game loop
				print("[GameManager] 🔄 Starting game loop...");
				this.startGameLoop();

				// Request first delivery
				print("[GameManager] 📦 Requesting first delivery in 2 seconds...");
				task.wait(2);
				this.requestNewDelivery();
			} else {
				// Keep waiting
				print("[GameManager] ⏳ Waiting for vehicle...");
				task.wait(0.5);
				waitForVehicle();
			}
		};

		waitForVehicle();
	}


	private setupCallbacks(): void {
		// Timer callbacks
		this.timerManager.onTimerUpdate = (remaining, limit) => {
			this.hud.updateTimer(remaining, limit);
		};

		this.timerManager.onTimerExpired = () => {
			this.hud.showNotification("TIME'S UP!", 2);
			// Auto-fail delivery
			task.wait(2);
			this.requestNewDelivery();
		};

		this.timerManager.onTimerWarning = () => {
			this.hud.showNotification("HURRY! 10 SECONDS LEFT!", 1.5);
		};

		// Score callbacks
		this.scoreTracker.onScoreChanged = (score) => {
			this.hud.updateScore(score);
		};

		this.scoreTracker.onComboChanged = (multiplier) => {
			this.hud.updateCombo(multiplier);
		};
	}

	private setupInputListener(): void {
		// Show instructions on first load
		task.wait(3);
		if (this.isFirstDelivery) {
			this.hud.showInstructions();
		}

		// Hide instructions on any key press
		const UserInputService = game.GetService("UserInputService");
		UserInputService.InputBegan.Connect((input) => {
			if (this.isFirstDelivery && this.hud) {
				this.hud.hideInstructions();
				this.isFirstDelivery = false;
			}
		});
	}

	private startGameLoop(): void {
		// Main game update loop
		RunService.RenderStepped.Connect(() => {
			this.update();
		});
	}

	private updateCount = 0;
	
	private update(): void {
		if (!this.vehicleController || !this.vehicle) {
			// This shouldn't spam too much, just occasionally
			return;
		}

		// Update speedometer
		const speed = this.vehicleController.getCurrentSpeed();
		this.hud.updateSpeed(speed);

		// Update delivery distance
		if (this.currentDelivery) {
			this.updateDeliveryDistance(); // Update UI distance!
		}

		// Debug every 60 frames (about once per second)
		this.updateCount++;
		if (this.updateCount >= 60) {
			this.updateCount = 0;
			
			// Check if vehicle has a PrimaryPart
			if (this.vehicle.PrimaryPart) {
				const vehiclePos = this.vehicle.PrimaryPart.Position;
				print(`[GameManager] 🚗 Update: Pos=(${math.floor(vehiclePos.X)}, ${math.floor(vehiclePos.Y)}, ${math.floor(vehiclePos.Z)}) | HasDelivery=${this.currentDelivery !== undefined} | HasPizza=${this.hasPizza}`);
			} else {
				print(`[GameManager] ❌ Vehicle has no PrimaryPart! Vehicle name: ${this.vehicle.Name}`);
			}
		}

		// Check zones
		this.checkZones();

		// Update drift state
		if (this.vehicleController.isDriftingActive() && this.driftManager) {
			// Drift effects are handled by DriftManager
		}
	}
	
	private updateDeliveryDistance(): void {
		if (!this.currentDelivery || !this.vehicle) return;

		const vehiclePos = this.vehicle.PrimaryPart!.Position;
		
		// Calculate distance to next target (pickup if no pizza, delivery if have pizza)
		const targetPos = this.hasPizza 
			? this.currentDelivery.deliveryLocation.position
			: this.currentDelivery.pickupLocation.position;
			
		const distance = vehiclePos.sub(targetPos).Magnitude;
		const distanceMeters = math.floor(distance);
		
		// Update HUD with distance
		this.hud.updateDeliveryInfo(this.currentDelivery, distanceMeters, this.hasPizza);
	}

	private updateDeliveryArrow(): void {
		if (!this.deliveryArrow || !this.currentDelivery || !this.vehicle) return;

		const vehiclePos = this.vehicle.PrimaryPart!.Position;
		const targetPos = this.currentDelivery.deliveryLocation.position;
		const direction = targetPos.sub(vehiclePos);
		const distance = direction.Magnitude;

		// Position arrow above vehicle
		const arrowPos = vehiclePos.add(new Vector3(0, 15, 0)).add(direction.Unit.mul(10));
		this.deliveryArrow.Position = arrowPos;

		// Point arrow toward target
		this.deliveryArrow.CFrame = new CFrame(arrowPos, targetPos);

		// Update distance label
		const billboard = this.deliveryArrow.FindFirstChild("BillboardGui") as BillboardGui;
		if (billboard) {
			const label = billboard.FindFirstChild("TextLabel") as TextLabel;
			if (label) {
				label.Text = `${math.floor(distance)}m`;
			}
		}
	}

	private checkZones(): void {
		if (!this.vehicle) {
			return;
		}
		
		if (!this.currentDelivery) {
			// Don't spam, but mention it occasionally
			return;
		}

		// CRITICAL: Check if vehicle has PrimaryPart
		if (!this.vehicle.PrimaryPart) {
			print(`[GameManager] ❌ checkZones: Vehicle ${this.vehicle.Name} has no PrimaryPart!`);
			
			// Try to find the VehicleSeat as fallback
			const seat = this.vehicle.FindFirstChildWhichIsA("VehicleSeat", true);
			if (seat) {
				print(`[GameManager] 🪑 Using VehicleSeat position as fallback: (${seat.Position.X}, ${seat.Position.Y}, ${seat.Position.Z})`);
				const vehiclePos = seat.Position;
				this.checkZonesWithPosition(vehiclePos);
			}
			return;
		}

		const vehiclePos = this.vehicle.PrimaryPart.Position;
		this.checkZonesWithPosition(vehiclePos);
	}

	private checkZonesWithPosition(vehiclePos: Vector3): void {
		if (!this.currentDelivery) return;
		const pickupPos = this.currentDelivery.pickupLocation.position;
		const deliveryPos = this.currentDelivery.deliveryLocation.position;

		// Check pickup zone (only X/Z distance, HUGE radius for testing!)
		const pickupDistance = new Vector3(
			vehiclePos.X - pickupPos.X,
			0,
			vehiclePos.Z - pickupPos.Z
		).Magnitude;
		
		// ALWAYS show pickup distance if we don't have pizza
		if (!this.hasPizza) {
			print(`[GameManager] 📍 Pickup: ${math.floor(pickupDistance)}m away (need <40m)`);
		}
		
		const wasInPickup = this.isInPickupZone;
		this.isInPickupZone = pickupDistance < 40; // Reasonable zone - 40 studs

		if (this.isInPickupZone && !wasInPickup && !this.hasPizza) {
			// Just entered pickup zone and don't have pizza yet
			print(`[GameManager] ✅✅✅ PICKUP! Distance: ${pickupDistance}`);
			print(`[GameManager] 🎯 Now drive to: ${this.currentDelivery.deliveryLocation.name}`);
			this.hasPizza = true;
			this.hud.setPizzaPickedUp(true);
			this.hud.showNotification("🍕 PIZZA PICKED UP! Now deliver it!", 2.5);
		}

		// Check delivery zone ONLY if we have pizza (don't check both in same frame!)
		if (!this.hasPizza) {
			return; // Stop here if no pizza - don't check delivery zone
		}

		// Check delivery zone (only X/Z distance)
		const deliveryDistance = new Vector3(
			vehiclePos.X - deliveryPos.X,
			0,
			vehiclePos.Z - deliveryPos.Z
		).Magnitude;
		
		// ALWAYS show delivery distance if we have pizza
		print(`[GameManager] 📦 Delivery: ${math.floor(deliveryDistance)}m away (need <40m) to ${this.currentDelivery.deliveryLocation.name}`);
		
		const wasInDelivery = this.isInDeliveryZone;
		this.isInDeliveryZone = deliveryDistance < 40; // Reasonable zone - 40 studs

		if (this.isInDeliveryZone && !wasInDelivery && this.hasPizza) {
			// In delivery zone with pizza - complete delivery
			print(`[GameManager] ✅✅✅ DELIVERY COMPLETE! Distance: ${deliveryDistance}`);
			
			// INSTANT EFFECTS! Trigger IMMEDIATELY!
			if (this.effectsManager && this.vehicle) {
				warn("🎆🎆🎆 INSTANT EFFECTS TRIGGERED!");
				const vehiclePos = this.vehicle.PrimaryPart?.Position || this.vehicle.GetPivot().Position;
				this.effectsManager.playDeliveryCompleteEffect(vehiclePos, true);
			}
			
			this.completeDelivery();
		}
	}

	private onDeliveryStarted(task: DeliveryTask): void {
		print(`[GameManager] 📦 onDeliveryStarted called!`);
		print(`[GameManager] Pickup: ${task.pickupLocation.name} at (${task.pickupLocation.position.X}, ${task.pickupLocation.position.Z})`);
		print(`[GameManager] Delivery: ${task.deliveryLocation.name} at (${task.deliveryLocation.position.X}, ${task.deliveryLocation.position.Z})`);
		
		this.currentDelivery = task;
		this.isInPickupZone = false;
		this.isInDeliveryZone = false;
		this.hasPizza = false;

		// Update pizza status
		this.hud.setPizzaPickedUp(false);

		// Start timer
		this.timerManager.startTimer(task);

		// Show delivery info
		this.hud.showDeliveryInfo(task);
		
		// Clear instructions for first delivery
		if (this.isFirstDelivery) {
			this.hud.showNotification(`🚗 Hold W to drive! Go to the RED marker first!`, 5);
		} else {
			this.hud.showNotification(`NEW DELIVERY: Get pizza, deliver to ${task.deliveryLocation.name}`, 3);
		}

		// No delivery arrow - using HUD distance only

		print(`[GameManager] ✅ Delivery setup complete! Ready to check zones.`);
	}

	private onDeliveryCompleted(result: DeliveryResult): void {
		warn("🎯🎯🎯 onDeliveryCompleted() FUNCTION CALLED!");
		warn("Success: " + tostring(result.success));
		warn("Total tip: $" + tostring(result.totalTip));
		
		// Stop timer
		this.timerManager.stopTimer();

		// SAVE DELIVERY POSITION FIRST!
		const deliveryPosition = this.currentDelivery?.deliveryLocation.position;
		warn("Delivery position: " + tostring(deliveryPosition));

		// Reset pizza status
		this.hasPizza = false;
		this.hud.setPizzaPickedUp(false);

		// Hide delivery info
		this.hud.hideDeliveryInfo();

		// Remove arrow
		if (this.deliveryArrow) {
			this.deliveryArrow.Destroy();
			this.deliveryArrow = undefined;
		}

		// Show result
		if (result.success) {
			warn("✅✅✅ DELIVERY WAS SUCCESSFUL!");
			this.hud.showNotification(`✅ DELIVERY COMPLETE! +$${result.totalTip}`, 3);
			this.scoreTracker.recordDelivery(true);
			
			// Effects already played instantly on zone entry!
		} else {
			warn("❌ DELIVERY FAILED!");
			this.hud.showNotification("❌ DELIVERY FAILED! TIME RAN OUT!", 3);
			this.scoreTracker.recordDelivery(false);
		}

		this.currentDelivery = undefined;

		// Request new delivery after a short delay
		task.wait(3);
		this.requestNewDelivery();
	}

	private onScoreUpdated(score: PlayerScore): void {
		this.hud.updateScore(score.totalScore);
		print(`[GameManager] Score updated: $${score.totalScore}, Deliveries: ${score.deliveriesCompleted}`);
	}

	public requestNewDelivery(): void {
		print("[GameManager] 📤 requestNewDelivery() called");
		const event = this.remoteEvents.get("RequestNewDelivery");
		if (event) {
			print("[GameManager] 📤 Firing RequestNewDelivery to server...");
			event.FireServer();
			print("[GameManager] ✅ Delivery request sent!");
		} else {
			print("[GameManager] ❌ ERROR: RequestNewDelivery event not found!");
		}
	}

	private completeDelivery(): void {
		const event = this.remoteEvents.get("CompleteDelivery")!;
		event.FireServer();

		// Report drift bonus if any
		if (this.driftManager) {
			const driftBonus = this.driftManager.getTotalDriftBonus();
			if (driftBonus > 0) {
				const reportEvent = this.remoteEvents.get("ReportDrift")!;
				reportEvent.FireServer(driftBonus);
				this.driftManager.resetTotalBonus();
			}
		}
	}

	public destroy(): void {
		this.timerManager.destroy();
		this.hud.destroy();
		if (this.vehicleController) this.vehicleController.destroy();
		if (this.driftManager) this.driftManager.destroy();
		if (this.effectsManager) this.effectsManager.destroy();
		if (this.deliveryArrow) this.deliveryArrow.Destroy();
	}
}
