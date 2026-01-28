// Main game HUD with arcade-style UI

import { Players, TweenService, Workspace } from "@rbxts/services";
import { DeliveryTask, PlayerScore } from "shared/module";

export class GameHUD {
	private player: Player;
	private screenGui: ScreenGui;

	// UI Elements
	private timerLabel?: TextLabel;
	private timerBar?: Frame;
	private scoreLabel?: TextLabel;
	private speedometerLabel?: TextLabel;
	private deliveryInfoFrame?: Frame;
	private deliveryNameLabel?: TextLabel;
	private deliveryDistanceLabel?: TextLabel;
	private driftScoreLabel?: TextLabel;
	private comboLabel?: TextLabel;
	private notificationLabel?: TextLabel;
	private pizzaStatusFrame?: Frame;
	private pizzaStatusLabel?: TextLabel;
	private pizzaStatusIcon?: TextLabel;
	private instructionsFrame?: Frame;
	private instructionsLabel?: TextLabel;
	private directionArrow?: ImageLabel;
	private moneyDigits: TextLabel[] = [];

	constructor() {
		this.player = Players.LocalPlayer;
		this.screenGui = new Instance("ScreenGui");
		this.screenGui.Name = "PizzaDeliveryHUD";
		this.screenGui.ResetOnSpawn = false;
		this.screenGui.Parent = this.player.WaitForChild("PlayerGui");

		this.createHUD();
	}

	private createHUD(): void {
		// Timer at top left (Crazy Taxi style)
		this.createTimer();

		// Slot machine money display at top right
		this.createMoneyDisplay();

		// Big green directional arrow at top center
		this.createDirectionArrow();

		// Speedometer at bottom right
		this.createSpeedometer();

		// Delivery info at bottom left
		this.createDeliveryInfo();

		// Drift score popup (initially hidden)
		this.createDriftScore();

		// Combo multiplier (initially hidden)
		this.createComboDisplay();

		// Notification system
		this.createNotifications();

		// Pizza status indicator
		this.createPizzaStatus();

		// Instructions panel
		this.createInstructions();
	}

	private createTimer(): void {
		// Crazy Taxi style - top left, big yellow numbers
		const container = new Instance("Frame");
		container.Name = "TimerContainer";
		container.Size = new UDim2(0, 200, 0, 100);
		container.Position = new UDim2(0, 20, 0, 20);
		container.BackgroundTransparency = 1;
		container.BorderSizePixel = 0;
		container.Parent = this.screenGui;

		// "game time" label
		const label = new Instance("TextLabel");
		label.Size = new UDim2(1, 0, 0.3, 0);
		label.BackgroundTransparency = 1;
		label.Text = "game time";
		label.TextColor3 = new Color3(1, 1, 0.2);
		label.Font = Enum.Font.GothamBold;
		label.TextSize = 16;
		label.TextXAlignment = Enum.TextXAlignment.Left;
		label.Parent = container;

		// Timer label - BIG yellow numbers
		this.timerLabel = new Instance("TextLabel");
		this.timerLabel.Name = "TimerLabel";
		this.timerLabel.Size = new UDim2(1, 0, 0.7, 0);
		this.timerLabel.Position = new UDim2(0, 0, 0.3, 0);
		this.timerLabel.BackgroundTransparency = 1;
		this.timerLabel.Text = "0";
		this.timerLabel.TextColor3 = new Color3(1, 1, 0.2); // Yellow like Crazy Taxi
		this.timerLabel.TextScaled = true;
		this.timerLabel.Font = Enum.Font.GothamBold;
		this.timerLabel.TextStrokeTransparency = 0.5;
		this.timerLabel.TextStrokeColor3 = new Color3(0, 0, 0);
		this.timerLabel.TextXAlignment = Enum.TextXAlignment.Left;
		this.timerLabel.Parent = container;

		// No timer bar - Crazy Taxi doesn't have one!
		this.timerBar = undefined;
	}

