import { useState, useEffect, useRef } from 'react';
import { InitialScreen } from './components/InitialScreen';
import { GameShell } from './components/GameShell';
import { GameCore } from './components/GameCore';
import { DuelScene } from './components/DuelScene';
import { WorldMap } from './components/WorldMap';
import { LevelSelector } from './components/LevelSelector';
import { playMusic, stopMusic } from './utils/musicManager';
import { getWorldProgress } from './lib/progression';

type Screen = 'menu' | 'game' | 'daily' | 'duel' | 'worldmap' | 'levelselect';

function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'duel') {
      return 'duel';
    }
    return 'menu';
  });
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedWorld, setSelectedWorld] = useState(1);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const musicStartedRef = useRef(false);
  const [worldProgress, setWorldProgress] = useState(() => getWorldProgress());
  // removed custom photo feature

  useEffect(() => {
    if (musicEnabled && !musicStartedRef.current) {
      playMusic();
      musicStartedRef.current = true;
    } else if (!musicEnabled && musicStartedRef.current) {
      stopMusic();
      musicStartedRef.current = false;
    }
  }, [musicEnabled]);

  const handleStartGame = (level: number) => {
    setSelectedLevel(level);
    setScreen('game');
  };

  const handleStartDailyChallenge = () => {
    setScreen('daily');
  };

  const handleStartDuel = () => {
    setScreen('duel');
  };

  const handleBackToMenu = () => {
    setScreen('menu');
  };

  const handleMusicToggle = (enabled: boolean) => {
    setMusicEnabled(enabled);
  };

  // removed custom photo feature

  return (
    <>
      {screen === 'menu' && (
        <InitialScreen
          onStartGame={() => setScreen('worldmap')}
          onStartDailyChallenge={handleStartDailyChallenge}
          onStartDuel={handleStartDuel}
          musicEnabled={musicEnabled}
          onMusicToggle={handleMusicToggle}
        />
      )}
      {screen === 'worldmap' && (
        <WorldMap
          currentWorld={worldProgress.currentWorld}
          currentLevel={worldProgress.currentLevel}
          worldsCompleted={worldProgress.worldsCompleted}
          onSelectWorld={(world) => {
            setSelectedWorld(world);
            setScreen('levelselect');
          }}
          onBackToMenu={() => {
            setWorldProgress(getWorldProgress());
            setScreen('menu');
          }}
        />
      )}
      {screen === 'levelselect' && (
        <LevelSelector
          world={selectedWorld}
          currentLevel={worldProgress.currentLevel}
          onSelectLevel={(levelId) => {
            setSelectedLevel(levelId);
            setScreen('game');
          }}
          onBack={() => setScreen('worldmap')}
        />
      )}
      {screen === 'game' && (
        <GameShell
          key={selectedLevel}
          initialLevel={selectedLevel}
          onBackToMenu={() => {
            setWorldProgress(getWorldProgress());
            handleBackToMenu();
          }}
        />
      )}
      {screen === 'daily' && (
        <GameCore
          key="daily"
          level={1}
          isDailyChallenge={true}
          onComplete={handleBackToMenu}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {screen === 'duel' && (
        <DuelScene onBackToMenu={handleBackToMenu} />
      )}
    </>
  );
}

export default App;
