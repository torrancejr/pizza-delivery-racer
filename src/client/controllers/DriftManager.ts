// Drift scoring and visual feedback system

import { RunService, ReplicatedStorage } from "@rbxts/services";
import { GameConfig } from "shared/module";

export class DriftManager {
	private vehicle: Model;
	private isDrifting = false;
	private driftStartTime?: number;
	private currentDriftScore = 0;
	private totalDriftBonus = 0;

	// Visual effects
	private leftTrail?: Trail;
	private rightTrail?: Trail;
	private driftParticles: ParticleEmitter[] = [];

	// Callbacks
	public onDriftScoreUpdate?: (score: number) => void;
	public onDriftComplete?: (totalScore: number, duration: number) => void;

	constructor(vehicle: Model) {
		this.vehicle = vehicle;
		this.setupVisualEffects();
	}

	private setupVisualEffects(): void {
		// Find wheels or create attachment points
		const primaryPart = this.vehicle.PrimaryPart!;

		// Create drift trails for the rear wheels
		const leftAttachment = new Instance("Attachment");
		leftAttachment.Name = "LeftDriftAttachment";
		leftAttachment.Position = new Vector3(-3, -2, -4);
		leftAttachment.Parent = primaryPart;

		const rightAttachment = new Instance("Attachment");
		rightAttachment.Name = "RightDriftAttachment";
		rightAttachment.Position = new Vector3(3, -2, -4);
		rightAttachment.Parent = primaryPart;

		// Create trails
		this.leftTrail = this.createDriftTrail(leftAttachment);
		this.rightTrail = this.createDriftTrail(rightAttachment);

		// Create particle emitters for tire smoke
		const leftSmoke = this.createSmokeParticle();
		leftSmoke.Parent = leftAttachment;
		this.driftParticles.push(leftSmoke);

		const rightSmoke = this.createSmokeParticle();
		rightSmoke.Parent = rightAttachment;
		this.driftParticles.push(rightSmoke);

		// Start disabled
		this.setEffectsEnabled(false);
	}

	private createDriftTrail(attachment: Attachment): Trail {
		const trail = new Instance("Trail");
		trail.Attachment0 = attachment;
		trail.Attachment1 = attachment;
		trail.Lifetime = 0.5;
		trail.MinLength = 0.1;
		trail.Color = new ColorSequence([
			new ColorSequenceKeypoint(0, new Color3(0.2, 0.2, 0.2)),
			new ColorSequenceKeypoint(1, new Color3(0.5, 0.5, 0.5)),
		]);
		trail.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.3),
			new NumberSequenceKeypoint(1, 1),
		]);
		trail.WidthScale = new NumberSequence([
			new NumberSequenceKeypoint(0, 1),
			new NumberSequenceKeypoint(1, 0),
		]);
		trail.FaceCamera = true;
		trail.Enabled = false;
		trail.Parent = attachment;
		return trail;
	}

	private createSmokeParticle(): ParticleEmitter {
		const emitter = new Instance("ParticleEmitter");
		emitter.Texture = "rbxasset://textures/particles/smoke_main.dds";
		emitter.Rate = 50;
		emitter.Lifetime = new NumberRange(0.5, 1);
		emitter.Speed = new NumberRange(5, 10);
		emitter.SpreadAngle = new Vector2(30, 30);
		emitter.Color = new ColorSequence(new Color3(0.3, 0.3, 0.3));
		emitter.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.5),
			new NumberSequenceKeypoint(1, 1),
		]);
		emitter.Size = new NumberSequence([
			new NumberSequenceKeypoint(0, 1),
			new NumberSequenceKeypoint(1, 3),
		]);
		emitter.Rotation = new NumberRange(0, 360);
		emitter.RotSpeed = new NumberRange(-100, 100);
		emitter.Enabled = false;
		return emitter;
	}

	private setEffectsEnabled(enabled: boolean): void {
		if (this.leftTrail) this.leftTrail.Enabled = enabled;
		if (this.rightTrail) this.rightTrail.Enabled = enabled;

		this.driftParticles.forEach((particle) => {
			particle.Enabled = enabled;
		});
	}

	public startDrift(): void {
		if (!this.isDrifting) {
			this.isDrifting = true;
			this.driftStartTime = os.clock();
			this.currentDriftScore = 0;
			this.setEffectsEnabled(true);

			// Start score update loop
			this.updateDriftScore();
		}
	}

	public endDrift(): void {
		if (this.isDrifting && this.driftStartTime !== undefined) {
			this.isDrifting = false;
			const duration = os.clock() - this.driftStartTime;

			// Calculate final score
			const finalScore = math.floor(duration * GameConfig.DRIFT_BONUS_PER_SECOND);
			this.totalDriftBonus += finalScore;

			// Disable effects
			this.setEffectsEnabled(false);

			// Trigger callback
			if (this.onDriftComplete && duration >= 0.5) {
				this.onDriftComplete(finalScore, duration);
			}

			this.driftStartTime = undefined;
			this.currentDriftScore = 0;
		}
	}

	private updateDriftScore(): void {
		if (!this.isDrifting || this.driftStartTime === undefined) return;

		const duration = os.clock() - this.driftStartTime;
		this.currentDriftScore = math.floor(duration * GameConfig.DRIFT_BONUS_PER_SECOND);

		// Update UI
		if (this.onDriftScoreUpdate) {
			this.onDriftScoreUpdate(this.currentDriftScore);
		}

		// Continue updating
		if (this.isDrifting) {
			task.wait(0.1);
			this.updateDriftScore();
		}
	}

	public getCurrentDriftScore(): number {
		return this.currentDriftScore;
	}

	public getTotalDriftBonus(): number {
		return this.totalDriftBonus;
	}

	public resetTotalBonus(): void {
		this.totalDriftBonus = 0;
	}

	public destroy(): void {
		this.setEffectsEnabled(false);

		if (this.leftTrail) this.leftTrail.Destroy();
		if (this.rightTrail) this.rightTrail.Destroy();

		this.driftParticles.forEach((particle) => particle.Destroy());
		this.driftParticles = [];
	}
}
