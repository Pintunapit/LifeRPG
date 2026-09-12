import React, { createContext, useCallback, useContext, useState } from 'react';
import { ChatMessage, QuestSuggestion } from '../types';
import { askGuide, buildRpgContext } from '../services/aiService';
import { storage } from '../utils/storage';
import { useGame } from './GameContext';

interface ChatContextValue {
  isOpen: boolean;
  isThinking: boolean;
  hasUnreadSuggestion: boolean;
  messages: ChatMessage[];
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  addSuggestedQuest: (suggestion: QuestSuggestion) => void;
}

const CHAT_KEY = 'RPG_GUIDE_MESSAGES';
const welcome: ChatMessage = { id: 'guide-welcome', role: 'assistant', createdAt: new Date().toISOString(), content: '⚔️ Welcome back, Hero!\n\nI’m your RPG Guide. I can help you plan quests, understand your stats, improve your streak, and prepare for your next level.' };
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const game = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [hasUnreadSuggestion, setHasUnreadSuggestion] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = storage.get<ChatMessage[]>(CHAT_KEY, [welcome]);
    return Array.isArray(saved) && saved.length ? saved : [welcome];
  });
  const commit = useCallback((next: ChatMessage[]) => { setMessages(next); storage.set(CHAT_KEY, next.slice(-30)); }, []);
  const openChat = useCallback(() => { setIsOpen(true); setHasUnreadSuggestion(false); }, []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const addSuggestedQuest = useCallback((item: QuestSuggestion) => {
    game.createQuest({ ...item, isDaily: true, isWeekly: false });
    commit([...messages, { id: `guide-${Date.now()}`, role: 'assistant', createdAt: new Date().toISOString(), content: `Quest accepted: “${item.title}” is now in your quest log.` }]);
  }, [game, messages, commit]);
  const sendMessage = useCallback(async (raw: string) => {
    const message = raw.trim();
    if (!message || isThinking) return;
    const userMessage: ChatMessage = { id: `hero-${Date.now()}`, role: 'user', content: message, createdAt: new Date().toISOString() };
    const next = [...messages, userMessage];
    commit(next); setIsThinking(true);
    const context = buildRpgContext(game.player, game.quests, game.achievements, game.skills, game.inventory, game.shopItems);
    const answer = await askGuide(message, context, next);
    commit([...next, { id: `guide-${Date.now()}`, role: 'assistant', content: answer.content, suggestion: answer.suggestion, createdAt: new Date().toISOString() }]);
    setIsThinking(false); if (!isOpen) setHasUnreadSuggestion(true);
  }, [messages, game, commit, isThinking, isOpen]);
  return <ChatContext.Provider value={{ isOpen, isThinking, hasUnreadSuggestion, messages, openChat, closeChat, sendMessage, addSuggestedQuest }}>{children}</ChatContext.Provider>;
};

export const useChat = () => { const context = useContext(ChatContext); if (!context) throw new Error('useChat must be used within ChatProvider'); return context; };
