import { useCallback, useEffect, useRef, useState } from 'react';
import { GameCore } from './GameCore';
import { completeLevel, getWorldProgress, WorldUnlockEvent } from '../lib/progression';
import { getLevelConfig } from '../lib/levels';
import { WorldUnlockModal } from './WorldUnlockModal';

type BannerType = 'level' | 'end' | null;

interface GameShellProps {
  initialLevel: number;
  onBackToMenu: () => void;
  // removed custom photo feature
}

export const GameShell = ({ initialLevel, onBackToMenu }: GameShellProps) => {
  const [level, setLevel] = useState(initialLevel);
  const [nextLevel, setNextLevel] = useState<number | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerType, setBannerType] = useState<BannerType>(null);
  const [worldUnlockEvent, setWorldUnlockEvent] = useState<WorldUnlockEvent | null>(null);

  const completedRef = useRef(false);

  const onLevelCompleted = useCallback(async () => {
    if (completedRef.current) {
      console.log('[GameShell] onLevelCompleted: already completed, skipping');
      return;
    }
    completedRef.current = true;

    const unlockEvent = await completeLevel(level);

    const config = getLevelConfig(level);
    const progress = getWorldProgress();

    if (unlockEvent) {
      setWorldUnlockEvent(unlockEvent);
    } else if (config && config.level === 5 && config.world === 5) {
      setBannerType('end');
      setNextLevel(1);
      setShowBanner(true);
    } else {
      const nextLevelId = progress.currentLevel;
      setNextLevel(nextLevelId);
      setBannerType('level');
      setShowBanner(true);
    }
  }, [level]);

  useEffect(() => {
    console.log('[GameShell] LEVEL_CHANGED', level);
    completedRef.current = false;
  }, [level]);

  const handleNextLevel = useCallback(() => {
    console.log('[GameShell] handleNextLevel', { level, nextLevel });
    if (nextLevel == null) return;
    setLevel(nextLevel);
    setNextLevel(null);
    setShowBanner(false);
    setBannerType(null);
  }, [nextLevel, level]);

  const handleWorldUnlockContinue = useCallback(() => {
    setWorldUnlockEvent(null);
    const progress = getWorldProgress();
    setLevel(progress.currentLevel);
  }, []);

  console.log('[GameShell] Render', { level, nextLevel, showBanner, bannerType });

  return (
    <>
      <section key={`level-${level}`}>
        <GameCore
          level={level}
          onComplete={onLevelCompleted}
          onBackToMenu={onBackToMenu}
        />
      </section>

      {worldUnlockEvent && (
        <WorldUnlockModal
          completedWorld={worldUnlockEvent.completedWorld}
          unlockedWorld={worldUnlockEvent.unlockedWorld}
          coinsEarned={worldUnlockEvent.coinsEarned}
          isGameComplete={worldUnlockEvent.isGameComplete}
          onContinue={handleWorldUnlockContinue}
        />
      )}

      {showBanner && nextLevel != null && !worldUnlockEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl pointer-events-auto">
            {bannerType === 'level' ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-green-600 mb-2">¡Nivel {level} Completado!</h3>
                <p className="text-gray-600 mb-6">Pulsa para continuar.</p>
                <div className="flex gap-3">
                  <button
                    onClick={onBackToMenu}
                    className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Salir
                  </button>
                  <button
                    onClick={handleNextLevel}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Nivel {nextLevel}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
                  ¡Has completado todas las fases!
                </h3>
                <p className="text-gray-600 mb-6">¿Quieres volver a empezar?</p>
                <div className="flex gap-3">
                  <button
                    onClick={onBackToMenu}
                    className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Menú
                  </button>
                  <button
                    onClick={handleNextLevel}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Nivel {nextLevel}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
