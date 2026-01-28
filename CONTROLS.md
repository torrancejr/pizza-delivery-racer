# 🎮 Pizza Delivery Racer - Controls & Tips

## 🚗 Basic Controls

### Driving
| Key | Action | Tips |
|-----|--------|------|
| **W** or **Up Arrow** | Accelerate | Hold to go faster! Max speed ~80 MPH |
| **S** or **Down Arrow** | Brake/Reverse | Slow down or back up |
| **A** or **Left Arrow** | Turn Left | Turn sharper at high speeds |
| **D** or **Right Arrow** | Turn Right | Turn sharper at high speeds |

### Advanced Moves
| Key | Action | Tips |
|-----|--------|------|
| **Space** | Jump | Hit ramps for big air! Earn $25 per jump |
| **Shift** (hold) | Drift | Slide around corners! Earn $50/second |

## 💡 Pro Tips

### Speed Management
1. **Going Faster**:
   - Hold **W** continuously to accelerate
   - Current max speed: **120 studs/sec** (~80 MPH)
   - Takes ~2-3 seconds to reach max speed

2. **Slowing Down**:
   - Tap **S** to brake gently
   - Hold **S** to brake hard or reverse
   - Let go of **W** to coast (slows naturally)
   - Use **Shift** to drift and control speed around corners

3. **Speed on Screen**:
   - Check bottom-right corner for your speedometer
   - White = Normal speed
   - Yellow = Fast (60+ MPH)
   - Red = Very fast (100+ MPH)

### Earning More Money

#### Speed Bonuses 💨
- Deliver fast = bigger tips!
- **Time remaining × 2** = Speed bonus
- Example: 30 seconds left = $60 bonus

#### Drift Bonuses 🌀
- Hold **Shift** while turning
- Must drift for at least 0.5 seconds
- Earn **$50 per second** of drifting
- Drift smoke shows you're doing it right!

#### Jump Bonuses 🚀
- Hit ramps with speed
- Press **Space** for extra height
- Each jump = **$25 bonus**
- More air time = more style points!

#### Combo Multipliers 🔥
- Complete deliveries quickly (within 15 seconds of each other)
- Build up to **3x multiplier**
- Applies to ALL points earned
- Chain together for huge scores!

## 🎯 Driving Techniques

### The Perfect Delivery
1. **Start**: Hold **W** immediately
2. **Navigate**: Use smooth steering (don't overcorrect)
3. **Shortcuts**: Look for ramps and jump over obstacles
4. **Corners**: Hold **Shift** + turn for drift corners
5. **Finish**: Aim for center of delivery marker

### Drifting Like a Pro
1. Approach corner at high speed (60+ MPH)
2. Hold **Shift** BEFORE turning
3. Turn with **A** or **D** while holding Shift
4. Release **Shift** when exiting corner
5. Watch the smoke and your score pop up!

### Taking Shortcuts
- **Ramps**: Hit them straight-on at full speed
- **Rooftops**: Many buildings have flat tops - drive on them!
- **Alleys**: Tight spaces are faster if you can nail them
- **Elevated Roads**: Going up gives you jump opportunities coming down

## ⚠️ Common Mistakes

### "I'm going too slow!"
- ✅ Hold **W** constantly (don't tap)
- ✅ Avoid hitting walls (resets your speed)
- ✅ Use straight paths to build speed
- ❌ Don't hold **S** unless you need to brake

### "I can't turn!"
- ✅ Turning is easier at medium-high speeds
- ✅ Use drift (**Shift**) for tight corners
- ✅ Start turning early
- ❌ Don't try to turn at very low speeds

### "My drift won't work!"
1. Need to be going at least **20 MPH**
2. Must hold **Shift** + turn direction simultaneously
3. Release **Shift** after the turn
4. Must drift for 0.5+ seconds to count

### "I keep missing the delivery!"
- The markers have a **15-stud radius** (pretty big)
- You just need to drive THROUGH them
- Speed through - no need to stop!
- Arrow always points to your target

## 🏆 Score Goals

### Beginner
- Complete 5 deliveries: **$500+**
- Average per delivery: **$150-250**

### Intermediate  
- Complete 10 deliveries: **$2000+**
- Average per delivery: **$300-400**
- Use drifts and jumps regularly

### Expert
- Complete 15+ deliveries: **$5000+**
- Average per delivery: **$500+**
- Maintain 2x+ combo multiplier
- Master all shortcuts

## 🎨 Visual Feedback

### Speedometer Colors
- **White**: 0-60 MPH (Normal)
- **Yellow**: 60-100 MPH (Fast)
- **Red**: 100+ MPH (Crazy fast!)

### Timer Colors
- **Green**: 50%+ time remaining (Good!)
- **Yellow**: 25-50% time remaining (Hurry!)
- **Red**: Under 25% time remaining (RUSH!)

### Effects You'll See
- **Tire smoke**: You're drifting correctly
- **Sparkles**: Jump boost active
- **Confetti**: Successful delivery!
- **Drift trails**: Active drift in progress

## 🔧 Troubleshooting

**Vehicle feels too slow?**
- Default max speed: 120 studs/sec
- Edit `src/shared/config.ts` → `VehicleConfig.maxSpeed`
- Try 150-180 for faster gameplay

**Turning feels sluggish?**
- Edit `src/shared/config.ts` → `VehicleConfig.turnSpeed`
- Increase from 3.5 to 4.5-5.0

**Drift too slidey?**
- Edit `src/shared/config.ts` → `VehicleConfig.driftFactor`
- Lower value = more grip (try 0.5-0.6)

---

**Now get out there and deliver some pizza! 🍕💨**
