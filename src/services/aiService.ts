import { Achievement, ChatMessage, InventoryItem, Player, Quest, QuestSuggestion, ShopItem, SkillNode } from '../types';
import { getRequiredXP } from '../utils/xpSystem';

export interface RPGContext {
  character: Pick<Player, 'name' | 'level' | 'currentXP' | 'gold' | 'streak' | 'longestStreak' | 'attributes'>;
  quests: Pick<Quest, 'title' | 'category' | 'difficulty' | 'xpReward' | 'goldReward' | 'attributeType' | 'completed' | 'deadline'>[];
  achievements: Pick<Achievement, 'title' | 'currentProgress' | 'maxProgress' | 'unlocked'>[];
  skills: Pick<SkillNode, 'title' | 'unlocked' | 'requiredLevel'>[];
  inventory: Pick<InventoryItem, 'name' | 'category' | 'isEquipped'>[];
  rewards: Pick<ShopItem, 'name' | 'price' | 'category'>[];
}

export const buildRpgContext = (player: Player, quests: Quest[], achievements: Achievement[], skills: SkillNode[], inventory: InventoryItem[], rewards: ShopItem[]): RPGContext => ({
  character: { name: player.name, level: player.level, currentXP: player.currentXP, gold: player.gold, streak: player.streak, longestStreak: player.longestStreak, attributes: player.attributes },
  quests: quests.slice(0, 16).map(({ title, category, difficulty, xpReward, goldReward, attributeType, completed, deadline }) => ({ title, category, difficulty, xpReward, goldReward, attributeType, completed, deadline })),
  achievements: achievements.map(({ title, currentProgress, maxProgress, unlocked }) => ({ title, currentProgress, maxProgress, unlocked })),
  skills: skills.map(({ title, unlocked, requiredLevel }) => ({ title, unlocked, requiredLevel })),
  inventory: inventory.map(({ name, category, isEquipped }) => ({ name, category, isEquipped })),
  rewards: rewards.filter(item => !item.isPurchased).slice(0, 10).map(({ name, price, category }) => ({ name, price, category }))
});

const suggestion = (category: QuestSuggestion['category'], attributes: Player['attributes']): QuestSuggestion => {
  const choices: Record<QuestSuggestion['category'], Omit<QuestSuggestion, 'category'>> = {
    Coding: { title: 'Complete Two Focused DSA Problems', description: 'Solve and review two algorithm problems with clean notes.', difficulty: 'Medium', xpReward: 50, goldReward: 25, attributeType: 'Intellect', attributeReward: 2, deadline: 'Today, 20:00' },
    Study: { title: 'Deep Study Sprint', description: 'Complete a distraction-free 30-minute study session and summarize the lesson.', difficulty: 'Easy', xpReward: 40, goldReward: 20, attributeType: 'Intellect', attributeReward: 2, deadline: 'Today, 19:00' },
    Fitness: { title: 'Training Arena Circuit', description: 'Complete 20 minutes of movement, mobility, or strength training.', difficulty: 'Easy', xpReward: 35, goldReward: 18, attributeType: 'Strength', attributeReward: 2, deadline: 'Today, 18:00' },
    Reading: { title: 'Library Focus Session', description: 'Read for 20 minutes and write down three useful ideas.', difficulty: 'Easy', xpReward: 30, goldReward: 15, attributeType: 'Focus', attributeReward: 2, deadline: 'Today, 21:00' },
    Personal: { title: 'Temple of Focus Sprint', description: 'Plan tomorrow and complete one 25-minute distraction-free focus block.', difficulty: 'Easy', xpReward: 35, goldReward: 18, attributeType: 'Discipline', attributeReward: 2, deadline: 'Today, 21:00' },
    Health: { title: 'Vitality Recharge', description: 'Prepare a healthy meal, hydrate, and take a 15-minute restorative walk.', difficulty: 'Easy', xpReward: 30, goldReward: 15, attributeType: 'Health', attributeReward: 2, deadline: 'Today, 20:00' }
  };
  const weakest = Object.entries(attributes).sort((a, b) => a[1] - b[1])[0]?.[0] as QuestSuggestion['attributeType'] | undefined;
  return { category, ...choices[category], attributeType: weakest || choices[category].attributeType };
};