	private createMoneyDisplay(): void {
		// Slot machine style money display - top right like Crazy Taxi
		const container = new Instance("Frame");
		container.Name = "MoneyContainer";
		container.Size = new UDim2(0, 250, 0, 100);
		container.Position = new UDim2(1, -270, 0, 20);
		container.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
		container.BackgroundTransparency = 0.2;
		container.BorderSizePixel = 3;
		container.BorderColor3 = new Color3(0.8, 0.8, 0.8);
		container.Parent = this.screenGui;

		const corner = new Instance("UICorner");
		corner.CornerRadius = new UDim(0, 8);
		corner.Parent = container;

		// "TIPS" label
		const fareLabel = new Instance("TextLabel");
		fareLabel.Size = new UDim2(1, 0, 0.25, 0);
		fareLabel.BackgroundTransparency = 1;
		fareLabel.Text = "💰 TIPS";
		fareLabel.TextColor3 = new Color3(1, 0.8, 0.2);
		fareLabel.Font = Enum.Font.GothamBold;
		fareLabel.TextSize = 16;
		fareLabel.Parent = container;

		// Money display frame (slot machine style)
		const moneyFrame = new Instance("Frame");
		moneyFrame.Name = "MoneyFrame";
		moneyFrame.Size = new UDim2(0.9, 0, 0.6, 0);
		moneyFrame.Position = new UDim2(0.05, 0, 0.3, 0);
		moneyFrame.BackgroundColor3 = new Color3(0, 0, 0);
		moneyFrame.BorderSizePixel = 2;
		moneyFrame.BorderColor3 = new Color3(0.6, 0.6, 0.6);
		moneyFrame.Parent = container;

		// Dollar sign
		const dollarSign = new Instance("TextLabel");
		dollarSign.Size = new UDim2(0.15, 0, 1, 0);
		dollarSign.BackgroundTransparency = 1;
		dollarSign.Text = "$";
		dollarSign.TextColor3 = new Color3(0.2, 1, 0.3); // Green
		dollarSign.Font = Enum.Font.Code;
		dollarSign.TextScaled = true;
		dollarSign.Parent = moneyFrame;

		// Individual digit displays (4 digits + decimal + 2 cents = $0000.00)
		const digitWidth = 0.11;
		const decimalWidth = 0.04;
		
		for (let i = 0; i < 6; i++) {
			const digit = new Instance("TextLabel");
			digit.Name = `Digit${i}`;
			digit.Size = new UDim2(digitWidth, 0, 1, 0);
			
			// Position: account for decimal space after 4th digit
			let xPos = 0.15 + (i * digitWidth);
			if (i >= 4) {
				// Add decimal width for digits after the decimal point
				xPos = xPos + decimalWidth;
			}
			digit.Position = new UDim2(xPos, 0, 0, 0);
			
			digit.BackgroundColor3 = new Color3(0.05, 0.05, 0.05);
			digit.BorderSizePixel = 1;
			digit.BorderColor3 = new Color3(0.3, 0.3, 0.3);
			digit.Text = "0";
			digit.TextColor3 = new Color3(0.2, 1, 0.3); // Green like Crazy Taxi
			digit.Font = Enum.Font.Code;
			digit.TextScaled = true;
			digit.Parent = moneyFrame;
			
			this.moneyDigits.push(digit);
			
			// Decimal point after 4th digit (before cents)
			if (i === 3) {
				const decimal = new Instance("TextLabel");
				decimal.Size = new UDim2(decimalWidth, 0, 1, 0);
				decimal.Position = new UDim2(0.15 + (4 * digitWidth), 0, 0, 0);
				decimal.BackgroundTransparency = 1;
				decimal.Text = ".";
				decimal.TextColor3 = new Color3(0.2, 1, 0.3);
				decimal.Font = Enum.Font.Code;
				decimal.TextScaled = true;
				decimal.Parent = moneyFrame;
			}
		}
	}

