# 🚀 Quick Setup Guide for Pizza Delivery Racer

## Step-by-Step Setup

### 1. Terminal Setup (Already Running!)

You already have the project running with:
- ✅ TypeScript compiler in watch mode (`npm run watch`)
- ✅ Rojo server running on `localhost:34872`

### 2. Roblox Studio Setup

1. **Open Roblox Studio**
   - Launch Roblox Studio
   - Create a new Baseplate game (or use an existing place)

2. **Install Rojo Plugin**
   - In Roblox Studio, go to the Plugins tab
   - Click "Manage Plugins"
   - Search for "Rojo" or get it from: https://www.roblox.com/library/13916111004/Rojo-7
   - Install the plugin

3. **Connect Rojo**
   - In Roblox Studio, find the Rojo plugin toolbar
   - Click "Connect"
   - Enter `localhost:34872` (should be default)
   - Click "Connect" - you should see a success message!

4. **Sync the Game**
   - The plugin will automatically sync your code
   - You should see new folders appear in Explorer:
     - `ReplicatedStorage/RemoteEvents`
     - `ServerScriptService` (with server scripts)
     - `StarterPlayer/StarterPlayerScripts` (with client scripts)

### 3. Build Your City (Roblox Studio)

The game creates delivery markers automatically, but you need to build the world around them:

#### Minimum Setup (5 minutes):
1. **Expand the Baseplate**
   - Select the baseplate in Workspace
   - In Properties, set Size to `2048, 2, 2048` (large flat surface)
   - This gives you room for the delivery locations

2. **Add Spawn Location**
   - Insert → Gameplay → SpawnLocation
   - Place it near position (0, 0, 0) - where the pizza shop spawns

3. **Test Basic Movement**
   - Click "Play" (F5) to test
   - You should see delivery markers appear as colored cylinders with beams
   - A vehicle should spawn
   - Try driving with WASD!

#### Enhanced Setup (30+ minutes):
Build a proper city for the best experience:

1. **Create Buildings**
   - Use Parts to create simple buildings around delivery markers
   - Vary heights (5-50 studs) for interesting terrain
   - Leave roads/paths between buildings

2. **Add Ramps & Shortcuts**
   - Create angled parts (Wedges) for jump ramps
   - Place them strategically between delivery locations
   - Aim for 15-30 degree angles for good jumps

3. **Terrain (Optional)**
   - Use the Terrain Editor to add hills, valleys
   - This adds verticality and challenge
   - Match terrain to delivery marker heights

4. **Visual Polish**
   - Add textures to buildings (Material property)
   - Place decoration (trees, signs, etc.)
   - Add lighting (Lighting → Ambient, Brightness)

### 4. Testing Your Game

1. **Press F5 (Play)** in Roblox Studio

2. **What Should Happen:**
   - Vehicle spawns at origin (0, 0, 0)
   - Red cylinder markers appear at delivery locations
   - HUD shows: Timer, Score, Speedometer
   - After 2 seconds: First delivery task appears
   - Red arrow points to delivery location

3. **Test the Gameplay Loop:**
   - Drive to Pizza Shop (red marker at 0,0,0)
   - Drive through it to "pick up pizza"
   - Follow arrow to delivery location
   - Drive through the delivery marker
   - See completion message and score!

### 5. Common Issues & Fixes

#### Issue: Vehicle doesn't spawn
**Fix**: 
- Check StarterPlayer → StarterPlayerScripts has "main.client"
- Look in Output window for errors

#### Issue: Can't control vehicle
**Fix**:
- Make sure you clicked into the game window
- Check that Shift Lock isn't enabled
- Verify WASD keys aren't bound to other actions

#### Issue: Deliveries don't complete
**Fix**:
- Make sure you drove through BOTH markers (pickup then delivery)
- Check the timer hasn't expired
- Look in Output window for "[Client]" or "[Server]" messages

#### Issue: Vehicle falls through baseplate
**Fix**:
- Pause the game (Shift+F5)
- Select baseplate, check that Anchored = true
- Check baseplate position is at Y=0 or lower

#### Issue: No delivery markers visible
**Fix**:
- Check Workspace for "DeliveryLocations" folder
- If not there, check Output for server errors
- Try stopping and restarting the game

### 6. Customization Quick Start

Want to make it your own? Start here:

1. **Change Vehicle Speed** → `src/shared/config.ts` → `VehicleConfig.maxSpeed`
2. **Adjust Timer** → `src/shared/config.ts` → `calculateDeliveryTime()`
3. **Add More Locations** → `src/shared/config.ts` → `DELIVERY_LOCATIONS[]`
4. **Customize Colors** → `src/shared/config.ts` → location `color` properties
5. **Change Rewards** → `src/shared/config.ts` → `GameConfig` values

After making changes:
- Files auto-compile (watch mode is running)
- Rojo auto-syncs to Studio
- Stop and restart the game (Shift+F5, then F5)

### 7. Next Steps

Once basic gameplay works:

1. **Build a proper map**
   - Design a city layout
   - Add landmarks at delivery spots
   - Create fun shortcuts and jump spots

2. **Tune the gameplay**
   - Adjust speeds and times to your liking
   - Test with friends
   - Balance risk vs. reward

3. **Add polish**
   - Custom vehicle model
   - Sound effects
   - Background music
   - More particle effects

4. **Publish!**
   - File → Publish to Roblox
   - Set game to public
   - Share with friends!

## Need Help?

Check these resources:
- **Roblox Creator Hub**: https://create.roblox.com/docs
- **roblox-ts Documentation**: https://roblox-ts.com/
- **Rojo Documentation**: https://rojo.space/docs/

Look at the Output window in Studio for debug messages - both client and server log helpful information!

---

**🎮 Ready to start? Hit F5 in Roblox Studio and start delivering pizzas!**
