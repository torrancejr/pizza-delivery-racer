// Auto-flip service - flips vehicles that are upside down or on their side

import { RunService } from "@rbxts/services";

export class VehicleAutoFlip {
	private vehicle: Model;
	private checkInterval = 0.5; // Check every 0.5 seconds
	private lastCheckTime = 0;
	private flipCooldown = 2; // Don't flip more than once per 2 seconds
	private lastFlipTime = 0;

	constructor(vehicle: Model) {
		this.vehicle = vehicle;
		this.startMonitoring();
	}

	private startMonitoring(): void {
		RunService.Heartbeat.Connect((deltaTime) => {
			this.lastCheckTime += deltaTime;

			if (this.lastCheckTime >= this.checkInterval) {
				this.lastCheckTime = 0;
				this.checkAndFlip();
			}
		});
	}

	private checkAndFlip(): void {
		const primaryPart = this.vehicle.PrimaryPart;
		if (!primaryPart) return;

		// Check if vehicle is upside down or on its side
		const upVector = primaryPart.CFrame.UpVector;

		// If the up vector is pointing mostly down or sideways, flip the vehicle
		const isUpsideDown = upVector.Y < -0.3; // More than 30 degrees upside down
		const isOnSide = math.abs(upVector.Y) < 0.3; // Less than 30 degrees upright

		if ((isUpsideDown || isOnSide) && this.shouldFlip()) {
			this.flipVehicle();
		}
	}

	private shouldFlip(): boolean {
		const currentTime = os.clock();
		const timeSinceLastFlip = currentTime - this.lastFlipTime;

		// Only flip if cooldown has passed
		return timeSinceLastFlip >= this.flipCooldown;
	}

	private flipVehicle(): void {
		const primaryPart = this.vehicle.PrimaryPart;
		if (!primaryPart) return;

		// Get current position and rotation
		const currentPos = primaryPart.Position;
		const currentCFrame = primaryPart.CFrame;

		// Create new CFrame that's upright
		// Keep X and Z rotation zero, preserve Y rotation (heading)
		const lookVector = currentCFrame.LookVector;
		const heading = math.atan2(lookVector.X, lookVector.Z);

		// New upright CFrame at same position, slightly elevated
		const newCFrame = new CFrame(currentPos.add(new Vector3(0, 3, 0))).mul(
			CFrame.Angles(0, heading, 0)
		);

		// Set all velocities to zero to stop tumbling
		if (primaryPart.AssemblyLinearVelocity) {
			primaryPart.AssemblyLinearVelocity = new Vector3(0, 0, 0);
		}
		if (primaryPart.AssemblyAngularVelocity) {
			primaryPart.AssemblyAngularVelocity = new Vector3(0, 0, 0);
		}

		// Apply the new CFrame
		this.vehicle.SetPrimaryPartCFrame(newCFrame);

		this.lastFlipTime = os.clock();

		print(`[VehicleAutoFlip] Flipped vehicle upright`);
	}

	public destroy(): void {
		// Cleanup if needed
	}
}
