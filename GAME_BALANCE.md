# ⚖️ Game Balance Reference

Quick reference for tuning gameplay values to get the perfect arcade feel!

## 🚗 Vehicle Physics (`src/shared/config.ts`)

| Setting | Default | Description | Tuning Tips |
|---------|---------|-------------|-------------|
| `maxSpeed` | 120 | Top speed in studs/sec | 80-100 = casual, 120-150 = fast, 180+ = insane |
| `acceleration` | 50 | How fast you reach top speed | Higher = snappier, Lower = gradual |
| `turnSpeed` | 3.5 | Steering responsiveness (rad/s) | 2-3 = wide turns, 4-6 = tight turns |
| `driftFactor` | 0.7 | Sideways slide amount | 0.5 = grippy, 0.8 = slidey |
| `jumpPower` | 80 | Vertical jump force | 60 = low hop, 100+ = crazy air |

### Recommended Presets:

**Beginner Friendly:**
```typescript
maxSpeed: 90
acceleration: 40
turnSpeed: 3.0
driftFactor: 0.6
```

**Arcade Pro:**
```typescript
maxSpeed: 140
acceleration: 60
turnSpeed: 4.5
driftFactor: 0.75
```

**Chaos Mode:**
```typescript
maxSpeed: 200
acceleration: 80
turnSpeed: 6.0
driftFactor: 0.85
```

## 💰 Scoring System

### Base Rewards
| Item | Value | Notes |
|------|-------|-------|
| Base Delivery | $100 | Always earned |
| Distance Bonus | ~$1 per 10 studs | Farther = more money |
| Height Bonus | ~$1 per 5 studs elevation | Hills pay extra |

### Time Bonuses
| Bonus Type | Formula | Max Value |
|------------|---------|-----------|
| Speed Bonus | Time Remaining × 2 | ~$240 (120s × 2) |
| Fast Delivery | +$200 | If under 50% time used |

**Example Delivery Calculation:**
- Distance: 300 studs → Base: $100 + $30 distance = **$130**
- Time Limit: 60s, Completed in: 25s → Remaining: 35s
- Speed Bonus: 35 × 2 = **$70**
- Fast Delivery (25s < 30s): **$200**
- **Total: $400**

### Skill Bonuses
| Action | Value | Requirements |
|--------|-------|--------------|
| Drift | +$50/second | Hold drift ≥0.5s |
| Jump | +$25 | Any jump |

### Combo System
| Deliveries | Multiplier | Time Window |
|------------|------------|-------------|
| 1 | 1.0× | - |
| 2+ consecutive | +0.25× per delivery | Within 15s |
| Maximum | 3.0× | 8+ fast deliveries |

**Combo breaks on:**
- Failed delivery
- 15+ seconds between deliveries

## ⏱️ Time Limits

Default formula: `(distance / 100) × 10` seconds
- Minimum: 30 seconds
- Maximum: 120 seconds

### Distance → Time Examples:
| Distance | Time Given |
|----------|------------|
| 100 studs | 30s (min) |
| 200 studs | 30s |
| 300 studs | 30s |
| 500 studs | 50s |
| 800 studs | 80s |
| 1200+ studs | 120s (max) |

### Tuning Tips:
**Too Easy?** 
- Reduce time by 20%: `baseTime * 0.8`
- Lower max time: 90s instead of 120s

**Too Hard?**
- Add 20% more time: `baseTime * 1.2`
- Raise minimum time: 40s instead of 30s

**For larger maps:**
```typescript
const baseTime = (distance / 80) * 10; // More generous
return math.clamp(baseTime, 40, 150);
```

## 🎯 Difficulty Presets

### Easy Mode (Casual Players)
```typescript
// config.ts changes:
SPEED_BONUS_MULTIPLIER: 3.0  // More time bonus
FAST_DELIVERY_THRESHOLD: 0.6 // Easier to get bonus
calculateDeliveryTime: distance => math.clamp((distance/80)*10, 40, 150)

// Vehicle:
maxSpeed: 100
acceleration: 50
```

### Normal Mode (Default)
- Current settings are balanced for average players
- Good for testing and most players

### Hard Mode (Arcade Veterans)
```typescript
// config.ts changes:
SPEED_BONUS_MULTIPLIER: 1.5  // Less time bonus
FAST_DELIVERY_THRESHOLD: 0.4 // Harder to get bonus
calculateDeliveryTime: distance => math.clamp((distance/120)*10, 25, 90)

// Vehicle:
maxSpeed: 150
driftFactor: 0.8 // Slidier
```

## 🗺️ Map Design Guidelines

### Delivery Location Spacing
- **Minimum distance**: 150 studs (too close = boring)
- **Maximum distance**: 800 studs (too far = tedious)
- **Sweet spot**: 300-500 studs
- **Variation**: Mix short (200s) and long (600s) deliveries

### Vertical Layout
- **Flat**: Y=5 (sea level)
- **Low elevation**: Y=10-30 (small buildings)
- **Medium elevation**: Y=50-80 (skyscrapers)
- **High elevation**: Y=100+ (mountains)

**Tip**: Put 2-3 high locations for challenge, rest at low-medium

### Obstacles & Shortcuts
- **Direct route**: Should be possible but boring
- **Shortcut route**: Requires skill (jumps, tight turns)
- **Risk/reward**: Shortcuts save 5-10s but can fail
- **Ramp angles**: 15-25° for reliable jumps

### Example City Layout (500×500 studs):
```
Pizza Shop (Center):
  Position: (0, 5, 0)

Delivery Locations (radial pattern):
1. Downtown: (150, 5, 100)    - Easy, close
2. Beach: (-200, 5, 180)       - Medium, flat
3. Mountain: (100, 80, -150)   - Hard, high elevation
4. Skyscraper: (180, 120, -50) - Hard, very high
5. Suburbs: (-120, 5, -100)    - Easy, flat
6. Industrial: (250, 5, 0)     - Far, flat
7. Park: (-80, 5, 120)         - Close, easy
8. Harbor: (-180, 5, -180)     - Far, water theme
```

## 📊 Telemetry & Testing

### Key Metrics to Watch:
1. **Average delivery time** - Should be 60-70% of time limit
2. **Success rate** - Target 80-90% completion
3. **Average score per delivery** - $200-400 is good
4. **Drift usage** - Players should drift on ~30% of turns
5. **Jump usage** - 1-3 jumps per delivery on good maps

### Playtesting Checklist:
- [ ] Can complete deliveries consistently?
- [ ] Does speed feel good? (Not too floaty or heavy)
- [ ] Are timers fair? (Not too easy or impossible)
- [ ] Do shortcuts feel rewarding?
- [ ] Is drifting useful or just for style?
- [ ] Can you beat your own high score?

### Quick Balance Test:
1. Do 5 test deliveries
2. Record: completion rate, average time, average score
3. Adjust one variable at a time
4. Retest and compare

**Example Session:**
```
Before: 3/5 complete, avg 75s, avg score $180
After (added 10s): 5/5 complete, avg 55s, avg score $280
Result: ✅ Better balance!
```

## 🎮 Player Feedback

Based on playtests, adjust:

**"Too slow/boring"** → Increase maxSpeed, reduce time limits
**"Too hard to control"** → Increase turnSpeed, reduce driftFactor
**"Can't complete in time"** → Increase time multiplier, reduce distances
**"Too easy"** → Reduce time limits, increase distances
**"Drift is useless"** → Increase DRIFT_BONUS_PER_SECOND
**"No reason to jump"** → Add more ramps, increase JUMP_BONUS

---

**Pro tip:** Change one thing at a time and playtest after each change. Small tweaks make big differences!
