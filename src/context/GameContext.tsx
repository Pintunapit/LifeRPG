import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Player,
  Quest,
  ShopItem,
  InventoryItem,
  Achievement,
  NotificationItem,
  GameSettings,
  AttributeType,
  SkillNode,
  LootChest,
  DailyMission,
  LootChestReward
} from '../types';
import {
  initialPlayer,
  initialSettings,
  initialSkills,
  initialChests,
  initialDailyMissions
} from '../data/mockData';
import { playerService } from '../services/playerService';
import { questService } from '../services/questService';
import { rewardService } from '../services/rewardService';
import { achievementService } from '../services/achievementService';
import { notificationService } from '../services/notificationService';
import { skillsApi, chestsApi, missionsApi, settingsApi } from '../lib/api';
import { processXPGain } from '../utils/xpSystem';
import { soundFx } from '../utils/soundEffects';
import { storage } from '../utils/storage';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './ToastContext';

export interface FloatingReward {
  id: string;
  text: string;
  color: string;
}

export interface LevelUpEvent {
  oldLevel: number;
  newLevel: number;
  attributePointsEarned: number;
  goldEarned: number;
  newTitle?: string;
}

interface GameContextType {
  player: Player;
  quests: Quest[];
  shopItems: ShopItem[];
  inventory: InventoryItem[];
  achievements: Achievement[];
  notifications: NotificationItem[];
  settings: GameSettings;
  skills: SkillNode[];
  chests: LootChest[];
  dailyMissions: DailyMission[];
  dailyMissionBonusClaimed: boolean;
  levelUpModalData: LevelUpEvent | null;
  floatingRewards: FloatingReward[];
  recentlyCompletedQuest: Quest | null;
  activeChestReward: { chest: LootChest; reward: LootChestReward } | null;
  isLoading: boolean;
  completeQuest: (questId: string) => void;
  createQuest: (questData: Omit<Quest, 'id' | 'completed'>) => void;
  deleteQuest: (questId: string) => void;
  buyShopItem: (itemId: string) => boolean;
  equipInventoryItem: (itemId: string) => void;
  unequipInventoryItem: (itemId: string) => void;
  allocateAttributePoint: (attr: AttributeType) => void;
  unlockSkill: (skillId: string) => void;
  openChest: (chestId: string) => void;
  closeChestModal: () => void;
  toggleDailyMission: (missionId: string) => void;
  claimDailyMissionsBonus: () => void;
  clearRecentlyCompletedQuest: () => void;
  updateProfile: (updates: Partial<Player>) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  markNotificationsAsRead: () => void;
  closeLevelUpModal: () => void;
  resetAllData: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// ── localStorage cache keys for skills / chests / missions / settings ──────────
const SKILLS_KEY      = 'GAME_SKILLS';
const CHESTS_KEY      = 'GAME_CHESTS';
const MISSIONS_KEY    = 'GAME_DAILY_MISSIONS';
const DAILY_BONUS_KEY = 'GAME_DAILY_BONUS_CLAIMED';
const SETTINGS_KEY    = 'GAME_SETTINGS';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // ── Synchronous initial state from caches (renders instantly) ───────────────
  const [player,       setPlayer]       = useState<Player>(() => playerService.getPlayer());
  const [quests,       setQuests]       = useState<Quest[]>(() => questService.getQuests());
  const [shopItems,    setShopItems]    = useState<ShopItem[]>(() => rewardService.getShopItems());
  const [inventory,    setInventory]    = useState<InventoryItem[]>(() => rewardService.getInventory());
  const [achievements, setAchievements] = useState<Achievement[]>(() => achievementService.getAchievements());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => notificationService.getNotifications());
  const [settings,     setSettings]    = useState<GameSettings>(() => storage.get<GameSettings>(SETTINGS_KEY, initialSettings));
  const [skills,       setSkills]      = useState<SkillNode[]>(() => storage.get<SkillNode[]>(SKILLS_KEY, initialSkills));
  const [chests,       setChests]      = useState<LootChest[]>(() => storage.get<LootChest[]>(CHESTS_KEY, initialChests));
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => storage.get<DailyMission[]>(MISSIONS_KEY, initialDailyMissions));
  const [dailyMissionBonusClaimed, setDailyMissionBonusClaimed] = useState(() => storage.get<boolean>(DAILY_BONUS_KEY, false));
  const [isLoading,    setIsLoading]   = useState(false);

  const [levelUpModalData,     setLevelUpModalData]     = useState<LevelUpEvent | null>(null);
  const [floatingRewards,      setFloatingRewards]      = useState<FloatingReward[]>([]);
  const [recentlyCompletedQuest, setRecentlyCompletedQuest] = useState<Quest | null>(null);
  const [activeChestReward,    setActiveChestReward]    = useState<{ chest: LootChest; reward: LootChestReward } | null>(null);

  // Track whether we've already seeded this session to avoid double-seeding
  const seededRef = useRef(false);

  // ── Sound settings sync ──────────────────────────────────────────────────────
  useEffect(() => {
    soundFx.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // ── Async backend hydration on auth change ───────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadUserData = async (userId: string) => {
      if (seededRef.current) return;
      setIsLoading(true);

      try {
        // Fetch all data in parallel
        const [
          serverPlayer,
          serverQuests,
          serverAchievements,
          serverShop,
          serverInventory,
          serverSkills,
          serverChests,
          serverMissions,
          serverSettings
        ] = await Promise.all([
          playerService.fetchPlayer(),
          questService.fetchQuests(),
          achievementService.fetchAchievements(),
          rewardService.fetchShopItems(),
          rewardService.fetchInventory(),
          skillsApi.getAll(),
          chestsApi.getAll(),
          missionsApi.getAll(),
          settingsApi.get()
        ]);

        if (cancelled) return;

        // If this is a brand-new user (no player row), seed all defaults
        if (!serverPlayer) {
          const authUser = (await supabase.auth.getUser()).data.user;
          const displayName =
            (authUser?.user_metadata as Record<string, string> | undefined)?.['name']
            ?? authUser?.email?.split('@')[0]
            ?? 'Hero';

          const newPlayer: Player = {
            ...initialPlayer,
            id:             userId,
            name:           displayName,
            email:          authUser?.email ?? '',
            level:          1,
            currentXP:      0,
            gold:           100,
            attributePoints: 0,
            streak:         0,
            longestStreak:  0,
            attributes:     { Strength: 10, Intellect: 10, Discipline: 10, Creativity: 10, Health: 10, Focus: 10 },
            joinedDate:     new Date().toISOString().split('T')[0],
            lastActiveDate: new Date().toISOString().split('T')[0]
          };

          await Promise.all([
            playerService.createPlayer(newPlayer),
            questService.seedDefaults(),
            achievementService.seedDefaults(),
            rewardService.seedDefaults(),
            skillsApi.seed(initialSkills),
            chestsApi.seed(initialChests),
            missionsApi.seed(initialDailyMissions),
            settingsApi.save({ ...initialSettings, dailyBonusClaimed: false }),
            notificationService.seedDefaults()
          ]);

          if (cancelled) return;

          setPlayer(newPlayer);
          setQuests(await questService.fetchQuests());
          setAchievements(await achievementService.fetchAchievements());
          setShopItems(await rewardService.fetchShopItems());
          setInventory(await rewardService.fetchInventory());
          setSkills(initialSkills);
          setChests(initialChests);
          setDailyMissions(initialDailyMissions);
          setSettings(initialSettings);
          setDailyMissionBonusClaimed(false);
          setNotifications(await notificationService.fetchNotifications());
        } else {
          // Existing user – hydrate from server data
          setPlayer(serverPlayer);
          setQuests(serverQuests);
          setAchievements(serverAchievements);
          setShopItems(serverShop);
          setInventory(serverInventory);

          if (serverSkills.length > 0) {
            setSkills(serverSkills);
            storage.set(SKILLS_KEY, serverSkills);
          }
          if (serverChests.length > 0) {
            setChests(serverChests);
            storage.set(CHESTS_KEY, serverChests);
          }
          if (serverMissions.length > 0) {
            setDailyMissions(serverMissions);
            storage.set(MISSIONS_KEY, serverMissions);
          }
          if (serverSettings) {
            const { dailyBonusClaimed, ...gameSettings } = serverSettings;
            setSettings(gameSettings);
            setDailyMissionBonusClaimed(dailyBonusClaimed ?? false);
            storage.set(SETTINGS_KEY, gameSettings);
            storage.set(DAILY_BONUS_KEY, dailyBonusClaimed ?? false);
          }

          const serverNotifs = await notificationService.fetchNotifications();
          if (cancelled) return;
          setNotifications(serverNotifs);
        }

        seededRef.current = true;
      } catch (e) {
        console.error('[GameContext] loadUserData failed:', e);
        // Silent fail – cached/default data already in state
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    // Subscribe to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        seededRef.current = false; // allow re-load on login
        // Clear stale cache from a previous user so we never flash wrong data
        storage.remove('PLAYER_CACHE');
        storage.remove('QUESTS_CACHE');
        storage.remove('ACHIEVEMENTS_CACHE');
        storage.remove('SHOP_CACHE');
        storage.remove('INVENTORY_CACHE');
        storage.remove('NOTIFICATIONS_CACHE');
        loadUserData(session.user.id);
      } else {
        // Logged out – wipe caches and reset to empty state
        storage.remove('PLAYER_CACHE');
        storage.remove('QUESTS_CACHE');
        storage.remove('ACHIEVEMENTS_CACHE');
        storage.remove('SHOP_CACHE');
        storage.remove('INVENTORY_CACHE');
        storage.remove('NOTIFICATIONS_CACHE');
        if (!cancelled) {
          setPlayer(initialPlayer);
          setQuests([]);
          setAchievements([]);
          setShopItems([]);
          setInventory([]);
          setSkills(initialSkills);
          setChests(initialChests);
          setDailyMissions(initialDailyMissions);
          setSettings(initialSettings);
          setNotifications([]);
          seededRef.current = false;
        }
      }
    });

    // Also trigger load if a session already exists on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user && !seededRef.current) {
        loadUserData(data.session.user.id);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // ── Local persist helpers (cache + fire-and-forget to backend) ───────────────

  const saveSkills = useCallback((newSkills: SkillNode[]) => {
    setSkills(newSkills);
    storage.set(SKILLS_KEY, newSkills);
    skillsApi.seed(newSkills).catch(e => console.error('[GameContext] saveSkills sync failed:', e));
  }, []);

  const saveChests = useCallback((newChests: LootChest[]) => {
    setChests(newChests);
    storage.set(CHESTS_KEY, newChests);
    chestsApi.bulkUpdate(newChests).catch(e => console.error('[GameContext] saveChests sync failed:', e));
  }, []);

  const saveDailyMissions = useCallback((newMissions: DailyMission[]) => {
    setDailyMissions(newMissions);
    storage.set(MISSIONS_KEY, newMissions);
    missionsApi.bulkUpdate(newMissions).catch(e => console.error('[GameContext] saveDailyMissions sync failed:', e));
  }, []);

  const saveSettings = useCallback((newSettings: GameSettings, bonusClaimed?: boolean) => {
    storage.set(SETTINGS_KEY, newSettings);
    const bonus = bonusClaimed ?? storage.get<boolean>(DAILY_BONUS_KEY, false);
    settingsApi.save({ ...newSettings, dailyBonusClaimed: bonus }).catch(e =>
      console.error('[GameContext] saveSettings sync failed:', e)
    );
  }, []);

  // ── Confetti helpers ─────────────────────────────────────────────────────────

  const triggerConfetti = useCallback(() => {
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#fbbf24', '#06b6d4', '#a855f7', '#ef4444', '#10b981'] });
    } catch { /* canvas unavailable */ }
  }, []);

  const triggerLevelUpConfetti = useCallback(() => {
    try {
      const end = Date.now() + 2500;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60,  spread: 55, origin: { x: 0 }, colors: ['#fbbf24', '#f59e0b', '#22d3ee'] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#a855f7', '#06b6d4', '#ec4899'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    } catch { /* canvas unavailable */ }
  }, []);

  const spawnFloatingReward = useCallback((text: string, color: string) => {
    const id = `float-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setFloatingRewards(prev => [...prev, { id, text, color }]);
    setTimeout(() => setFloatingRewards(prev => prev.filter(f => f.id !== id)), 1500);
  }, []);

  // ── Complete Quest ───────────────────────────────────────────────────────────

  const completeQuest = useCallback(
    (questId: string) => {
      questService.completeQuest(questId).then(result => {
        if (!result.success || !result.quest) {
          showToast('Quest already completed or not found.', 'warning');
          return;
        }

        const quest = result.quest;
        soundFx.playQuestComplete();
        setRecentlyCompletedQuest(quest);

        spawnFloatingReward(`+${quest.xpReward} XP`, '#fbbf24');
        setTimeout(() => spawnFloatingReward(`+${quest.goldReward} Gold`, '#38bdf8'), 200);
        setTimeout(() => spawnFloatingReward(`+${quest.attributeReward} ${quest.attributeType.toUpperCase()}`, '#34d399'), 400);

        setQuests(questService.getQuests());

        const currentPlayer = playerService.getPlayer();
        const xpResult = processXPGain(currentPlayer.level, currentPlayer.currentXP, quest.xpReward);

        const todayStr = new Date().toISOString().split('T')[0];
        const isNewDayStreak = currentPlayer.lastActiveDate !== todayStr;
        const nextStreak = isNewDayStreak ? currentPlayer.streak + 1 : currentPlayer.streak;
        const nextLongest = Math.max(currentPlayer.longestStreak, nextStreak);

        const levelUpBonusGold = xpResult.levelsGained * 100;
        const levelUpBonusAttrPoints = xpResult.attributePointsEarned;

        const nextPlayer: Player = {
          ...currentPlayer,
          level:           xpResult.newLevel,
          currentXP:       xpResult.newXP,
          gold:            currentPlayer.gold + quest.goldReward + levelUpBonusGold,
          attributePoints: currentPlayer.attributePoints + levelUpBonusAttrPoints,
          attributes: {
            ...currentPlayer.attributes,
            [quest.attributeType]: Math.min(100, (currentPlayer.attributes[quest.attributeType] || 0) + quest.attributeReward)
          },
          streak:        nextStreak,
          longestStreak: nextLongest,
          lastActiveDate: todayStr
        };

        playerService.savePlayer(nextPlayer);
        setPlayer(nextPlayer);

        // Advance daily missions
        setDailyMissions(prevMissions => {
          const nextMissions = prevMissions.map(m => {
            if (m.title.includes('3 Real-Life Quests')) {
              const nextCurr = Math.min(m.target, m.current + 1);
              return { ...m, current: nextCurr, completed: nextCurr >= m.target };
            }
            if (m.category === quest.category && !m.completed) {
              const nextCurr = Math.min(m.target, m.current + 1);
              return { ...m, current: nextCurr, completed: nextCurr >= m.target };
            }
            return m;
          });
          storage.set(MISSIONS_KEY, nextMissions);
          missionsApi.bulkUpdate(nextMissions).catch(e => console.error('[completeQuest] missions sync:', e));
          return nextMissions;
        });

        // Advance chests progress
        setChests(prevChests => {
          const nextChests = prevChests.map(ch => {
            if ((ch.type === 'daily' || ch.type === 'weekly') && !ch.opened) {
              const nextProg = Math.min(ch.maxProgress, ch.progress + 1);
              return { ...ch, progress: nextProg, unlocked: nextProg >= ch.maxProgress };
            }
            return ch;
          });
          storage.set(CHESTS_KEY, nextChests);
          chestsApi.bulkUpdate(nextChests).catch(e => console.error('[completeQuest] chests sync:', e));
          return nextChests;
        });

        if (isNewDayStreak) {
          notificationService.addNotification(
            'Daily Streak Extended!',
            `🔥 You completed a quest today! Streak is now ${nextStreak} days.`,
            'streak'
          );
        }

        const achCheck = achievementService.checkMilestones(nextPlayer, questService.getQuests());
        if (achCheck.unlockedNow.length > 0) {
          setAchievements(achCheck.updatedList);
          achCheck.unlockedNow.forEach(ach => {
            showToast(`🏆 Achievement Unlocked: ${ach.title}!`, 'success', 'Trophy Unlocked');
            notificationService.addNotification(
              `Achievement Unlocked: ${ach.title}`,
              `Claimed +${ach.rewardXp} XP and +${ach.rewardGold} Gold!`,
              'achievement'
            );
          });
        }

        if (xpResult.leveledUp) {
          soundFx.playLevelUp();
          triggerLevelUpConfetti();
          setLevelUpModalData({
            oldLevel: currentPlayer.level,
            newLevel: xpResult.newLevel,
            attributePointsEarned: levelUpBonusAttrPoints,
            goldEarned: levelUpBonusGold,
            newTitle: nextPlayer.title
          });
          showToast(`🎉 Level Up! You reached Level ${xpResult.newLevel}! (+5 Points, +100 Gold)`, 'success', 'Level Up!');
          notificationService.addNotification(
            'Heroic Level Up!',
            `🎉 Reached Level ${xpResult.newLevel}! Gained +5 Attribute Points and +100 Gold.`,
            'level_up'
          );
        } else {
          triggerConfetti();
          showToast(`Quest completed: "${quest.title}" (+${quest.xpReward} XP, +${quest.goldReward} Gold)`, 'success');
        }

        setNotifications(notificationService.getNotifications());
      });
    },
    [showToast, spawnFloatingReward, triggerConfetti, triggerLevelUpConfetti]
  );

  // ── Create Quest ─────────────────────────────────────────────────────────────

  const createQuest = useCallback(
    (questData: Omit<Quest, 'id' | 'completed'>) => {
      questService.createQuest(questData).then(created => {
        setQuests(questService.getQuests());
        soundFx.playButtonClick();
        showToast(`Quest "${created.title}" forged successfully!`, 'success', 'Quest Created');
        notificationService.addNotification(
          'New Quest Registered',
          `⚔️ "${created.title}" added to quest log. Reward: +${created.xpReward} XP`,
          'quest'
        );
        setNotifications(notificationService.getNotifications());
      });
    },
    [showToast]
  );

  // ── Delete Quest ─────────────────────────────────────────────────────────────

  const deleteQuest = useCallback(
    (questId: string) => {
      questService.deleteQuest(questId).then(() => {
        setQuests(questService.getQuests());
        showToast('Quest removed from log.', 'info');
      });
    },
    [showToast]
  );

  // ── Buy Shop Item ────────────────────────────────────────────────────────────

  const buyShopItem = useCallback(
    (itemId: string) => {
      rewardService.buyItem(itemId).then(res => {
        if (!res.success) {
          soundFx.playErrorSound();
          showToast(res.message, 'error', 'Purchase Failed');
          return;
        }
        soundFx.playCoinSound();
        triggerConfetti();
        setPlayer(playerService.getPlayer());
        setShopItems(rewardService.getShopItems());
        setInventory(rewardService.getInventory());
        showToast(res.message, 'success', 'Item Acquired');
        notificationService.addNotification(
          'Guild Shop Purchase',
          `💰 You purchased ${res.item?.name} from the guild treasury.`,
          'shop'
        );
        setNotifications(notificationService.getNotifications());
      });
      return true; // optimistic
    },
    [showToast, triggerConfetti]
  );

  // ── Equip / Unequip ──────────────────────────────────────────────────────────

  const equipInventoryItem = useCallback(
    (itemId: string) => {
      rewardService.equipItem(itemId).then(res => {
        if (res.success && res.item) {
          soundFx.playEquipSound();
          setInventory(rewardService.getInventory());
          setPlayer(playerService.getPlayer());
          showToast(`Equipped ${res.item.name}!`, 'success', 'Gear Equipped');
        }
      });
    },
    [showToast]
  );

  const unequipInventoryItem = useCallback((itemId: string) => {
    rewardService.unequipItem(itemId).then(() => {
      setInventory(rewardService.getInventory());
    });
  }, []);

  // ── Allocate Attribute Point ─────────────────────────────────────────────────

  const allocateAttributePoint = useCallback(
    (attr: AttributeType) => {
      playerService.allocateAttributePoint(attr).then(updated => {
        if (!updated) {
          soundFx.playErrorSound();
          showToast('No attribute points available!', 'warning');
          return;
        }
        soundFx.playAttributeUp();
        spawnFloatingReward(`+1 ${attr.slice(0, 4).toUpperCase()}`, '#34d399');
        setPlayer(updated);
        showToast(`+1 Point permanently invested into ${attr}!`, 'success');
      });
    },
    [showToast, spawnFloatingReward]
  );

  // ── Unlock Skill ─────────────────────────────────────────────────────────────

  const unlockSkill = useCallback(
    (skillId: string) => {
      const targetSkill = skills.find(s => s.id === skillId);
      if (!targetSkill) return;

      if (targetSkill.unlocked) { showToast('Skill already mastered!', 'info'); return; }

      const currentPlayer = playerService.getPlayer();

      if (currentPlayer.level < targetSkill.requiredLevel) {
        soundFx.playErrorSound();
        showToast(`Requires Character Level ${targetSkill.requiredLevel}!`, 'warning');
        return;
      }

      const currentAttrVal = currentPlayer.attributes[targetSkill.requiredAttribute.type] || 0;
      if (currentAttrVal < targetSkill.requiredAttribute.value) {
        soundFx.playErrorSound();
        showToast(`Requires ${targetSkill.requiredAttribute.value} ${targetSkill.requiredAttribute.type} (You have ${currentAttrVal})!`, 'warning');
        return;
      }

      if (currentPlayer.attributePoints < targetSkill.costAttributePoints) {
        soundFx.playErrorSound();
        showToast(`Requires ${targetSkill.costAttributePoints} Attribute Points!`, 'warning');
        return;
      }

      if (currentPlayer.gold < targetSkill.costGold) {
        soundFx.playErrorSound();
        showToast(`Requires ${targetSkill.costGold} Gold!`, 'warning');
        return;
      }

      const updatedPlayer: Player = {
        ...currentPlayer,
        attributePoints: currentPlayer.attributePoints - targetSkill.costAttributePoints,
        gold:            currentPlayer.gold - targetSkill.costGold
      };
      playerService.savePlayer(updatedPlayer);
      setPlayer(updatedPlayer);

      const unlockedAt = new Date().toISOString();
      const updatedSkills = skills.map(s =>
        s.id === skillId ? { ...s, unlocked: true, unlockedAt } : s
      );
      saveSkills(updatedSkills);

      // Single-skill update to backend
      skillsApi.update(skillId, { unlocked: true, unlockedAt }).catch(e =>
        console.error('[unlockSkill] sync failed:', e)
      );

      soundFx.playSkillUnlock();
      triggerConfetti();
      spawnFloatingReward(`Unlocked: ${targetSkill.title}`, '#06b6d4');
      showToast(`✨ Mastered Skill: ${targetSkill.title}!`, 'success', 'Skill Tree Unlocked');
      notificationService.addNotification(
        `Skill Mastered: ${targetSkill.title}`,
        `Unlocked powerful passive: "${targetSkill.perk}"`,
        'achievement'
      );
      setNotifications(notificationService.getNotifications());
    },
    [skills, showToast, spawnFloatingReward, triggerConfetti, saveSkills]
  );

  // ── Open Loot Chest ──────────────────────────────────────────────────────────

  const openChest = useCallback(
    (chestId: string) => {
      const targetChest = chests.find(c => c.id === chestId);
      if (!targetChest) return;

      if (!targetChest.unlocked) {
        soundFx.playErrorSound();
        showToast('This chest is still locked! Complete the milestone to unlock.', 'warning');
        return;
      }
      if (targetChest.opened) {
        showToast('This chest has already been looted.', 'info');
        return;
      }

      const reward = targetChest.reward;
      soundFx.playChestOpen();
      triggerConfetti();

      const currentPlayer = playerService.getPlayer();
      const xpResult = processXPGain(currentPlayer.level, currentPlayer.currentXP, reward.xp);
      const updatedPlayer: Player = {
        ...currentPlayer,
        level:       xpResult.newLevel,
        currentXP:   xpResult.newXP,
        gold:        currentPlayer.gold + reward.gold,
        title:       reward.title  ?? currentPlayer.title,
        avatar:      reward.avatar ?? currentPlayer.avatar,
        equippedBadge: reward.badge ?? currentPlayer.equippedBadge
      };

      playerService.savePlayer(updatedPlayer);
      setPlayer(updatedPlayer);

      const updatedChests = chests.map(c => c.id === chestId ? { ...c, opened: true } : c);
      saveChests(updatedChests);
      chestsApi.update(chestId, { opened: true }).catch(e => console.error('[openChest] sync failed:', e));

      setActiveChestReward({ chest: targetChest, reward });
      showToast(`🎁 Claimed ${reward.gold} Gold & +${reward.xp} XP from ${targetChest.name}!`, 'success');
      notificationService.addNotification(
        `Loot Chest Claimed: ${targetChest.name}`,
        `Discovered +${reward.gold} Gold and +${reward.xp} XP!`,
        'shop'
      );
      setNotifications(notificationService.getNotifications());
    },
    [chests, showToast, triggerConfetti, saveChests]
  );

  const closeChestModal = useCallback(() => setActiveChestReward(null), []);

  // ── Toggle Daily Mission ─────────────────────────────────────────────────────

  const toggleDailyMission = useCallback(
    (missionId: string) => {
      const target = dailyMissions.find(m => m.id === missionId);
      if (!target) return;

      const nextCompleted = !target.completed;
      const nextCurr = nextCompleted ? target.target : 0;

      const nextMissions = dailyMissions.map(m =>
        m.id === missionId ? { ...m, completed: nextCompleted, current: nextCurr } : m
      );
      saveDailyMissions(nextMissions);

      if (nextCompleted) {
        soundFx.playCoinSound();
        spawnFloatingReward(`+${target.rewardXp} XP`, '#fbbf24');
        const currentPlayer = playerService.getPlayer();
        const xpResult = processXPGain(currentPlayer.level, currentPlayer.currentXP, target.rewardXp);
        const updatedPlayer = {
          ...currentPlayer,
          level:     xpResult.newLevel,
          currentXP: xpResult.newXP,
          gold:      currentPlayer.gold + target.rewardGold
        };
        playerService.savePlayer(updatedPlayer);
        setPlayer(updatedPlayer);
        showToast(`Mission Cleared: ${target.title} (+${target.rewardXp} XP, +${target.rewardGold} Gold)`, 'success');
      }

      const allDone = nextMissions.every(m => m.completed);
      if (allDone) {
        setChests(prev => {
          const updated = prev.map(c =>
            c.type === 'epic' ? { ...c, progress: 5, unlocked: true } : c
          );
          storage.set(CHESTS_KEY, updated);
          chestsApi.bulkUpdate(updated).catch(e => console.error('[toggleDailyMission] chests sync:', e));
          return updated;
        });
        showToast('🎉 ALL 5 DAILY MISSIONS CLEARED! Epic Chest is now Unlocked!', 'success', 'Daily Triumph');
      }
    },
    [dailyMissions, showToast, spawnFloatingReward, saveDailyMissions]
  );

  // ── Claim Daily Missions Bonus ───────────────────────────────────────────────

  const claimDailyMissionsBonus = useCallback(() => {
    const allDone = dailyMissions.every(m => m.completed);
    if (!allDone) {
      showToast('Complete all 5 daily missions first to claim the bonus!', 'warning');
      return;
    }
    if (dailyMissionBonusClaimed) {
      showToast('The daily grand bonus has already been claimed.', 'info');
      return;
    }

    soundFx.playLevelUp();
    triggerLevelUpConfetti();

    const currentPlayer = playerService.getPlayer();
    const xpResult = processXPGain(currentPlayer.level, currentPlayer.currentXP, 500);
    const updatedPlayer: Player = {
      ...currentPlayer,
      level:     xpResult.newLevel,
      currentXP: xpResult.newXP,
      gold:      currentPlayer.gold + 200
    };
    playerService.savePlayer(updatedPlayer);
    setPlayer(updatedPlayer);
    setDailyMissionBonusClaimed(true);
    storage.set(DAILY_BONUS_KEY, true);

    // Persist bonus flag to backend with current settings
    settingsApi.save({ ...settings, dailyBonusClaimed: true }).catch(e =>
      console.error('[claimDailyMissionsBonus] settings sync:', e)
    );

    setChests(prev => {
      const updated = prev.map(c =>
        c.type === 'epic' ? { ...c, progress: 5, unlocked: true } : c
      );
      storage.set(CHESTS_KEY, updated);
      chestsApi.bulkUpdate(updated).catch(e => console.error('[claimDailyMissionsBonus] chests sync:', e));
      return updated;
    });

    showToast('🏆 Claimed +500 XP, +200 Gold and unlocked Epic Chest!', 'success', 'Grand Daily Bonus');
  }, [dailyMissions, dailyMissionBonusClaimed, showToast, triggerLevelUpConfetti, settings]);

  // ── Profile & Settings ───────────────────────────────────────────────────────

  const clearRecentlyCompletedQuest = useCallback(() => setRecentlyCompletedQuest(null), []);

  const updateProfile = useCallback(
    (updates: Partial<Player>) => {
      playerService.updateProfile(updates).then(updated => {
        setPlayer(updated);
        showToast('Hero profile updated successfully!', 'success');
      });
    },
    [showToast]
  );

  const updateSettings = useCallback(
    (newSettings: Partial<GameSettings>) => {
      setSettings(prev => {
        const merged = { ...prev, ...newSettings };
        saveSettings(merged);
        return merged;
      });
      showToast('Settings saved.', 'info');
    },
    [showToast, saveSettings]
  );

  const markNotificationsAsRead = useCallback(() => {
    const updated = notificationService.markAllAsRead();
    setNotifications(updated);
  }, []);

  const closeLevelUpModal = useCallback(() => setLevelUpModalData(null), []);

  // ── Reset All Data ───────────────────────────────────────────────────────────

  const resetAllData = useCallback(() => {
    storage.clearAll();

    Promise.all([
      playerService.resetDefaults(),
      questService.resetDefaults(),
      achievementService.resetDefaults(),
      notificationService.resetDefaults(),
      rewardService.resetDefaults(),
      skillsApi.seed(initialSkills),
      chestsApi.seed(initialChests),
      missionsApi.seed(initialDailyMissions),
      settingsApi.save({ ...initialSettings, dailyBonusClaimed: false })
    ]).then(([p, q, a, n]) => {
      setPlayer(p as Player);
      setQuests(q as Quest[]);
      setAchievements(a as Achievement[]);
      setNotifications(n as NotificationItem[]);
      setShopItems(rewardService.getShopItems());
      setInventory(rewardService.getInventory());
      setSettings(initialSettings);
      setSkills(initialSkills);
      setChests(initialChests);
      setDailyMissions(initialDailyMissions);
      setDailyMissionBonusClaimed(false);
      showToast('Life RPG restored to default demo state.', 'info');
    }).catch(e => console.error('[resetAllData] failed:', e));
  }, [showToast]);

  // ── Provider ─────────────────────────────────────────────────────────────────

  return (
    <GameContext.Provider
      value={{
        player,
        quests,
        shopItems,
        inventory,
        achievements,
        notifications,
        settings,
        skills,
        chests,
        dailyMissions,
        dailyMissionBonusClaimed,
        levelUpModalData,
        floatingRewards,
        recentlyCompletedQuest,
        activeChestReward,
        isLoading,
        completeQuest,
        createQuest,
        deleteQuest,
        buyShopItem,
        equipInventoryItem,
        unequipInventoryItem,
        allocateAttributePoint,
        unlockSkill,
        openChest,
        closeChestModal,
        toggleDailyMission,
        claimDailyMissionsBonus,
        clearRecentlyCompletedQuest,
        updateProfile,
        updateSettings,
        markNotificationsAsRead,
        closeLevelUpModal,
        resetAllData
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
