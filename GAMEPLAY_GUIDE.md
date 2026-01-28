# 🍕 How to Play - Pizza Delivery Racer

## 🎮 Quick Start

### When You Spawn In:
1. **Wait 2 seconds** - Your pizza delivery car spawns automatically!
2. **Get in position** - Walk close to the red car
3. **Start driving** - Hold **W** to accelerate
4. **Follow the instructions** on screen

## 📋 How Deliveries Work

### The Delivery Loop (Simple!)

```
START
  ↓
1. PICK UP PIZZA
   Drive to Pizza Shop (RED marker at 0,0,0)
   Just drive THROUGH it!
  ↓
2. DELIVER PIZZA  
   Drive to delivery location (colored marker)
   Follow the arrow!
  ↓
3. GET PAID 💰
   Earn money based on speed!
  ↓
REPEAT (New delivery starts automatically)
```

### Step-by-Step First Delivery:

**STEP 1: Pick Up the Pizza**
- Look for the **RED glowing cylinder** with a tall beam (Pizza Shop)
- It's at coordinates (0, 0, 0) - usually near the center
- Drive your car **through the red marker**
- You'll see: **"PIZZA PICKED UP! DELIVER IT!"**

**STEP 2: Deliver the Pizza**
- A **colored marker** appears elsewhere on the map
- An **arrow above your car** points to it
- Follow the arrow to the delivery location
- Drive **through that marker** too!

**STEP 3: Get Paid!**
- Timer stops
- Score pops up showing your tip
- New delivery starts automatically after 3 seconds

## 🎯 Markers Explained

### Red Marker = Pizza Shop
- Always at position (0, 0, 0)
- This is where you **pick up** pizzas
- You return here for EVERY delivery

### Colored Markers = Delivery Locations
- 8 different locations around the city
- Each has a unique color and name
- Drive through to complete delivery

### How Markers Look:
- **Large cylinder** on the ground (10 studs wide)
- **Tall glowing beam** shooting up (100 studs high)
- **Name label** floating above
- You just need to drive THROUGH them (within 15 studs)

## 🚗 Vehicle Spawning Fixed!

### The vehicle now:
- ✅ Spawns **in front of you** (10 studs away)
- ✅ Wider wheelbase for **better stability**
- ✅ Heavier body (won't tip as easily)
- ✅ Less bouncy (won't flip on landing)

### If Your Vehicle Still Tips Over:

**Quick Fix in Roblox Studio:**
1. Stop the game (Shift+F5)
2. Select your **SpawnLocation** in Workspace
3. In Properties, set **Position** to: `0, 0.5, 0`
4. Select your **Baseplate**
5. In Properties, set **Position** to: `0, -10, 0`
6. Restart (F5)

This ensures your spawn is just above the baseplate!

**Alternative - Move Pizza Shop:**
If you want to spawn somewhere else, edit `src/shared/config.ts`:
```typescript
export const PIZZA_SHOP: DeliveryLocation = {
  name: "Tony's Pizza Palace",
  position: new Vector3(50, 5, 50), // Change to your spawn area!
  color: new Color3(1, 0.2, 0.2),
};
```

## 🎮 First Time Playing? Try This:

1. **Spawn in** → Wait for your car
2. **Hold W** to drive forward
3. Look for the **RED marker** (Pizza Shop)
4. Drive through it → "PIZZA PICKED UP!"
5. Look at the **arrow above your car**
6. Follow arrow to the **colored marker**
7. Drive through it → "DELIVERY COMPLETE!"
8. Check your score → $200-400 for first delivery!
9. Repeat!

## 💡 Pro Tips for Beginners

### Your First 3 Deliveries:
1. **Don't rush** - Learn the controls first
2. **Follow the arrow** - It always points the right way
3. **Drive THROUGH markers** - Don't stop, just go through!

### Getting Comfortable:
4. **Practice turns** at medium speed
5. **Try a jump** - Hit space while going fast
6. **Attempt a drift** - Hold Shift while turning

### Going Pro:
7. **Find shortcuts** between locations
8. **Chain drifts** through multiple corners
9. **Maintain combos** with fast deliveries

## ⚠️ Common Confusions

### "Do I need to stop at the pizza shop?"
❌ **NO!** Just drive through the marker at full speed.

### "Do I pick up the pizza first or go to delivery?"
✅ **ALWAYS pickup first!** 
1. Pizza Shop (red) 
2. Then delivery location (colored)

### "Where's the pizza shop?"
- Look for the **RED glowing marker**
- It's at the center of the map (0, 0, 0)
- Has a beam shooting up to the sky
- Label says "Tony's Pizza Palace"

### "I drove through both markers but nothing happened!"
- Make sure you went to **Pizza Shop FIRST** (red one)
- Then went to **delivery location SECOND** (colored one)
- Both must be within the same delivery (don't start a new one!)

### "My car spawned in the air and fell over!"
- This is fixed now! Car spawns in front of you
- If still happening, check your SpawnLocation height
- Make sure baseplate is at Y = -10 or lower

### "The arrow is pointing the wrong way!"
- Arrow points to **final delivery**, not pizza shop
- You still need to pick up pizza first!
- This is intentional - you remember where the pizza shop is

## 🎯 Understanding the Timer

### Timer starts when:
- You receive a new delivery task

### Timer countdown:
- Shows in TOP CENTER of screen
- Changes color: Green → Yellow → Red

### Timer stops when:
- You complete the delivery (both markers)
- OR time runs out (delivery fails)

### Time Based on Distance:
- Close delivery (200 studs): ~30 seconds
- Medium delivery (400 studs): ~40-50 seconds  
- Far delivery (800+ studs): ~80-120 seconds

## 🏆 Scoring System Quick Reference

- **Base Pay**: $100 + distance bonus
- **Speed Bonus**: Time remaining × 2
- **Drift Bonus**: $50 per second
- **Jump Bonus**: $25 per jump
- **Fast Delivery Bonus**: +$200 (if under 50% time)
- **Combo Multiplier**: Up to 3x everything!

---

**Still confused? Just hold W and follow the arrow! 🍕🚗💨**
