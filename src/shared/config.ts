// Game configuration and constants

import { DeliveryLocation, VehicleStats } from "./types";

export const GameConfig = {
	// Round settings
	ROUND_DURATION: 300, // 5 minutes total game time
	DELIVERIES_TO_WIN: 10,

	// Scoring
	BASE_DELIVERY_REWARD: 100,
	SPEED_BONUS_MULTIPLIER: 2.0, // Multiply remaining time by this
	DRIFT_BONUS_PER_SECOND: 50,
	JUMP_BONUS: 25,

	// Time bonuses
	FAST_DELIVERY_THRESHOLD: 0.5, // If completed in less than 50% of time
	FAST_DELIVERY_BONUS: 200,

	// Physics
	GRAVITY_MULTIPLIER: 1.5, // Make jumps feel snappier
	MAX_FALL_DAMAGE_VELOCITY: 200, // No fall damage, just respawn if too fast
};

export const VehicleConfig: VehicleStats = {
	maxSpeed: 180, // Studs per second (FASTER for 3x bigger map!)
	acceleration: 60, // Faster acceleration
	turnSpeed: 6, // Radians per second (responsive arcade turning)
	driftFactor: 0.7, // How much sideways friction is reduced during drift
	jumpPower: 80,
};

// Pizza shop and delivery locations around the city (ALL at ground level Y=1!)
export const PIZZA_SHOP: DeliveryLocation = {
	name: "Tony's Pizza Palace",
	position: new Vector3(0, 1, 0), // Ground level!
	color: new Color3(1, 0.2, 0.2), // Red
};

// Delivery locations - reasonable distances (300-800 studs from center)
export const DELIVERY_LOCATIONS: DeliveryLocation[] = [
	{
		name: "Downtown Office",
		position: new Vector3(400, 1, 300), // Northeast
		color: new Color3(0.2, 0.5, 1), // Blue
	},
	{
		name: "Beach House",
		position: new Vector3(-500, 1, 600), // Northwest
		color: new Color3(1, 1, 0.2), // Yellow
	},
	{
		name: "Mountain Lodge",
		position: new Vector3(600, 1, -500), // Southeast
		color: new Color3(0.6, 0.3, 0.1), // Brown
	},
	{
		name: "Skyscraper Penthouse",
		position: new Vector3(700, 1, 200), // East
		color: new Color3(0.8, 0.8, 0.8), // Gray
	},
	{
		name: "Suburb Villa",
		position: new Vector3(-400, 1, -400), // Southwest
		color: new Color3(0.2, 1, 0.5), // Green
	},
	{
		name: "Industrial District",
		position: new Vector3(800, 1, -100), // East
		color: new Color3(0.5, 0.5, 0.5), // Dark gray
	},
	{
		name: "Park Pavilion",
		position: new Vector3(-600, 1, 300), // Northwest
		color: new Color3(0.4, 1, 0.4), // Light green
	},
	{
		name: "Harbor Warehouse",
		position: new Vector3(-700, 1, -600), // Southwest
		color: new Color3(0.2, 0.3, 0.6), // Dark blue
	},
	{
		name: "Airport Terminal",
		position: new Vector3(500, 1, 700), // Northeast
		color: new Color3(1, 0.5, 0), // Orange
	},
	{
		name: "Shopping Mall",
		position: new Vector3(300, 1, 500), // North
		color: new Color3(1, 0.2, 0.8), // Pink
	},
	{
		name: "Sports Stadium",
		position: new Vector3(-300, 1, -700), // South
		color: new Color3(0.8, 0.2, 0.2), // Dark red
	},
	{
		name: "Tech Campus",
		position: new Vector3(450, 1, 650), // Northeast
		color: new Color3(0.5, 1, 1), // Cyan
	},
];

// Calculate delivery time based on distance (studs)
export function calculateDeliveryTime(distance: number): number {
	// Base time: 10 seconds per 100 studs, minimum 30s, maximum 120s
	const baseTime = (distance / 100) * 10;
	return math.clamp(baseTime, 30, 120);
}

// Calculate base reward based on distance and difficulty
export function calculateBaseReward(distance: number, heightDifference: number): number {
	const distanceReward = math.floor(distance / 10);
	const heightReward = math.floor(math.abs(heightDifference) / 5);
	return GameConfig.BASE_DELIVERY_REWARD + distanceReward + heightReward;
}
