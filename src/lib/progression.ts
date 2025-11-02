import { supabase, getOrCreateClientId } from './supabase';
import { getLevelConfig } from './levels';
import { createConfetti } from '../utils/confetti';

export interface UserProfile {
  client_id: string;
  coins: number;
  owned_skins: string[];
  equipped_skin: string | null;
  last_daily_at: string | null;
  current_world: number;
  current_level: number;
  worlds_completed: number;
  updated_at: string;
}

export interface WorldProgress {
  currentWorld: number;
  currentLevel: number;
  worldsCompleted: number;
}

const STORAGE_KEY_COINS = 'user_coins';
const STORAGE_KEY_LAST_DAILY = 'last_daily_at';
const STORAGE_KEY_OWNED_SKINS = 'owned_skins';
const STORAGE_KEY_EQUIPPED_SKIN = 'equipped_skin';
const STORAGE_KEY_CURRENT_WORLD = 'current_world';
const STORAGE_KEY_CURRENT_LEVEL = 'current_level';
const STORAGE_KEY_WORLDS_COMPLETED = 'worlds_completed';

export function getLocalCoins(): number {
  const stored = localStorage.getItem(STORAGE_KEY_COINS);
  return stored ? parseInt(stored, 10) : 0;
}

export function setLocalCoins(coins: number): void {
  localStorage.setItem(STORAGE_KEY_COINS, coins.toString());
}

export function addCoins(amount: number): number {
  const current = getLocalCoins();
  const newTotal = current + amount;
  setLocalCoins(newTotal);
  syncToSupabase();
  return newTotal;
}

export function spendCoins(amount: number): boolean {
  const current = getLocalCoins();
  if (current < amount) return false;

  setLocalCoins(current - amount);
  syncToSupabase();
  return true;
}

export function getLastDailyAt(): string | null {
  return localStorage.getItem(STORAGE_KEY_LAST_DAILY);
}

export function setLastDailyAt(date: string): void {
  localStorage.setItem(STORAGE_KEY_LAST_DAILY, date);
}

export function canClaimDaily(): boolean {
  const last = getLastDailyAt();
  if (!last) return true;

  const lastDate = new Date(last);
  const today = new Date();

  const lastUTC = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate()));
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  return todayUTC.getTime() > lastUTC.getTime();
}

export function claimDailyReward(): number {
  if (!canClaimDaily()) return 0;

  const todayUTC = new Date();
  const dateStr = `${todayUTC.getUTCFullYear()}-${String(todayUTC.getUTCMonth() + 1).padStart(2, '0')}-${String(todayUTC.getUTCDate()).padStart(2, '0')}`;

  setLastDailyAt(dateStr);
  const coins = addCoins(50);
  return coins;
}

export function getOwnedSkins(): string[] {
  const stored = localStorage.getItem(STORAGE_KEY_OWNED_SKINS);
  return stored ? JSON.parse(stored) : [];
}

export function setOwnedSkins(skins: string[]): void {
  localStorage.setItem(STORAGE_KEY_OWNED_SKINS, JSON.stringify(skins));
}

export function ownsSkin(skinId: string): boolean {
  return getOwnedSkins().includes(skinId);
}

export function buySkin(skinId: string, price: number): boolean {
  if (ownsSkin(skinId)) return false;
  if (!spendCoins(price)) return false;

  const owned = getOwnedSkins();
  owned.push(skinId);
  setOwnedSkins(owned);
  syncToSupabase();
  return true;
}

export function getEquippedSkin(): string | null {
  return localStorage.getItem(STORAGE_KEY_EQUIPPED_SKIN);
}

export function equipSkin(skinId: string): boolean {
  if (!ownsSkin(skinId)) return false;

  localStorage.setItem(STORAGE_KEY_EQUIPPED_SKIN, skinId);
  syncToSupabase();
  return true;
}

