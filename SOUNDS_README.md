# 🔊 Twin Clash - Sound Effects Setup

## 📁 Required Sound Files

Create a `public/sounds/` directory and add these 5 WAV files:

```
public/
└── sounds/
    ├── zap.wav              (Electric zap effect)
    ├── flip_pop.wav         (Card flip sound)
    ├── countdown_click.wav  (Countdown tick)
    ├── confetti.wav         (Victory celebration)
    └── loop_150bpm.wav      (Background music loop)
```

## 🎵 How to Generate the Sounds

Use this Python script to generate all sounds:

```python
import numpy as np
from scipy.io.wavfile import write

sr = 44100

def save_wav(name, data):
    data = np.int16(data / np.max(np.abs(data)) * 32767)
    write(f"{name}.wav", sr, data)

# Zap: descending filtered noise
t = np.linspace(0,0.25,int(sr*0.25))
noise = np.random.randn(len(t))
zap = noise * np.exp(-12*t) * np.cos(2*np.pi*(600-400*t)*t)
save_wav("zap", zap)

# Flip pop: short click
t = np.linspace(0,0.05,int(sr*0.05))
pop = np.sin(2*np.pi*1200*t) * np.exp(-50*t)
save_wav("flip_pop", pop)

# Countdown click: classic digital tick
t = np.linspace(0,0.07,int(sr*0.07))
click = (np.sin(2*np.pi*800*t)+0.3*np.sin(2*np.pi*1600*t)) * np.exp(-20*t)
save_wav("countdown_click", click)

# Confetti: quick noise burst
t = np.linspace(0,0.4,int(sr*0.4))
conf = np.random.randn(len(t))*np.exp(-4*t)
save_wav("confetti", conf)

# Simple 150bpm loop (1 bar 4/4): kick-snare-hat
bpm = 150
bar_dur = 60/bpm*4
t = np.linspace(0, bar_dur, int(sr*bar_dur))
kick = (np.sin(2*np.pi*60*t) * np.exp(-8*t)) * (t<0.1)
snare = (np.random.randn(len(t))*np.exp(-16*t)) * (t>0.2)*(t<0.3)
hihat = (np.random.randn(len(t))*0.2) * (np.mod(t,0.1)<0.02)
loop = kick + snare + hihat
save_wav("loop_150bpm", loop)
```

## 🎮 Sound Usage in Game

### Automatic Integration

The game will automatically use these sounds when available:

| Sound | Trigger | Usage |
|-------|---------|-------|
| `zap.wav` | Logo reveal, VS intro | Power effects, electric energy |
| `flip_pop.wav` | Card flip | Every time a card is revealed |
| `countdown_click.wav` | Duel countdown | 3-2-1-Go sequence |
| `confetti.wav` | Victory screen | Level/game completion |
| `loop_150bpm.wav` | Background | Optional BGM (150 BPM) |

### Volume Settings

Default volumes (can be adjusted in `soundManager.ts`):

- Zap: 60%
- Flip Pop: 40%
- Countdown Click: 50%
- Confetti: 70%
- Background Loop: 30%

## 🔧 Implementation Details

### Sound Manager Features

✅ **Preloading** - All sounds loaded on app start
✅ **Error Handling** - Graceful fallback if sounds missing
✅ **Volume Control** - Individual and master volume
✅ **Enable/Disable** - Toggle all sounds on/off
✅ **Background Music** - Looping 150 BPM track

### Current Integration Points

1. **Card Flip** - `GameCard.tsx` → plays `flip_pop.wav`
2. **Victory** - `GameShell.tsx` → plays `confetti.wav`
3. **Countdown** - `DuelScene.tsx` → plays `countdown_click.wav` (3-2-1)
4. **Logo Reveal** - `InitialScreen.tsx` → plays `zap.wav`

## 📝 Installation Steps

1. **Create sounds directory:**
   ```bash
   mkdir -p public/sounds
   ```

2. **Generate sounds using Python:**
   ```bash
   python generate_sounds.py
   ```

3. **Move WAV files:**
   ```bash
   mv *.wav public/sounds/
   ```

4. **Rebuild project:**
   ```bash
   npm run build
   ```

## 🎨 Enhancement Tips (AAA Quality)

To make sounds more professional, apply these effects in an audio editor (Audacity, etc.):

1. **Zap:**
   - Add reverb (10-20%)
   - Light distortion (drive 5-10%)

2. **Flip Pop:**
   - Normalize to -3dB
   - Add subtle reverb

3. **Countdown Click:**
   - EQ boost at 800Hz
   - Short decay

4. **Confetti:**
   - Pan randomization
   - Stereo width

5. **Background Loop:**
   - Sidechain to kick
   - Add soft clap with snare
   - Low-pass filter at 12kHz

## 🔊 Alternative: Use Web Audio API

If you don't have the WAV files, the game will fall back to the existing Web Audio API synthesis in `musicManager.ts`.

## 📄 License

All sounds generated with the provided Python script are **copyright-free** and can be used freely in your project.

## 🎯 Testing

To test if sounds are working:

1. Open browser console
2. Run: `soundManager.playZap()`
3. Check for audio playback

If no sound:
- Check browser console for errors
- Verify files exist in `public/sounds/`
- Check browser audio permissions
- Ensure volume is not muted

---

**Note:** The sound system is fully optional. The game works perfectly without sound files, using the existing synthesized music system.
