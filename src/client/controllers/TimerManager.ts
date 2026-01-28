// Client-side timer and scoring tracking

import { RunService } from "@rbxts/services";
import { DeliveryTask } from "shared/module";

export class TimerManager {
	private isActive = false;
	private startTime?: number;
	private timeLimit = 0;
	private currentTask?: DeliveryTask;

	// Callbacks
	public onTimerUpdate?: (timeRemaining: number, timeLimit: number) => void;
	public onTimerExpired?: () => void;
	public onTimerWarning?: () => void; // Triggered at 10 seconds remaining

	private hasWarned = false;
	private updateConnection?: RBXScriptConnection;

	public startTimer(task: DeliveryTask): void {
		this.isActive = true;
		this.startTime = os.clock();
		this.timeLimit = task.timeLimit;
		this.currentTask = task;
		this.hasWarned = false;

		// Start update loop
		this.updateConnection = RunService.RenderStepped.Connect(() => {
			this.update();
		});
	}

	public stopTimer(): void {
		this.isActive = false;
		this.currentTask = undefined;

		if (this.updateConnection) {
			this.updateConnection.Disconnect();
			this.updateConnection = undefined;
		}
	}

	private update(): void {
		if (!this.isActive || this.startTime === undefined) {
			return;
		}

		const elapsed = os.clock() - this.startTime;
		const remaining = this.timeLimit - elapsed;

		// Update UI
		if (this.onTimerUpdate) {
			this.onTimerUpdate(math.max(0, remaining), this.timeLimit);
		}

		// Warning at 10 seconds
		if (remaining <= 10 && !this.hasWarned) {
			this.hasWarned = true;
			if (this.onTimerWarning) {
				this.onTimerWarning();
			}
		}

		// Timer expired
		if (remaining <= 0) {
			this.stopTimer();
			if (this.onTimerExpired) {
				this.onTimerExpired();
			}
		}
	}

	public getTimeRemaining(): number {
		if (!this.isActive || this.startTime === undefined) {
			return 0;
		}
		const elapsed = os.clock() - this.startTime;
		return math.max(0, this.timeLimit - elapsed);
	}

	public getTimeElapsed(): number {
		if (!this.isActive || this.startTime === undefined) {
			return 0;
		}
		return os.clock() - this.startTime;
	}

	public isTimerActive(): boolean {
		return this.isActive;
	}

	public getCurrentTask(): DeliveryTask | undefined {
		return this.currentTask;
	}

	public destroy(): void {
		this.stopTimer();
	}
}

export class ScoreTracker {
	private currentScore = 0;
	private sessionScore = 0;
	private deliveryCount = 0;
	private comboMultiplier = 1;
	private lastDeliveryTime?: number;

	// Callbacks
	public onScoreChanged?: (newScore: number) => void;
	public onComboChanged?: (multiplier: number) => void;

	public addScore(points: number): void {
		const scoredPoints = math.floor(points * this.comboMultiplier);
		this.currentScore += scoredPoints;
		this.sessionScore += scoredPoints;

		if (this.onScoreChanged) {
			this.onScoreChanged(this.currentScore);
		}
	}

	public recordDelivery(successful: boolean): void {
		if (successful) {
			this.deliveryCount += 1;
			this.updateCombo();
			this.lastDeliveryTime = os.clock();
		} else {
			// Failed delivery resets combo
			this.resetCombo();
		}
	}

	private updateCombo(): void {
		// Increase combo if deliveries are close together
		if (this.lastDeliveryTime !== undefined) {
			const timeSinceLastDelivery = os.clock() - this.lastDeliveryTime;
			if (timeSinceLastDelivery < 15) {
				// Within 15 seconds
				this.comboMultiplier = math.min(this.comboMultiplier + 0.25, 3); // Max 3x multiplier
			} else {
				this.resetCombo();
			}
		}

		if (this.onComboChanged) {
			this.onComboChanged(this.comboMultiplier);
		}
	}

	private resetCombo(): void {
		this.comboMultiplier = 1;
		if (this.onComboChanged) {
			this.onComboChanged(this.comboMultiplier);
		}
	}

	public getCurrentScore(): number {
		return this.currentScore;
	}

	public getSessionScore(): number {
		return this.sessionScore;
	}

	public getDeliveryCount(): number {
		return this.deliveryCount;
	}

	public getComboMultiplier(): number {
		return this.comboMultiplier;
	}

	public reset(): void {
		this.currentScore = 0;
		this.sessionScore = 0;
		this.deliveryCount = 0;
		this.resetCombo();
		this.lastDeliveryTime = undefined;
	}
}
