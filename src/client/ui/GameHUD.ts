// Main game HUD with arcade-style UI

import { Players, TweenService } from "@rbxts/services";
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

	constructor() {
		this.player = Players.LocalPlayer;
		this.screenGui = new Instance("ScreenGui");
		this.screenGui.Name = "PizzaDeliveryHUD";
		this.screenGui.ResetOnSpawn = false;
		this.screenGui.Parent = this.player.WaitForChild("PlayerGui");

		this.createHUD();
	}

	private createHUD(): void {
		// Timer at top center
		this.createTimer();

		// Score at top left
		this.createScore();

		// Speedometer at bottom right
		this.createSpeedometer();

		// Delivery info at top right
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
		// Container
		const container = new Instance("Frame");
		container.Name = "TimerContainer";
		container.Size = new UDim2(0, 300, 0, 80);
		container.Position = new UDim2(0.5, -150, 0, 20);
		container.BackgroundColor3 = new Color3(0, 0, 0);
		container.BackgroundTransparency = 0.3;
		container.BorderSizePixel = 0;
		container.Parent = this.screenGui;

		// Corner rounding
		const corner = new Instance("UICorner");
		corner.CornerRadius = new UDim(0, 10);
		corner.Parent = container;

		// Timer label
		this.timerLabel = new Instance("TextLabel");
		this.timerLabel.Name = "TimerLabel";
		this.timerLabel.Size = new UDim2(1, 0, 0.6, 0);
		this.timerLabel.Position = new UDim2(0, 0, 0, 5);
		this.timerLabel.BackgroundTransparency = 1;
		this.timerLabel.Text = "0:00";
		this.timerLabel.TextColor3 = new Color3(1, 1, 1);
		this.timerLabel.TextScaled = true;
		this.timerLabel.Font = Enum.Font.GothamBold;
		this.timerLabel.Parent = container;

		// Timer bar container
		const barContainer = new Instance("Frame");
		barContainer.Name = "BarContainer";
		barContainer.Size = new UDim2(0.9, 0, 0.15, 0);
		barContainer.Position = new UDim2(0.05, 0, 0.75, 0);
		barContainer.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
		barContainer.BorderSizePixel = 0;
		barContainer.Parent = container;

		// Timer bar fill
		this.timerBar = new Instance("Frame");
		this.timerBar.Name = "TimerBar";
		this.timerBar.Size = new UDim2(1, 0, 1, 0);
		this.timerBar.BackgroundColor3 = new Color3(0.2, 1, 0.3);
		this.timerBar.BorderSizePixel = 0;
		this.timerBar.Parent = barContainer;
	}

	private createScore(): void {
		const container = new Instance("Frame");
		container.Name = "ScoreContainer";
		container.Size = new UDim2(0, 250, 0, 100);
		container.Position = new UDim2(0, 20, 0, 20);
		container.BackgroundColor3 = new Color3(0, 0, 0);
		container.BackgroundTransparency = 0.3;
		container.BorderSizePixel = 0;
		container.Parent = this.screenGui;

		const corner = new Instance("UICorner");
		corner.CornerRadius = new UDim(0, 10);
		corner.Parent = container;

		// Label
		const label = new Instance("TextLabel");
		label.Size = new UDim2(1, 0, 0.4, 0);
		label.BackgroundTransparency = 1;
		label.Text = "SCORE";
		label.TextColor3 = new Color3(1, 0.8, 0.2);
		label.Font = Enum.Font.GothamBold;
		label.TextScaled = true;
		label.Parent = container;

		// Score value
		this.scoreLabel = new Instance("TextLabel");
		this.scoreLabel.Name = "ScoreValue";
		this.scoreLabel.Size = new UDim2(1, 0, 0.6, 0);
		this.scoreLabel.Position = new UDim2(0, 0, 0.4, 0);
		this.scoreLabel.BackgroundTransparency = 1;
		this.scoreLabel.Text = "$0";
		this.scoreLabel.TextColor3 = new Color3(1, 1, 1);
		this.scoreLabel.Font = Enum.Font.GothamBold;
		this.scoreLabel.TextScaled = true;
		this.scoreLabel.Parent = container;
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
		this.deliveryInfoFrame = new Instance("Frame");
		this.deliveryInfoFrame.Name = "DeliveryInfo";
		this.deliveryInfoFrame.Size = new UDim2(0, 300, 0, 120);
		this.deliveryInfoFrame.Position = new UDim2(1, -320, 0, 20);
		this.deliveryInfoFrame.BackgroundColor3 = new Color3(0, 0, 0);
		this.deliveryInfoFrame.BackgroundTransparency = 0.3;
		this.deliveryInfoFrame.BorderSizePixel = 0;
		this.deliveryInfoFrame.Visible = false;
		this.deliveryInfoFrame.Parent = this.screenGui;

		const corner = new Instance("UICorner");
		corner.CornerRadius = new UDim(0, 10);
		corner.Parent = this.deliveryInfoFrame;

		// Title
		const title = new Instance("TextLabel");
		title.Size = new UDim2(1, 0, 0.3, 0);
		title.BackgroundTransparency = 1;
		title.Text = "DELIVER TO:";
		title.TextColor3 = new Color3(1, 0.3, 0.3);
		title.Font = Enum.Font.GothamBold;
		title.TextScaled = true;
		title.Parent = this.deliveryInfoFrame;

		// Location name
		this.deliveryNameLabel = new Instance("TextLabel");
		this.deliveryNameLabel.Size = new UDim2(1, -20, 0.4, 0);
		this.deliveryNameLabel.Position = new UDim2(0, 10, 0.3, 0);
		this.deliveryNameLabel.BackgroundTransparency = 1;
		this.deliveryNameLabel.Text = "";
		this.deliveryNameLabel.TextColor3 = new Color3(1, 1, 1);
		this.deliveryNameLabel.Font = Enum.Font.Gotham;
		this.deliveryNameLabel.TextScaled = true;
		this.deliveryNameLabel.TextWrapped = true;
		this.deliveryNameLabel.Parent = this.deliveryInfoFrame;

		// Distance
		this.deliveryDistanceLabel = new Instance("TextLabel");
		this.deliveryDistanceLabel.Size = new UDim2(1, 0, 0.25, 0);
		this.deliveryDistanceLabel.Position = new UDim2(0, 0, 0.72, 0);
		this.deliveryDistanceLabel.BackgroundTransparency = 1;
		this.deliveryDistanceLabel.Text = "";
		this.deliveryDistanceLabel.TextColor3 = new Color3(0.8, 0.8, 0.8);
		this.deliveryDistanceLabel.Font = Enum.Font.Gotham;
		this.deliveryDistanceLabel.TextScaled = true;
		this.deliveryDistanceLabel.Parent = this.deliveryInfoFrame;
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
		if (!this.timerLabel || !this.timerBar) return;

		const minutes = math.floor(timeRemaining / 60);
		const seconds = math.floor(timeRemaining % 60);
		this.timerLabel.Text = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

		// Update bar
		const percentage = timeRemaining / timeLimit;
		this.timerBar.Size = new UDim2(percentage, 0, 1, 0);

		// Change color based on time remaining
		if (percentage > 0.5) {
			this.timerBar.BackgroundColor3 = new Color3(0.2, 1, 0.3); // Green
			this.timerLabel.TextColor3 = new Color3(1, 1, 1);
		} else if (percentage > 0.25) {
			this.timerBar.BackgroundColor3 = new Color3(1, 1, 0.2); // Yellow
			this.timerLabel.TextColor3 = new Color3(1, 1, 0.2);
		} else {
			this.timerBar.BackgroundColor3 = new Color3(1, 0.2, 0.2); // Red
			this.timerLabel.TextColor3 = new Color3(1, 0.2, 0.2);
		}
	}

	public updateScore(score: number): void {
		if (!this.scoreLabel) return;
		this.scoreLabel.Text = `$${score}`;
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
		this.deliveryDistanceLabel.Text = `${task.distanceMeters}m away`;
		this.deliveryInfoFrame.Visible = true;
	}

	public updateDeliveryInfo(task: DeliveryTask, distanceMeters: number, hasPizza: boolean): void {
		if (this.deliveryNameLabel) {
			const target = hasPizza ? task.deliveryLocation.name : task.pickupLocation.name;
			const icon = hasPizza ? "📍" : "🍕";
			this.deliveryNameLabel.Text = `${icon} ${target}`;
		}
		if (this.deliveryDistanceLabel) {
			this.deliveryDistanceLabel.Text = `${distanceMeters}m`;
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
