// Network events for client-server communication

import { DeliveryTask, DeliveryResult, PlayerScore } from "./types";

// Server -> Client events
export interface ClientEvents {
	onDeliveryStarted: (task: DeliveryTask) => void;
	onDeliveryCompleted: (result: DeliveryResult) => void;
	onScoreUpdated: (score: PlayerScore) => void;
	onGameStateChanged: (state: string) => void;
	onDriftBonus: (bonusPoints: number) => void;
	onJumpBonus: () => void;
}

// Client -> Server events
export interface ServerEvents {
	requestNewDelivery: () => void;
	completeDelivery: () => void;
	reportDrift: (driftTime: number) => void;
	reportJump: () => void;
}

// Remote event names
export const RemoteEventNames = {
	// Server to Client
	DeliveryStarted: "DeliveryStarted",
	DeliveryCompleted: "DeliveryCompleted",
	ScoreUpdated: "ScoreUpdated",
	GameStateChanged: "GameStateChanged",
	DriftBonus: "DriftBonus",
	JumpBonus: "JumpBonus",

	// Client to Server
	RequestNewDelivery: "RequestNewDelivery",
	CompleteDelivery: "CompleteDelivery",
	ReportDrift: "ReportDrift",
	ReportJump: "ReportJump",
} as const;