	private createSpeedometer(): void {
		const container = new Instance("Frame");
		container.Name = "SpeedometerContainer";
		container.Size = new UDim2(0, 200, 0, 80);
		container.Position = new UDim2(1, -220, 1, -100);
		container.BackgroundColor3 = new Color3(0, 0, 0);
		container.BackgroundTransparency = 0.3;
		container.BorderSizePixel = 0;
		container.Parent = this.screenGui;

		const corner = new Instance("UICorner");
		corner.CornerRadius = new UDim(0, 10);
		corner.Parent = container;

		this.speedometerLabel = new Instance("TextLabel");
		this.speedometerLabel.Name = "SpeedLabel";
		this.speedometerLabel.Size = new UDim2(1, 0, 1, 0);
		this.speedometerLabel.BackgroundTransparency = 1;
		this.speedometerLabel.Text = "0 MPH";
		this.speedometerLabel.TextColor3 = new Color3(1, 1, 1);
		this.speedometerLabel.Font = Enum.Font.GothamBold;
		this.speedometerLabel.TextScaled = true;
		this.speedometerLabel.Parent = container;
	}

	private createDeliveryInfo(): void {
		// Crazy Taxi style - bottom left with destination name and distance
		this.deliveryInfoFrame = new Instance("Frame");
		this.deliveryInfoFrame.Name = "DeliveryInfo";
		this.deliveryInfoFrame.Size = new UDim2(0, 300, 0, 80);
		this.deliveryInfoFrame.Position = new UDim2(0, 20, 1, -100);
		this.deliveryInfoFrame.BackgroundTransparency = 1;
		this.deliveryInfoFrame.BorderSizePixel = 0;
		this.deliveryInfoFrame.Visible = false;
		this.deliveryInfoFrame.Parent = this.screenGui;

		// Location name - big and bold
		this.deliveryNameLabel = new Instance("TextLabel");
		this.deliveryNameLabel.Size = new UDim2(1, 0, 0.5, 0);
		this.deliveryNameLabel.BackgroundTransparency = 1;
		this.deliveryNameLabel.Text = "";
		this.deliveryNameLabel.TextColor3 = new Color3(1, 1, 1);
		this.deliveryNameLabel.Font = Enum.Font.GothamBold;
		this.deliveryNameLabel.TextSize = 24;
		this.deliveryNameLabel.TextXAlignment = Enum.TextXAlignment.Left;
		this.deliveryNameLabel.TextStrokeTransparency = 0.5;
		this.deliveryNameLabel.Parent = this.deliveryInfoFrame;

		// Distance - yellow like Crazy Taxi with "yd" suffix
		this.deliveryDistanceLabel = new Instance("TextLabel");
		this.deliveryDistanceLabel.Size = new UDim2(1, 0, 0.5, 0);
		this.deliveryDistanceLabel.Position = new UDim2(0, 0, 0.5, 0);
		this.deliveryDistanceLabel.BackgroundTransparency = 1;
		this.deliveryDistanceLabel.Text = "";
		this.deliveryDistanceLabel.TextColor3 = new Color3(1, 1, 0.2); // Yellow
		this.deliveryDistanceLabel.Font = Enum.Font.GothamBold;
		this.deliveryDistanceLabel.TextSize = 20;
		this.deliveryDistanceLabel.TextXAlignment = Enum.TextXAlignment.Left;
		this.deliveryDistanceLabel.TextStrokeTransparency = 0.5;
		this.deliveryDistanceLabel.Parent = this.deliveryInfoFrame;
	}

	private createDirectionArrow(): void {
		// Simple arrow - no background, no border
		this.directionArrow = new Instance("ImageLabel");
		this.directionArrow.Name = "DirectionArrow";
		this.directionArrow.Size = new UDim2(0, 200, 0, 200);
		this.directionArrow.Position = new UDim2(0.5, 0, 0, 80);
		this.directionArrow.AnchorPoint = new Vector2(0.5, 0.5);
		this.directionArrow.BackgroundTransparency = 1;
		this.directionArrow.Image = "";
		this.directionArrow.Visible = true;
		this.directionArrow.ZIndex = 10;
		this.directionArrow.Parent = this.screenGui;

		// MASSIVE bright green arrow
		const arrowText = new Instance("TextLabel");
		arrowText.Name = "ArrowText";
		arrowText.Size = new UDim2(1, 0, 1, 0);
		arrowText.Position = new UDim2(0.5, 0, 0.5, 0);
		arrowText.AnchorPoint = new Vector2(0.5, 0.5);
		arrowText.BackgroundTransparency = 1;
		arrowText.Text = "▲"; // Up arrow at 0°
		arrowText.TextColor3 = new Color3(0.2, 1, 0.2); // Brighter neon green
		arrowText.Font = Enum.Font.GothamBold;
		arrowText.TextSize = 150;
		arrowText.TextStrokeTransparency = 0;
		arrowText.TextStrokeColor3 = new Color3(0, 0, 0);
		arrowText.Parent = this.directionArrow;
		
		warn("[HUD] ✅ HUGE centered arrow created!");
	}

