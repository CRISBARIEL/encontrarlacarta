import { useCallback, useEffect, useRef, useState } from 'react';
import { GameCore } from './GameCore';
import { TOTAL_LEVELS } from '../types';

type BannerType = 'level' | 'end' | null;

interface GameShellProps {
  initialLevel: number;
  onBackToMenu: () => void;
  // removed custom photo feature
}

export const GameShell = ({ initialLevel, onBackToMenu }: GameShellProps) => {
  const MAX = TOTAL_LEVELS;

  const [level, setLevel] = useState(initialLevel);
  const [nextLevel, setNextLevel] = useState<number | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerType, setBannerType] = useState<BannerType>(null);

  const completedRef = useRef(false);

  const onLevelCompleted = useCallback(() => {
    if (completedRef.current) {
      console.log('[GameShell] onLevelCompleted: already completed, skipping');
      return;
    }
    completedRef.current = true;

    const candidate = level < MAX ? level + 1 : 1;
    console.log('[GameShell] onLevelCompleted', { level, candidate });
    setNextLevel(candidate);
    setBannerType(level < MAX ? 'level' : 'end');
    setShowBanner(true);
  }, [level, MAX]);

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

      {showBanner && nextLevel != null && (
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
