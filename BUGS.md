# Known Bugs & Issues

## 🐛 Active Bugs

### Delivery Markers Under Buildings
**Status:** Open  
**Priority:** Medium  
**Reported:** 2026-01-27

**Description:**
Some delivery point markers are spawning underneath buildings, making them hard to see and potentially confusing for gameplay.

**Affected Files:**
- `src/server/services/DeliveryService.ts` - `createLocationMarker()` method
- `src/shared/config.ts` - `DELIVERY_LOCATIONS` array

**Possible Causes:**
1. Building placement in `MapBuilder.ts` might be overlapping with delivery coordinates
2. Delivery marker Y-position is set to ground level (Y=1) but buildings extend downward
3. Random building generation doesn't check for delivery location conflicts

**Potential Solutions:**
1. Ensure delivery locations avoid building spawn zones
2. Raise delivery marker Y-position slightly (Y=2 or Y=3)
3. Add collision detection between buildings and delivery markers during map generation
4. Make delivery markers taller/more visible (increase beam height or add floating elements)

**Steps to Reproduce:**
1. Start game and pick up pizza
2. Drive to various delivery locations
3. Some markers will be partially or fully obscured by buildings

---

## ✅ Fixed Bugs

### Delivery Effects Delayed (Fixed 2026-01-27)
**Issue:** Visual effects (explosions, sparkles) were delayed by ~1-2 seconds after delivery completion.  
**Fix:** Moved effect trigger from server response handler to instant client-side zone entry detection.  
**Commit:** Latest

### Delivery Distance Display Broken (Fixed 2026-01-27)
**Issue:** Distance to delivery wasn't updating in UI after removing directional arrow.  
**Fix:** Changed condition in `update()` loop from checking `this.deliveryArrow` to just `this.currentDelivery`.  
**Commit:** v1.0+

---

## 📋 Future Improvements

### Performance
- Consider object pooling for particle effects
- Optimize delivery marker beam rendering

### Gameplay
- Add sound effects for pizza pickup
- Add more varied delivery completion effects
- Consider difficulty levels (closer vs farther deliveries)
- Add combo bonuses for fast consecutive deliveries

### Visual Polish
- Better delivery marker visibility
- Vehicle trail effects during high speed
- More building variety and detail
- Add NPCs or ambient traffic
