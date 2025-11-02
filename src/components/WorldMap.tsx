import { Lock, Trophy, Leaf, Dumbbell, Gamepad2, PawPrint, Rocket } from 'lucide-react';

const worldIcons = [Leaf, Dumbbell, Gamepad2, PawPrint, Rocket];
const worldNames = ['Naturaleza', 'Deportes', 'Juegos', 'Animales', 'Espacio'];
const worldColors = [
  { from: 'from-emerald-500', to: 'to-green-700' },
  { from: 'from-yellow-500', to: 'to-orange-700' },
  { from: 'from-purple-500', to: 'to-pink-700' },
  { from: 'from-orange-500', to: 'to-red-700' },
  { from: 'from-indigo-500', to: 'to-blue-700' },
];

interface WorldMapProps {
  currentWorld: number;
  currentLevel: number;
  worldsCompleted: number;
  onSelectWorld: (world: number) => void;
  onBackToMenu: () => void;
}

export function WorldMap({ currentWorld, currentLevel, worldsCompleted, onSelectWorld, onBackToMenu }: WorldMapProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-700 p-6">
      <button
        onClick={onBackToMenu}
        className="mb-6 text-white flex items-center gap-2 font-semibold text-lg hover:scale-105 transition-transform"
      >
        ← Volver
      </button>

      <h1 className="text-4xl font-bold text-white text-center mb-3">Elige tu Mundo</h1>
      <p className="text-white/80 text-center mb-10 text-lg">5 Mundos · 25 Niveles · Aventura Épica</p>

      <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
        {[1, 2, 3, 4, 5].map((worldId) => {
          const isUnlocked = worldsCompleted >= worldId - 1;
          const Icon = worldIcons[worldId - 1];
          const colors = worldColors[worldId - 1];
          const isCurrent = currentWorld === worldId;
          const isCompleted = worldsCompleted >= worldId;

          return (
            <button
              key={worldId}
              onClick={() => isUnlocked && onSelectWorld(worldId)}
              disabled={!isUnlocked}
              className={`relative p-6 rounded-3xl shadow-2xl transition-all transform ${
                isUnlocked
                  ? `bg-gradient-to-br ${colors.from} ${colors.to} hover:scale-105 active:scale-95`
                  : 'bg-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Icon size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold">Mundo {worldId}</h3>
                    <p className="text-sm opacity-90">{worldNames[worldId - 1]}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  {isCompleted ? (
                    <>
                      <Trophy className="text-yellow-300" size={28} />
                      <span className="text-xs bg-yellow-300/20 px-2 py-0.5 rounded-full">
                        Completado
                      </span>
                    </>
                  ) : !isUnlocked ? (
                    <Lock size={28} />
                  ) : null}
                </div>
              </div>

              {isCurrent && !isCompleted && (
                <div className="mt-3 text-sm bg-white/20 rounded-lg px-3 py-1.5 inline-block backdrop-blur-sm">
                  📍 Nivel actual: {currentLevel} / 5
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
