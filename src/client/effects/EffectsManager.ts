// Visual effects for jumps, deliveries, and other game events

import { TweenService, Debris } from "@rbxts/services";

export class EffectsManager {
	private vehicle: Model;

	constructor(vehicle: Model) {
		this.vehicle = vehicle;
	}

	public playJumpEffect(): void {
		const primaryPart = this.vehicle.PrimaryPart;
		if (!primaryPart) return;

		// Create jump trail particles
		const attachment = new Instance("Attachment");
		attachment.Position = new Vector3(0, -2, 0);
		attachment.Parent = primaryPart;

		// Sparkles for jump boost
		const sparkles = new Instance("ParticleEmitter");
		sparkles.Texture = "rbxasset://textures/particles/sparkles_main.dds";
		sparkles.Rate = 100;
		sparkles.Lifetime = new NumberRange(0.5, 1);
		sparkles.Speed = new NumberRange(10, 20);
		sparkles.SpreadAngle = new Vector2(180, 180);
		sparkles.Color = new ColorSequence([
			new ColorSequenceKeypoint(0, new Color3(1, 1, 0.2)),
			new ColorSequenceKeypoint(1, new Color3(1, 0.5, 0.2)),
		]);
		sparkles.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0),
			new NumberSequenceKeypoint(1, 1),
		]);
		sparkles.Size = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.5),
			new NumberSequenceKeypoint(1, 0),
		]);
		sparkles.EmissionDirection = Enum.NormalId.Bottom;
		sparkles.Parent = attachment;

		// Create trail
		const trail = new Instance("Trail");
		trail.Attachment0 = attachment;
		trail.Attachment1 = attachment;
		trail.Lifetime = 0.8;
		trail.MinLength = 0;
		trail.Color = new ColorSequence([
			new ColorSequenceKeypoint(0, new Color3(1, 1, 0.5)),
			new ColorSequenceKeypoint(1, new Color3(1, 0.5, 0)),
		]);
		trail.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.3),
			new NumberSequenceKeypoint(1, 1),
		]);
		trail.WidthScale = new NumberSequence([
			new NumberSequenceKeypoint(0, 1),
			new NumberSequenceKeypoint(1, 0.5),
		]);
		trail.FaceCamera = true;
		trail.Parent = attachment;

		// Cleanup after a few seconds
		Debris.AddItem(attachment, 2);
	}

	public playLandingEffect(): void {
		const primaryPart = this.vehicle.PrimaryPart;
		if (!primaryPart) return;

		// Ground impact particles
		const attachment = new Instance("Attachment");
		attachment.Position = new Vector3(0, -2, 0);
		attachment.Parent = primaryPart;

		const impact = new Instance("ParticleEmitter");
		impact.Texture = "rbxasset://textures/particles/smoke_main.dds";
		impact.Rate = 0;
		impact.Lifetime = new NumberRange(0.3, 0.6);
		impact.Speed = new NumberRange(20, 40);
		impact.SpreadAngle = new Vector2(60, 0);
		impact.Color = new ColorSequence(new Color3(0.5, 0.5, 0.5));
		impact.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.5),
			new NumberSequenceKeypoint(1, 1),
		]);
		impact.Size = new NumberSequence([
			new NumberSequenceKeypoint(0, 2),
			new NumberSequenceKeypoint(1, 4),
		]);
		impact.EmissionDirection = Enum.NormalId.Top;
		impact.Parent = attachment;

		// Emit burst
		impact.Emit(15);

		// Cleanup
		Debris.AddItem(attachment, 1);
	}

	public playDeliveryCompleteEffect(position: Vector3, success: boolean): void {
		// Create celebration particles at delivery location
		const part = new Instance("Part");
		part.Size = new Vector3(1, 1, 1);
		part.Position = position.add(new Vector3(0, 5, 0));
		part.Anchored = true;
		part.CanCollide = false;
		part.Transparency = 1;
		part.Parent = game.Workspace;

		const attachment = new Instance("Attachment");
		attachment.Parent = part;

		if (success) {
			// Success: Confetti explosion
			const confetti = new Instance("ParticleEmitter");
			confetti.Texture = "rbxasset://textures/particles/sparkles_main.dds";
			confetti.Rate = 0;
			confetti.Lifetime = new NumberRange(2, 3);
			confetti.Speed = new NumberRange(30, 50);
			confetti.SpreadAngle = new Vector2(180, 180);
			confetti.Color = new ColorSequence([
				new ColorSequenceKeypoint(0, new Color3(1, 0.2, 0.2)),
				new ColorSequenceKeypoint(0.5, new Color3(0.2, 1, 0.2)),
				new ColorSequenceKeypoint(1, new Color3(0.2, 0.2, 1)),
			]);
			confetti.Transparency = new NumberSequence([
				new NumberSequenceKeypoint(0, 0),
				new NumberSequenceKeypoint(1, 1),
			]);
			confetti.Size = new NumberSequence([
				new NumberSequenceKeypoint(0, 1),
				new NumberSequenceKeypoint(1, 0),
			]);
			confetti.Rotation = new NumberRange(0, 360);
			confetti.RotSpeed = new NumberRange(-200, 200);
			confetti.Parent = attachment;

			// Emit burst
			confetti.Emit(50);

			// Add ring effect
			this.createExpansionRing(position, new Color3(0.2, 1, 0.2));
		} else {
			// Failure: Smoke puff
			const smoke = new Instance("ParticleEmitter");
			smoke.Texture = "rbxasset://textures/particles/smoke_main.dds";
			smoke.Rate = 0;
			smoke.Lifetime = new NumberRange(1, 2);
			smoke.Speed = new NumberRange(10, 20);
			smoke.SpreadAngle = new Vector2(180, 180);
			smoke.Color = new ColorSequence(new Color3(0.3, 0.3, 0.3));
			smoke.Transparency = new NumberSequence([
				new NumberSequenceKeypoint(0, 0.5),
				new NumberSequenceKeypoint(1, 1),
			]);
			smoke.Size = new NumberSequence([
				new NumberSequenceKeypoint(0, 2),
				new NumberSequenceKeypoint(1, 5),
			]);
			smoke.Parent = attachment;

			smoke.Emit(20);
		}

		// Cleanup
		Debris.AddItem(part, 4);
	}

	private createExpansionRing(position: Vector3, color: Color3): void {
		const ring = new Instance("Part");
		ring.Size = new Vector3(1, 0.5, 1);
		ring.Position = position;
		ring.Anchored = true;
		ring.CanCollide = false;
		ring.Shape = Enum.PartType.Cylinder;
		ring.Orientation = new Vector3(0, 0, 90);
		ring.Color = color;
		ring.Material = Enum.Material.Neon;
		ring.Transparency = 0.5;
		ring.Parent = game.Workspace;

		// Tween expansion
		const goal = {
			Size: new Vector3(20, 0.5, 20),
			Transparency: 1,
		};

		const tween = TweenService.Create(
			ring,
			new TweenInfo(0.8, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
			goal
		);
		tween.Play();

		// Cleanup
		Debris.AddItem(ring, 1);
	}

	public playSpeedBoostEffect(): void {
		const primaryPart = this.vehicle.PrimaryPart;
		if (!primaryPart) return;

		// Speed lines effect
		const attachment = new Instance("Attachment");
		attachment.Parent = primaryPart;

		const speedLines = new Instance("ParticleEmitter");
		speedLines.Texture = "rbxasset://textures/particles/sparkles_main.dds";
		speedLines.Rate = 50;
		speedLines.Lifetime = new NumberRange(0.3, 0.5);
		speedLines.Speed = new NumberRange(0, 5);
		speedLines.SpreadAngle = new Vector2(30, 30);
		speedLines.VelocityInheritance = -1;
		speedLines.Color = new ColorSequence(new Color3(1, 1, 1));
		speedLines.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0),
			new NumberSequenceKeypoint(1, 1),
		]);
		speedLines.Size = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.3),
			new NumberSequenceKeypoint(1, 0),
		]);
		speedLines.EmissionDirection = Enum.NormalId.Back;
		speedLines.Parent = attachment;

		// Duration
		task.wait(1.5);
		speedLines.Enabled = false;

		// Cleanup
		Debris.AddItem(attachment, 2);
	}

	public createDeliveryArrow(targetPosition: Vector3): Part {
		// Create an arrow pointing toward the delivery location
		const arrow = new Instance("Part");
		arrow.Name = "DeliveryArrow";
		arrow.Size = new Vector3(2, 0.5, 4);
		arrow.Shape = Enum.PartType.Ball;
		arrow.Color = new Color3(1, 0.3, 0.3);
		arrow.Material = Enum.Material.Neon;
		arrow.CanCollide = false;
		arrow.Anchored = true;
		arrow.Transparency = 0.3;

		// Add billboard to show distance
		const billboard = new Instance("BillboardGui");
		billboard.Size = new UDim2(0, 100, 0, 40);
		billboard.StudsOffset = new Vector3(0, 3, 0);
		billboard.AlwaysOnTop = true;
		billboard.Parent = arrow;

		const label = new Instance("TextLabel");
		label.Size = new UDim2(1, 0, 1, 0);
		label.BackgroundTransparency = 1;
		label.Text = "0m";
		label.TextColor3 = new Color3(1, 1, 1);
		label.TextScaled = true;
		label.Font = Enum.Font.GothamBold;
		label.TextStrokeTransparency = 0.5;
		label.Parent = billboard;

		return arrow;
	}

	public destroy(): void {
		// Cleanup any persistent effects if needed
	}
}
