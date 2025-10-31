import { Card } from '../types';
import { getSkinById, getDefaultSkin } from '../lib/skins';
import { getEquippedSkin } from '../lib/progression';
// removed custom photo feature

interface GameCardProps {
  card: Card;
  image: string;
  onClick: (id: number) => void;
  disabled: boolean;
}

export const GameCard = ({ card, image, onClick, disabled }: GameCardProps) => {
  const equippedSkinId = getEquippedSkin();
  const skin = equippedSkinId ? getSkinById(equippedSkinId) || getDefaultSkin() : getDefaultSkin();

  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div
      className="relative aspect-square cursor-pointer perspective-1000"
      onClick={handleClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
        }`}
      >
        <div className="absolute w-full h-full backface-hidden">
          <div className={`w-full h-full ${skin.cardBackColor} rounded-xl shadow-lg flex items-center justify-center border-4 ${skin.cardBorderColor}`}>
            <div className="text-4xl text-white font-bold">?</div>
          </div>
        </div>

        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className={`w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center border-4 ${skin.cardBorderColor} overflow-hidden`}>
            <div className="text-6xl">{image}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
