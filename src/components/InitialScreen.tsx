import { useState, useEffect } from 'react';
import { Calendar, Swords, ShoppingBag, Gift, Coins, Palette } from 'lucide-react';
// removed custom photo feature
import { canClaimDaily, claimDailyReward, getLocalCoins, loadFromSupabase } from '../lib/progression';
import { Shop } from './Shop';
import { getEquippedTheme, getSkinById } from '../lib/skins';

interface InitialScreenProps {
  onStartGame: (level: number) => void;
  onStartDailyChallenge: () => void;
  onStartDuel: () => void;
  musicEnabled: boolean;
  onMusicToggle: (enabled: boolean) => void;
}

export const InitialScreen = ({ onStartGame, onStartDailyChallenge, onStartDuel, musicEnabled, onMusicToggle }: InitialScreenProps) => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showShop, setShowShop] = useState(false);
  const [coins, setCoins] = useState(0);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [equippedThemeName, setEquippedThemeName] = useState('Clásico');
  // removed custom photo feature

  useEffect(() => {
    loadFromSupabase().then(() => {
      setCoins(getLocalCoins());

      if (canClaimDaily()) {
        setShowDailyReward(true);
      }
    });

    getEquippedTheme().then((themeId) => {
      const skin = getSkinById(themeId);
      if (skin) {
        setEquippedThemeName(skin.name);
      }
    });
  }, []);

  // removed custom photo feature

  const handleClaimDaily = () => {
    const newCoins = claimDailyReward();
    setCoins(newCoins);
    setShowDailyReward(false);
  };

  const handleShopClose = () => {
    setShowShop(false);
    setCoins(getLocalCoins());
    getEquippedTheme().then((themeId) => {
      const skin = getSkinById(themeId);
      if (skin) {
        setEquippedThemeName(skin.name);
      }
    });
  };

  // removed custom photo feature

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Encuentra al Gemelo
        </h1>
        <p className="text-center text-gray-600 mb-4 text-sm">
          Encuentra todas las parejas antes de que se acabe el tiempo
        </p>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-3 flex items-center justify-center gap-2">
            <Coins size={20} className="text-white" />
            <span className="text-lg font-bold text-white">{coins}</span>
          </div>
          <div className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-3 flex items-center justify-center gap-2">
            <Palette size={20} className="text-white" />
            <span className="text-sm font-bold text-white">{equippedThemeName}</span>
          </div>
        </div>

        <button
          onClick={() => setShowShop(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-6"
        >
          <ShoppingBag size={20} />
          Tienda de Temas
        </button>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Selecciona el Nivel
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`py-3 px-4 rounded-xl font-bold transition-all ${
                    selectedLevel === level
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              Tiempo: {[70, 60, 50, 40, 30][selectedLevel - 1]}s
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={musicEnabled}
                onChange={(e) => onMusicToggle(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                Música épica
              </span>
            </label>
          </div>

          <button
            onClick={() => onStartGame(selectedLevel)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            🎮 Jugar
          </button>

          <button
            onClick={onStartDailyChallenge}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Calendar size={20} />
            Reto Diario
          </button>

          <button
            onClick={onStartDuel}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Swords size={20} />
            Duelo 1v1
          </button>
        </div>
      </div>

      {showShop && <Shop onClose={handleShopClose} onSkinChanged={() => {}} />}

      {showDailyReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-6xl mb-4">
              <Gift size={64} className="mx-auto text-yellow-500" />
            </div>
            <h3 className="text-3xl font-bold text-yellow-600 mb-2">¡Recompensa Diaria!</h3>
            <p className="text-gray-600 mb-4">Reclama tus monedas gratis</p>
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Coins size={32} className="text-white" />
                <span className="text-4xl font-bold text-white">+50</span>
              </div>
            </div>
            <button
              onClick={handleClaimDaily}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Reclamar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