	private createDriftScore(): void {
		this.driftScoreLabel = new Instance("TextLabel");
		this.driftScoreLabel.Name = "DriftScore";
		this.driftScoreLabel.Size = new UDim2(0, 200, 0, 60);
		this.driftScoreLabel.Position = new UDim2(0.5, -100, 0.7, 0);
		this.driftScoreLabel.BackgroundTransparency = 1;
		this.driftScoreLabel.Text = "";
		this.driftScoreLabel.TextColor3 = new Color3(1, 0.5, 0);
		this.driftScoreLabel.Font = Enum.Font.GothamBold;
		this.driftScoreLabel.TextScaled = true;
		this.driftScoreLabel.TextStrokeTransparency = 0.5;
		this.driftScoreLabel.Visible = false;
		this.driftScoreLabel.Parent = this.screenGui;
	}

	private createComboDisplay(): void {
		this.comboLabel = new Instance("TextLabel");
		this.comboLabel.Name = "ComboMultiplier";
		this.comboLabel.Size = new UDim2(0, 150, 0, 50);
		this.comboLabel.Position = new UDim2(0, 20, 1, -180);
		this.comboLabel.BackgroundTransparency = 1;
		this.comboLabel.Text = "";
		this.comboLabel.TextColor3 = new Color3(1, 1, 0.2);
		this.comboLabel.Font = Enum.Font.GothamBold;
		this.comboLabel.TextScaled = true;
		this.comboLabel.TextStrokeTransparency = 0.5;
		this.comboLabel.Visible = false;
		this.comboLabel.Parent = this.screenGui;
	}

	private createNotifications(): void {
		this.notificationLabel = new Instance("TextLabel");
		this.notificationLabel.Name = "Notification";
		this.notificationLabel.Size = new UDim2(0, 500, 0, 100);
		this.notificationLabel.Position = new UDim2(0.5, -250, 0.5, -50);
		this.notificationLabel.BackgroundColor3 = new Color3(0, 0, 0);
		this.notificationLabel.BackgroundTransparency = 0.5;
		this.notificationLabel.BorderSizePixel = 0;
		this.notificationLabel.Text = "";
		this.notificationLabel.TextColor3 = new Color3(1, 1, 1);
		this.notificationLabel.Font = Enum.Font.GothamBold;
		this.notificationLabel.TextScaled = true;
		this.notificationLabel.TextStrokeTransparency = 0.5;
		this.notificationLabel.Visible = false;
		this.notificationLabel.Parent = this.screenGui;

		const corner = new Instance("UICorner");
		corner.CornerRadius = new UDim(0, 15);
		corner.Parent = this.notificationLabel;
	}

	// Update methods
	public updateTimer(timeRemaining: number, timeLimit: number): void {
		if (!this.timerLabel) return;

		// Crazy Taxi style - just show seconds remaining
		const seconds = math.floor(timeRemaining);
		this.timerLabel.Text = tostring(seconds);

		// Change color based on time remaining
		const percentage = timeRemaining / timeLimit;
		if (percentage > 0.5) {
			this.timerLabel.TextColor3 = new Color3(1, 1, 0.2); // Yellow
		} else if (percentage > 0.25) {
			this.timerLabel.TextColor3 = new Color3(1, 0.6, 0.2); // Orange
		} else {
			this.timerLabel.TextColor3 = new Color3(1, 0.2, 0.2); // Red - TIME IS RUNNING OUT!
		}
	}

