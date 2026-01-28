// Pizza Delivery Racer - Server Entry Point
// Force re-sync: 2025-01-27

import { DeliveryService } from "./services/DeliveryService";
import { SpawnLocationFixer } from "./services/SpawnLocationFixer";
import { MapBuilder } from "./services/MapBuilder";
import { Workspace } from "@rbxts/services";

print("=".rep(60));
print("[Server] PIZZA DELIVERY RACER SERVER STARTING...");
print("=".rep(60));

// EMERGENCY GROUND - Create immediately to prevent falling!
print("[Server] Creating EMERGENCY ground plane...");
const emergencyGround = new Instance("Part");
emergencyGround.Name = "EMERGENCY_GROUND";
emergencyGround.Size = new Vector3(5000, 10, 5000); // MASSIVE!
emergencyGround.Position = new Vector3(0, -5, 0); // Below everything
emergencyGround.Anchored = true;
emergencyGround.Color = new Color3(0.2, 0.8, 0.2); // Bright green
emergencyGround.Material = Enum.Material.Grass;
emergencyGround.Parent = Workspace;
print("[Server] ✓ EMERGENCY ground created at Y=-5");

// Fix spawn locations FIRST (before map, before players)
print("[Server] Fixing spawn locations...");
SpawnLocationFixer.fixAllSpawnLocations();
print("[Server] ✓ Spawn locations fixed - players will spawn at (0, 1, 0)");

// Build the city map AFTER spawn is fixed
print("[Server] Building city map...");
const mapBuilder = new MapBuilder();
print("[Server] ✓ City map complete");

// Initialize delivery service
print("[Server] Starting delivery service...");
const deliveryService = new DeliveryService();
print("[Server] ✓ Delivery service ready");

print("=".rep(60));
print("[Server] ALL SYSTEMS READY! Waiting for players...");
print("=".rep(60));
