# 🏙️ City Map - Auto-Generated Streets

## 🎨 What Gets Built

Your game now **automatically generates a complete city** when the server starts! No manual building required!

### City Layout (600×600 studs)

```
          North
            ↑
    ┌───────────────────┐
    │ [Building]        │
    │     Road          │
    │  ═══════════      │
West│     Road          │East
← ──┼──═══════════──    ┼→
    │     Road          │
    │  ═══════════      │
    │ [Building]        │
    └───────────────────┘
            ↓
          South
```

## 🛣️ Street Features

### 1. **Grid Street System**
- **North-South roads** every 100 studs
- **East-West roads** every 100 studs
- **30 studs wide** (plenty of room!)
- **Dark gray asphalt** material
- **Yellow dashed center lines**

### 2. **Sidewalks**
- **8 studs wide** on both sides of every road
- **Light gray concrete** material
- **Raised 0.5 studs** above street level
- Safe zones for buildings

### 3. **Buildings**
- **One building per delivery location** (color-coded!)
- **Random heights** (30-60 studs tall)
- **Windows** on all sides
- **Flat roofs** (driveable!)
- **Brick material**

### 4. **Ramps**
- **4 ramps** around the city
- Positioned at corners for shortcuts
- **15×20 studs** (good jump distance)
- **Orange wood** material
- Angled for maximum air time!

## 🎯 Delivery Locations on the Map

Each delivery location has a **building nearby** in its signature color:

| Location | Position | Building Color | Height |
|----------|----------|----------------|---------|
| Pizza Shop | (0, 0, 0) | Red | Random |
| Downtown Office | (150, 0, 100) | Blue | Random |
| Beach House | (-200, 0, 180) | Yellow | Random |
| Mountain Lodge | (100, 80, -150) | Brown | High! |
| Skyscraper | (180, 120, -50) | Gray | Very High! |
| Suburb Villa | (-120, 0, -100) | Green | Random |
| Industrial | (250, 0, 0) | Dark Gray | Random |
| Park Pavilion | (-80, 0, 120) | Light Green | Random |
| Harbor | (-180, 0, -180) | Dark Blue | Random |

## 🚗 Driving Routes

### Main Roads:
- **Straight shots** between intersections (100 stud segments)
- Perfect for **building speed**
- Yellow lines guide you

### Shortcuts via Ramps:
```
Ramp at (80, 0, 80)     - Northeast corner
Ramp at (-80, 0, 80)    - Northwest corner
Ramp at (80, 0, -80)    - Southeast corner
Ramp at (-80, 0, -80)   - Southwest corner
```

### Advanced Routes:
- **Building roofs** are flat and driveable!
- **Jump from ramp** → **Land on roof** → **Jump to next building**
- Skilled players can chain rooftop shortcuts

## 🎨 Visual Details

### Streets:
- **Material**: Asphalt (realistic texture)
- **Color**: Dark gray (0.2, 0.2, 0.2)
- **Lines**: Neon yellow dashes
- **Dash pattern**: 8 studs dash, 4 studs gap

### Sidewalks:
- **Material**: Concrete
- **Color**: Light gray (0.7, 0.7, 0.7)
- **Height**: Raised 0.5 studs

### Buildings:
- **Material**: Brick
- **Windows**: Glass (30% transparent, light blue)
- **Roofs**: Concrete (dark gray)
- **Colors**: Match delivery locations (slightly desaturated)

### Ramps:
- **Material**: Wood
- **Color**: Orange-brown (0.8, 0.6, 0.2)
- **Size**: 15 wide × 8 tall × 20 long
- **Arrow decal** on top points up the ramp

## 🔧 How It Works

### Automatic Generation:
```typescript
Server starts
  ↓
MapBuilder initializes
  ↓
1. Build street grid (roads + lines)
2. Add sidewalks along all roads
3. Place buildings at delivery locations
4. Add 4 ramps at corners
  ↓
City complete! (~0.5 seconds)
```

### Performance:
- Generates in **under 1 second**
- All parts are **anchored** (no physics lag)
- Windows are **CanCollide = false** (can drive through)
- Efficient part count

## 🎮 Gameplay Impact

### Better Navigation:
- **Grid system** = easy to remember routes
- **Color-coded buildings** = quick destination identification
- **Visible from far away** = plan your route

### More Fun:
- **Ramps everywhere** = jump opportunities
- **Rooftops** = advanced shortcuts
- **Wide streets** = drift-friendly corners

### Visual Feedback:
- **Yellow lines** = stay on the road
- **Sidewalks** = building boundaries
- **Windows** = depth and realism

## 🏗️ Customization

Want to change the city? Edit `MapBuilder.ts`:

### Bigger City:
```typescript
const gridSize = 1000; // Was 600
```

### More Ramps:
```typescript
// Add to rampLocations array
{ pos: new Vector3(200, 0, 200), rotation: 0 },
```

### Different Street Width:
```typescript
const roadWidth = 40; // Was 30
```

### Building Heights:
```typescript
const heightVariation = math.random(50, 100); // Was 10-40
```

## 📊 City Stats

- **Total area**: 600×600 studs (360,000 sq studs)
- **Streets**: ~13 North-South, ~13 East-West
- **Sidewalks**: 52 segments
- **Buildings**: 9 (one per location)
- **Ramps**: 4
- **Windows**: ~300-500 (depends on building heights)

## 🎯 First Time Experience

### What You'll See:
1. Spawn in center of city (0, 0, 0)
2. **Streets in every direction**
3. **Buildings with colored markers** visible
4. **Yellow road lines** guiding you
5. **Ramps** at corners catching the light

### Where to Go:
- **Red building** = Pizza Shop (start here!)
- **Colored buildings** = Delivery destinations
- **Ramps** = Shortcut opportunities
- **Rooftops** = Advanced routes

## 💡 Pro Tips

### For Racing:
- **Memorize the grid** = faster routes
- **Cut corners** = shorter distance
- **Use ramps** = fly over traffic (if multiplayer)

### For Exploration:
- **Check every rooftop** = some are driveable
- **Test ramp angles** = find best jump spots
- **Look for shortcuts** = alleys between buildings

### For High Scores:
- **Drift the corners** = bonus points + maintain speed
- **Hit every ramp** = jump bonuses
- **Stay on roads** = maintain max speed

---

**Your city is ready to deliver pizzas in! 🍕🏙️**
