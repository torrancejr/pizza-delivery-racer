# Known Bugs & Issues

## 🐛 Active Bugs

### Money Display Formatting Issue
**Status:** Open  
**Severity:** Low (Visual)  
**Description:**  
The TIPS money display shows incorrect decimal placement. The far-right digit slot appears empty even after attempting to fix positioning logic. The display should show format `$XXXX.XX` (e.g., `$951.00`) but digits are not aligning correctly with the decimal point.

**Steps to Reproduce:**
1. Start game and earn tips
2. Observe top-right TIPS display
3. Notice far-right digit is empty or misaligned

**Expected Behavior:**
Money should display as `$951.00`, `$42.50`, etc. with proper decimal alignment.

**Actual Behavior:**
Last digit slot remains empty or decimal placement is incorrect.

**Notes:**
- Changed from "FARE" to "TIPS" label ✅
- Attempted multiple positioning fixes for decimal and digit layout
- May need complete redesign of slot-machine style digit layout

---

## ✅ Fixed Bugs

### Delivery Markers Under Buildings (Fixed 2026-01-28)
**Issue:** Delivery point markers were spawning underneath buildings, making them hard to see.  
**Fixes Implemented:**
1. Changed markers from square (50x50) to circular (50 diameter) using Cylinder shape
2. Elevated marker position from Y=1 to Y=5 (above buildings)
3. Made beams circular (8 stud diameter) instead of square (4x4)
4. Added building collision detection - buildings now skip spawning within 80 studs of delivery locations
5. Buildings spawn count now logs how many were skipped due to delivery zones

**Files Changed:**
- `src/server/services/DeliveryService.ts` - Circular markers at Y=5
- `src/server/services/MapBuilder.ts` - Added delivery location collision detection

**Commit:** Latest

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
