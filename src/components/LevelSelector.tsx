import { Lock, Star, Trophy } from 'lucide-react';
import { getLevelsByWorld, getGlobalLevelId } from '../lib/levels';
import { getThemeName } from '../lib/themes';

interface LevelSelectorProps {
  world: number;
  currentLevel: number;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export function LevelSelector({ world, currentLevel, onSelectLevel, onBack }: LevelSelectorProps) {
  const levelsInWorld = getLevelsByWorld(world);
  const themeName = getThemeName(levelsInWorld[0]?.theme);

  const maxLevelInWorld = Math.min(5, currentLevel - (world - 1) * 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-6">
      <button
        onClick={onBack}
        className="text-white mb-6 font-semibold text-lg flex items-center gap-2 hover:scale-105 transition-transform"
      >
        ← Mundos
      </button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Mundo {world}
        </h1>
        <p className="text-white/90 text-xl">{themeName}</p>
      </div>

      <div className="grid grid-cols-5 gap-4 max-w-lg mx-auto mb-8">
        {levelsInWorld.map((lvl) => {
          const isUnlocked = lvl.level <= maxLevelInWorld;
          const globalLevel = getGlobalLevelId(world, lvl.level);
          const isCurrent = globalLevel === currentLevel;

          return (
            <button
              key={lvl.level}
              onClick={() => isUnlocked && onSelectLevel(globalLevel)}
              disabled={!isUnlocked}
              className={`relative w-16 h-16 rounded-2xl font-bold text-xl transition-all shadow-lg ${
                isUnlocked
                  ? isCurrent
                    ? 'bg-yellow-400 scale-110 shadow-xl text-yellow-900'
                    : 'bg-white hover:scale-105 text-purple-700'
                  : 'bg-gray-700 opacity-50 text-gray-400'
              }`}
            >
              {isUnlocked ? (
                <>
                  <span>{lvl.level}</span>
                  {isCurrent && (
                    <Star
                      className="absolute -top-2 -right-2 text-yellow-600 fill-yellow-400"
                      size={20}
                    />
                  )}
                  {lvl.level === 5 && (
                    <Trophy
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-orange-500"
                      size={16}
                    />
                  )}
                </>
              ) : (
                <Lock className="absolute inset-0 m-auto text-gray-500" size={20} />
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 max-w-lg mx-auto text-white">
        <h3 className="font-bold text-xl mb-3">📋 Información del Mundo</h3>
        <div className="space-y-2 text-sm">
          <p>⏱️ Tiempo: {levelsInWorld[0].timeLimit}s - {levelsInWorld[4].timeLimit}s</p>
          <p>🎯 Parejas: {levelsInWorld[0].pairs} - {levelsInWorld[4].pairs}</p>
          <p>💰 Recompensa total: {levelsInWorld.reduce((sum, l) => sum + l.unlockReward, 0)} monedas</p>
          <p className="text-yellow-300 font-semibold">🏆 Nivel 5 desbloquea el siguiente mundo</p>
        </div>
      </div>
    </div>
  );
}
