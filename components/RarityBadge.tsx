import { RARITY_LABEL } from '@/lib/format';
import type { Rarity } from '@/lib/types';

const ICON: Record<Rarity, string> = { common: '●', rare: '✦', secret: '★' };

export default function RarityBadge({ rarity, large = false }: { rarity: Rarity; large?: boolean }) {
  return (
    <span className={`badge badge-${rarity}${large ? ' badge-large' : ''}`}>
      <span aria-hidden>{ICON[rarity]}</span> {RARITY_LABEL[rarity]}
    </span>
  );
}
