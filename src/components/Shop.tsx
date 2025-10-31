import { useState, useEffect } from 'react';
import { X, Coins, Check, Lock, Sparkles } from 'lucide-react';
import { SKINS, Skin, getUserThemes, ownTheme, equipTheme as equipThemeDB } from '../lib/skins';
import { getLocalCoins, spendCoins } from '../lib/progression';

interface ShopProps {
  onClose: () => void;
  onSkinChanged: () => void;
}

export const Shop = ({ onClose, onSkinChanged }: ShopProps) => {
  const [coins, setCoins] = useState(getLocalCoins());
  const [equippedSkinId, setEquippedSkinId] = useState('default');
  const [ownedSkinsIds, setOwnedSkinsIds] = useState<string[]>(['default']);
  const [ownedCount, setOwnedCount] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const themes = await getUserThemes();
        setOwnedSkinsIds(themes.owned_themes);
        setEquippedSkinId(themes.equipped_theme);
        setOwnedCount(themes.owned_themes.length);
      } catch (error) {
        console.error('Error loading themes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadThemes();
  }, []);

  const handleBuy = async (skin: Skin) => {
    if (coins < skin.price) {
      alert('No tienes suficientes monedas');
      return;
    }

    if (spendCoins(skin.price)) {
      const success = await ownTheme(skin.id);
      if (success) {
        setCoins(getLocalCoins());
        setOwnedSkinsIds([...ownedSkinsIds, skin.id]);
        setOwnedCount(ownedCount + 1);
        alert(`¡${skin.name} comprado! (Cosmético, no otorga monedas)`);
      }
    }
  };

  const handleEquip = async (skinId: string) => {
    const success = await equipThemeDB(skinId);
    if (success) {
      setEquippedSkinId(skinId);
      onSkinChanged();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Tienda de Temas</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-3 flex items-center justify-center gap-2">
            <Coins size={20} className="text-white" />
            <span className="text-xl font-bold text-white">{coins}</span>
          </div>
          <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-3 flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-white" />
            <span className="text-xl font-bold text-white">{ownedCount}/{SKINS.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {SKINS.map((skin) => {
              const owned = ownedSkinsIds.includes(skin.id);
              const equipped = equippedSkinId === skin.id;

              return (
                <div
                  key={skin.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    equipped ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className={`w-16 h-20 rounded-lg ${skin.cardBackColor} border-4 ${skin.cardBorderColor} shadow-lg`} />
                      {owned && !equipped && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          ✓
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{skin.name}</h3>
                        {equipped && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">Equipado</span>}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{skin.description}</p>
                      {skin.id !== 'default' && (
                        <p className="text-xs text-gray-500 italic mb-2">Cosmético. No otorga monedas.</p>
                      )}

                      {!owned && skin.id !== 'default' && (
                        <div className="flex items-center gap-2 text-sm mb-1">
                          <Coins size={16} className="text-yellow-500" />
                          <span className="font-semibold">{skin.price}</span>
                        </div>
                      )}

                      <div className="mt-2">
                        {owned ? (
                          equipped ? (
                            <div className="text-sm text-green-600 font-semibold flex items-center gap-1">
                              <Check size={16} />
                              Equipado
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEquip(skin.id)}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                            >
                              Equipar
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => handleBuy(skin)}
                            disabled={coins < skin.price}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Lock size={16} />
                            Comprar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