	public updateScore(score: number): void {
		// Format as real money: $XXX.00 (no leading zeros on dollars)
		const dollars = math.floor(score);
		const cents = math.floor((score - dollars) * 100);
		
		// Format dollars (pad to 4 digits from the RIGHT with spaces on left)
		const dollarsStr = tostring(dollars);
		const paddedDollars = string.rep(" ", 4 - dollarsStr.size()) + dollarsStr;
		
		// Format cents (always 2 digits)
		const centsStr = string.rep("0", 2 - tostring(cents).size()) + tostring(cents);
		
		// Combine: 4 dollar digits + 2 cent digits = 6 total
		const fullDisplay = paddedDollars + centsStr;

		// Update each digit (first 4 are dollars, last 2 are cents)
		for (let i = 0; i < this.moneyDigits.size(); i++) {
			const digit = this.moneyDigits[i];
			if (digit) {
				const char = fullDisplay.sub(i + 1, i + 1);
				// Show space as blank
				digit.Text = char === " " ? "" : char;
			}
		}
	}

	public updateDirectionArrow(playerPosition: Vector3, targetPosition: Vector3): void {
		if (!this.directionArrow) {
			warn("[Arrow] ❌ directionArrow is undefined!");
			return;
		}

		// Get camera to calculate screen-relative direction
		const camera = Workspace.CurrentCamera;
		if (!camera) {
			warn("[Arrow] ❌ No camera!");
			return;
		}

		// Direction from player to target in world space
		const toTarget = targetPosition.sub(playerPosition);
		
		// Get camera's look direction (flatten to XZ plane)
		const cameraLook = camera.CFrame.LookVector;
		const cameraForward = new Vector3(cameraLook.X, 0, cameraLook.Z).Unit;
		const cameraRight = new Vector3(-cameraForward.Z, 0, cameraForward.X); // perpendicular
		
		// Project target direction onto camera's forward and right axes
		const targetFlat = new Vector3(toTarget.X, 0, toTarget.Z).Unit;
		const forward = targetFlat.Dot(cameraForward); // How much forward/backward
		const right = targetFlat.Dot(cameraRight);     // How much left/right
		
		// Calculate angle relative to camera (0° = ahead, 90° = right, 180° = behind, -90° = left)
		const angleRad = math.atan2(right, forward);
		const angleDeg = math.deg(angleRad);
		
		// Apply rotation - ▲ points up which is "forward" on screen
		this.directionArrow.Rotation = angleDeg;

		// FORCE visible
		this.directionArrow.Visible = true;
		
		// Debug occasionally
		if (math.random() < 0.02) {
			const dist = math.floor(toTarget.Magnitude);
			warn(`[Arrow] 🎯 Camera-relative: ${math.floor(angleDeg)}° (0=ahead, 90=right, 180=behind), dist=${dist}`);
		}
	}

	public hideDirectionArrow(): void {
		if (this.directionArrow) {
			this.directionArrow.Visible = false;
		}
	}

	public updateSpeed(speed: number): void {
		if (!this.speedometerLabel) return;
		const mph = math.floor(speed * 0.68); // Convert studs/s to approximate MPH
		this.speedometerLabel.Text = `${mph} MPH`;

		// Color based on speed
		if (speed > 100) {
			this.speedometerLabel.TextColor3 = new Color3(1, 0.2, 0.2); // Red for high speed
		} else if (speed > 60) {
			this.speedometerLabel.TextColor3 = new Color3(1, 1, 0.2); // Yellow
		} else {
			this.speedometerLabel.TextColor3 = new Color3(1, 1, 1); // White
		}
	}

	public showDeliveryInfo(task: DeliveryTask): void {
		if (!this.deliveryInfoFrame || !this.deliveryNameLabel || !this.deliveryDistanceLabel) return;

		this.deliveryNameLabel.Text = task.deliveryLocation.name;
		const yards = math.floor(task.distanceMeters / 0.9144);
		this.deliveryDistanceLabel.Text = `${yards}yd`;
		this.deliveryInfoFrame.Visible = true;
	}

