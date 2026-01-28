// Core game types for Pizza Delivery Racer

export interface DeliveryLocation {
	name: string;
	position: Vector3;
	color: Color3;
}

export interface DeliveryTask {
	id: string;
	pickupLocation: DeliveryLocation;
	deliveryLocation: DeliveryLocation;
	timeLimit: number; // seconds
	baseReward: number;
	distanceMeters: number;
}

export interface PlayerScore {
	totalScore: number;
	deliveriesCompleted: number;
	totalTips: number;
	bestDeliveryTime: number;
	longestDriftTime: number;
}

export interface VehicleStats {
	maxSpeed: number;
	acceleration: number;
	turnSpeed: number;
	driftFactor: number;
	jumpPower: number;
}

export enum GameState {
	Waiting = "Waiting",
	Active = "Active",
	DeliveryComplete = "DeliveryComplete",
	GameOver = "GameOver",
}

export interface DeliveryResult {
	success: boolean;
	timeTaken: number;
	timeRemaining: number;
	baseReward: number;
	speedBonus: number;
	driftBonus: number;
	totalTip: number;
}
