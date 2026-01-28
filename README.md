# 🍕 Pizza Delivery Racer

A fast-paced arcade driving game for Roblox inspired by Crazy Taxi! Deliver pizzas around the city, earn tips for speed, pull off crazy drifts, and hit shortcuts for maximum points!

## 🎮 Game Features

### Core Gameplay
- **Timer-Based Deliveries**: Race against the clock to deliver pizzas before time runs out
- **Speed-Based Tips**: The faster you deliver, the bigger your tip!
- **Arcade Driving Physics**: Responsive controls with tight handling for that arcade feel
- **Drift Mechanics**: Hold Shift to drift and earn bonus points
- **Crazy Jumps**: Hit ramps and earn jump bonuses
- **Scoring System**: Combo multipliers for consecutive fast deliveries

### Controls
- **W/Up Arrow**: Accelerate
- **S/Down Arrow**: Reverse
- **A/Left Arrow**: Turn Left
- **D/Right Arrow**: Turn Right
- **Space**: Jump
- **Shift**: Drift (hold while turning)

### Scoring
- **Base Delivery Reward**: $100 + distance bonuses
- **Speed Bonus**: 2x the remaining time in seconds
- **Fast Delivery Bonus**: Extra $200 if you beat 50% of the time limit
- **Drift Bonus**: $50 per second of drifting
- **Jump Bonus**: $25 per jump
- **Combo Multiplier**: Up to 3x for consecutive fast deliveries

## 🏗️ Project Structure

```
src/
├── client/
│   ├── main.client.ts          # Client entry point
│   ├── GameManager.ts           # Main game orchestrator
│   ├── controllers/
│   │   ├── VehicleController.ts # Arcade driving physics
│   │   ├── DriftManager.ts      # Drift mechanics & effects
│   │   └── TimerManager.ts      # Timer & scoring tracking
│   ├── ui/
│   │   └── GameHUD.ts           # Game HUD with timer, score, etc.
│   └── effects/
│       └── EffectsManager.ts    # Visual effects (jumps, deliveries)
├── server/
│   ├── main.server.ts           # Server entry point
│   └── services/
│       └── DeliveryService.ts   # Delivery management & validation
└── shared/
    ├── types.ts                 # Shared TypeScript types
    ├── config.ts                # Game configuration & constants
    ├── remotes.ts               # Network event definitions
    └── module.ts                # Shared module exports
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Roblox Studio](https://www.roblox.com/create)
- [Rojo](https://rojo.space/) (for syncing code to Roblox)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the TypeScript compiler** (watch mode):
   ```bash
   npm run watch
   ```

3. **Start Rojo** (in a separate terminal):
   ```bash
   rojo serve
   ```

4. **Open Roblox Studio**:
   - Create a new place or open an existing one
   - Install the Rojo plugin from the [Roblox website](https://www.roblox.com/library/13916111004/Rojo-7)
   - Click "Connect" in the Rojo plugin (should connect to `localhost:34872`)

5. **Set up your game world**:
   - Create a baseplate or terrain for your city
   - The game automatically creates delivery location markers
   - Build ramps, buildings, and shortcuts around the markers!

### Building the Game

For production builds:
```bash
npm run build
```

## 🎨 Customization

### Adjusting Game Settings

Edit `src/shared/config.ts` to customize:

```typescript
export const GameConfig = {
  ROUND_DURATION: 300,           // Game time limit
  BASE_DELIVERY_REWARD: 100,     // Base payment
  SPEED_BONUS_MULTIPLIER: 2.0,   // Speed tip multiplier
  DRIFT_BONUS_PER_SECOND: 50,    // Drift rewards
  // ... and more!
};

export const VehicleConfig = {
  maxSpeed: 120,                  // Max vehicle speed
  acceleration: 50,               // How fast you speed up
  turnSpeed: 3.5,                 // Turning responsiveness
  driftFactor: 0.7,               // Drift slide amount
  jumpPower: 80,                  // Jump height
};
```

### Adding Delivery Locations

In `src/shared/config.ts`, add new locations to the `DELIVERY_LOCATIONS` array:

```typescript
{
  name: "New Location",
  position: new Vector3(x, y, z),
  color: new Color3(r, g, b),
}
```

### Customizing the Vehicle

Modify `createVehicle()` in `src/client/GameManager.ts` to:
- Import custom vehicle models
- Adjust vehicle size and appearance
- Add custom parts (spoilers, wheels, etc.)

## 🎯 Game Design Notes

### Arcade Physics
The vehicle controller uses `BodyVelocity` and `BodyGyro` for responsive arcade-style controls rather than realistic physics. This makes the game more accessible and fun!

### Network Architecture
- **Server authoritative**: All scoring and delivery validation happens server-side
- **Client prediction**: Vehicle physics run on the client for responsive controls
- **Event-driven**: RemoteEvents handle all client-server communication

### Visual Feedback
Heavy use of particle effects and UI animations to make the game feel juicy:
- Drift smoke and trails
- Jump sparkles
- Delivery completion effects
- Speed-based UI color changes

## 🐛 Troubleshooting

### "RemoteEvents not found" error
Make sure the server starts before the client connects. Rojo should sync both scripts.

### Vehicle falls through the map
Ensure you have a solid baseplate or terrain in your Roblox place.

### Compilation errors
Run `npm install` to ensure all dependencies are installed, especially `@rbxts/types`.

### Vehicle doesn't move
Check that the vehicle's PrimaryPart is set and the parts are not anchored.

## 📝 Development Roadmap

Future features to consider:
- [ ] Multiplayer racing/competition
- [ ] Power-ups (speed boost, time extension, etc.)
- [ ] Multiple vehicle types with different stats
- [ ] Leaderboards and high scores
- [ ] Day/night cycle
- [ ] Weather effects
- [ ] Customizable vehicles
- [ ] More delivery challenges (avoid obstacles, take specific routes)
- [ ] Sound effects and music

## 🤝 Contributing

This is a roblox-ts project. To contribute:
1. Follow TypeScript best practices
2. Maintain the existing code structure
3. Test in Roblox Studio before committing
4. Keep the arcade feel - fun over realism!

## 📄 License

This project is open source and available under the MIT License.

---

**Have fun delivering pizzas! 🍕🚗💨**
