# 🔧 Vehicle Height Fix Guide

## Current Setup Issues

Your vehicle is spawning below street level because the heights don't align properly.

## Current Heights in Code:
```
Road surface:    Y = 0.25 (center) → Top at Y = 0.5
Vehicle spawn:   Y = 4.0
Vehicle body:    3 studs tall → Bottom at Y = 2.5, Top at Y = 5.5
Wheels offset:   -2.5 from body center
Wheel position:  Y = 1.5 (floating 1 stud ABOVE road!)
```

## The Problem:
- Road top is at Y = 0.5
- Wheels are at Y = 1.5
- **Gap of 1 stud!** Vehicle is floating/sinking

## Quick Fix in Roblox Studio:

### Option 1: Check Your Baseplate (EASIEST)
1. In Roblox Studio, select your **Baseplate** in Workspace
2. Look at **Properties** → **Position**
3. **Set Position to**: `0, -10, 0`
4. This drops the baseplate 10 studs down

### Option 2: Delete Baseplate Entirely (RECOMMENDED)
1. Select **Baseplate** in Workspace
2. Press **Delete**
3. The streets will be your new ground!

### Option 3: Manual Fix - Adjust Spawn Location
1. Find **SpawnLocation** in Workspace
2. Set Position to: `0, 1, 0` (just above road surface)

## After Trying One Option Above:
Restart the game (F5) and test!
