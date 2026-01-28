// Vehicle controller - speed tracking and game features only (CarScript handles driving)

import { VehicleConfig } from "shared/module";
import { UserInputService, RunService } from "@rbxts/services";

export class VehicleController {
	private vehicle: Model;
	private seat: VehicleSeat;
	private primaryPart: BasePart;

	private isDrifting = false;
	private currentSpeed = 0;

	// Input tracking for game features (drift, jump)
	private keysPressed = new Set<Enum.KeyCode>();

	// Drift tracking
	private driftStartTime?: number;
	public onDriftStart?: () => void;
	public onDriftEnd?: (duration: number) => void;

	// Jump tracking
	public onJump?: () => void;

	constructor(vehicle: Model) {
		this.vehicle = vehicle;
		this.primaryPart = vehicle.PrimaryPart!;
		
		// Find ANY VehicleSeat in the vehicle (works with premade cars!)
		const vehicleSeat = vehicle.FindFirstChildWhichIsA("VehicleSeat", true); // true = recursive search
		
		if (!vehicleSeat) {
			error("No VehicleSeat found in vehicle!");
		}
		
		this.seat = vehicleSeat as VehicleSeat;
		print(`[VehicleController] Found VehicleSeat: ${this.seat.Name}`);
		print(`[VehicleController] Using CarScript for driving - tracking speed only!`);

		this.setupInput();
		this.startPhysicsLoop();
	}

	private setupInput(): void {
		// Only track Shift for drift feature
		UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (gameProcessed) return;

			this.keysPressed.add(input.KeyCode);

			// Shift for drift
			if (input.KeyCode === Enum.KeyCode.LeftShift || input.KeyCode === Enum.KeyCode.RightShift) {
				this.startDrift();
			}
		});

		UserInputService.InputEnded.Connect((input) => {
			this.keysPressed.delete(input.KeyCode);

			// Release drift
			if (input.KeyCode === Enum.KeyCode.LeftShift || input.KeyCode === Enum.KeyCode.RightShift) {
				this.endDrift();
			}
		});
	}

	private startPhysicsLoop(): void {
		RunService.RenderStepped.Connect(() => {
			this.updateSpeed();
		});
	}

	private updateSpeed(): void {
		// Track speed from either PrimaryPart or VehicleSeat
		let velocity = this.primaryPart.AssemblyLinearVelocity;
		
		// If PrimaryPart has no velocity, try the VehicleSeat
		if (velocity.Magnitude < 0.1) {
			velocity = this.seat.AssemblyLinearVelocity;
		}
		
		this.currentSpeed = new Vector3(velocity.X, 0, velocity.Z).Magnitude;
	}

	private startDrift(): void {
		if (!this.isDrifting) {
			this.isDrifting = true;
			this.driftStartTime = os.clock();

			if (this.onDriftStart) {
				this.onDriftStart();
			}
		}
	}

	private endDrift(): void {
		if (this.isDrifting && this.driftStartTime !== undefined) {
			this.isDrifting = false;
			const driftDuration = os.clock() - this.driftStartTime;

			// Only count as valid drift if it lasted at least 0.5 seconds
			if (driftDuration >= 0.5 && this.onDriftEnd) {
				this.onDriftEnd(driftDuration);
			}

			this.driftStartTime = undefined;
		}
	}

	public getCurrentSpeed(): number {
		return this.currentSpeed;
	}

	public isDriftingActive(): boolean {
		return this.isDrifting;
	}

	public destroy(): void {
		// Nothing to clean up - CarScript handles driving
	}
}