export function getWorldProgress(): WorldProgress {
  const currentWorld = parseInt(localStorage.getItem(STORAGE_KEY_CURRENT_WORLD) || '1', 10);
  const currentLevel = parseInt(localStorage.getItem(STORAGE_KEY_CURRENT_LEVEL) || '1', 10);
  const worldsCompleted = parseInt(localStorage.getItem(STORAGE_KEY_WORLDS_COMPLETED) || '0', 10);

  return { currentWorld, currentLevel, worldsCompleted };
}

export function setWorldProgress(progress: Partial<WorldProgress>): void {
  if (progress.currentWorld !== undefined) {
    localStorage.setItem(STORAGE_KEY_CURRENT_WORLD, progress.currentWorld.toString());
  }
  if (progress.currentLevel !== undefined) {
    localStorage.setItem(STORAGE_KEY_CURRENT_LEVEL, progress.currentLevel.toString());
  }
  if (progress.worldsCompleted !== undefined) {
    localStorage.setItem(STORAGE_KEY_WORLDS_COMPLETED, progress.worldsCompleted.toString());
  }
  syncToSupabase();
}

export interface WorldUnlockEvent {
  completedWorld: number;
  unlockedWorld: number;
  coinsEarned: number;
  isGameComplete: boolean;
}

export async function completeLevel(levelId: number): Promise<WorldUnlockEvent | null> {
  const config = getLevelConfig(levelId);
  if (!config) return null;

  addCoins(config.unlockReward);

  const progress = getWorldProgress();

  if (config.level === 5) {
    const nextWorld = config.world + 1;
    setWorldProgress({
      worldsCompleted: config.world,
      currentWorld: nextWorld <= 5 ? nextWorld : config.world,
      currentLevel: nextWorld <= 5 ? (nextWorld - 1) * 5 + 1 : levelId,
    });

    createConfetti();

    if (nextWorld <= 5) {
      return {
        completedWorld: config.world,
        unlockedWorld: nextWorld,
        coinsEarned: config.unlockReward,
        isGameComplete: false,
      };
    } else {
      return {
        completedWorld: config.world,
        unlockedWorld: config.world,
        coinsEarned: config.unlockReward,
        isGameComplete: true,
      };
    }
  } else {
    const nextLevel = levelId + 1;
    setWorldProgress({
      currentLevel: nextLevel,
    });
  }

  return null;
}

export async function syncToSupabase(): Promise<void> {
  try {
    const clientId = getOrCreateClientId();
    const coins = getLocalCoins();
    const ownedSkins = getOwnedSkins();
    const equippedSkin = getEquippedSkin();
    const lastDaily = getLastDailyAt();
    const progress = getWorldProgress();

    await supabase.from('profiles').upsert({
      client_id: clientId,
      coins,
      owned_skins: ownedSkins,
      equipped_skin: equippedSkin,
      last_daily_at: lastDaily,
      current_world: progress.currentWorld,
      current_level: progress.currentLevel,
      worlds_completed: progress.worldsCompleted,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[syncToSupabase] Error:', err);
  }
}

export async function loadFromSupabase(): Promise<void> {
  try {
    const clientId = getOrCreateClientId();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();

    if (error) {
      console.error('[loadFromSupabase] Error:', error);
      return;
    }

    if (data) {
      setLocalCoins(data.coins);
      setOwnedSkins(data.owned_skins || []);

      if (data.equipped_skin) {
        localStorage.setItem(STORAGE_KEY_EQUIPPED_SKIN, data.equipped_skin);
      }

      if (data.last_daily_at) {
        setLastDailyAt(data.last_daily_at);
      }

      if (data.current_world !== undefined) {
        localStorage.setItem(STORAGE_KEY_CURRENT_WORLD, data.current_world.toString());
      }
      if (data.current_level !== undefined) {
        localStorage.setItem(STORAGE_KEY_CURRENT_LEVEL, data.current_level.toString());
      }
      if (data.worlds_completed !== undefined) {
        localStorage.setItem(STORAGE_KEY_WORLDS_COMPLETED, data.worlds_completed.toString());
      }
    }
  } catch (err) {
    console.error('[loadFromSupabase] Exception:', err);
  }
}
