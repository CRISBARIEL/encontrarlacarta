let audioContext: AudioContext | null = null;
let mainGain: GainNode | null = null;
let isPlaying = false;
let loopInterval: number | null = null;

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const playMelody = (context: AudioContext, notes: number[], duration: number) => {
  if (!mainGain) return;

  notes.forEach((freq, index) => {
    const osc = context.createOscillator();
    const oscGain = context.createGain();

    osc.connect(oscGain);
    oscGain.connect(mainGain!);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, context.currentTime + index * duration);

    oscGain.gain.setValueAtTime(0, context.currentTime + index * duration);
    oscGain.gain.linearRampToValueAtTime(0.08, context.currentTime + index * duration + 0.01);
    oscGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + (index + 1) * duration);

    osc.start(context.currentTime + index * duration);
    osc.stop(context.currentTime + (index + 1) * duration);
  });
};

const createBackgroundMusic = (context: AudioContext) => {
  const melody1 = [261.63, 329.63, 392.00, 329.63, 261.63, 329.63, 392.00, 523.25];
  const melody2 = [523.25, 587.33, 659.25, 587.33, 523.25, 392.00, 329.63, 261.63];

  playMelody(context, melody1, 0.3);

  setTimeout(() => {
    playMelody(context, melody2, 0.3);
  }, 2400);
};

export const playMusic = async (): Promise<void> => {
  try {
    const context = initAudioContext();

    if (context.state === 'suspended') {
      await context.resume();
    }

    if (!isPlaying) {
      mainGain = context.createGain();
      mainGain.connect(context.destination);

      mainGain.gain.setValueAtTime(0, context.currentTime);
      mainGain.gain.linearRampToValueAtTime(1, context.currentTime + 0.5);

      isPlaying = true;

      createBackgroundMusic(context);

      loopInterval = window.setInterval(() => {
        if (isPlaying) {
          createBackgroundMusic(context);
        }
      }, 4800);
    }
  } catch (error) {
    console.log('Error playing music:', error);
  }
};

export const stopMusic = (): void => {
  if (!audioContext || !mainGain || !isPlaying) return;

  try {
    if (loopInterval) {
      clearInterval(loopInterval);
      loopInterval = null;
    }

    mainGain.gain.setValueAtTime(mainGain.gain.value, audioContext.currentTime);
    mainGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

    setTimeout(() => {
      isPlaying = false;
      mainGain = null;
    }, 500);
  } catch (error) {
    console.log('Error stopping music:', error);
  }
};

export const getMusicInstance = (): AudioContext | null => {
  return audioContext;
};