	public updateDeliveryInfo(task: DeliveryTask, distanceMeters: number, hasPizza: boolean): void {
		// Always show the frame
		if (this.deliveryInfoFrame) {
			this.deliveryInfoFrame.Visible = true;
		}
		
		if (this.deliveryNameLabel) {
			const target = hasPizza ? task.deliveryLocation.name : task.pickupLocation.name;
			this.deliveryNameLabel.Text = target;
		}
		if (this.deliveryDistanceLabel) {
			// Crazy Taxi style - show in yards (studs ~= yards in Roblox)
			const yards = math.floor(distanceMeters);
			this.deliveryDistanceLabel.Text = `${yards}yd`;
		}
	}

	public hideDeliveryInfo(): void {
		if (this.deliveryInfoFrame) {
			this.deliveryInfoFrame.Visible = false;
		}
	}

	public showDriftScore(score: number): void {
		if (!this.driftScoreLabel) return;

		this.driftScoreLabel.Text = `+$${score} DRIFT!`;
		this.driftScoreLabel.Visible = true;

		// Animate
		const goal = { Position: new UDim2(0.5, -100, 0.6, 0) };
		const tween = TweenService.Create(
			this.driftScoreLabel,
			new TweenInfo(0.5, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
			goal
		);
		tween.Play();

		// Hide after delay
		task.wait(2);
		this.driftScoreLabel.Visible = false;
		this.driftScoreLabel.Position = new UDim2(0.5, -100, 0.7, 0);
	}

	public updateCombo(multiplier: number): void {
		if (!this.comboLabel) return;

		if (multiplier > 1) {
			this.comboLabel.Text = `${multiplier}x COMBO!`;
			this.comboLabel.Visible = true;
		} else {
			this.comboLabel.Visible = false;
		}
	}

	public showNotification(message: string, duration: number = 3): void {
		if (!this.notificationLabel) return;

		this.notificationLabel.Text = message;
		this.notificationLabel.Visible = true;

		task.wait(duration);
		this.notificationLabel.Visible = false;
	}

	private createPizzaStatus(): void {
		this.pizzaStatusFrame = new Instance("Frame");
		this.pizzaStatusFrame.Name = "PizzaStatus";
		this.pizzaStatusFrame.Size = new UDim2(0, 280, 0, 90);
		this.pizzaStatusFrame.Position = new UDim2(0, 20, 1, -200);
		this.pizzaStatusFrame.BackgroundColor3 = new Color3(0, 0, 0);
		this.pizzaStatusFrame.BackgroundTransparency = 0.3;
		this.pizzaStatusFrame.BorderSizePixel = 0;
		this.pizzaStatusFrame.Parent = this.screenGui;

		const corner = new Instance("UICorner");
		corner.CornerRadius = new UDim(0, 10);
		corner.Parent = this.pizzaStatusFrame;

		// Pizza emoji icon
		this.pizzaStatusIcon = new Instance("TextLabel");
		this.pizzaStatusIcon.Name = "Icon";
		this.pizzaStatusIcon.Size = new UDim2(0, 60, 0, 60);
		this.pizzaStatusIcon.Position = new UDim2(0, 10, 0.5, -30);
		this.pizzaStatusIcon.BackgroundTransparency = 1;
		this.pizzaStatusIcon.Text = "🍕";
		this.pizzaStatusIcon.TextScaled = true;
		this.pizzaStatusIcon.Parent = this.pizzaStatusFrame;

		// Status text
		this.pizzaStatusLabel = new Instance("TextLabel");
		this.pizzaStatusLabel.Name = "StatusText";
		this.pizzaStatusLabel.Size = new UDim2(0, 200, 1, 0);
		this.pizzaStatusLabel.Position = new UDim2(0, 75, 0, 0);
		this.pizzaStatusLabel.BackgroundTransparency = 1;
		this.pizzaStatusLabel.Text = "NO PIZZA\nGo to Pizza Shop!";
		this.pizzaStatusLabel.TextColor3 = new Color3(1, 0.5, 0.5);
		this.pizzaStatusLabel.Font = Enum.Font.GothamBold;
		this.pizzaStatusLabel.TextSize = 18;
		this.pizzaStatusLabel.TextXAlignment = Enum.TextXAlignment.Left;
		this.pizzaStatusLabel.TextYAlignment = Enum.TextYAlignment.Center;
		this.pizzaStatusLabel.Parent = this.pizzaStatusFrame;
	}

	private createInstructions(): void {
		this.instructionsFrame = new Instance("Frame");
		this.instructionsFrame.Name = "Instructions";
		this.instructionsFrame.Size = new UDim2(0, 400, 0, 200);
		this.instructionsFrame.Position = new UDim2(0.5, -200, 0.5, -100);
		this.instructionsFrame.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
		this.instructionsFrame.BackgroundTransparency = 0.2;
		this.instructionsFrame.BorderSizePixel = 0;
		this.instructionsFrame.Visible = false; // Start hidden
		this.instructionsFrame.Parent = this.screenGui;

		const corner = new Instance("UICorner");
		corner.CornerRadius = new UDim(0, 15);
		corner.Parent = this.instructionsFrame;

		// Title
		const title = new Instance("TextLabel");
		title.Size = new UDim2(1, 0, 0, 40);
		title.BackgroundTransparency = 1;
		title.Text = "🍕 PIZZA DELIVERY CONTROLS";
		title.TextColor3 = new Color3(1, 0.8, 0.2);
		title.Font = Enum.Font.GothamBold;
		title.TextSize = 20;
		title.Parent = this.instructionsFrame;

		// Instructions text
		this.instructionsLabel = new Instance("TextLabel");
		this.instructionsLabel.Name = "InstructionsText";
		this.instructionsLabel.Size = new UDim2(1, -20, 1, -50);
		this.instructionsLabel.Position = new UDim2(0, 10, 0, 45);
		this.instructionsLabel.BackgroundTransparency = 1;
		this.instructionsLabel.Text = `CONTROLS:
W/↑ = Drive Forward
A/← D/→ = Steer
Space = Jump  |  Shift = Drift

OBJECTIVE:
1. Drive to RED marker (Pizza Shop)
2. Drive through it to pick up pizza
3. Follow arrow to delivery location
4. Drive through delivery marker
5. Get paid and repeat!

Press any key to start...`;
		this.instructionsLabel.TextColor3 = new Color3(1, 1, 1);
		this.instructionsLabel.Font = Enum.Font.Gotham;
		this.instructionsLabel.TextSize = 16;
		this.instructionsLabel.TextXAlignment = Enum.TextXAlignment.Left;
		this.instructionsLabel.TextYAlignment = Enum.TextYAlignment.Top;
		this.instructionsLabel.TextWrapped = true;
		this.instructionsLabel.Parent = this.instructionsFrame;
	}

	// Pizza status methods
	public setPizzaPickedUp(pickedUp: boolean): void {
		if (!this.pizzaStatusLabel || !this.pizzaStatusFrame) return;

		if (pickedUp) {
			this.pizzaStatusLabel.Text = "PIZZA ONBOARD!\nDeliver it fast!";
			this.pizzaStatusLabel.TextColor3 = new Color3(0.2, 1, 0.3); // Green
			this.pizzaStatusFrame.BackgroundColor3 = new Color3(0.1, 0.3, 0.1);
		} else {
			this.pizzaStatusLabel.Text = "NO PIZZA\nGo to Pizza Shop!";
			this.pizzaStatusLabel.TextColor3 = new Color3(1, 0.5, 0.5); // Red-ish
			this.pizzaStatusFrame.BackgroundColor3 = new Color3(0, 0, 0);
		}
	}

	public showInstructions(): void {
		if (this.instructionsFrame) {
			this.instructionsFrame.Visible = true;
		}
	}

	public hideInstructions(): void {
		if (this.instructionsFrame) {
			this.instructionsFrame.Visible = false;
		}
	}

	public updateInstructionsText(text: string): void {
		if (this.instructionsLabel) {
			this.instructionsLabel.Text = text;
		}
	}

	public destroy(): void {
		this.screenGui.Destroy();
	}
}