export const localGuide = (message: string, context: RPGContext): { content: string; suggestion?: QuestSuggestion } => {
  const query = message.toLowerCase();
  const { character, quests, achievements, rewards } = context;
  const remaining = Math.max(0, getRequiredXP(character.level) - character.currentXP);
  const weakest = Object.entries(character.attributes).sort((a, b) => a[1] - b[1])[0];
  const active = quests.filter(quest => !quest.completed).sort((a, b) => b.xpReward - a.xpReward);
  if (/create.*(coding|code)|coding quest/.test(query)) return { content: 'Here is a coding quest ready for your approval.', suggestion: suggestion('Coding', character.attributes) };
  if (/fitness|workout|exercise/.test(query)) return { content: 'Enter the Training Arena with this manageable challenge.', suggestion: suggestion('Fitness', character.attributes) };
  if (/challenge/.test(query)) return { content: 'A balanced challenge is ready. Confirm it only if it fits today’s energy.', suggestion: suggestion(weakest?.[0] === 'Health' ? 'Health' : 'Personal', character.attributes) };
  if (/xp|level/.test(query)) return { content: `You are Level ${character.level} with ${character.currentXP}/${getRequiredXP(character.level)} XP. Complete ${remaining} more XP to reach the next level.` };
  if (/attribute|weakest|discipline/.test(query)) return { content: `${weakest?.[0] || 'Your lowest attribute'} is currently ${weakest?.[1] ?? 0}. Small, repeatable quests in that domain are your best upgrade path.` };
  if (/streak/.test(query)) return { content: `Your current streak is ${character.streak} days (best: ${character.longestStreak}). Complete one realistic quest today to protect it.` };
  if (/achievement/.test(query)) { const close = achievements.filter(a => !a.unlocked).sort((a, b) => b.currentProgress / b.maxProgress - a.currentProgress / a.maxProgress)[0]; return { content: close ? `You are closest to “${close.title}”: ${close.currentProgress}/${close.maxProgress}.` : 'Every listed achievement is already unlocked—legendary work.' }; }
  if (/reward|buy|gold/.test(query)) { const affordable = rewards.filter(r => r.price <= character.gold).sort((a, b) => a.price - b.price)[0]; return { content: affordable ? `You have ${character.gold} Gold. ${affordable.name} is available for ${affordable.price} Gold.` : `You have ${character.gold} Gold. No unowned reward is currently affordable.` }; }
  if (/plan|today|first|focus/.test(query)) return { content: active.length ? `Today’s RPG plan:\n${active.slice(0, 3).map((q, i) => `${i + 1}. ${q.title} — +${q.xpReward} XP`).join('\n')}\n\nEstimated XP: +${active.slice(0, 3).reduce((sum, q) => sum + q.xpReward, 0)}.` : 'Your quest board is clear. I can forge a focused challenge for you.' };
  return { content: `Welcome, ${character.name}. You are Level ${character.level}, carrying ${character.gold} Gold and a ${character.streak}-day streak. Ask me to plan your day, analyze your stats, or create a quest.` };
};

const parseSuggestion = (content: string): { content: string; suggestion?: QuestSuggestion } => {
  const match = content.match(/<quest>\s*([\s\S]*?)\s*<\/quest>/i);
  if (!match) return { content };
  try { return { content: content.replace(match[0], '').trim(), suggestion: JSON.parse(match[1]) as QuestSuggestion }; } catch { return { content }; }
};

export const askGuide = async (message: string, context: RPGContext, history: ChatMessage[]) => {
  try {
    const response = await fetch('http://localhost:8787/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, context, history: history.map(({ role, content }) => ({ role, content })) }) });
    if (!response.ok) throw new Error('Guide unavailable');
    const data = await response.json() as { content: string };
    return parseSuggestion(data.content);
  } catch {
    const fallback = localGuide(message, context);
    return { ...fallback, content: `RPG Guide is currently using local intelligence. ${fallback.content}` };
  }
};
