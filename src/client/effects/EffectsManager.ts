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
		warn("🎉🎉🎉 DELIVERY EFFECT TRIGGERED!");
		
		if (success) {
			// MASSIVE FIREWORKS EXPLOSION AT VEHICLE!
			const vehiclePos = this.vehicle.PrimaryPart?.Position || this.vehicle.GetPivot().Position;
			warn("💥 CREATING HUGE EXPLOSION AT VEHICLE: " + tostring(vehiclePos));
			
			this.createMassiveExplosion(vehiclePos);
			this.createScreenFlash();
			
			// 3 expansion rings
			for (let i = 0; i < 3; i++) {
				task.wait(0.15);
				this.createExpansionRing(vehiclePos, new Color3(1, 0.8, 0));
			}
		} else {
			// Failure smoke
			this.createFailureSmoke(position);
		}
	}

	private createMassiveExplosion(position: Vector3): void {
		warn("💥💥💥 CREATING MASSIVE EXPLOSION!");
		
		// Create explosion effect part
		const explosionPart = new Instance("Part");
		explosionPart.Size = new Vector3(1, 1, 1);
		explosionPart.Position = position.add(new Vector3(0, 10, 0));
		explosionPart.Anchored = true;
		explosionPart.CanCollide = false;
		explosionPart.Transparency = 1;
		explosionPart.Parent = game.Workspace;

		const attachment = new Instance("Attachment");
		attachment.Parent = explosionPart;

		// HUGE golden sparkle burst
		const sparkles = new Instance("ParticleEmitter");
		sparkles.Texture = "rbxasset://textures/particles/sparkles_main.dds";
		sparkles.Rate = 0;
		sparkles.Lifetime = new NumberRange(1.5, 3);
		sparkles.Speed = new NumberRange(60, 120);
		sparkles.SpreadAngle = new Vector2(180, 180);
		sparkles.Color = new ColorSequence([
			new ColorSequenceKeypoint(0, new Color3(1, 1, 0)),
			new ColorSequenceKeypoint(0.5, new Color3(1, 0.5, 0)),
			new ColorSequenceKeypoint(1, new Color3(1, 0, 0)),
		]);
		sparkles.Size = new NumberSequence([
			new NumberSequenceKeypoint(0, 4),
			new NumberSequenceKeypoint(1, 0),
		]);
		sparkles.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0),
			new NumberSequenceKeypoint(1, 1),
		]);
		sparkles.Rotation = new NumberRange(0, 360);
		sparkles.RotSpeed = new NumberRange(-300, 300);
		sparkles.Parent = attachment;

		// EMIT 300 SPARKLES! (even more!)
		sparkles.Emit(300);

		// Add bright point light
		const light = new Instance("PointLight");
		light.Color = new Color3(1, 0.8, 0);
		light.Brightness = 5;
		light.Range = 100;
		light.Parent = explosionPart;

		// Flash the light
		task.spawn(() => {
			for (let i = 0; i < 10; i++) {
				light.Enabled = !light.Enabled;
				task.wait(0.1);
			}
		});

		// Add sound
		const sound = new Instance("Sound");
		sound.SoundId = "rbxasset://sounds/Rocket shot.wav";
		sound.Volume = 1;
		sound.Parent = explosionPart;
		sound.Play();

		// Cleanup
		Debris.AddItem(explosionPart, 5);
		
		warn("✅ EXPLOSION CREATED!");
	}

	private createScreenFlash(): void {
		// Flash the screen white
		const Players = game.GetService("Players");
		const player = Players.LocalPlayer;
		const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

		const screenGui = new Instance("ScreenGui");
		screenGui.Parent = playerGui;

		const flash = new Instance("Frame");
		flash.Size = new UDim2(1, 0, 1, 0);
		flash.BackgroundColor3 = new Color3(1, 1, 1);
		flash.BackgroundTransparency = 0;
		flash.BorderSizePixel = 0;
		flash.Parent = screenGui;

		// Fade out
		const goal = { BackgroundTransparency: 1 };
		const tween = TweenService.Create(
			flash,
			new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
			goal
		);
		tween.Play();

		// Cleanup
		Debris.AddItem(screenGui, 1);
	}

	private createConfettiExplosion(position: Vector3): void {
		const part = new Instance("Part");
		part.Size = new Vector3(1, 1, 1);
		part.Position = position.add(new Vector3(0, 5, 0));
		part.Anchored = true;
		part.CanCollide = false;
		part.Transparency = 1;
		part.Parent = game.Workspace;

		const attachment = new Instance("Attachment");
		attachment.Parent = part;

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

		confetti.Emit(80); // MORE confetti!

		// Cleanup
		Debris.AddItem(part, 4);
	}

	private createFailureSmoke(position: Vector3): void {
		const part = new Instance("Part");
		part.Size = new Vector3(1, 1, 1);
		part.Position = position.add(new Vector3(0, 5, 0));
		part.Anchored = true;
		part.CanCollide = false;
		part.Transparency = 1;
		part.Parent = game.Workspace;

		const attachment = new Instance("Attachment");
		attachment.Parent = part;

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
		// Create a HUGE glowing arrow above the delivery location
		
		// Main arrow shaft (vertical beam)
		const shaft = new Instance("Part");
		shaft.Name = "DeliveryArrow";
		shaft.Size = new Vector3(4, 50, 4); // Tall vertical beam
		shaft.Position = targetPosition.add(new Vector3(0, 100, 0)); // High above
		shaft.Anchored = true;
		shaft.CanCollide = false;
		shaft.Color = new Color3(1, 1, 0); // Bright yellow
		shaft.Material = Enum.Material.Neon;
		shaft.Transparency = 0;
		shaft.Parent = game.Workspace;

		// Arrow head pointing DOWN (cone shape)
		const cone = new Instance("Part");
		cone.Name = "ArrowHead";
		cone.Size = new Vector3(20, 25, 20); // Big cone
		cone.Position = targetPosition.add(new Vector3(0, 60, 0)); // Below shaft
		cone.Anchored = true;
		cone.CanCollide = false;
		cone.Color = new Color3(1, 0.5, 0); // Orange
		cone.Material = Enum.Material.Neon;
		cone.Transparency = 0.1;
		cone.Parent = shaft; // Parent to shaft so they move together

		// Make it a cone pointing down
		const mesh = new Instance("SpecialMesh");
		mesh.MeshType = Enum.MeshType.FileMesh;
		mesh.MeshId = "rbxasset://fonts/cone.mesh";
		mesh.Scale = new Vector3(1.5, 2, 1.5);
		mesh.Parent = cone;
		cone.CFrame = cone.CFrame.mul(CFrame.Angles(math.pi, 0, 0)); // Point down

		// Pulsing glow sphere
		const glow = new Instance("Part");
		glow.Name = "Glow";
		glow.Shape = Enum.PartType.Ball;
		glow.Size = new Vector3(15, 15, 15);
		glow.Position = targetPosition.add(new Vector3(0, 70, 0));
		glow.Anchored = true;
		glow.CanCollide = false;
		glow.Color = new Color3(1, 0, 0); // Red
		glow.Material = Enum.Material.Neon;
		glow.Transparency = 0.3;
		glow.Parent = shaft;

		// Add spinning and pulsing animation
		task.spawn(() => {
			while (shaft && shaft.Parent) {
				// Rotate around Y axis
				shaft.CFrame = shaft.CFrame.mul(CFrame.Angles(0, 0.03, 0));
				
				// Pulse the glow
				const pulse = 0.3 + math.sin(os.clock() * 4) * 0.2;
				glow.Transparency = pulse;
				
				// Bob up and down slightly
				const bob = math.sin(os.clock() * 2) * 5;
				shaft.Position = targetPosition.add(new Vector3(0, 100 + bob, 0));
				
				task.wait(0.03);
			}
		});

		// Add billboard label
		const billboard = new Instance("BillboardGui");
		billboard.Size = new UDim2(0, 300, 0, 80);
		billboard.StudsOffset = new Vector3(0, 15, 0);
		billboard.AlwaysOnTop = true;
		billboard.Parent = glow;

		const label = new Instance("TextLabel");
		label.Size = new UDim2(1, 0, 1, 0);
		label.BackgroundTransparency = 1;
		label.Text = "⬇️ DELIVER HERE ⬇️";
		label.TextColor3 = new Color3(1, 1, 1);
		label.TextScaled = true;
		label.Font = Enum.Font.GothamBold;
		label.TextStrokeTransparency = 0;
		label.TextStrokeColor3 = new Color3(0, 0, 0);
		label.Parent = billboard;

		return shaft;
	}

	public destroy(): void {
		// Cleanup any persistent effects if needed
	}
}
