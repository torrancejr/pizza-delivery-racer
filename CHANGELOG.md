# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-01-27

### Added
- **Instant Delivery Effects** 🎆
  - Screen flash effect on delivery completion
  - Massive sparkle explosion (300 particles)
  - Flashing point light
  - Explosion sound effect
  - 3 expanding golden rings
  - Effects trigger instantly on zone entry (no server delay)

### Changed
- Delivery effects now trigger client-side on zone entry instead of waiting for server response
- Increased particle count from 200 to 300 sparkles
- Increased particle speed from 50-100 to 60-120
- Increased particle size from 3 to 4
- Increased rotation speed from 200 to 300

### Fixed
- Delivery effects now trigger instantly with zero delay
- Removed delayed server-side effect triggers

---

## [v1.0] - 2026-01-27

### Added
- **Core Gameplay**
  - Pizza pickup and delivery system
  - Timer-based deliveries with speed bonuses
  - Scoring system with tip calculation
  - 12 delivery locations across city map
  
- **City Environment**
  - 2000x2000 stud map with flat streets
  - Procedurally generated buildings (Glass, Brick, Concrete types)
  - Buildings with windows, doors, and roofs
  - Street lights at intersections
  - Parked cars along streets
  - Boundary walls to prevent falling off map
  
- **Vehicle System**
  - Support for user-provided Jeep with native driving scripts
  - Speed tracking and display
  - Auto-sit player in vehicle on spawn
  - Jump disabled to prevent exiting vehicle
  
- **UI/HUD**
  - Timer display
  - Score tracking
  - Speedometer
  - Delivery distance indicator
  - Pizza pickup status
  - Delivery location name
  - Notification system
  
- **Visual Effects**
  - Delivery completion effects (confetti, rings)
  - Delivery location markers with beams
  - Drift particles (system in place)
  
### Changed
- Map size optimized from 9000x9000 to 2000x2000 studs
- Vehicle max speed increased to 180 studs/second
- Vehicle acceleration increased to 60
- Delivery locations positioned 300-800 studs from center
- Delivery zone radius set to 40 studs
- Pickup zone radius set to 40 studs

### Fixed
- Vehicle spawning at correct ground level
- Player spawning in vehicle instead of on buildings
- Delivery and pickup detection working reliably
- Delivery distance UI updating correctly
- Remote event connections established properly
- Scripts loading and executing on both client and server

---

## Initial Setup - 2026-01-26

### Added
- Roblox-TS project structure
- Rojo configuration for Studio sync
- Basic TypeScript compilation setup
- Core game types and configuration
- Remote event system for client-server communication
- Game state management foundation
